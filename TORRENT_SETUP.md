# Adding Torrent Files for Movies

## How to Add Torrent Streaming to Movies

1. **Place your torrent file** in the `public/torrents/` folder

2. **Update the movie data** in `src/data/mockData.ts`:

```typescript
{
  id: "1",
  title: "Movie Title",
  // ... other properties ...
  torrentFile: "/torrents/your-torrent-file.torrent",
}
```

3. The app will automatically:
   - Load the torrent file when a user clicks play
   - Stream the video directly in the browser using WebTorrent
   - Display download progress while loading
   - Play the video once enough data is buffered

## Current Movies with Torrents

- **Inception** (ID: 1) - `/torrents/[LimeTorrents.fun]Inception.2010.1080p.BluRay.HEVC.x265.5.1.BONE.torrent`

## Adding More Movies

For each movie you want to add torrent streaming:

1. Download or obtain the torrent file
2. Copy it to `public/torrents/`
3. Add the `torrentFile` property to the movie object in `mockData.ts`
4. Use the path format: `/torrents/filename.torrent`

## Example

```typescript
{
  id: "2",
  title: "The Dark Knight",
  // ... existing properties ...
  torrentFile: "/torrents/[YourSource]TheDarkKnight.2008.1080p.BluRay.torrent",
}
```

## Technical Details

- Uses **WebTorrent** for browser-based P2P streaming
- Supports MP4, MKV, AVI, and WebM video formats
- Automatically selects the largest video file from the torrent
- Includes loading states and progress indicators
- Compatible with Next.js App Router
