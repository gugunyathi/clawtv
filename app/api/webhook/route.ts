import { NextRequest, NextResponse } from 'next/server';
import { WebhookPayload, AgentSentimentData } from '@/types/agent';
import { campaigns, getCampaign, storeSentimentData, getLatestSentiment } from '@/lib/adStorage';
import { verifyWebhookSignature } from '@/lib/webhookSecurity';

/**
 * POST /api/webhook
 * Webhook endpoint for OpenClaw agent to send updates
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-openclaw-signature');
    const webhookSecret = process.env.CLAWTV_WEBHOOK_SECRET;
    
    // Get request body
    const body = await request.text();
    
    // Verify signature in production
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('[Webhook] Invalid signature');
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn('[Webhook] No signature verification configured');
    }
    
    const payload: WebhookPayload = JSON.parse(body);
    
    console.log(`[Webhook] Received event: ${payload.event}`, payload);

    switch (payload.event) {
      case 'sentiment_update':
        // OpenClaw agent sends Twitter sentiment data
        if (payload.data.sentimentData) {
          storeSentimentData(payload.data.sentimentData);

          return NextResponse.json({
            success: true,
            message: `Stored ${payload.data.sentimentData.length} sentiment updates`,
          });
        }
        break;

      case 'campaign_update':
        // Agent wants to update campaign status or settings
        if (payload.data.campaignIds) {
          for (const campaignId of payload.data.campaignIds) {
            const campaign = getCampaign(campaignId);
            if (campaign && payload.data.message) {
              // Update campaign based on agent's message
              // This could be status changes, budget adjustments, etc.
              console.log(`[Webhook] Campaign update for ${campaignId}: ${payload.data.message}`);
            }
          }
          
          return NextResponse.json({
            success: true,
            message: 'Campaign updates processed',
          });
        }
        break;

      case 'budget_alert':
        // Agent alerts about budget concerns
        console.log(`[Webhook] Budget alert: ${payload.data.message}`);
        return NextResponse.json({
          success: true,
          message: 'Budget alert received',
        });

      case 'performance_report':
        // Agent sends performance metrics
        if (payload.data.metrics) {
          console.log('[Webhook] Performance metrics:', payload.data.metrics);
          return NextResponse.json({
            success: true,
            message: 'Performance report received',
            metrics: payload.data.metrics,
          });
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhook/sentiment
 * Get latest sentiment data for ad selection
 */
export async function GET() {
  const sentiments = getLatestSentiment(10);
  
  // Group by timestamp for response
  const grouped = sentiments.reduce((acc, s) => {
    const ts = s.timestamp;
    if (!acc[ts]) acc[ts] = [];
    acc[ts].push(s);
    return acc;
  }, {} as Record<string, AgentSentimentData[]>);

  return NextResponse.json({
    count: Object.keys(grouped).length,
    data: Object.entries(grouped).map(([timestamp, data]) => ({
      timestamp,
      sentiments: data,
    })),
  });
}
