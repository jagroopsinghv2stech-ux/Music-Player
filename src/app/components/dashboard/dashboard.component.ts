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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArtistInterface } from '../../interfaces/Artist';
import { ArtistDialogComponent } from '../artist-dialog/artist-dialog.component';
import { debounceTime, fromEvent, map, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPlaylistModelComponent } from '../addPlaylistModel/addPlaylistModel.component';
import {MatTabsModule} from '@angular/material/tabs';

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
    MatTabsModule
  ],
})
export class DashboardComponent implements OnInit {
  public player = inject(PlayerService);
  public dialog = inject(MatDialog);

  @ViewChild('music') music!: ElementRef<HTMLIFrameElement>;
  @ViewChild('searchInput') searchInput!: ElementRef;
  user: any;
  songs: any = [];
  isLoading = false;

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
      id: 'PLr-XCZlklEPDuf2KvOKNqujTbPpyRTdZm',
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

    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        switchMap((value) => this.player.getSongs(value)) 
      )
      .subscribe((data: any) => {
        this.songs = data.items;
        console.log(this.songs, 'songs');
      });
  }

  openArtistModal(artist: any) {
    console.log(artist);

    this.dialog.open(ArtistDialogComponent, {
      width: '1000px',
      data: artist,
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

  onSearch(event: any) {
    console.log(event.target.value);
    // this.player.getSongs(event.target.value).subscribe((data) => {
    //   console.log(data);
    //   this.songs = data.items;
    // });
  }

  //! GET THE SONG
  playSong(songId: string, index: number) {
    this.currentSongIndex = index;
    const iframe = document.getElementById('playerIframe') as HTMLIFrameElement;
    iframe.src = `https://www.youtube.com/embed/${songId}?autoplay=1&mute=0&controls=2&modestbranding=1&rel=0&enablejsapi=1`;
    this.searchInput.nativeElement.value = '';
  }


  //! GET THE PLAYLIST
  fetchPlaylist(id: string) {
    console.log(id);
    this.isLoading = true;
    let playlist = localStorage.getItem(`playlist-${id}`);
    if (playlist) {
      this.playListSongs = JSON.parse(playlist);
      console.log(this.playListSongs);
      
      this.isLoading = false;
      return;
    }

    this.player.getPlaylistFromRSS(id).subscribe((data) => {
      this.playListSongs = data;
      this.isLoading = false;
      localStorage.setItem(`playlist-${id}`, JSON.stringify(this.playListSongs));
    });
  }
  showArtist(obj: ArtistInterface) {
    this.openArtistModal(obj);
  }
  openAddPlaylistDialog() {
    this.dialog.open(AddPlaylistModelComponent, {
      width: '500px',
    });
  }

  addPlaylist(){
    this.openAddPlaylistDialog()
  }

  formatSongName(songName:string){
    if(songName.includes(' - ')){
      return songName.split(' -')[1]
    }
    else if(songName.includes('| ')){
      return songName.split(' -')[0]
    }


    



    return songName

  }
}
