import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import * as _lodash from 'lodash';
import { AuthService } from './auth.service';

const MINUTES_UNITL_AUTO_REFRESH = 50 // in Minutes
const CHECK_INTERVALL = 3000000 // in ms

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  refresh_token: any;
  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) public document: any) {
    this.check();
    this.initInterval();
  }

  ngOnInit() {
    console.log(this.authService.getTimer());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVALL);
  }

  check() {
    const now = new Date().getTime();
    let num: any = this.authService.getTimer();
    const timeleft: any = parseInt(num) + (MINUTES_UNITL_AUTO_REFRESH * 60 * 1000);
    const diff = timeleft - now;

    let isTimeout = diff < 0;
    let EXMIdToken: any = localStorage.getItem('EXMIdToken');
    let chktoken = JSON.parse(EXMIdToken);

    if (chktoken['id_token'] != null) {
      if (isTimeout && this.authService.isLoggedIn()) {
        let refresToken = this.setRefreshToken();
        console.log(refresToken.toPromise());
      }
    }
  }

  setRefreshToken() {
    let EXMRefreshToken: any = localStorage.getItem('RefreshToken');
    let token = JSON.parse(EXMRefreshToken);
    this.refresh_token = token.refresh_token;
    // Setting headers required for invoking refresh token api
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    // Setting parameters required for invoking refresh token api
    let params = new HttpParams();
    params = params.set('grant_type', 'refresh_token');
    params = params.set('client_id', environment.oauth2.clientId);
    params = params.set('refresh_token', this.refresh_token);
    params = params.set('redirect_uri', environment.oauth2.redirect_uri);
    params = params.set('scope', environment.oauth2.scope);
    // Invoking refresh token api for fetching new Access token
    return this.http.post(environment.oauth2.tokenUrl, params, { headers }).pipe(map(
      (data: any) => {
        // Check if refresh token api successfully gets new access token
        if (data.id_token) {
          // Update new token in session storage
          localStorage.setItem('EXMIdToken', JSON.stringify({ id_token: data.id_token }));
        } else {
          this.authService.logout();
        }
      }
    ));
  }


}
