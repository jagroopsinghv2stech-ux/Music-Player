import { Component, ElementRef, inject, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArtistInterface } from '../../interfaces/Artist';
import { ArtistDialogComponent } from '../artist-dialog/artist-dialog.component';
import { debounceTime, fromEvent, map, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPlaylistModelComponent } from '../addPlaylistModel/addPlaylistModel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { playlistIDs } from '../../interfaces/Songs';

declare var YT: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    NgFor,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTabsModule,
  ],
})
export class DashboardComponent implements OnInit {
  public service = inject(PlayerService);
  public dialog = inject(MatDialog);

  @ViewChild('music') music!: ElementRef<HTMLIFrameElement>;
  @ViewChild('searchInput') searchInput!: ElementRef;
  iframe!: HTMLIFrameElement;

  staticParams = '&autoplay=1&controls=1&modestbranding=0&rel=0&iv_load_policy=3&color=black';

  isLoading = false;
  isMobile = false;
  currentPlaylistId = signal('PL5DigwkkJqqR439Nr1LJxaSuU1liDW7pJ');

  baseUrl = `https://www.youtube.com/embed?list=${this.currentPlaylistId()}${this.staticParams}`;

  playlistIDs = playlistIDs;
  playListSongs: any[] = [];
  searchedSongs: any[] = [];
  //!
  artists = [
    {
      name: 'Arijit Singh',
      image: 'https://i.scdn.co/image/ab6761610000e5eb6cbf5bd1c9fa00f8d96ee574',
    },
    {
      name: 'Shreya Ghoshal',
      image: 'https://i.scdn.co/image/ab6761610000e5ebb6d05336df89f8a2511f25a7',
    },
    {
      name: 'AP Dhillon',
      image: 'https://i.scdn.co/image/ab6761610000e5eb9b32f10a9cda8f5cd7e7d85f',
    },
    {
      name: 'Anushka Sharma',
      image: 'https://i.scdn.co/image/ab6761610000e5eb1f5c46bada49735cea90c0c0',
    },
  ];
  constructor() {}

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }
  ngAfterViewInit() {
    this.iframe = document.getElementById('playerIframe') as HTMLIFrameElement;
    this.iframe.src = this.baseUrl;

    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        switchMap((value) => this.service.getSongs(value)),
      )
      .subscribe((data: any) => {
        this.searchedSongs = data.items;
        console.log(this.searchedSongs, 'songs');
      });
  }

  playSongfromLib(videoId: string, index: number) {
    console.log(index);

    this.iframe.src =
      `https://www.youtube.com/embed/${videoId}` +
      `?list=${this.currentPlaylistId()}` +
      `&index=${index}${this.staticParams}`;
  }

  fetchPlaylist(playlist_id: string) {
    this.service.getPlaylistFromRSS(playlist_id).subscribe((data) => {
      this.playListSongs = data;
    });
    console.log(this.playListSongs);
    this.setIframePlaylistId(playlist_id);
  }
  //! GET THE SONG
  playSong(songId: string, index: number) {
    const iframe = document.getElementById('playerIframe') as HTMLIFrameElement;
    iframe.src = `https://www.youtube.com/embed/${songId}?autoplay=1&mute=0&controls=2&modestbranding=1&rel=0&enablejsapi=1`;
    this.searchInput.nativeElement.value = '';
  }
  //! Update the playlist
  refreshPlaylist() {
    localStorage.clear();
  }

  //! Helpers
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
  formatSongName(songName: string) {
    if (songName.includes(' - ')) {
      return songName.split(' -')[1];
    } else if (songName.includes('| ')) {
      return songName.split(' -')[0];
    }
    return songName;
  }

  setIframePlaylistId(playlistId: string) {
    this.baseUrl = `https://www.youtube.com/embed?list=${playlistId}${this.staticParams}`;
    this.currentPlaylistId.set(playlistId);
    this.iframe.src = this.baseUrl;
  }
}
