import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  player: any = {};
  constructor() {}
  http = inject(HttpClient);

  // getSongs(term: string): Observable<any> {
  //     const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song`;
  //     return this.http.get(url);
  //   }
  getSongs(query: string): Observable<any> {
    const apiKey = 'AIzaSyCmSmwgOfF-7kVBzABM4VbxvcICkW8T85A';
    const url =
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&type=video` +
      `&videoCategoryId=10` + 
      `&q=${encodeURIComponent(query)}` +
      `&maxResults=4` +
      `&key=${apiKey}`;
    return this.http.get(url);
  }

  getPlaylistFromRSS(playlistId: string): Observable<any> {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
    )}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(res.contents, 'text/xml');
        const items = Array.from(xml.querySelectorAll('entry'));
        return items.map((entry) => ({
          videoId: entry.querySelector('videoId')?.textContent,
          title: entry.querySelector('title')?.textContent,
          link: entry.querySelector('link')?.getAttribute('href'),
          published: entry.querySelector('published')?.textContent,
        }));
      })
    );
  }
}
