import { NextRequest, NextResponse } from 'next/server';
import { AdPlacementRequest, AdPlacementResponse, AgentAdCampaign } from '@/types/agent';
import { campaigns, updateCampaign, getCampaign } from '@/lib/adStorage';

/**
 * POST /api/ads/submit
 * Submit a new ad campaign from an agent
 */
export async function POST(request: NextRequest) {
  try {
    const body: AdPlacementRequest = await request.json();
    
    // Validate required fields
    if (!body.campaign || !body.payment) {
      return NextResponse.json<AdPlacementResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment amount
    if (body.payment.amount < 100) { // Minimum $1.00
      return NextResponse.json<AdPlacementResponse>(
        { success: false, error: 'Minimum payment is $1.00' },
        { status: 400 }
      );
    }

    // Generate campaign ID
    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create campaign object
    const campaign: AgentAdCampaign = {
      ...body.campaign,
      id: campaignId,
      impressions: 0,
      clicks: 0,
      spent: 0,
      status: 'pending', // Will be activated after payment confirmation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store campaign (pending payment)
    campaigns.set(campaignId, campaign);

    // In production, integrate with actual x402/Lightning Network payment
    // For now, return a mock payment URL
    const paymentUrl = `${process.env.NEXT_PUBLIC_URL}/api/payment/x402/${campaignId}`;
    
    return NextResponse.json<AdPlacementResponse>({
      success: true,
      campaignId,
      paymentRequired: {
        amount: body.payment.amount,
        currency: body.payment.currency,
        paymentUrl,
        invoiceId: `inv_${campaignId}`,
      },
    });
  } catch (error) {
    console.error('Error submitting ad:', error);
    return NextResponse.json<AdPlacementResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ads/submit?campaignId=xxx
 * Get campaign status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaignId');

  if (!campaignId) {
    return NextResponse.json(
      { error: 'campaignId required' },
      { status: 400 }
    );
  }

  const campaign = getCampaign(campaignId);
  
  if (!campaign) {
    return NextResponse.json(
      { error: 'Campaign not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ campaign });
}
