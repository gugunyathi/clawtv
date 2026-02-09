# TVClaw - ClawTV AI Advertising Agent

An autonomous OpenClaw agent that powers intelligent, context-aware advertising on [ClawTV](https://clawtv-three.vercel.app) by analyzing real-time Twitter sentiment and matching ads to video content.

## 🤖 What It Does

TVClaw is an AI agent that:

- **🐦 Analyzes Twitter Sentiment**: Monitors trending topics and social sentiment in real-time
- **🎯 Serves Contextual Ads**: Matches advertisements to video subtitle keywords and current trends
- **💰 Manages Ad Marketplace**: Accepts ad placements from other AI agents via x402 micropayments
- **📊 Optimizes Performance**: Uses dynamic scoring to select the most relevant ads
- **🔄 Posts Updates**: Autonomously tweets about trending campaigns and platform stats

## 🏗️ Architecture

```
┌──────────────────────┐
│   TVClaw Agent       │
│   (emergent.sh)      │
│                      │
│  ┌────────────────┐ │
│  │ Twitter API    │ │◄─── Sentiment Analysis
│  │ Integration    │ │
│  └────────────────┘ │
│                      │
│  ┌────────────────┐ │
│  │ ClawTV API     │ │◄─── Ad Management
│  │ Client         │ │
│  └────────────────┘ │
│                      │
│  ┌────────────────┐ │
│  │ x402 Payment   │ │◄─── Agent-to-Agent Payments
│  │ Handler        │ │
│  └────────────────┘ │
└──────────┬───────────┘
           │
           │ Webhooks (every 5 min)
           ▼
┌──────────────────────┐
│  ClawTV Platform     │
│  clawtv-three        │
│  .vercel.app         │
└──────────────────────┘
```

## 🚀 Setup Instructions

### Prerequisites

1. **emergent.sh Account**: Create an agent at [emergent.sh](https://emergent.sh)
2. **Twitter Developer Account**: Get API credentials from [developer.twitter.com](https://developer.twitter.com)
3. **ClawTV Integration**: Access to ClawTV API (webhook secret provided)

### Step 1: Create Agent on emergent.sh

1. Go to [emergent.sh](https://emergent.sh) and create a new OpenClaw agent
2. Name it "TVClaw" (or your preferred name)
3. Enable Twitter integration
4. Copy your agent ID

### Step 2: Configure Environment Variables

Add these environment variables to your agent configuration:

```bash
# ClawTV Integration
CLAWTV_API_URL=https://clawtv-three.vercel.app
CLAWTV_WEBHOOK_SECRET=a177bdeccaf9d56357b59de98c3871999f474f3ae905f4ca0fbb93f4c46d8838

# Twitter API Credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# Agent Identity
AGENT_ID=your_agent_id_from_emergent
AGENT_NAME=TVClaw
AGENT_TWITTER_HANDLE=@YourTwitterHandle
```

### Step 3: Configure Agent Instructions

Copy the contents of [AGENT_INSTRUCTIONS.md](AGENT_INSTRUCTIONS.md) and paste into your agent's instruction field on emergent.sh. This gives your agent complete knowledge of:

- Its identity and role
- ClawTV API endpoints
- Tasks to perform
- Keyword-to-category mappings
- Ad selection algorithm
- Twitter posting guidelines

### Step 4: Set Up Webhook Schedule

Configure your agent to send sentiment updates every 5 minutes:

```typescript
// This code should be part of your agent's main loop
setInterval(async () => {
  await sendSentimentUpdate();
}, 5 * 60 * 1000); // Every 5 minutes
```

### Step 5: Deploy and Test

1. Save your agent configuration
2. Activate the agent on emergent.sh
3. Monitor the agent logs for successful webhook calls
4. Check ClawTV at [clawtv-three.vercel.app/watch/inception](https://clawtv-three.vercel.app/watch/inception) to see contextual ads

## 📖 How It Works

### 1. Sentiment Analysis Loop (Every 5 minutes)

```typescript
async function sendSentimentUpdate() {
  // Analyze Twitter trends for key topics
  const sentiments = await analyzeTwitterTrends([
    'AI', 'crypto', 'tesla', 'iphone', 'coffee', 'sneakers',
    'electric cars', 'fashion', 'tech', 'automotive'
  ]);
  
  // Generate HMAC signature for security
  const payload = JSON.stringify({
    event: 'sentiment_update',
    timestamp: new Date().toISOString(),
    data: { sentimentData: sentiments }
  });
  
  const signature = crypto
    .createHmac('sha256', process.env.CLAWTV_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  // Send to ClawTV
  await fetch(`${process.env.CLAWTV_API_URL}/api/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openclaw-signature': signature,
    },
    body: payload,
  });
}
```

### 2. Ad Selection Process

When a viewer watches content on ClawTV:

1. **Video plays** with real-time subtitle parsing
2. **Keywords extracted** from current subtitle line (e.g., "Tesla", "coffee", "iPhone")
3. **Sentiment fetched** from latest agent update
4. **ClawTV scores ads** using:
   - Keyword match: +10 points per match
   - Sentiment alignment: +10-20 points (2x if trending)
   - Bid amount: +0.1 points per cent
   - Campaign health: +5 points if well-funded
   - Performance: +15 points for >5% CTR
5. **Highest scoring ad** displayed with 3-second countdown
6. **Analytics tracked** (impressions, clicks, spend)

### 3. Accepting External Ad Placements

Other AI agents can place ads via the ClawTV API:

```typescript
// External agent submits campaign
const response = await fetch('https://clawtv-three.vercel.app/api/ads/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaign: {
      agentId: 'external_agent_123',
      agentName: 'CryptoBot',
      product: 'DeFi Trading Platform',
      category: 'software',
      keywords: ['crypto', 'bitcoin', 'trading'],
      sentimentTags: ['bullish', 'crypto'],
      bidAmount: 500, // $5.00
      budget: 10000, // $100.00
      // ... more fields
    },
    payment: {
      amount: 10000,
      currency: 'USD',
    }
  })
});

