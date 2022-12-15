import { Component, OnInit } from '@angular/core';
import { AddPlannerCodeComponent } from '../add-planner-code/add-planner-code.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-planner-code',
  templateUrl: './planner-code.component.html',
  styleUrls: ['./planner-code.component.scss']
})
export class PlannerCodeComponent implements OnInit {
  dataSource: any = [];
  componentName: any = 'PlannerCode';
  totalRecords: any;
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortKey: string = "planner_code";
  sortType: string = "DESC";
  sortedPageIndex = 0;
  columns = [
    {columnDef : 'planner_code', header: 'Planner Code'},
    // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
    {columnDef : 'bom_check', header: 'Bom Check'},
    {columnDef : 'material_script_check', header: 'Material Script Check'},
    {columnDef : 'planning_script_check', header: 'Planning Script Check'},
    {columnDef : 'last_updated_by', header: 'Last Updated By'},
    {columnDef : 'last_updated_date', header :'Last Updated Date'},
     //Release 2 Changes - CHG0116719 - End
    {columnDef: 'action', header: 'Action'}
  ];
  
  constructor(private dialog: MatDialog,
  private masterDataService: MasterAPIService,
  private commonService : CommonService) { }

  ngOnInit(): void {
    this.dataSource = [];    
  }
  deleteData(row: any){
    if (row) {
      this.masterDataService.deletePlannerCodeData(row['detail']['planner_code_id']).subscribe(resp => {
        if (resp && resp['data']) {
          if ((resp['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(resp['data']['message'], "Success");
            this.getPlannerCodeData();
          } else {
            this.commonService.openSnackBar(resp['data']['message'], "Error");
          }
          this.getPlannerCodeData();
        }
      })
    }
  }
  sortChange(event){
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.sortKey = 'last_updated_date';
        this.sortType = 'desc';
      } else {
        this.sortKey = event.active;
        this.sortType = event.direction;
      }
      setTimeout(() => {
        this.getPlannerCodeData();
      }, 1000);
    }
  }
  emitPagesValue(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.sortedPageIndex = this.pageIndex;
    this.getPlannerCodeData();    
  }
  openDialog(){
    const dialogRef = this.dialog.open(AddPlannerCodeComponent, { disableClose: true, data: null });
    this.masterDataService.setPlannerCodeTableAction(null);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
       
      } 
    });
  }
  getPlannerCodeData(){
    let inputObject ={
      limit: this.currentPageSize,
      pageNumber: this.pageIndex + 1,
      sortKey: this.sortKey,
      sortType: this.sortType
    }
    this.masterDataService.fetchPlannerCodeData(inputObject).subscribe((res: any) => {
      var stringified = JSON.stringify(res);
      var parsedObj = JSON.parse(stringified);

      this.totalRecords = parsedObj.totalRecords;

      if (parsedObj.totalRecords != 0) {
        this.dataSource = parsedObj.routes;

      } else {
        this.dataSource = [];
      }
    }, errorResponse => {
      console.log(errorResponse);
    })
  }

}
