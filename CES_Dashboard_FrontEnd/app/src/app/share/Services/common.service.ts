import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { response } from 'express';
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  API_HOST_URL = `${environment.apiHostUrl}`;

  public currentAction = new BehaviorSubject(null);
  actionDetail = this.currentAction.asObservable();

  public filterAction = new BehaviorSubject(null);
  clearFilterAction = this.filterAction.asObservable();

  public saveAction = new BehaviorSubject(null);
  saveDetail = this.saveAction.asObservable();

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar, ) { }

  errorHandler(error: HttpErrorResponse) {
    return error.message || 'Server Error';
  }

  setMasterTableAction(message) {
    this.currentAction.next(message);
  }

  setClearFilterAction(message) {
    this.filterAction.next(message);
  }

  setJobStausAction(message) {
    this.saveAction.next(message);
  }

  GetMainMenu() {
    const userDetail = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const userRole = userDetail.join(',');
    return this.http.get<any>(this.API_HOST_URL + '/menu/' + userRole).pipe(map(response => {
      return response
    }), catchError(this.errorHandler)
    );
  }

  openSnackBar(message: string, messageType: string) {
    let colorclass: any = [];
    if (messageType) {
      switch (messageType) {
        case 'Success':
          colorclass = ['green-snackbar', 'green-snackbar'];
          break;
        case 'Error':
          colorclass = ['red-snackbar', 'red-snackbar'];
          break;
        default:
          colorclass = ['orange-snackbar', 'orange-snackbar'];
          break;
      }
    }
    if (message) {
      this._snackBar.open(message, '', {
        duration: 5000,
        panelClass: colorclass,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  getManufacturingLine(): Observable<any> {
    const userDetail = JSON.parse(localStorage.getItem('userData') || '{}');
    return this.http.get<any>(this.API_HOST_URL + '/favoriteLines/' + userDetail['wwid']).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  updateManufacturingLine(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/updateFavoriteLines', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  // Scheduler Dashboard -------------
  getSchedulerData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchSchedulerDashboard', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  saveSchedulerData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/saveSchedulerDashboard', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  deleteSchedulerData(selectedIDs, queryParamValue, selectedJobNumbers): Observable<any> {
    const queryParam = { action: queryParamValue, job_list: selectedJobNumbers ? selectedJobNumbers : 'null' };
    return this.http.delete<any>(this.API_HOST_URL + '/schedulerdashboard/' + selectedIDs, { params: queryParam }).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  lockSchedulerData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/lockSchedulerDashboard', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  runScriptdata(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/runScript', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  publishSchedulerData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/publishsd', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }
  // Scheduler Final Dashboard -------------
  getSchedulerFinalData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchSchedulerFinalDashboard', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  saveSchedulerFinalData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/saveSchedulerFinalDashboard', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  saveJobSequenceData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/sequencesfd', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  deleteSchedulerFinalData(selectedIDs, queryParamValue, joblist, recreateval, selectedLine): Observable<any> {
    const queryParam = { action: queryParamValue, job_list: joblist ? joblist : 'null', recreate: recreateval, line_name: selectedLine };
    return this.http.delete<any>(this.API_HOST_URL + '/schedulerfinaldashboard/' + selectedIDs, { params: queryParam }).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  //Ops Dashboard ------------------------------------------

  getFinalDashboardData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchFinalDashboard', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  addCommentData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/addComments', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  //Planning Screen---------------------------
  getPlannercode(): Observable<any> {
    return this.http.get<any>(this.API_HOST_URL + '/fetchPlanner').pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  getPlannercodeTabledata(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchPlanning', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  updatestatuscommnet(reqPayload, component): Observable<any> {
    return this.http.put<any>(this.API_HOST_URL + '/updatePlanningComments/' + component, reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  //---------------------------------------
  fetchCommentData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchComments', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  publishSchedulerFinalData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/publishsfd', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  moveDataSFD(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/moveJobs', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  updateFDStatus(reqPayload): Observable<any> {
    return this.http.put<any>(this.API_HOST_URL + '/saveJobStatus', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  fetchSubAssemblyData(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchSubassemblyStatus', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }


  //Fetch Materials and Planning Data
  getMaterialPlanningData(reqPayload, queryParamValue): Observable<any> {
    const queryParam = { action: queryParamValue };
    return this.http.get<any>(this.API_HOST_URL + '/matPlan/' + reqPayload, { params: queryParam }).pipe(
      map(response => { return response }), catchError(this.errorHandler)
    )
  }

  //Fetch Mat User Comment
  getMaterialsComment(reqPayload): Observable<any> {
    return this.http.get<any>(this.API_HOST_URL + '/matUserComments/' + reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler)
    )
  }

  //Add Comment in Materials
  addMaterialsComment(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/addMatComments', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  fetchMetrices(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchMetrics', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  //Move Order.....................................
  moveOrderOracle(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/moveOrder', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }
  //Update Bom Detail..........................
  updateBomDetail(reqPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchBomData', reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }
  //Acknowledge Schedule Quantity
  acknowledgeSchdQty(selectedIDs, reqPayload): Observable<any> {
    return this.http.put<any>(this.API_HOST_URL + '/acknowledge/' + selectedIDs, reqPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

}
