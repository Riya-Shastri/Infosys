import { Component, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/share/Services/auth.service';
import { environment } from 'src/environments/environment';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  isLoggedin = false;
  isAdmin = '';
  fullName = "";
  usersRoles: any;
  isAdminflag = false;
  isDarkTheme = false;
  RRM_URL = environment.rrmAccessManagement;
  @HostBinding('class') componentCssClass: any;
  @Output() themeChanged = new EventEmitter<string>();

  constructor(
    private router: Router,
    public overlayContainer: OverlayContainer,
    public authService: AuthService) {

    const theme = localStorage.getItem('theme');
    if (theme) {
      this.isDarkTheme = theme == 'dark-theme' ? true : false;
    }

  }


  ngOnInit(): void {
    const userDetail = localStorage.getItem('userData');
    this.authService.currentUserSubject.subscribe(data => {
      if (data) {
        let userData = data;
        this.fullName = userData['firstName'] + " " + userData['lastName'];
        localStorage.setItem('userData', JSON.stringify(data));
        this.isLoggedin = true;
      } else if (userDetail) {
        const detail = JSON.parse(userDetail);
        this.fullName = detail['firstName'] + " " + detail['lastName'];
        this.isLoggedin = true;
      } else {
        this.isLoggedin = false;
      }
    });

    this.authService.currentUserRoleSubject.subscribe(user => {
      this.usersRoles = user;
      if (!this.usersRoles || this.usersRoles.length === 0) {
        this.usersRoles = JSON.parse(localStorage.getItem('userRoles') || '{}');
      }
      if (this.usersRoles && this.usersRoles.length > 0 && this.usersRoles.includes('CMP-User-Admin')) {
        this.isAdminflag = true;
      } else {
        this.isAdminflag = false;
      }
    });

  }

  toggleTheme(theme: any) {
    this.themeChanged.emit(theme);
    window.localStorage.setItem('theme', theme)
    theme == 'dark-theme' ? this.isDarkTheme = true : this.isDarkTheme = false;
  }

  Logout() {
    this.router.navigate(['auth/login']);
  }

  redirectToRRM() {
    window.open(this.RRM_URL);
  }

}
