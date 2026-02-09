"use client";

import { useState, useCallback } from 'react';
import { AdSelectionCriteria, SelectedAd } from '@/types/agent';

export function useDynamicAds() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectAd = useCallback(async (criteria: AdSelectionCriteria): Promise<SelectedAd | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ads/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error('Failed to select ad');
      }

      const data = await response.json();
      return data.ad;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error selecting ad:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSentiment = useCallback(async () => {
    try {
      const response = await fetch('/api/webhook/sentiment');
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment');
      }
      const data = await response.json();
      return data.data[0]?.sentiments || [];
    } catch (err) {
      console.error('Error fetching sentiment:', err);
      return [];
    }
  }, []);

  const trackImpression = useCallback(async (campaignId: string) => {
    try {
      await fetch(`/api/ads/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          event: 'impression',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Error tracking impression:', err);
    }
  }, []);

  const trackClick = useCallback(async (campaignId: string) => {
    try {
      await fetch(`/api/ads/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          event: 'click',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  }, []);

  return {
    selectAd,
    fetchSentiment,
    trackImpression,
    trackClick,
    loading,
    error,
  };
}
