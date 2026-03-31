import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface PlaylistVideo {
  videoId: string;
  title: string;
  link: string;
  published: string;
}


@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  player: any = {};
  constructor() { }
  http = inject(HttpClient);

  getSongs(query: string): Observable<any> {
    const apiKey = 'AIzaSyCmSmwgOfF-7kVBzABM4VbxvcICkW8T85A';
    const url =
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&type=video` +
      `&videoCategoryId=10` +
      `&q=${encodeURIComponent(query)}` +
      `&maxResults=5` +
      `&key=${apiKey}`;
    return this.http.get(url);
  }

getPlaylist(playlistId: string): Observable<PlaylistVideo[]> {
  const url =
    `https://getplaylist.jagroop-singh-v2stech.workers.dev/?playlist_id=${playlistId}`;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  return this.http.get<PlaylistVideo[]>(url).pipe(
    catchError(err => {
      console.error('Playlist fetch failed', err);
      return throwError(() => new Error('Failed to load playlist'));
    })
  );
}
}
