// Mock data for the streaming app
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  duration: string;
  streamingPlatforms: string[];
  torrentFile?: string;
  videoFile?: string;
  subtitleFile?: string;
}

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    genre: ["Sci-Fi", "Action", "Thriller"],
    overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    duration: "2h 28m",
    streamingPlatforms: ["Netflix", "Prime Video"],
    videoFile: "/films/Inception.mp4",
    subtitleFile: "/films/Inception.srt",
  },
  {
    id: "2",
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    genre: ["Action", "Crime", "Drama"],
    overview: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests.",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911Z7TXJhPFCP7F.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg",
    duration: "2h 32m",
    streamingPlatforms: ["HBO Max", "Prime Video"],
  },
  {
    id: "3",
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg",
    duration: "2h 49m",
    streamingPlatforms: ["Paramount+", "Prime Video"],
  },
  {
    id: "4",
    title: "Blade Runner 2049",
    year: 2017,
    rating: 8.0,
    genre: ["Sci-Fi", "Drama"],
    overview: "Young blade runner K's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/sAtoMqiTmY0GFqAHbMHbkl2HPXR.jpg",
    duration: "2h 44m",
    streamingPlatforms: ["Netflix"],
  },
  {
    id: "5",
    title: "Dune",
    year: 2021,
    rating: 8.0,
    genre: ["Sci-Fi", "Adventure"],
    overview: "Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
    duration: "2h 35m",
    streamingPlatforms: ["HBO Max"],
  },
  {
    id: "6",
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    genre: ["Action", "Sci-Fi"],
    overview: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    duration: "2h 16m",
    streamingPlatforms: ["Netflix", "HBO Max"],
  },
  {
    id: "7",
    title: "Oppenheimer",
    year: 2023,
    rating: 8.3,
    genre: ["Biography", "Drama", "History"],
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
    duration: "3h 0m",
    streamingPlatforms: ["Prime Video"],
  },
  {
    id: "8",
    title: "Everything Everywhere All at Once",
    year: 2022,
    rating: 7.8,
    genre: ["Action", "Adventure", "Comedy"],
    overview: "A middle-aged Chinese immigrant is swept up into an insane adventure where she alone can save existence.",
    posterUrl: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/feSiISwgEpVzR1v3zv2n2AU4ANJ.jpg",
    duration: "2h 19m",
    streamingPlatforms: ["Netflix"],
  },
];

export const CATEGORIES = [
  { name: "Trending Now", movies: MOCK_MOVIES.slice(0, 5) },
  { name: "Sci-Fi Epics", movies: MOCK_MOVIES.filter(m => m.genre.includes("Sci-Fi")) },
  { name: "Action Blockbusters", movies: MOCK_MOVIES.filter(m => m.genre.includes("Action")) },
  { name: "Award Winners", movies: MOCK_MOVIES.filter(m => m.rating >= 8.5) },
];

// Mock subtitle data for ad-cueing demo
export interface SubtitleLine {
  id: number;
  startTime: number; // seconds
  endTime: number;
  text: string;
  keywords?: string[];
  adMatch?: { category: string; product: string } | null;
}