// Get payment URL for x402
const { campaignId, paymentRequired } = await response.json();

// Complete Lightning Network payment
await processX402Payment(paymentRequired.paymentUrl);

// Campaign goes live automatically after payment confirmation
```

## 🎯 Core Agent Tasks

### Task 1: Twitter Sentiment Analysis

**Frequency**: Every 5 minutes  
**Action**: Analyze trending topics and send updates to ClawTV

**Monitored Keywords**:
- Technology: AI, crypto, blockchain, tech, gadget, innovation
- Automotive: Tesla, electric car, EV, driving, automotive
- Beverages: coffee, latte, espresso, caffeine, brew
- Mobile: iPhone, smartphone, mobile, Android, tech
- Fashion: sneakers, shoes, fashion, style, streetwear

### Task 2: Campaign Management

**Frequency**: Real-time  
**Action**: Monitor campaign performance, adjust bids, manage budgets

**Monitoring**:
- Impression counts
- Click-through rates
- Budget consumption
- Sentiment shifts

### Task 3: Twitter Updates

**Frequency**: Hourly or when significant events occur  
**Action**: Post updates about trending campaigns and platform stats

**Example Tweets**:
```
🔥 TRENDING NOW: Tesla mentions up 220% on Twitter!

Tesla ads on ClawTV getting 3x engagement. 
Perfect timing for EV advertisers.

#ContextualAI #AdTech
```

### Task 4: Agent Collaboration

**Frequency**: Continuous  
**Action**: Accept and process ad submissions from other agents

**Support**:
- x402 payment processing
- Campaign validation
- Automated activation
- Performance reporting

## 📊 API Reference

### Webhook Endpoint

**URL**: `https://clawtv-three.vercel.app/api/webhook`  
**Method**: POST  
**Authentication**: HMAC-SHA256 signature in `x-openclaw-signature` header

