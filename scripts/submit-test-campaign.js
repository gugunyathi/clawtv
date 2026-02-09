// Example script for submitting test campaigns to ClawTV
// Run with: node scripts/submit-test-campaign.js

const CLAWTV_API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

async function submitTestCampaign() {
  const campaign = {
    agentId: 'agent_test_001',
    agentName: 'TestBot',
    agentTwitterHandle: '@testbot',
    product: 'AI Assistant Pro',
    category: 'mobile',
    tagline: 'Your AI companion',
    description: 'Advanced AI assistant that learns from your habits and preferences',
    imageUrl: 'https://placehold.co/400x225/1a1f36/3b82f6?text=AI+Assistant+Pro',
    ctaText: 'Try Now',
    ctaUrl: 'https://example.com/ai-assistant',
    keywords: ['phone', 'ai', 'assistant', 'app'],
    sentimentTags: ['tech', 'ai', 'innovation'],
    bidAmount: 300, // $3.00 per impression
    budget: 5000, // $50.00 total
    status: 'pending',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  console.log('📤 Submitting campaign...');
  
  try {
    // Step 1: Submit campaign
    const submitResponse = await fetch(`${CLAWTV_API_URL}/api/ads/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaign,
        payment: {
          amount: campaign.budget,
          currency: 'USD',
        },
      }),
    });

    const submitData = await submitResponse.json();
    
    if (!submitData.success) {
      console.error('❌ Campaign submission failed:', submitData.error);
      return;
    }

    console.log('✅ Campaign submitted successfully!');
    console.log('📋 Campaign ID:', submitData.campaignId);
    console.log('💳 Payment required:', `$${submitData.paymentRequired.amount / 100}`);
    console.log('🔗 Payment URL:', submitData.paymentRequired.paymentUrl);

    // Step 2: Mock payment confirmation (in production, use real x402 payment)
    console.log('\n💰 Confirming payment...');
    
    const paymentResponse = await fetch(
      `${CLAWTV_API_URL}/api/payment/x402/${submitData.campaignId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txHash: `mock_tx_${Date.now()}`,
          paymentProof: 'mock_payment_proof',
        }),
      }
    );

    const paymentData = await paymentResponse.json();
    
    if (paymentData.success) {
      console.log('✅ Payment confirmed!');
      console.log('🚀 Campaign activated:', paymentData.campaign.status);
      console.log('\n📊 Campaign Summary:');
      console.log('   ID:', paymentData.campaign.id);
      console.log('   Status:', paymentData.campaign.status);
      console.log('   TX Hash:', paymentData.campaign.txHash);
      console.log('\n🎯 Your ads will now appear when relevant keywords are detected!');
    } else {
      console.error('❌ Payment confirmation failed:', paymentData.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function submitSentimentUpdate() {
  console.log('\n📊 Sending sentiment update...');
  
  const sentiments = [
    {
      keywords: ['tesla', 'ev', 'electric'],
      sentiment: 'positive',
      trending: true,
      volume: 15420,
      engagementScore: 89234,
      timestamp: new Date().toISOString(),
    },
    {
      keywords: ['iphone', 'apple', 'ios'],
      sentiment: 'positive',
      trending: true,
      volume: 12340,
      engagementScore: 67890,
      timestamp: new Date().toISOString(),
    },
    {
      keywords: ['coffee', 'starbucks'],
      sentiment: 'neutral',
      trending: false,
      volume: 5600,
      engagementScore: 23400,
      timestamp: new Date().toISOString(),
    },
  ];

  try {
    const response = await fetch(`${CLAWTV_API_URL}/api/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-openclaw-signature': 'mock_signature',
      },
      body: JSON.stringify({
        event: 'sentiment_update',
        timestamp: new Date().toISOString(),
        data: {
          sentimentData: sentiments,
        },
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Sentiment update sent successfully!');
      console.log('📈 Updated', sentiments.length, 'sentiment entries');
    } else {
      console.error('❌ Sentiment update failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run both tests
async function main() {
  console.log('🚀 ClawTV Agent Integration Test\n');
  console.log('API URL:', CLAWTV_API_URL);
  console.log('─'.repeat(50));
  
  await submitSentimentUpdate();
  console.log('─'.repeat(50));
  await submitTestCampaign();
  console.log('\n✨ Test complete!');
}

main();
