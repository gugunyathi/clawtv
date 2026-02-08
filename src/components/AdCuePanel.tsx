"use client";

import { motion } from "framer-motion";
import { Zap, Eye, TrendingUp, Tag, Clock } from "lucide-react";
import { SubtitleLine, AD_LIBRARY } from "@/data/mockData";

interface AdCuePanelProps {
  subtitles: SubtitleLine[];
  currentTime: number;
}

const AdCuePanel = ({ subtitles, currentTime }: AdCuePanelProps) => {
  const detectedKeywords = subtitles
    .filter((s) => s.adMatch)
    .map((s) => ({
      time: s.startTime,
      keyword: s.adMatch!.product,
      category: s.adMatch!.category,
      text: s.text,
      active: currentTime >= s.startTime && currentTime < s.endTime,
    }));

  const stats = {
    totalKeywords: detectedKeywords.length,
    categories: [...new Set(detectedKeywords.map((k) => k.category))],
    adsQueued: detectedKeywords.length,
  };

  return (
    <div className="gradient-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg gradient-accent">
          <Zap className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">OpenClaw AI Engine</h3>
          <p className="text-xs text-muted-foreground">Real-time subtitle analysis</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard icon={<Eye className="h-3.5 w-3.5" />} label="Keywords" value={stats.totalKeywords} />
        <StatCard icon={<Tag className="h-3.5 w-3.5" />} label="Categories" value={stats.categories.length} />
        <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Ads Queued" value={stats.adsQueued} />
      </div>

      {/* Keyword timeline */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Detected Keywords</h4>
        <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-hide">
          {detectedKeywords.map((kw, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                kw.active ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {Math.floor(kw.time / 60)}:{(kw.time % 60).toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-semibold text-primary">{kw.keyword}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    {kw.category}
                  </span>
                </div>
              </div>
              {kw.active && (
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Matched ads */}
      <div className="mt-5 space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Matched Ads</h4>
        <div className="grid grid-cols-2 gap-2">
          {AD_LIBRARY.slice(0, 4).map((ad) => (
            <div key={ad.id} className="p-2.5 rounded-lg bg-secondary/50 border border-border">
              <span className="text-xs font-semibold text-foreground">{ad.brand}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">{ad.title}</p>
              <span className="text-[10px] text-primary">{ad.duration}s</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="p-3 rounded-lg bg-secondary/50 text-center">
    <div className="flex justify-center mb-1 text-primary">{icon}</div>
    <div className="text-lg font-display font-bold text-foreground">{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

export default AdCuePanel;
