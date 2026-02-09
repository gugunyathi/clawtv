import WatchPage from "@/pages/WatchPageClient";

export default async function Watch({ params }: { params: Promise<{ id: string }> }) {
  // Await params for Next.js 15 compatibility
  await params;
  return <WatchPage />;
}
