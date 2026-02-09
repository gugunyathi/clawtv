import { NextRequest, NextResponse } from 'next/server';
import { AdSelectionCriteria, SelectedAd, AgentAdCampaign, AgentSentimentData } from '@/types/agent';
import { campaigns, getActiveCampaigns, updateCampaign, getLatestSentiment } from '@/lib/adStorage';

/**
 * POST /api/ads/select
 * Select the best ad based on subtitle keywords and Twitter sentiment
 */
export async function POST(request: NextRequest) {
  try {
    const criteria: AdSelectionCriteria = await request.json();
    
    // Get active campaigns
    const activeCampaigns = getActiveCampaigns();

    if (activeCampaigns.length === 0) {
      return NextResponse.json({ 
        ad: null, 
        message: 'No active campaigns available' 
      });
    }

    // Score and rank campaigns
    const scoredAds = activeCampaigns.map(campaign => {
      let score = 0;
      let reasons: string[] = [];

      // Keyword match scoring
      const keywordMatches = campaign.keywords.filter(k => 
        criteria.subtitleKeywords.some(sk => 
          sk.toLowerCase().includes(k.toLowerCase()) || 
          k.toLowerCase().includes(sk.toLowerCase())
        )
      );
      
      if (keywordMatches.length > 0) {
        score += keywordMatches.length * 10;
        reasons.push(`Matched ${keywordMatches.length} subtitle keywords`);
      }

      // Sentiment match scoring
      if (criteria.currentSentiment) {
        for (const sentiment of criteria.currentSentiment) {
          const sentimentMatches = campaign.sentimentTags.filter(tag =>
            sentiment.keywords.some(k => k.toLowerCase().includes(tag.toLowerCase()))
          );
          
          if (sentimentMatches.length > 0) {
            const sentimentBonus = sentiment.trending ? 20 : 10;
            score += sentimentMatches.length * sentimentBonus;
            reasons.push(
              `Aligned with ${sentiment.trending ? 'trending' : 'current'} sentiment: ${sentimentMatches.join(', ')}`
            );
          }
        }
      }

      // Bid amount (higher bids get preference)
      score += campaign.bidAmount / 10;

      // Budget remaining (campaigns with more budget left get slight boost)
      const budgetRemaining = campaign.budget - campaign.spent;
      if (budgetRemaining > campaign.budget * 0.5) {
        score += 5;
        reasons.push('Well-funded campaign');
      }

      // Performance bonus (good CTR gets boost)
      if (campaign.impressions > 0) {
        const ctr = campaign.clicks / campaign.impressions;
        if (ctr > 0.05) { // 5% CTR
          score += 15;
          reasons.push('High-performing ad');
        }
      }

      return {
        campaign,
        relevanceScore: score,
        reason: reasons.join(' | ') || 'Default selection',
      };
    });

    // Sort by score and select best
    scoredAds.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedAd = scoredAds[0];

    // Update impression count
    if (selectedAd) {
      const campaign = campaigns.get(selectedAd.campaign.id);
      if (campaign) {
        campaign.impressions += 1;
        campaign.spent += campaign.bidAmount / 100; // Charge per impression
        updateCampaign(campaign);
      }
    }

    return NextResponse.json<{ ad: SelectedAd | null }>({
      ad: selectedAd || null,
    });
  } catch (error) {
    console.error('Error selecting ad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ads/select/active
 * Get all active campaigns (for debugging)
 */
export async function GET() {
  const activeCampaigns = getActiveCampaigns();

  return NextResponse.json({
    count: activeCampaigns.length,
    campaigns: activeCampaigns,
  });
}
