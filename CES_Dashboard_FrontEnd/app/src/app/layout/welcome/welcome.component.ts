import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/share/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/share/Services/login/login.service';
import { LoaderService } from 'src/app/share/Common/loader/loader.service';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  errorMessage;
  successMessage;
  messages;
  newUser;
  existingUser;
  notLoggedIn = false;
  userMenuDatails;
  UserDataRole;
  authtype: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private loginService: LoginService) {
    localStorage.clear();
  }

  ngOnInit(): void {
    const url = window.location.href;
    const codeIdx = url.indexOf('code=');
    if (codeIdx !== -1) {
      const fragment = url.substr(codeIdx);
      const fragmentsMap = this.extractKeyValueBasedOnDelimiter(fragment);
      const code = fragmentsMap.code;
      this.login(code);
    }
    else {
      this.router.navigate(['/auth/login']);
      localStorage.clear();
    }
  }

  private extractKeyValueBasedOnDelimiter = (str: any, delimiter = '&') => {
    const map: any = {};
    if (str && str != null) {
      const fragArray = str.split(delimiter);
      for (const frag of fragArray) {
        const arr = frag.split('=');
        map[arr[0]] = arr[1];
      }
    }
    return map;
  }

  login(code: any): void {
    this.loginService.getToken(code).subscribe(dataToken => {

      localStorage.setItem('RefreshToken', JSON.stringify({ refresh_token: dataToken.refresh_token }));
      sessionStorage.setItem('RefreshToken', JSON.stringify({ refresh_token: dataToken.refresh_token }));
      localStorage.setItem('EXMIdToken', JSON.stringify({ id_token: dataToken.id_token }));
      sessionStorage.setItem('EXMIdToken', JSON.stringify({ id_token: dataToken.id_token }));

      const date = new Date();
      this.authService.setTimer(date.getTime());
      this.loaderService.show();
      this.loginService.login(dataToken.id_token).subscribe(data => {
        this.UserDataRole = data;
        if (data.accessStatus) {
          if (data.roles && data.roles.length == 1) {
            let userDetails = {
              user: data.user[0],
              roles: data.roles
            };
            this.loaderService.hide();
            this.authService.setUserInfo(userDetails.user);

            let roles: any = [];
            if (data.roles && data.roles.length > 0) {
              data.roles.forEach(role => {
                roles.push(role['roleName']);
              });
            }

            if (this.UserDataRole['user'] && this.UserDataRole['user'].length > 0) {
              const user = this.UserDataRole['user'][0];
              const userObj = {
                "wwid": user['wwid'],
                "first_name": user['firstName'],
                "last_name": user['lastName'],
                "email": user['userEmail']
              };
              this.sendUserDetail(userObj);
            }
            this.authService.setUserRoles(roles);
            this.router.navigate(['dashboard/final']);
          } else {
            this.authtype = "multiple";
            this.router.navigate(['unauthorized/' + this.authtype]);
          }
        } else {
          let userDetails = {
            user: data.user[0],
            roles: ['CMP-View-Only']
          };
          this.loaderService.hide();
          this.authService.setUserInfo(userDetails.user);

          if (this.UserDataRole['user'] && this.UserDataRole['user'].length > 0) {
            const user = this.UserDataRole['user'][0];
            const userObj = {
              "wwid": user['wwid'],
              "first_name": user['firstName'],
              "last_name": user['lastName'],
              "email": user['userEmail']
            };
            this.sendUserDetail(userObj);
          }
          this.authService.setUserRoles(['CMP-View-Only']);
          this.router.navigate(['dashboard/final']);
        }
      }, (error) => {
        this.loaderService.hide();
        this.openDialog('Error', 'System Error! Please try again.', 'INFO');
        this.authtype = "single";
        this.router.navigate(['unauthorized/' + this.authtype]);
      });

    }, (error) => {
      this.loaderService.hide();
      console.info("erroe", error)
      this.authtype = "single";
      this.router.navigate(['unauthorized/' + this.authtype]);
      this.openDialog('Error', 'System Error! Please try again.', 'INFO');
    });

  }

  openDialog(head: any, desc: String, type: any) {
    const dialogC = this.dialog.open(AlertDialogBoxComponent, {
      width: '400px',
      data: { title: head, content: desc, type: type },
      disableClose: false
    });
    dialogC.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    })
  }

  sendUserDetail(reqPayload) {
    this.authService.sendUserData(reqPayload).subscribe();
  }

}
