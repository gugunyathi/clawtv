"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import AdCuePanel from "@/components/AdCuePanel";
import { MOCK_MOVIES, MOCK_SUBTITLES } from "@/data/mockData";

const WatchPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(0);
  const id = params?.id as string;
  const movie = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 lg:px-12 pb-16">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player */}
          <div className="lg:col-span-2">
            <VideoPlayer 
              title={movie.title} 
              subtitles={MOCK_SUBTITLES}
              torrentFile={movie.torrentFile}
              videoFile={movie.videoFile}
              subtitleFile={movie.subtitleFile}
            />

            {/* Movie info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <h1 className="font-display text-3xl font-bold text-foreground">{movie.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {movie.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Film className="h-4 w-4" /> {movie.genre.join(", ")}
                </span>
              </div>
              <p className="text-secondary-foreground mt-4 leading-relaxed max-w-2xl">
                {movie.overview}
              </p>

              {movie.streamingPlatforms.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-muted-foreground">Also on:</span>
                  {movie.streamingPlatforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Ad Cue Panel */}
          <div className="lg:col-span-1">
            <AdCuePanel subtitles={MOCK_SUBTITLES} currentTime={currentTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
