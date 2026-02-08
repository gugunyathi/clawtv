import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subtitleText, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "analyze_subtitles") {
      systemPrompt = `You are an AI ad-cueing engine. Analyze subtitle/caption text and detect product mentions, brand names, and contextual keywords that could trigger relevant advertisements.

For each detected keyword, return:
- keyword: the detected word/phrase
- category: ad category (automotive, beverage, mobile, footwear, electronics, food, fashion, travel, finance, entertainment)
- confidence: 0-1 score
- timestamp_hint: approximate position in text (beginning, middle, end)

Return ONLY valid JSON using the tool provided.`;

      userPrompt = `Analyze this subtitle text for ad-cueing opportunities:\n\n${subtitleText}`;
    } else {
      systemPrompt = "You are a helpful entertainment assistant.";
      userPrompt = subtitleText;
    }

    const body: Record<string, unknown> = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };

    if (action === "analyze_subtitles") {
      body.tools = [
        {
          type: "function",
          function: {
            name: "return_ad_cues",
            description: "Return detected ad cue keywords from subtitle analysis",
            parameters: {
              type: "object",
              properties: {
                keywords: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      keyword: { type: "string" },
                      category: { type: "string", enum: ["automotive", "beverage", "mobile", "footwear", "electronics", "food", "fashion", "travel", "finance", "entertainment"] },
                      confidence: { type: "number" },
                      timestamp_hint: { type: "string", enum: ["beginning", "middle", "end"] },
                    },
                    required: ["keyword", "category", "confidence"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["keywords"],
              additionalProperties: false,
            },
          },
        },
      ];
      body.tool_choice = { type: "function", function: { name: "return_ad_cues" } };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits required. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Extract tool call result if present
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ response: data.choices?.[0]?.message?.content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-subtitles error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
