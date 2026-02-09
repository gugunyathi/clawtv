import { NextRequest, NextResponse } from 'next/server';
import { getCampaign, updateCampaign } from '@/lib/adStorage';

/**
 * GET /api/payment/x402/[campaignId]
 * Generate x402 payment request for a campaign
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;
    const campaign = getCampaign(campaignId);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Generate x402 payment request
    // In production, integrate with actual payment provider
    const paymentRequest = {
      campaignId,
      amount: campaign.budget,
      currency: 'USD',
      paymentPointer: '$ilp.example.com/payment', // Replace with actual payment pointer
      invoiceUrl: `lightning:lnbc...`, // Replace with actual Lightning invoice
      status: 'pending',
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    };

    return NextResponse.json(paymentRequest);
  } catch (error) {
    console.error('Error generating payment request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payment/x402/[campaignId]
 * Confirm payment for a campaign
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;
    const body = await request.json();
    const campaign = getCampaign(campaignId);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Verify payment
    // In production, verify with payment provider (Lightning Network, Web Monetization, etc.)
    const { txHash, paymentProof } = body;

    if (!txHash && !paymentProof) {
      return NextResponse.json(
        { error: 'Payment proof required' },
        { status: 400 }
      );
    }

    // TODO: Verify payment with actual provider
    // For now, accept any payment proof
    const paymentVerified = true;

    if (paymentVerified) {
      // Activate campaign
      campaign.status = 'active';
      campaign.paymentTxHash = txHash;
      updateCampaign(campaign);

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed, campaign activated',
        campaign: {
          id: campaign.id,
          status: campaign.status,
          txHash: campaign.paymentTxHash,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
