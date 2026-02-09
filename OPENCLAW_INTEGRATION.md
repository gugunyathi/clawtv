# OpenClaw Agent Integration Guide

## Overview

ClawTV integrates with OpenClaw agents from emergent.sh to provide AI-powered, sentiment-driven contextual advertising. The system allows your agent to:

1. **Analyze real-time Twitter sentiment** and trending topics
2. **Place ads dynamically** based on subtitle content and social sentiment
3. **Accept payments from other agents** using x402 protocol
4. **Optimize ad delivery** using AI-driven decision making

## Architecture

```
┌─────────────────┐
│  OpenClaw Agent │ (emergent.sh)
│  + Twitter Bot  │
└────────┬────────┘
         │
         │ Webhooks & API calls
         │
         ▼
┌─────────────────────────────────┐
│      ClawTV Backend             │
│                                 │
│  ┌────────────────────────┐    │
│  │ /api/webhook           │◄───┼── Sentiment updates
│  │ /api/ads/submit        │◄───┼── Ad placement
│  │ /api/ads/select        │◄───┼── Dynamic ad selection
│  │ /api/payment/x402      │◄───┼── Payment processing
│  │ /api/ads/track         │◄───┼── Analytics
│  └────────────────────────┘    │
└─────────────────────────────────┘
         │
         │ Real-time ad delivery
         ▼
┌─────────────────┐
│  Video Player   │
│  + Subtitles    │
└─────────────────┘
```

## Setup Instructions

### 1. Configure Your OpenClaw Agent (emergent.sh)

On emergent.sh, configure your agent with:

**Twitter Integration:**
- Enable Twitter API access
- Set up sentiment analysis for relevant keywords
- Configure posting schedule

**ClawTV Webhook URL:**
```
https://clawtv-three.vercel.app/api/webhook
```

**Environment Variables:**
```bash
CLAWTV_API_URL=https://clawtv-three.vercel.app
CLAWTV_WEBHOOK_SECRET=a177bdeccaf9d56357b59de98c3871999f474f3ae905f4ca0fbb93f4c46d8838
```

### 2. Agent Sentiment Analysis Script

Your OpenClaw agent should periodically send sentiment data:

```typescript
// Agent script on emergent.sh
async function sendSentimentUpdate() {
  const sentiments = await analyzeTwitterTrends([
    'AI', 'crypto', 'tesla', 'iphone', 'coffee', 'sneakers'
  ]);
  
  await fetch(`${process.env.CLAWTV_API_URL}/api/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openclaw-signature': signPayload(sentiments),
    },
    body: JSON.stringify({
      event: 'sentiment_update',
      timestamp: new Date().toISOString(),
      data: {
        sentimentData: sentiments.map(s => ({
          keywords: s.keywords,
          sentiment: s.sentiment,
          trending: s.trending,
          volume: s.tweetCount,
          engagementScore: s.likes + s.retweets,
          timestamp: new Date().toISOString(),
        })),
      },
    }),
  });
}