export const MOCK_SUBTITLES: SubtitleLine[] = [
  { id: 1, startTime: 0, endTime: 4, text: "The dream has become their reality." },
  { id: 2, startTime: 4, endTime: 8, text: "I need to get to the airport. Call me an Uber." },
  { id: 3, startTime: 8, endTime: 12, text: "Here, take my iPhone. The app is already open.", keywords: ["iPhone"], adMatch: { category: "mobile", product: "iPhone" } },
  { id: 4, startTime: 12, endTime: 16, text: "Thanks. Is there time for a quick coffee?" },
  { id: 5, startTime: 16, endTime: 20, text: "We're not dreaming anymore." },
  { id: 6, startTime: 20, endTime: 24, text: "The architecture of the mind is complex." },
  { id: 7, startTime: 24, endTime: 28, text: "I need my morning Starbucks before we start.", keywords: ["Starbucks"], adMatch: { category: "beverage", product: "Starbucks" } },
  { id: 8, startTime: 28, endTime: 32, text: "Every detail must be perfect." },
  { id: 9, startTime: 32, endTime: 36, text: "Time moves differently here." },
  { id: 10, startTime: 36, endTime: 40, text: "My Tesla is waiting outside.", keywords: ["Tesla"], adMatch: { category: "automotive", product: "Tesla" } },
  { id: 11, startTime: 40, endTime: 44, text: "The subconscious is unpredictable." },
  { id: 12, startTime: 44, endTime: 48, text: "We need to go deeper." },
  { id: 13, startTime: 48, endTime: 52, text: "Nice car. I've been looking at the new BMW models.", keywords: ["BMW"], adMatch: { category: "automotive", product: "BMW" } },
  { id: 14, startTime: 52, endTime: 56, text: "Reality is just a construct." },
  { id: 15, startTime: 56, endTime: 60, text: "The mind creates its own barriers." },
  { id: 16, startTime: 60, endTime: 64, text: "We're running out of time." },
  { id: 17, startTime: 64, endTime: 68, text: "These new Nike sneakers are perfect for quick escapes.", keywords: ["Nike"], adMatch: { category: "footwear", product: "Nike" } },
  { id: 18, startTime: 68, endTime: 72, text: "Every second counts in the dream world." },
  { id: 19, startTime: 72, endTime: 76, text: "The projections are getting hostile." },
  { id: 20, startTime: 76, endTime: 80, text: "We need to plant the idea carefully." },
  { id: 21, startTime: 80, endTime: 84, text: "Check the Samsung devices for any glitches.", keywords: ["Samsung"], adMatch: { category: "electronics", product: "Samsung" } },
  { id: 22, startTime: 84, endTime: 88, text: "The deeper we go, the more unstable it becomes." },
  { id: 23, startTime: 88, endTime: 92, text: "This is the last level." },
  { id: 24, startTime: 92, endTime: 96, text: "Inception is possible, but dangerous." },
  { id: 25, startTime: 96, endTime: 100, text: "A coffee would help us stay sharp right now.", keywords: ["coffee"], adMatch: { category: "beverage", product: "coffee" } },
  { id: 26, startTime: 100, endTime: 104, text: "The mind protects itself from invasion." },
  { id: 27, startTime: 104, endTime: 108, text: "We're almost there." },
  { id: 28, startTime: 108, endTime: 112, text: "The kick is coming." },
  { id: 29, startTime: 112, endTime: 116, text: "Everyone wake up!" },
  { id: 30, startTime: 116, endTime: 120, text: "Did it work?" },
  { id: 31, startTime: 120, endTime: 124, text: "We need to verify reality." },
  { id: 32, startTime: 124, endTime: 128, text: "The totems never lie." },
  { id: 33, startTime: 128, endTime: 132, text: "Is this still a dream?" },
  { id: 34, startTime: 132, endTime: 136, text: "The job is complete." },
  { id: 35, startTime: 136, endTime: 140, text: "Time to go home." },
  { id: 36, startTime: 140, endTime: 144, text: "Or is it?" },
];

export const AD_LIBRARY = [
  { id: "ad1", category: "automotive", brand: "Tesla", title: "The Future of Driving", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Tesla+Ad", duration: 15 },
  { id: "ad2", category: "automotive", brand: "BMW", title: "Ultimate Driving Machine", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=BMW+Ad", videoUrl: "/ads/BMW.mp4", duration: 10 },
  { id: "ad3", category: "beverage", brand: "Starbucks", title: "Your Daily Ritual", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Starbucks+Ad", videoUrl: "/ads/Starbucks.mp4", duration: 10 },
  { id: "ad4", category: "mobile", brand: "Apple", title: "iPhone - Shot on iPhone", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Apple+Ad", duration: 15 },
  { id: "ad5", category: "footwear", brand: "Nike", title: "Just Do It", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Nike+Ad", duration: 10 },
  { id: "ad6", category: "electronics", brand: "Samsung", title: "Galaxy Experience", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Samsung+Ad", duration: 12 },
];
