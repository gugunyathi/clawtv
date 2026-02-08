"use client";

import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import { MOCK_MOVIES, CATEGORIES } from "@/data/mockData";

const Index = () => {
  const featuredMovie = MOCK_MOVIES[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner movie={featuredMovie} />
      <div className="-mt-20 relative z-10 pb-16 space-y-2">
        {CATEGORIES.map((category) => (
          <ContentRow key={category.name} title={category.name} movies={category.movies} />
        ))}
      </div>
    </div>
  );
};

export default Index;