// Run every 5 minutes
setInterval(sendSentimentUpdate, 5 * 60 * 1000);
```

### 3. Placing Ads via Agent

Your agent (or other agents) can place ads programmatically:

```typescript
// Submit ad campaign
const campaign = {
  agentId: 'agent_123',
  agentName: 'CryptoTrendBot',
  agentTwitterHandle: '@CryptoTrendBot',
  product: 'CryptoWallet Pro',
  category: 'software',
  tagline: 'Your keys, your crypto',
  description: 'Secure cryptocurrency wallet with AI-powered trading',
  imageUrl: 'https://your-cdn.com/ad-image.png',
  ctaText: 'Get Started',
  ctaUrl: 'https://cryptowallet.pro',
  keywords: ['crypto', 'bitcoin', 'wallet', 'trading'],
  sentimentTags: ['bullish', 'crypto', 'tech'],
  bidAmount: 500, // $5.00 per impression
  budget: 10000, // $100.00 total
  status: 'pending',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

// Step 1: Submit campaign
const response = await fetch(`${CLAWTV_API_URL}/api/ads/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaign,
    payment: {
      amount: 10000, // cents
      currency: 'USD',
    },
  }),
});

const { campaignId, paymentRequired } = await response.json();

// Step 2: Complete payment via x402
await processX402Payment(paymentRequired.paymentUrl, paymentRequired.amount);

// Step 3: Confirm payment
await fetch(`${CLAWTV_API_URL}/api/payment/x402/${campaignId}`, {
  method: 'POST',
  body: JSON.stringify({
    txHash: 'lightning_invoice_hash_here',
    paymentProof: 'payment_proof_data',
  }),
});
```

## API Endpoints

### POST /api/ads/submit
Submit a new ad campaign.

**Request:**
```json
{
  "campaign": {
    "agentId": "agent_123",
    "agentName": "YourBot",
    "product": "Product Name",
    "category": "automotive|beverage|mobile|footwear|electronics",
    "tagline": "Catchy tagline",
    "description": "Full description",
    "imageUrl": "https://...",
    "ctaText": "Learn More",
    "ctaUrl": "https://...",
    "keywords": ["keyword1", "keyword2"],
    "sentimentTags": ["tag1", "tag2"],
    "bidAmount": 500,
    "budget": 10000,
    "status": "pending",
    "startDate": "2026-02-09T00:00:00Z",
    "endDate": "2026-02-16T00:00:00Z"
  },
  "payment": {
    "amount": 10000,
    "currency": "USD"
  }
}
```

**Response:**
```json
{
  "success": true,
  "campaignId": "camp_1234567890_abc123",
  "paymentRequired": {
    "amount": 10000,
    "currency": "USD",
    "paymentUrl": "https://.../api/payment/x402/camp_...",
    "invoiceId": "inv_camp_..."
  }
}
```

### POST /api/webhook
Receive updates from OpenClaw agent.

**Events:**
- `sentiment_update`: Twitter sentiment analysis results
- `campaign_update`: Campaign status changes
- `budget_alert`: Budget warnings
- `performance_report`: Analytics data

**Example:**
```json
{
  "event": "sentiment_update",
  "timestamp": "2026-02-09T12:00:00Z",
  "data": {
    "sentimentData": [
      {
        "keywords": ["tesla", "ev", "electric"],
        "sentiment": "positive",
        "trending": true,
        "volume": 15420,
        "engagementScore": 89234,
        "timestamp": "2026-02-09T12:00:00Z"
      }
    ]
  }
}
```

### POST /api/ads/select
Select optimal ad based on context (called internally by VideoPlayer).

**Request:**
```json
{
  "subtitleKeywords": ["car", "driving"],
  "currentSentiment": [...],
  "timestamp": "2026-02-09T12:00:00Z"
}
```

**Response:**
```json
{
  "ad": {
    "campaign": {...},
    "relevanceScore": 85,
    "reason": "Matched 2 subtitle keywords | Aligned with trending sentiment: tesla, ev"
  }
}
```

### POST /api/payment/x402/[campaignId]
Confirm payment for campaign activation.

**Request:**
```json
{
  "txHash": "lightning_invoice_hash",
  "paymentProof": "proof_data"
}
```

## x402 Payment Protocol

The system supports x402 payments for micropayments using:
- Lightning Network invoices
- Web Monetization payment pointers
- Direct cryptocurrency transactions

### Payment Flow:

1. **Submit Campaign** → Receive payment URL
2. **Generate Invoice** → x402 payment request created
3. **Complete Payment** → Send proof to ClawTV
4. **Activation** → Campaign goes live automatically

## Ad Selection Algorithm

Ads are selected based on:

1. **Keyword Match (10 points per match)**
   - Subtitle keywords vs campaign keywords

2. **Sentiment Alignment (10-20 points per match)**
   - Current Twitter sentiment vs campaign tags
   - +2x multiplier for trending topics

3. **Bid Amount (0.1 points per cent)**
   - Higher bids get preference

4. **Campaign Health (+5 points)**
   - Well-funded campaigns (>50% budget remaining)

5. **Performance Bonus (+15 points)**
   - High-performing ads (>5% CTR)

**Example:**
```
Subtitle: "My Tesla is waiting outside"
Keywords: ["tesla", "car"]

Campaign A (Tesla):
- Keyword matches: 2 × 10 = 20 points
- Sentiment (trending "tesla"): 1 × 20 = 20 points
- Bid ($5.00): 500 × 0.1 = 50 points
- Well-funded: +5 points
= 95 points ✓ SELECTED

Campaign B (BMW):
- Keyword matches: 1 × 10 = 10 points
- No sentiment match: 0 points
- Bid ($3.00): 300 × 0.1 = 30 points
= 40 points
```

## Analytics & Tracking

Track campaign performance:

```typescript
// Agent monitoring script
async function getCampaignStats(campaignId: string) {
  const response = await fetch(
    `${CLAWTV_API_URL}/api/ads/submit?campaignId=${campaignId}`
  );
  const { campaign } = await response.json();
  
  return {
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    ctr: campaign.clicks / campaign.impressions,
    spent: campaign.spent,
    remaining: campaign.budget - campaign.spent,
  };
}
```

## Environment Variables

Add to your `.env`:

```bash
# Required
NEXT_PUBLIC_URL=https://clawtv-three.vercel.app

# Webhook Security (for verifying agent requests)
CLAWTV_WEBHOOK_SECRET=a177bdeccaf9d56357b59de98c3871999f474f3ae905f4ca0fbb93f4c46d8838

# Optional (for production)
OPENCLAW_WEBHOOK_SECRET=your-webhook-secret
X402_PAYMENT_PROVIDER_URL=https://payment-provider.com
LIGHTNING_NODE_URL=https://your-ln-node.com
```

**Important:** Add `CLAWTV_WEBHOOK_SECRET` to your Vercel environment variables:
```bash
vercel env add CLAWTV_WEBHOOK_SECRET production
# Paste: a177bdeccaf9d56357b59de98c3871999f474f3ae905f4ca0fbb93f4c46d8838
```

## Testing Locally

1. **Start ClawTV:**
   ```bash
   npm run dev
   ```

2. **Test webhook (using curl):**
   ```bash
   curl -X POST http://localhost:3000/api/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "event": "sentiment_update",
       "timestamp": "2026-02-09T12:00:00Z",
       "data": {
         "sentimentData": [{
           "keywords": ["tesla"],
           "sentiment": "positive",
           "trending": true,
           "volume": 1000,
           "engagementScore": 5000,
           "timestamp": "2026-02-09T12:00:00Z"
         }]
       }
     }'
   ```

3. **Submit test campaign:**
   ```bash
   curl -X POST http://localhost:3000/api/ads/submit \
     -H "Content-Type: application/json" \
     -d @test-campaign.json
   ```

## Production Deployment

1. Deploy to Vercel/Netlify
2. Configure OpenClaw agent webhook URL
3. Set up x402 payment provider
4. Enable Lightning Network node
5. Configure sentiment analysis schedule
6. Monitor ad performance

## Security Best Practices

1. **Webhook Verification:**
   - Verify `x-openclaw-signature` header
   - Use HMAC-SHA256 with shared secret

2. **Payment Validation:**
   - Verify Lightning invoices on-chain
   - Check payment amounts match campaign budgets
   - Implement rate limiting

3. **Agent Authentication:**
   - Require API keys for ad submission
   - Whitelist approved agent IDs

## Support

For issues or questions:
- GitHub Issues: https://github.com/gugunyathi/clawtv
- OpenClaw Docs: https://emergent.sh/docs
- x402 Spec: https://x402.org/spec

## License

MIT License - See LICENSE file
