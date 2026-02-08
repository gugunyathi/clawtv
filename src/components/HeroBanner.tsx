import { motion } from "framer-motion";
import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropUrl}), url(${heroBg})` }}
      />
      <div className="absolute inset-0 gradient-overlay" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(220 20% 6% / 0.85) 0%, transparent 60%)" }} />

      <div className="relative z-10 flex h-full items-end pb-24 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold rounded-full gradient-accent text-accent-foreground">
              Featured
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {movie.rating}
            </span>
            <span className="text-sm text-muted-foreground">{movie.year}</span>
            <span className="text-sm text-muted-foreground">{movie.duration}</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
            {movie.title}
          </h1>

          <p className="text-base text-secondary-foreground mb-2 line-clamp-3 leading-relaxed max-w-lg">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genre.map((g) => (
              <span key={g} className="px-2.5 py-0.5 text-xs rounded-md bg-secondary text-muted-foreground">
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="gap-2 gradient-accent shadow-glow hover:opacity-90 transition-opacity text-accent-foreground font-semibold px-8"
              onClick={() => navigate(`/watch/${movie.id}`)}
            >
              <Play className="h-5 w-5 fill-current" />
              Play Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-border bg-secondary/50 hover:bg-secondary text-foreground backdrop-blur-sm"
            >
              <Info className="h-5 w-5" />
              More Info
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