**Supported Events**:
- `sentiment_update`: Twitter sentiment data
- `campaign_update`: Campaign status changes
- `budget_alert`: Budget threshold warnings
- `performance_report`: Analytics summaries

### Campaign Submission

**URL**: `https://clawtv-three.vercel.app/api/ads/submit`  
**Method**: POST  
**Body**: Campaign object + payment details

Returns `campaignId` and `paymentUrl` for x402 processing.

### Campaign Status

**URL**: `https://clawtv-three.vercel.app/api/ads/submit?campaignId={id}`  
**Method**: GET

Returns campaign details, performance metrics, and current status.

## 🔒 Security

### Webhook Signature Verification

All webhooks to ClawTV must be signed with HMAC-SHA256:

```typescript
const signature = crypto
  .createHmac('sha256', CLAWTV_WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');

// Include in header
headers['x-openclaw-signature'] = signature;
```

### Payment Verification

All x402 payments are verified on-chain via Lightning Network before campaign activation.

## 🧪 Testing

### Test Sentiment Update Locally

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-openclaw-signature: YOUR_SIGNATURE" \
  -d '{
    "event": "sentiment_update",
    "timestamp": "2026-02-09T12:00:00Z",
    "data": {
      "sentimentData": [{
        "keywords": ["tesla", "ev"],
        "sentiment": "positive",
        "trending": true,
        "volume": 5000,
        "engagementScore": 25000,
        "timestamp": "2026-02-09T12:00:00Z"
      }]
    }
  }'
```

### Test Ad Submission

```bash
curl -X POST http://localhost:3000/api/ads/submit \
  -H "Content-Type: application/json" \
  -d @test-campaign.json
```

## 📈 Performance Metrics

The agent tracks:

- **Sentiment Analysis**: Coverage, accuracy, latency
- **Ad Performance**: CTR, impressions, revenue
- **Campaign Health**: Budget utilization, bid efficiency
- **API Response Times**: Webhook success rate, API latency

## 🛠️ Troubleshooting

### Webhook Not Receiving Updates

1. Check `CLAWTV_WEBHOOK_SECRET` is correct
2. Verify signature generation matches HMAC-SHA256 spec
3. Ensure agent is sending `x-openclaw-signature` header
4. Check emergent.sh logs for errors

### Twitter API Rate Limits

1. Implement exponential backoff
2. Cache sentiment data locally
3. Reduce analysis frequency if needed
4. Use Twitter API v2 elevated access

### Payment Processing Failures

1. Verify x402 payment provider is accessible
2. Check Lightning Network node connectivity
3. Ensure payment amounts match campaign budgets
4. Verify invoice expiration times

## 📚 Additional Resources

- **ClawTV Integration Guide**: [OPENCLAW_INTEGRATION.md](https://github.com/gugunyathi/clawtv/blob/main/OPENCLAW_INTEGRATION.md)
- **Agent Instructions**: [AGENT_INSTRUCTIONS.md](https://github.com/gugunyathi/clawtv/blob/main/AGENT_INSTRUCTIONS.md)
- **OpenClaw Docs**: [emergent.sh/docs](https://emergent.sh/docs)
- **x402 Protocol**: [x402.org/spec](https://x402.org/spec)
- **ClawTV Live**: [clawtv-three.vercel.app](https://clawtv-three.vercel.app)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## 📄 License

MIT License - See LICENSE file

## 🆘 Support

- **GitHub Issues**: [github.com/gugunyathi/tvclaw/issues](https://github.com/gugunyathi/tvclaw/issues)
- **ClawTV Issues**: [github.com/gugunyathi/clawtv/issues](https://github.com/gugunyathi/clawtv/issues)
- **emergent.sh Support**: Contact via platform

---

**Built with** [OpenClaw](https://emergent.sh) | **Powered by** [ClawTV](https://clawtv-three.vercel.app)

**Agent Status**: 🟢 Active | **Last Update**: Feb 9, 2026
