import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, throwError, map, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Tokens } from '../models/Tokens';
import { User } from '../models/User';
import { LoginService } from './login/login.service';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenSubject = new BehaviorSubject<Tokens | null>(null);
  currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUserRoleSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentSupplierIdSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private isLoggedin = false;

  constructor(private loginService: LoginService, private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) public document: any,
    private storageService: StorageService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUserRoleSubject = new BehaviorSubject<User | null>(null);
    this.currentSupplierIdSubject = new BehaviorSubject<User | null>(null);
  }

  setTimer(date: any) {
    sessionStorage.setItem('timer', date);
  }

  sendToken(token: string) {
    this.storageService.setInStorage('LoggedInUser', token);
  }

  setRefreshToken(refreshToken: string) {
    this.storageService.setInStorage('RefreshToken', refreshToken);
  }

  setUserToken(idToken: any) {
    localStorage.setItem('EXMIdToken', JSON.stringify({ id_token: idToken }));
    sessionStorage.setItem('EXMIdToken', JSON.stringify({ id_token: idToken }));
  }

  setInternalUserLogin(checked: string) {
    this.storageService.setInStorage('isInternalUserLogin', checked);
  }
  getInternalUserLogin() {
    return this.storageService.getFromStorage('isInternalUserLogin');
  }

  getInternalUserReg() {
    return this.storageService.getFromStorage('isInternalUserReg');
  }
  setInternalUserReg(checked: string) {
    this.storageService.setInStorage('isInternalUserReg', checked);
  }
  getRefreshToken() {
    return this.storageService.getFromStorage('RefreshToken');
  }
  setTokens(tokens: Tokens | null) {
    this.tokenSubject.next(tokens);
  }

  getUserInfo(): any {
    if (this.currentUserSubject.getValue() != null) {
      let userData = this.currentUserSubject.getValue()
      return userData;
    } else {
      this.setInternalUserLogin('checked');
      let authURL = environment.authentication_url;
      this.document.location.href = authURL;
    }
  }

  setUserInfo(user: any) {
    this.currentUserSubject.next(user);
    this.storageService.setInStorage('user', JSON.stringify(user));
  }

  internalUserLogin() {
    this.setInternalUserLogin('checked');
    let authURL = environment.authentication_url;
    this.document.location.href = authURL;
  }

  setUserRoles(user: any) {
    this.currentUserRoleSubject.next(user);
    this.storageService.setInStorage('userRoles', JSON.stringify(user));
    localStorage.setItem('userRoles', JSON.stringify(user));
    if (user.includes('CMP-User-Admin')) {
      this.storageService.setInStorage('isAdmin', 'Yes');
    } else {
      this.storageService.setInStorage('isAdmin', 'No');
    }

  }

  getUserRoles() {
    return this.currentUserRoleSubject.getValue();
  }

  getToken() {
    return this.storageService.getFromStorage('LoggedInUser');
  }

  getTimer() {
    return this.storageService.getFromStorage('timer');
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedin = isLoggedIn;
  }

  getIsLoggedIn() {
    return this.isLoggedin;
  }
  currentUserValue() {
    return this.currentUserSubject.value !== null ? this.currentUserSubject.value : null;
  }

  isLoggedIn() {

    let EXMIdToken: any = localStorage.getItem('EXMIdToken');
    let chktoken = JSON.parse(EXMIdToken);

    //Check if token persists in session storage
    if (chktoken.id_token === null) {
      return false;
    }
    const token = chktoken.id_token;
    return null;
    //return this.getToken() !== null;
  }

  // Fetch tokens based on code provided in authorization code flow
  public fetchTokensForCode(code: string) {

    if (code && code != null && code.trim().length > 0) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

      const params: HttpParams = new HttpParams().append('grant_type', environment.oauth2.grantType)
        .append('client_id', environment.oauth2.clientId)
        .append('redirect_uri', environment.oauth2.redirect_uri)
        .append('code', code);

      return this.http.post(environment.oauth2.tokenUrl, null, { headers, params });
    }
    return throwError('auth code not provided');
  }


  sendUserData(userDetail: any): Observable<any> {
    return this.http.post<any>(environment.apiHostUrl + '/userInfo', userDetail).pipe(map(response => {
      return response
    }), catchError((error: HttpErrorResponse) => {
      return error.message || 'Server Error';
    })
    );
  }

  logout() {
    this.storageService.removeFromStorage('LoggedInUser');
    this.storageService.removeFromStorage('user');
    this.currentUserSubject.next(null);
    this.storageService.removeFromStorage('timer');
    this.storageService.removeFromStorage('isInternalUserReg');
    this.storageService.removeFromStorage('isInternalUserLogin');
    this.storageService.removeFromStorage('userRoles');
    this.storageService.removeFromStorage('userSupplierId');
    this.storageService.removeFromStorage('userRoles');
    this.storageService.getFromStorage('RefreshToken') ? this.storageService.removeFromStorage('RefreshToken') : this.storageService.getFromStorage('RefreshToken');
    sessionStorage.clear();
    localStorage.clear();

    //let authURL = environment.oauth2.logoutRedirectUrl;
    let authURL = environment.oam_logout_url;
    this.document.location.href = authURL;
  }


}
