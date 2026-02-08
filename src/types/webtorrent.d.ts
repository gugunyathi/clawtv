declare module 'webtorrent' {
  export default class WebTorrent {
    constructor(opts?: any);
    add(torrentId: any, opts?: any, callback?: (torrent: Torrent) => void): Torrent;
    destroy(callback?: (err?: Error) => void): void;
    torrents: Torrent[];
  }

  export interface Torrent {
    files: TorrentFile[];
    progress: number;
    downloadSpeed: number;
    uploadSpeed: number;
    timeRemaining: number;
    downloaded: number;
    uploaded: number;
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(callback?: () => void): void;
  }

  export interface TorrentFile {
    name: string;
    length: number;
    path: string;
    getBlobURL(callback: (err: Error | null, url?: string) => void): void;
    appendTo(element: HTMLElement, callback?: (err?: Error) => void): void;
  }
}
