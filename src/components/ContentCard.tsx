"use client";

import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { Movie } from "@/data/mockData";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContentCardProps {
  movie: Movie;
}

const ContentCard = ({ movie }: ContentCardProps) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-44 md:w-52 cursor-pointer group"
      onClick={() => router.push(`/watch/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-card">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-secondary animate-pulse" />
        )}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="absolute inset-0 gradient-card flex items-center justify-center">
            <span className="text-muted-foreground text-sm text-center px-2">{movie.title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="p-3 rounded-full gradient-accent shadow-glow">
            <Play className="h-6 w-6 text-accent-foreground fill-current" />
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-sm font-medium text-foreground truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs text-muted-foreground">{movie.rating}</span>
          <span className="text-xs text-muted-foreground">• {movie.year}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
