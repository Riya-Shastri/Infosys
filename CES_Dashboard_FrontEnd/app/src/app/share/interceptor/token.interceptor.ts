import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../Services/auth.service';
import { LoaderService } from '../Common/loader/loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  refreshFlag: boolean = false;
  fileUploadInProgress = false;
  constructor(private authService: AuthService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private http: HttpClient,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.refreshFlag = false;
    // Skipping Interception for OAUTH Refresh Token URL in case of Global region
    if (request.url === environment.oauth2.tokenUrl || (request.method === 'PUT' &&  request.url.indexOf(environment.S3UploadInterceptor) > -1)
      || request.url.indexOf(environment.RRMTokenInterceptor) > -1 || request.url.indexOf('fetchnavpaneldetails') > -1) {
      this.loaderService.show();
      return next.handle(request).pipe(
        finalize(() => {
          this.loaderService.hide()
        }
        )
      );
    }

    this.loaderService.show();
    let EXMIdToken: any = localStorage.getItem('EXMIdToken');
    // Cloning Http request and adding Authorization header with the token value stored in Session storage 
    request = request.clone({
      setHeaders: {
        Authorization: `${JSON.parse(EXMIdToken).id_token}`
      }
    });

    // Sending request again after cloning the original request
    return next.handle(request).pipe(
      finalize(() => {
        this.loaderService.hide()
      }),
      catchError(err => {
        // Catching error response obtained after sending cloned request
        // If the Http status is 401, then the Authorization token in cloned request is expired.
        // Which means token stored in session storage is expired
        if (err.status === 401 || err.status === 403 || err.status === 0) {
          // Setting headers required for invoking refresh token api
          const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
          let getRefreshToken: any = this.authService.getRefreshToken();
          let refresh_token = JSON.parse(getRefreshToken);
          // Setting parameters required for invoking refresh token api
          let params = new HttpParams();
          params = params.set('grant_type', 'refresh_token');
          params = params.set('client_id', environment.oauth2.clientId);
          params = params.set('refresh_token', refresh_token.refresh_token);
          params = params.set('redirect_uri', environment.oauth2.redirect_uri);
          params = params.set('scope', environment.oauth2.scope);
          // Invoking refresh token api for fetching new Access token
          return this.http.post(environment.oauth2.tokenUrl, params, { headers }).pipe(mergeMap(
            (data: any) => {
              // Check if refresh token api successfully gets new access token
              if (data.id_token) {
                // Update new token in session storage
                this.authService.sendToken(data.id_token);
                this.authService.setUserToken(data.id_token);

                // Clone our request with new access token and try to resend the original request
                request = request.clone({
                  setHeaders: {
                    Authorization: `${this.authService.getToken()}`
                  }
                });
                this.loaderService.show();
                return next.handle(request).pipe(
                  finalize(() => {
                    this.loaderService.hide()
                  }),
                  catchError(err => {
                    return this.logoutUser();
                  }));
              } else {
                return this.logoutUser();
              }
            }
          ));
        }
        return throwError(err);
      }));
  }

  // Houses logic to execute to force user to logout.
  logoutUser() {
    // Route to the login page
    let status = confirm('Session is timed out. You are required to login again. Please click OK to navigate to login page');
    if (status) {
      this.authService.logout();
    }
    return throwError('Session Timed Out');
  }
}
