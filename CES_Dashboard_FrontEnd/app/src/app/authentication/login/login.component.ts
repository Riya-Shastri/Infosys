import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/share/Services/auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: any) {
    sessionStorage.clear();
    localStorage.clear();
  }

  ngOnInit(): void { }

  Login() {
    localStorage.setItem('token', 'a@3Fghdd&U');
    this.authService.setInternalUserLogin('checked');
    let authURL = environment.authentication_url;
    this.document.location.href = authURL;
  }

}
