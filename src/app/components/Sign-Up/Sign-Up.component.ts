import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
declare const google: any;
@Component({
  selector: 'app-Sign-Up',
  templateUrl: './Sign-Up.component.html',
  styleUrls: ['./Sign-Up.component.css']
})
export class SignUpComponent implements OnInit {
  router = inject(Router)
  playerService = inject(PlayerService)
  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '542765669212-j2j01sdai5drrsh014mahsfka6m1af1a.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" } // customize
    );
  }

  handleCredentialResponse(response: any) {
    const token = response.credential;
    const userInfos = this.decodeJwtResponse(token);

    console.log("Google JWT Token:", token);
    console.log("User Info:", userInfos);

    //  Save to localStorage so it persists after refresh
    localStorage.setItem('google_token', token);
    localStorage.setItem('google_user', JSON.stringify(userInfos));

    // Optionally decode the user info:
    const userInfo = this.decodeJwtResponse(token);
    console.log("User Info:", userInfo);
    this.playerService.player = userInfo

    this.router.navigate(['dashboard'])

  }

  decodeJwtResponse(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

}
