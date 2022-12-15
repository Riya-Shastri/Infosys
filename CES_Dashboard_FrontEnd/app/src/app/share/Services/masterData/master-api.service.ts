import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterAPIService {

  dataSource: any = [];
  totalRecords: any;

  public capsizeAction = new BehaviorSubject(null);
  capsizeActionDetail = this.capsizeAction.asObservable();

  public laserRecipeAction = new BehaviorSubject(null);
  laserRecipeActionDetail = this.laserRecipeAction.asObservable();

  public protoTypeAction = new BehaviorSubject(null);
  protoTypeActionDetail = this.protoTypeAction.asObservable();

  public departmentPriority = new BehaviorSubject(null);
  departmentPriorityDetail = this.departmentPriority.asObservable();

  public locationMasterAction = new BehaviorSubject(null);
  locationMasterActionDetail = this.locationMasterAction.asObservable();

  public recipeMasterAction = new BehaviorSubject(null);
  recipeMasterActionDetail = this.recipeMasterAction.asObservable();

  public plannerCodeAction = new BehaviorSubject(null);
  plannerCodeActionDetail = this.plannerCodeAction.asObservable();

  public shiftTimeAction = new BehaviorSubject(null);
  shiftTimeDetail = this.shiftTimeAction.asObservable();

  public submenu = new BehaviorSubject([]);
  submenuList = this.submenu.asObservable();

  API_HOST_URL = `${environment.apiHostUrl}`;

  errorHandler(error: HttpErrorResponse) {
    return error.message || 'Server Error';
  }

  constructor(private http: HttpClient) { }

  getMasterSubMenu(message) {
    this.submenu.next(message);
  }

  // CapSizing APIs
  setCapSizeTableAction(message) {
    this.capsizeAction.next(message);
  }

  addCapsizingData(requestPayload, isEdit, id) {
    if (isEdit) {
      return this.http.put<any>(this.API_HOST_URL + '/capsizing/' + id, requestPayload).pipe(
        map(response => { return response }), catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/capsizing', requestPayload).pipe(
        map(response => { return response }), catchError(this.errorHandler));
    }
  }

  getCapsizingData(requestPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchcapsizing', requestPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  deleteCapsizingData(id): Observable<any> {
    return this.http.delete<any>(this.API_HOST_URL + '/capsizing/' + id).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }


  //Department Priority
  setDepartmentTableAction(message) {
    this.departmentPriority.next(message);
  }

  addDepartment(requestPayload, isEdit, department_id) {
    if (isEdit) {
      return this.http.put<any>(this.API_HOST_URL + '/departpriority/' + department_id, requestPayload).pipe(
        map(response => { return response }), catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/departpriority', requestPayload).pipe(
        map(response => { return response }), catchError(this.errorHandler));
    }
  }

  getDepartment(requestPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchDepartPriority', requestPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  deleteDepartment(id): Observable<any> {
    return this.http.delete<any>(this.API_HOST_URL + '/departpriority/' + id).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  //Laser Recipe APIs

  setLaserTableAction(message) {
    this.laserRecipeAction.next(message);
  }

  fetchLaserRecipeData(inputObject: any): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchlaserrecipe', inputObject).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler)
    );
  }

  //Delete
  deleteLaserRecipeData(requestData: any) {
    return this.http.delete<any>(this.API_HOST_URL + '/laserrecipe/' + requestData).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler));
  }

  //ADD & UPDATE
  setLaserRecipeTableAction(message) {
    this.laserRecipeAction.next(message);
  }

  addLaserRecipeData(inputObject: any, isEdit, id): Observable<any> {
    if (isEdit) {
      return this.http.put<any>(this.API_HOST_URL + '/laserrecipe/' + id, inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/laserrecipe', inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    }
  }


  //Proto
  setProtoTableAction(message) {
    this.protoTypeAction.next(message);
  }

  fetchProtoTypeData(inputObject: any): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchprotorecipe', inputObject).pipe(map(response => {
      return response
    }), catchError(this.errorHandler));
  }

  //Delete
  deleteProtoTypeData(requestData: any) {
    return this.http.delete<any>(this.API_HOST_URL + '/protorecipe/' + requestData).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler));
  }


  setProtoTypeTableAction(message) {
    this.protoTypeAction.next(message);
  }

  addProtoTypeData(inputObject: any, isEdit, id): Observable<any> {
    if (isEdit) {
      return this.http.put<any>(this.API_HOST_URL + '/protorecipe/' + id, inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/protorecipe', inputObject).pipe(map(response => {
        return response
      }), catchError(this.errorHandler));
    }
  }


  //Location Master Data
  //Delete

  locationMasterData(requestData: any) {
    return this.http.delete<any>(this.API_HOST_URL + '/location/' + requestData).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler));
  }

  setlocationTableAction(message) {
    this.locationMasterAction.next(message);
  }

  addlocationData(requestPayload, isEdit, id): Observable<any> {
    if (isEdit) {
      //const id = requestPayload.id;
      return this.http.put<any>(this.API_HOST_URL + '/location/' + id, requestPayload).pipe(
        map(response => { return response }), catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/location', requestPayload).pipe(
        map(response => { return response }), catchError(this.errorHandler));
    }
  }

  getlocationData(requestPayload): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchLocationMaster', requestPayload).pipe(
      map(response => { return response }), catchError(this.errorHandler));
  }

  // deletelocationData(requestPayload): Observable<any> {
  //   const id = requestPayload.id;
  //   return this.http.delete<any>(this.API_HOST_URL + '/location/' + id, requestPayload).pipe(
  //     map(response => { return response }), catchError(this.errorHandler));
  // }

  //Recipe Master Data

  //Fetch Details

  fetchRecipeMasterData(inputObject: any): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchRecipeMaster', inputObject).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler)
    );
  }
  //Delete 
  deleteRecipeMasterData(requestData: any) {
    return this.http.delete<any>(this.API_HOST_URL + '/recipemaster/' + requestData).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler));
  }
  //Add & Update
  setRecipeMasterTableAction(message) {
    this.recipeMasterAction.next(message);
  }
  addRecipeMasterData(inputObject: any, isEdit, id): Observable<any> {
    if (isEdit) {
      return this.http.put<any>(this.API_HOST_URL + '/recipemaster/' + id, inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/recipemaster', inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    }
  }

  //Planner Code
  //Fetch
  fetchPlannerCodeData(inputObject: any): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchPlannerCode', inputObject).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler)
    );
  }
  //Delete 
  deletePlannerCodeData(requestData: any) {
    return this.http.delete<any>(this.API_HOST_URL + '/plannercode/' + requestData).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler));
  }
  //ADD
  setPlannerCodeTableAction(message) {
    this.plannerCodeAction.next(message);
  }
  setShiftTimeTableAction(message) {
    this.shiftTimeAction.next(message);
  }
 // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
  addPlannerCodeData(inputObject: any, isEdit, id) {
    if(isEdit){
      return this.http.put<any>(this.API_HOST_URL + '/plannercode/' + id, inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    }
    else{
    return this.http.post<any>(this.API_HOST_URL + '/plannercode', inputObject).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler));
    }
  }
  //Shift-Timing
  fetchShiftTimingData(inputObject: any): Observable<any> {
    return this.http.post<any>(this.API_HOST_URL + '/fetchShiftTime', inputObject).pipe(map(response => {
      return response
    }),
      catchError(this.errorHandler)
    );
  }
  addShiftTimingData(inputObject: any, isEdit, id): Observable<any> {
    if (isEdit) {
      return this.http.put<any>(this.API_HOST_URL + '/timeshift/' + id, inputObject).pipe(map(response => {
        return response
      }),
        catchError(this.errorHandler));
    } else {
      return this.http.post<any>(this.API_HOST_URL + '/protorecipe', inputObject).pipe(map(response => {
        return response
      }), catchError(this.errorHandler));
    }
  }
  //Release 2 Changes - CHG0116719 - End

  //Download Excel
  downloadExcelRequest(queryParams) {
    return this.http.get<any>(this.API_HOST_URL + "/download/" + queryParams).pipe(map(response => { return response }),

      catchError(this.errorHandler));
  }

}
