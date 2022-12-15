import { Component, OnInit } from '@angular/core';
import { AddPlannerCodeComponent } from '../add-planner-code/add-planner-code.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { UpdateShiftTimingComponent } from '../update-shift-timing/update-shift-timing.component';
@Component({
  selector: 'app-shift-timing',
  templateUrl: './shift-timing.component.html',
  styleUrls: ['./shift-timing.component.scss']
})
export class ShiftTimingComponent implements OnInit {
  dataSource: any = [];
  componentName: any = 'ShiftTiming';
  totalRecords: any;
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortKey: string = "st_updated_date";
  sortType: string = "DESC";
  sortedPageIndex = 0;
  
  columns = [
    {columnDef : 'line_name', header: 'Line'},
    {columnDef : 'first_shift_s_t', header: '1st Shift Start'},
    {columnDef : 'first_shift_e_t', header: '1st Shift End'},
    {columnDef : 'second_shift_s_t', header: '2nd Shift Start'},
    {columnDef : 'second_shift_e_t', header: '2nd Shift End'},
    {columnDef : 'third_shift_s_t', header: '3rd Shift Start'},
    {columnDef : 'third_shift_e_t', header: '3rd Shift End'},
    {columnDef : 'st_updated_by', header: 'Updated By'},
    {columnDef : 'st_updated_date', header: 'Updated Date'},
    {columnDef: 'action', header: 'Action'}
  ]
  
  constructor(private dialog: MatDialog,
    private masterDataService: MasterAPIService,
    private commonService : CommonService) { }

  ngOnInit(): void { 
    this.dataSource = [];
  }


  sortChange(event){
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.sortKey = 'st_updated_date';
        this.sortType = 'desc';
      } else {
        this.sortKey = event.active;
        this.sortType = event.direction;
      }
      setTimeout(() => {
        this.getShiftTimingData();
      }, 1000);
    }
  }
  emitPagesValue(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.sortedPageIndex = this.pageIndex;
    this.getShiftTimingData();    
  }

  getShiftTimingData(){
    let inputObject ={
      limit: this.currentPageSize,
      pageNumber: this.pageIndex + 1,
      sortKey: this.sortKey,
      sortType: this.sortType
    }
    this.masterDataService.fetchShiftTimingData(inputObject).subscribe((res: any) => {
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

