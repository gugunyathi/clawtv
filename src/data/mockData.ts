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
  { id: 1, startTime: 0, endTime: 3, text: "I need to get to the airport. Call me an Uber." },
  { id: 2, startTime: 3, endTime: 6, text: "Here, take my iPhone. The app is already open." , keywords: ["iPhone"], adMatch: { category: "mobile", product: "iPhone" } },
  { id: 3, startTime: 6, endTime: 9, text: "Thanks. I could use a coffee too." , keywords: ["coffee"], adMatch: { category: "beverage", product: "coffee" } },
  { id: 4, startTime: 9, endTime: 12, text: "There's a Starbucks around the corner." , keywords: ["Starbucks"], adMatch: { category: "beverage", product: "Starbucks" } },
  { id: 5, startTime: 12, endTime: 15, text: "Perfect. My Tesla should be charged by now." , keywords: ["Tesla"], adMatch: { category: "automotive", product: "Tesla" } },
  { id: 6, startTime: 15, endTime: 18, text: "Nice car. I've been looking at the new BMW." , keywords: ["BMW"], adMatch: { category: "automotive", product: "BMW" } },
  { id: 7, startTime: 18, endTime: 21, text: "Let me check the weather on my laptop." },
  { id: 8, startTime: 21, endTime: 24, text: "It's sunny. Perfect for those new Nike sneakers." , keywords: ["Nike"], adMatch: { category: "footwear", product: "Nike" } },
  { id: 9, startTime: 24, endTime: 27, text: "I need to stop by the mall first." },
  { id: 10, startTime: 27, endTime: 30, text: "Sure, I want to check out the Samsung display." , keywords: ["Samsung"], adMatch: { category: "electronics", product: "Samsung" } },
];

export const AD_LIBRARY = [
  { id: "ad1", category: "automotive", brand: "Tesla", title: "The Future of Driving", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Tesla+Ad", duration: 15 },
  { id: "ad2", category: "automotive", brand: "BMW", title: "Ultimate Driving Machine", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=BMW+Ad", duration: 10 },
  { id: "ad3", category: "beverage", brand: "Starbucks", title: "Your Daily Ritual", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Starbucks+Ad", duration: 10 },
  { id: "ad4", category: "mobile", brand: "Apple", title: "iPhone - Shot on iPhone", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Apple+Ad", duration: 15 },
  { id: "ad5", category: "footwear", brand: "Nike", title: "Just Do It", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Nike+Ad", duration: 10 },
  { id: "ad6", category: "electronics", brand: "Samsung", title: "Galaxy Experience", imageUrl: "https://placehold.co/400x225/1a1f36/3b82f6?text=Samsung+Ad", duration: 12 },
];
