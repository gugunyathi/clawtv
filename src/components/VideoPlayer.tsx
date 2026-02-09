"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  Settings, Subtitles, X, Zap, Loader2
} from "lucide-react";
import { SubtitleLine, AD_LIBRARY } from "@/data/mockData";
import { useTorrentStream } from "@/hooks/useTorrentStream";
import { parseSRTFile, ParsedSubtitle } from "@/lib/srtParser";
import { useDynamicAds } from "@/hooks/useDynamicAds";
import { SelectedAd } from "@/types/agent";

interface VideoPlayerProps {
  title: string;
  subtitles: SubtitleLine[];
  torrentFile?: string;
  videoFile?: string;
  subtitleFile?: string;
}

const VideoPlayer = ({ title, subtitles: defaultSubtitles, torrentFile, videoFile, subtitleFile }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [currentAd, setCurrentAd] = useState<typeof AD_LIBRARY[0] | null>(null);
  const [adCountdown, setAdCountdown] = useState(0);
  const [wasPlayingBeforeAd, setWasPlayingBeforeAd] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [subtitles, setSubtitles] = useState<SubtitleLine[]>(defaultSubtitles);
  const [loadingSubtitles, setLoadingSubtitles] = useState(false);
  const [selectedAd, setSelectedAd] = useState<SelectedAd | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Use torrent stream hook (only if torrentFile is provided)
  const torrentStream = useTorrentStream(torrentFile);
  
  // Use dynamic ads hook
  const { selectAd, fetchSentiment, trackImpression, trackClick } = useDynamicAds();

  // Determine video source (prefer direct video file over torrent)
  const videoSource = videoFile || torrentStream.videoUrl;

  const totalDuration = duration || 30; // Use actual video duration or demo duration

  // Load SRT subtitle file if provided
  useEffect(() => {
    if (subtitleFile) {
      setLoadingSubtitles(true);
      parseSRTFile(subtitleFile)
        .then((parsed) => {
          if (parsed.length > 0) {
            setSubtitles(parsed as SubtitleLine[]);
          }
          setLoadingSubtitles(false);
        })
        .catch((error) => {
          console.error('Failed to load subtitles:', error);
          setLoadingSubtitles(false);
        });
    }
  }, [subtitleFile]);

  const currentSubtitle = subtitles.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );

  const triggerAd = useCallback(async (subtitle: SubtitleLine) => {
    if (!subtitle.adMatch || showAdOverlay) return;
    
    // Fetch current sentiment data
    const sentimentData = await fetchSentiment();
    
    // Select ad dynamically based on subtitle keywords and sentiment
    const ad = await selectAd({
      subtitleKeywords: subtitle.adMatch ? [subtitle.adMatch.category] : [],
      currentSentiment: sentimentData,
      timestamp: new Date().toISOString(),
    });
    
    if (ad) {
      // Use agent-selected ad
      setSelectedAd(ad);
      setWasPlayingBeforeAd(isPlaying);
      setCurrentAd({
        id: ad.campaign.id,
        category: ad.campaign.category,
        brand: ad.campaign.product,
        title: ad.campaign.tagline,
        product: ad.campaign.product,
        tagline: ad.campaign.tagline,
        description: ad.campaign.description,
        imageUrl: ad.campaign.imageUrl,
        videoUrl: ad.campaign.videoUrl,
        ctaText: ad.campaign.ctaText,
        ctaUrl: ad.campaign.ctaUrl,
      });
      setAdCountdown(3);
      setShowAdOverlay(true);
      setIsPlaying(false);
      
      // Track impression
      trackImpression(ad.campaign.id);
    } else {
      // Fallback to static ads if no dynamic ad available
      const matchingAd = AD_LIBRARY.find(
        (ad) => ad.category === subtitle.adMatch?.category
      );
      if (matchingAd) {
        setWasPlayingBeforeAd(isPlaying);
        setCurrentAd(matchingAd);
        setAdCountdown(3);
        setShowAdOverlay(true);
        setIsPlaying(false);
      }
    }
  }, [showAdOverlay, isPlaying, selectAd, fetchSentiment, trackImpression]);

  // Handle video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoSource]);

  // Update video volume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // Play/Pause control
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSource) return;

    if (isPlaying && !showAdOverlay) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, showAdOverlay, videoSource]);

  // Check for ad triggers
  useEffect(() => {
    if (currentSubtitle?.adMatch && isPlaying) {
      const timeInSub = currentTime - currentSubtitle.startTime;
      if (timeInSub >= 0 && timeInSub < 0.2) {
        triggerAd(currentSubtitle);
      }
    }
  }, [currentTime, currentSubtitle, isPlaying, triggerAd]);

  // Dismiss ad and resume playback
  const dismissAd = useCallback(() => {
    setShowAdOverlay(false);
    setCurrentAd(null);
    // Restore the playback state from before the ad
    if (wasPlayingBeforeAd && videoSource) {
      setIsPlaying(true);
    }
  }, [wasPlayingBeforeAd, videoSource]);

  // Ad countdown
  useEffect(() => {
    if (showAdOverlay && adCountdown > 0) {
      const t = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
      return () => clearTimeout(t);
    } else if (showAdOverlay && adCountdown === 0) {
      // Automatically dismiss ad when countdown reaches 0 (like real TV)
      dismissAd();
    }
  }, [showAdOverlay, adCountdown, dismissAd]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / totalDuration) * 100;

  return (
    <div
      className="relative w-full aspect-video bg-background rounded-xl overflow-hidden shadow-elevated group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video element or placeholder */}
      {videoSource ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          src={videoSource}
          onClick={() => setIsPlaying(!isPlaying)}
        />
      ) : (
        <div className="absolute inset-0 gradient-hero flex items-center justify-center">
          <div className="text-center">
            {torrentStream.loading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">Loading torrent stream...</p>
                <p className="text-muted-foreground text-sm">Progress: {torrentStream.progress}%</p>
              </>
            ) : torrentStream.error ? (
              <>
                <div className="text-6xl mb-4 opacity-20">⚠️</div>
                <p className="text-destructive font-medium mb-2">Error loading torrent</p>
                <p className="text-muted-foreground text-xs">{torrentStream.error}</p>
              </>
            ) : torrentFile ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-foreground font-medium">Initializing torrent...</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 opacity-20">🎬</div>
                <p className="text-muted-foreground text-sm">No torrent file available</p>
                <p className="text-muted-foreground text-xs mt-1">Demo mode: Subtitle-based ad cueing active</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Subtitle overlay */}
      <AnimatePresence>
        {showSubtitles && currentSubtitle && !showAdOverlay && (
          <motion.div
            key={currentSubtitle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="px-6 py-2.5 rounded-lg bg-background/80 backdrop-blur-sm max-w-2xl">
              <p className="text-foreground text-center text-lg">
                {currentSubtitle.text.split(" ").map((word, i) => {
                  const isKeyword = currentSubtitle.keywords?.some(
                    (k) => word.toLowerCase().includes(k.toLowerCase())
                  );
                  return (
                    <span key={i} className={isKeyword ? "text-primary font-semibold" : ""}>
                      {word}{" "}
                    </span>
                  );
                })}
              </p>
              {currentSubtitle.adMatch && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary">
                    Ad cue: {currentSubtitle.adMatch.category}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad overlay */}
      <AnimatePresence>
        {showAdOverlay && currentAd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-md"
          >
            <div className="text-center max-w-md">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">OpenClaw AI Ad</span>
              </div>
              <div className="rounded-xl overflow-hidden shadow-elevated mb-4 border border-border">
                {(currentAd as any).videoUrl ? (
                  <video 
                    src={(currentAd as any).videoUrl} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full"
                  />
                ) : (
                  <img src={currentAd.imageUrl} alt={currentAd.title} className="w-full" />
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">{currentAd.brand}</h3>
              <p className="text-sm text-muted-foreground mb-4">{currentAd.title}</p>
              <div className="px-6 py-2 rounded-lg text-sm font-medium bg-secondary/50 text-muted-foreground">
                Resuming in {adCountdown}s...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background/90 to-transparent"
      >
        {/* Progress bar */}
        <div className="relative w-full h-1 bg-secondary rounded-full mb-4 cursor-pointer group/progress"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const newTime = pct * totalDuration;
            setCurrentTime(newTime);
            if (videoRef.current && videoSource) {
              videoRef.current.currentTime = newTime;
            }
          }}
        >
          <div
            className="absolute h-full gradient-accent rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          {/* Keyword markers */}
          {subtitles
            .filter((s) => s.adMatch)
            .map((s) => (
              <div
                key={s.id}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-glow"
                style={{ left: `${(s.startTime / totalDuration) * 100}%` }}
                title={`Ad cue: ${s.adMatch?.product}`}
              />
            ))}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const newTime = Math.max(0, currentTime - 10);
                setCurrentTime(newTime);
                if (videoRef.current && videoSource) {
                  videoRef.current.currentTime = newTime;
                }
              }} 
              className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <SkipBack className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full gradient-accent shadow-glow hover:opacity-90 transition-opacity"
            >
              {isPlaying ? <Pause className="h-5 w-5 text-accent-foreground" /> : <Play className="h-5 w-5 text-accent-foreground fill-current" />}
            </button>
            <button 
              onClick={() => {
                const newTime = Math.min(totalDuration, currentTime + 10);
                setCurrentTime(newTime);
                if (videoRef.current && videoSource) {
                  videoRef.current.currentTime = newTime;
                }
              }} 
              className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <SkipForward className="h-5 w-5 text-foreground" />
            </button>
            <span className="text-xs text-muted-foreground ml-2">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setMuted(!muted)} className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors">
              {muted ? <VolumeX className="h-5 w-5 text-foreground" /> : <Volume2 className="h-5 w-5 text-foreground" />}
            </button>
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-1.5 rounded-lg transition-colors ${showSubtitles ? "bg-primary/20 text-primary" : "hover:bg-secondary/50 text-foreground"}`}
            >
              <Subtitles className="h-5 w-5" />
            </button>
            <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-foreground" />
            </button>
            <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors">
              <Maximize className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;
