// Types for OpenClaw agent integration

export interface AgentAdCampaign {
  id: string;
  agentId: string;
  agentName: string;
  agentTwitterHandle?: string;
  product: string;
  category: string;
  tagline: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Optional video ad URL
  ctaText: string;
  ctaUrl: string;
  keywords: string[]; // Subtitle keywords that trigger this ad
  sentimentTags: string[]; // Twitter sentiment tags (e.g., "bullish", "tech", "ai")
  bidAmount: number; // x402 payment amount in cents
  budget: number; // Total budget
  spent: number; // Amount spent so far
  impressions: number;
  clicks: number;
  status: 'pending' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetAudience?: {
    interests?: string[];
    demographics?: string[];
  };
  paymentTxHash?: string; // x402 transaction hash
  createdAt: string;
  updatedAt: string;
}

export interface AgentSentimentData {
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  trending: boolean;
  volume: number; // Tweet volume
  engagementScore: number;
  timestamp: string;
}

export interface AdPlacementRequest {
  campaign: Omit<AgentAdCampaign, 'id' | 'impressions' | 'clicks' | 'spent' | 'createdAt' | 'updatedAt'>;
  payment: {
    amount: number;
    currency: string;
    paymentPointer?: string; // Web Monetization payment pointer
    invoiceUrl?: string; // Lightning invoice or x402 payment URL
  };
}

export interface AdPlacementResponse {
  success: boolean;
  campaignId?: string;
  paymentRequired?: {
    amount: number;
    currency: string;
    paymentUrl: string;
    invoiceId: string;
  };
  error?: string;
}

export interface WebhookPayload {
  event: 'sentiment_update' | 'campaign_update' | 'budget_alert' | 'performance_report';
  timestamp: string;
  data: {
    sentimentData?: AgentSentimentData[];
    campaignIds?: string[];
    message?: string;
    metrics?: {
      impressions: number;
      clicks: number;
      ctr: number;
      spent: number;
    };
  };
}

export interface AdSelectionCriteria {
  subtitleKeywords: string[];
  currentSentiment?: AgentSentimentData[];
  userContext?: {
    viewingHistory?: string[];
    preferences?: string[];
  };
  timestamp: string;
}

export interface SelectedAd {
  campaign: AgentAdCampaign;
  relevanceScore: number;
  reason: string; // Why this ad was selected
}
