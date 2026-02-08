"use client";

export interface ParsedSubtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  keywords?: string[];
  adMatch?: {
    category: string;
    product: string;
  };
}

// Parse SRT time format (00:00:00,000) to seconds
function parseTimeToSeconds(timeString: string): number {
  const [time, ms] = timeString.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
}

// Keyword to ad category mapping
const KEYWORD_MAP: Record<string, { category: string; product: string }> = {
  'phone': { category: 'mobile', product: 'iPhone' },
  'iphone': { category: 'mobile', product: 'iPhone' },
  'call': { category: 'mobile', product: 'iPhone' },
  'coffee': { category: 'beverage', product: 'coffee' },
  'starbucks': { category: 'beverage', product: 'Starbucks' },
  'drink': { category: 'beverage', product: 'coffee' },
  'cafe': { category: 'beverage', product: 'Starbucks' },
  'car': { category: 'automotive', product: 'Tesla' },
  'tesla': { category: 'automotive', product: 'Tesla' },
  'bmw': { category: 'automotive', product: 'BMW' },
  'drive': { category: 'automotive', product: 'BMW' },
  'vehicle': { category: 'automotive', product: 'Tesla' },
  'shoes': { category: 'footwear', product: 'Nike' },
  'nike': { category: 'footwear', product: 'Nike' },
  'sneakers': { category: 'footwear', product: 'Nike' },
  'running': { category: 'footwear', product: 'Nike' },
  'samsung': { category: 'electronics', product: 'Samsung' },
  'screen': { category: 'electronics', product: 'Samsung' },
  'display': { category: 'electronics', product: 'Samsung' },
  'watch': { category: 'electronics', product: 'Samsung' },
  'laptop': { category: 'electronics', product: 'Samsung' },
  'computer': { category: 'electronics', product: 'Samsung' },
};

// Detect keywords in subtitle text
function detectKeywords(text: string): { keywords: string[]; adMatch?: { category: string; product: string } } {
  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];
  let adMatch: { category: string; product: string } | undefined;

  for (const [keyword, mapping] of Object.entries(KEYWORD_MAP)) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
      if (!adMatch) {
        adMatch = mapping;
      }
    }
  }

  return { keywords: foundKeywords, adMatch };
}

// Parse SRT subtitle file
export async function parseSRTFile(filePath: string): Promise<ParsedSubtitle[]> {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    const subtitles: ParsedSubtitle[] = [];
    const blocks = text.trim().split('\n\n');

    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length < 3) continue;

      const id = parseInt(lines[0]);
      const [startTime, endTime] = lines[1].split(' --> ');
      const subtitleText = lines.slice(2).join(' ');

      const { keywords, adMatch } = detectKeywords(subtitleText);

      subtitles.push({
        id,
        startTime: parseTimeToSeconds(startTime),
        endTime: parseTimeToSeconds(endTime),
        text: subtitleText,
        keywords: keywords.length > 0 ? keywords : undefined,
        adMatch,
      });
    }

    return subtitles;
  } catch (error) {
    console.error('Error parsing SRT file:', error);
    return [];
  }
}
