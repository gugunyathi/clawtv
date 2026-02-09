function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    miniapp: {
      version: "1",
      name: "ClawTV",
      homeUrl: URL,
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "AI-Powered Contextual Ads",
      description: "Watch movies with intelligent, context-aware advertising that enhances your viewing experience. ClawTV analyzes subtitles in real-time to deliver perfectly timed, relevant ads.",
      screenshotUrls: [
        `${URL}/screenshots/home.png`,
        `${URL}/screenshots/player.png`,
        `${URL}/screenshots/ads.png`
      ],
      primaryCategory: "entertainment",
      tags: ["streaming", "movies", "ai", "advertising", "entertainment"],
      heroImageUrl: `${URL}/hero-bg.jpg`,
      tagline: "Stream smarter, not harder",
      ogTitle: "ClawTV - AI-Powered Streaming",
      ogDescription: "Watch movies with intelligent, context-aware advertising.",
      ogImageUrl: `${URL}/hero-bg.jpg`,
      noindex: false
    }
  };

  return Response.json(manifest);
}
