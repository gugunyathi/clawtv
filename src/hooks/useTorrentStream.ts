"use client";

import { useEffect, useRef, useState } from "react";

interface TorrentStreamState {
  videoUrl: string | null;
  loading: boolean;
  progress: number;
  error: string | null;
  duration: number;
}

export function useTorrentStream(torrentFile: string | undefined) {
  const [state, setState] = useState<TorrentStreamState>({
    videoUrl: null,
    loading: false,
    progress: 0,
    error: null,
    duration: 0,
  });

  const clientRef = useRef<any>(null);
  const torrentRef = useRef<any>(null);

  useEffect(() => {
    if (!torrentFile) return;

    let mounted = true;

    const initTorrent = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Dynamically import WebTorrent to avoid SSR issues
        const WebTorrent = (await import("webtorrent")).default;
        
        if (!mounted) return;

        // Create WebTorrent client
        if (!clientRef.current) {
          clientRef.current = new WebTorrent();
        }

        const client = clientRef.current;

        // Fetch the torrent file
        const response = await fetch(torrentFile);
        const torrentBlob = await response.blob();

        // Add torrent to client
        client.add(torrentBlob, (torrent: any) => {
          if (!mounted) return;

          torrentRef.current = torrent;

          // Find the largest video file
          const file = torrent.files.find((f: any) => 
            f.name.endsWith('.mp4') || 
            f.name.endsWith('.mkv') || 
            f.name.endsWith('.avi') ||
            f.name.endsWith('.webm')
          ) || torrent.files[0];

          if (file) {
            // Create a blob URL for the video
            file.getBlobURL((err: Error | null, url: string) => {
              if (err || !mounted) {
                setState((prev) => ({ 
                  ...prev, 
                  loading: false, 
                  error: err?.message || "Failed to load video" 
                }));
                return;
              }

              setState({
                videoUrl: url,
                loading: false,
                progress: 100,
                error: null,
                duration: 0,
              });
            });
          }

          // Update download progress
          torrent.on('download', () => {
            if (!mounted) return;
            setState((prev) => ({
              ...prev,
              progress: Math.round((torrent.progress * 100)),
            }));
          });

          torrent.on('error', (err: Error) => {
            if (!mounted) return;
            setState((prev) => ({
              ...prev,
              loading: false,
              error: err.message,
            }));
          });
        });
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load torrent",
          }));
        }
      }
    };

    initTorrent();

    return () => {
      mounted = false;
      // Cleanup torrent on unmount
      if (torrentRef.current) {
        torrentRef.current.destroy();
      }
    };
  }, [torrentFile]);

  // Cleanup client on component unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
    };
  }, []);

  return state;
}
