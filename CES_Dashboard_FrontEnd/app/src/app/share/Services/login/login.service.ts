import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) { }

  login(access_token:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'x-api-key': environment.xApiKeyAccessManagement,
        'Authorization': access_token,
      })
    }

    return this.http.get(environment.apiAccessManagement+'/verify-access', httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getToken(code:any): Observable<any> {
    //setting headers
    const headers = new HttpHeaders().set(environment.contentTypeKey, environment.contentTypeValue);
    //setting parameters
    let params = new HttpParams();
    params = params.set('grant_type', environment.oauth2.grantType);
    params = params.set('client_id', environment.oauth2.clientId);
    params = params.set('code', code);
    params = params.set('redirect_uri', environment.redirectUrlValue);
    return this.http.post(environment.codeToTokenServiceUrl, params, { headers }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  
  userList(access_token:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'x-api-key': environment.xApiKeyAccessManagement,
        'Authorization': access_token,
        'appid': 'GDC-RAD-14',
        'role': 'FTA Approver'
      })
    }
  
    return this.http.get(environment.apiAccessManagement+'/user-role-list', httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
