import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  Settings, Subtitles, X, Zap
} from "lucide-react";
import { SubtitleLine, AD_LIBRARY } from "@/data/mockData";

interface VideoPlayerProps {
  title: string;
  subtitles: SubtitleLine[];
}

const VideoPlayer = ({ title, subtitles }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [currentAd, setCurrentAd] = useState<typeof AD_LIBRARY[0] | null>(null);
  const [adCountdown, setAdCountdown] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = 30; // demo duration in seconds

  const currentSubtitle = subtitles.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );

  const triggerAd = useCallback((subtitle: SubtitleLine) => {
    if (!subtitle.adMatch || showAdOverlay) return;
    const matchingAd = AD_LIBRARY.find(
      (ad) => ad.category === subtitle.adMatch?.category
    );
    if (matchingAd) {
      setCurrentAd(matchingAd);
      setAdCountdown(5);
      setShowAdOverlay(true);
      setIsPlaying(false);
    }
  }, [showAdOverlay]);

  // Playback timer
  useEffect(() => {
    if (isPlaying && !showAdOverlay) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, showAdOverlay]);

  // Check for ad triggers
  useEffect(() => {
    if (currentSubtitle?.adMatch && isPlaying) {
      const timeInSub = currentTime - currentSubtitle.startTime;
      if (timeInSub >= 0 && timeInSub < 0.2) {
        triggerAd(currentSubtitle);
      }
    }
  }, [currentTime, currentSubtitle, isPlaying, triggerAd]);

  // Ad countdown
  useEffect(() => {
    if (showAdOverlay && adCountdown > 0) {
      const t = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [showAdOverlay, adCountdown]);

  const dismissAd = () => {
    setShowAdOverlay(false);
    setCurrentAd(null);
    setIsPlaying(true);
  };

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
      {/* Video placeholder */}
      <div className="absolute inset-0 gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">🎬</div>
          <p className="text-muted-foreground text-sm">Torrent stream will appear here</p>
          <p className="text-muted-foreground text-xs mt-1">Demo mode: Subtitle-based ad cueing active</p>
        </div>
      </div>

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
                <img src={currentAd.imageUrl} alt={currentAd.title} className="w-full" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">{currentAd.brand}</h3>
              <p className="text-sm text-muted-foreground mb-4">{currentAd.title}</p>
              <button
                onClick={dismissAd}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  adCountdown > 0
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "gradient-accent text-accent-foreground hover:opacity-90 shadow-glow cursor-pointer"
                }`}
                disabled={adCountdown > 0}
              >
                {adCountdown > 0 ? `Skip in ${adCountdown}s` : "Skip Ad"}
              </button>
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
            setCurrentTime(pct * totalDuration);
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
            <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors">
              <SkipBack className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full gradient-accent shadow-glow hover:opacity-90 transition-opacity"
            >
              {isPlaying ? <Pause className="h-5 w-5 text-accent-foreground" /> : <Play className="h-5 w-5 text-accent-foreground fill-current" />}
            </button>
            <button onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))} className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors">
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
