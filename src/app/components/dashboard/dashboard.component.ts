import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import {MatDialogModule} from '@angular/material/dialog';

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
  ],
})
export class DashboardComponent implements OnInit {
  public player = inject(PlayerService);

  @ViewChild('music') music!: ElementRef<HTMLIFrameElement>;
  user: any;
  songs: any = [];

  playlistIDs = [
    {
      name: 'Karan Aujla',
      id: 'PL5DigwkkJqqR439Nr1LJxaSuU1liDW7pJ',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2hNWP0r-AuoQQGR6YhiLSFmfUsSon7BWlo4wqs_tMAQkGwnpNG218nQU1cJ2tJOv8Hf76NIayPeoflBMelBDubgy34faIm84swEvR6VYf&s=10',
      artistName: 'Karan Aujla',
      description: 'Latest Music from Karan Aujla',
    },
    {
      name: 'Chill',
      id: 'PLO7-VO1D0_6NYoMAN0XncJu4tvibirSmN',
      img: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_in_default.jpg',
      artistName: 'Popular Music',
      description: 'Latest Music',
    },
    {
      name: 'Chill',
      id: 'PLYe‑Fi7xbhY8bHDdlMcj6DPxVPmBsZ76x',
      img: 'https://atd-bloges.s3.us-east-2.amazonaws.com/wp-content/uploads/2022/04/16143223/playlist-covers-spotify-10.webp',
      artistName: 'Weekend',
      description: 'Latest Music from Weekend',
    },
    {
      name: 'Chill',
      id: 'PLpXNKj0kuGdft-RYefkaVOOe3leymof6G',
      img: 'https://i.pinimg.com/originals/90/e3/41/90e34121229253d293dcd6e8e40b6f44.jpg',
      artistName: 'My Playlist',
      description: 'Latest Music from My Playlist',
    },
  ];
  playListSongs: any[] = [];
  currentSongIndex: number = 0;

  song!: any;
  musicPlayer: any;
  // url = 'https://www.youtube.com/embed/' + this.song;

  constructor(private authService: AuthServiceService, private router: Router) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    let song = 'star Boy';
    // this.player.getSongs(song).subscribe(data => {
    //   console.log(data)
    //   this.songs=data.items
    //   // console.log(this.songs);
    //   song=this.songs[0].id.videoId
    //   let iframe = document.getElementById('iframe')
    //   console.log(song);
    //   iframe!.setAttribute('src','https://www.youtube.com/embed/'+song)

    // })
  }
  ngAfterViewInit() {
    // Initialize YouTube player via API
    this.musicPlayer = new YT.Player(this.music.nativeElement, {
      events: {
        onReady: (event: any) => {
          console.log('Player ready');
        },
        onStateChange: (event: any) => {
          if (event.data === YT.PlayerState.ENDED) {
            console.log('Video ended');
            this.playNext();
          }
        },
      },
    });
  }
  playNext() {
    this.currentSongIndex++;
    console.log(this.currentSongIndex);
    
    if (this.currentSongIndex >= this.playListSongs.length) {
      this.currentSongIndex = 0; // loop playlist
    }

    const nextSong = this.playListSongs[this.currentSongIndex].videoId;
    this.playSong(nextSong, this.currentSongIndex);
  }

  initializePlayer() {
    this.musicPlayer = new YT.Player(this.music.nativeElement, {
      events: {
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }

  play() {
    if (this.musicPlayer && this.musicPlayer.playVideo) {
      this.musicPlayer.playVideo();
    } else {
      console.warn('Player not ready yet');
    }
  }

  onPlayerReady(event: any) {
    console.log('Player is ready');
  }

  //! GET THE SONG
  playSong(songId: string, index: number) {
    this.currentSongIndex = index;
    const iframe = document.getElementById('playerIframe') as HTMLIFrameElement;
    iframe.src = `https://www.youtube.com/embed/${songId}?autoplay=1&mute=0&controls=2&modestbranding=1&rel=0&enablejsapi=1`;
  }

  //! GET THE PLAYLIST
  fetchPlaylist(id: string) {
    console.log(id);
    let playlist = localStorage.getItem(`playlist-${id}`);
    if (playlist) {
      this.playListSongs = JSON.parse(playlist);
      return;
    }

    this.player.getPlaylistFromRSS(id).subscribe((data) => {
      console.log(data);
      this.playListSongs = data;
      localStorage.setItem(`playlist-${id}`, JSON.stringify(this.playListSongs));
    });
  }
}
