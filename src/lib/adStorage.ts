// Shared in-memory storage for ad campaigns and sentiment data
// In production, replace with a database (Supabase, PostgreSQL, etc.)

import { AgentAdCampaign, AgentSentimentData } from '@/types/agent';

// Campaign storage
export const campaigns: Map<string, AgentAdCampaign> = new Map();

// Sentiment data storage (last 100 updates)
export const sentimentData: Map<string, AgentSentimentData[]> = new Map();

// Helper function to get active campaigns
export function getActiveCampaigns(): AgentAdCampaign[] {
  return Array.from(campaigns.values()).filter(
    c => c.status === 'active' && c.spent < c.budget
  );
}

// Helper function to get campaign by ID
export function getCampaign(campaignId: string): AgentAdCampaign | undefined {
  return campaigns.get(campaignId);
}

// Helper function to update campaign
export function updateCampaign(campaign: AgentAdCampaign): void {
  campaign.updatedAt = new Date().toISOString();
  campaigns.set(campaign.id, campaign);
}

// Helper function to get latest sentiment data
export function getLatestSentiment(limit: number = 10): AgentSentimentData[] {
  const latest = Array.from(sentimentData.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .slice(0, limit);
  
  return latest.flatMap(([, data]) => data);
}

// Helper function to store sentiment data
export function storeSentimentData(data: AgentSentimentData[]): void {
  const timestamp = new Date().toISOString();
  sentimentData.set(timestamp, data);
  
  // Keep only last 100 updates
  if (sentimentData.size > 100) {
    const oldestKey = Array.from(sentimentData.keys())[0];
    sentimentData.delete(oldestKey);
  }
}
