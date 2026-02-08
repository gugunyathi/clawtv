"use client";

import { motion } from "framer-motion";
import { Zap, Upload, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AD_LIBRARY } from "@/data/mockData";

const AdStudioPage = () => {
  const [ads, setAds] = useState(AD_LIBRARY);
  const [newKeyword, setNewKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["coffee", "bmw", "tesla", "iphone", "sneakers", "samsung"]);

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.toLowerCase())) {
      setKeywords([...keywords, newKeyword.toLowerCase()]);
      setNewKeyword("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 pb-16 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl gradient-accent">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Ad Studio</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Manage your ad library and keyword mappings for AI-powered ad cueing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Keyword mapping */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gradient-card rounded-xl border border-border p-6 shadow-card"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Keyword Triggers</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Words detected in subtitles that trigger ad placement
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                placeholder="Add keyword..."
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button onClick={addKeyword} size="sm" className="gradient-accent text-accent-foreground gap-1 shrink-0">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <motion.span
                  key={kw}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground group"
                >
                  <Tag className="h-3 w-3 text-primary" />
                  {kw}
                  <button
                    onClick={() => setKeywords(keywords.filter((k) => k !== kw))}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Ad library */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gradient-card rounded-xl border border-border p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Ad Library</h2>
              <Button size="sm" variant="outline" className="gap-1 border-border text-foreground">
                <Upload className="h-4 w-4" /> Import
              </Button>
            </div>

            <div className="space-y-3">
              {ads.map((ad, i) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={ad.imageUrl} alt={ad.brand} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground">{ad.brand}</h3>
                    <p className="text-xs text-muted-foreground truncate">{ad.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{ad.category}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ad.duration}s</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Subtitle upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 gradient-card rounded-xl border border-dashed border-border p-12 text-center shadow-card"
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">Upload Subtitle File</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drop an .srt file to analyze for keyword-based ad placement
          </p>
          <Button className="gradient-accent text-accent-foreground">
            Choose File
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdStudioPage;
