import crypto from 'crypto';

/**
 * Verify webhook signature from OpenClaw agent
 * @param payload - The request body as a string
 * @param signature - The signature from x-openclaw-signature header
 * @param secret - The webhook secret (CLAWTV_WEBHOOK_SECRET)
 * @returns boolean - True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  // Generate HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Generate signature for outgoing webhook requests (for agent to use)
 * @param payload - The request body as a string
 * @param secret - The webhook secret
 * @returns string - The HMAC-SHA256 signature
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}
