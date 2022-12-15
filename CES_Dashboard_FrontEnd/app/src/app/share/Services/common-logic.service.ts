import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogBoxComponent } from '../Common/alert-dialog-box/alert-dialog-box.component';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonLogicService {

  API_HOST_URL = `${environment.apiHostUrl}`;

  public getCommonData = new BehaviorSubject({});
  setCommonData = this.getCommonData.asObservable();

  public jobStatus = new BehaviorSubject(null);
  jobStatusActionDetail = this.jobStatus.asObservable();

  public subassemblydata = new BehaviorSubject(null);
  setsubassemblyActionDetails = this.subassemblydata.asObservable();

  public planningStatus = new BehaviorSubject(null);
  planningStatusActionDetail = this.planningStatus.asObservable();

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private http: HttpClient) { }

  errorHandler(error: HttpErrorResponse) {
    return error.message || 'Server Error';
  }

  setCommonMasterData(message) {
    this.getCommonData.next(message);
  }

  setjobstatusAction(message) {
    this.jobStatus.next(message);
  }
  setsubassemblyActiondata(message) {
    this.subassemblydata.next(message);
  }
  setPlanningstatusAction(message) {
    this.planningStatus.next(message);
  }

  getManufactureLine() {
    return this.http.get<any>(this.API_HOST_URL + '/masterData').pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  openCommonAlertDialog(title, content, type, Width) {
    const dialogC = this.dialog.open(AlertDialogBoxComponent, {
      width: Width,
      data: {
        title: title,
        content: content,
        type: type
      },
      disableClose: false
    });
    return dialogC;
  }

  uploadfile(requestData: any) {
    return this.http.post<any>(this.API_HOST_URL +"/upload", requestData).pipe(map(response => { return response }),
      catchError(this.errorHandler));
  }

  putFileToS3(body: any, uploadPresignedUrl: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Access-Control-Expose-Headers': 'Content-Disposition',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Credentials': 'true'
    });
    return this.http.put(uploadPresignedUrl, body, { headers: headers, reportProgress: true })
  }

  parseuploadfile(requestData: any){
    return this.http.post<any>(this.API_HOST_URL +"/parseMD", requestData).pipe(map(response => { return response }),
    catchError(this.errorHandler));
  }

}
