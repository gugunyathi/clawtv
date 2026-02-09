import { NextRequest, NextResponse } from 'next/server';
import { getCampaign, updateCampaign } from '@/lib/adStorage';

/**
 * POST /api/ads/track
 * Track ad events (impressions, clicks)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, event, timestamp } = body;

    if (!campaignId || !event) {
      return NextResponse.json(
        { error: 'campaignId and event required' },
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

    // Update campaign metrics
    if (event === 'impression') {
      campaign.impressions += 1;
      campaign.spent += campaign.bidAmount / 100;
    } else if (event === 'click') {
      campaign.clicks += 1;
    }

    updateCampaign(campaign);

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        spent: campaign.spent,
      },
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
