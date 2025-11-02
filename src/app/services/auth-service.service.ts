import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }
  getToken(): string | null {
    return localStorage.getItem('google_token');
  }

  getUser(): any | null {
    const data = localStorage.getItem('google_user');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('google_token');
    localStorage.removeItem('google_user');
  }


}
