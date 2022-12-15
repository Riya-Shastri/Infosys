import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { MatDialog } from '@angular/material/dialog';
import { AddStatusComponent } from './add-status/add-status.component';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  dataSource: any = [];
  filterval: any;
  componentName: any = 'Planning';
  totalRecords: any;
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortKey: string = "run_date";
  sortType: string = "ASC";
  rowIndex: any;
  tableColumns = [];
  tableData: any = [];
  selection = new SelectionModel<any>(true, []);
  //planningtableData = {};
  PlannerCodeList = [];
  selectedplannercode: any;
  selectedplannercodedefault: any;
  isPlannerSelected: boolean = false;
  selectedval = 'ALL';
  WWID : any;
  columns = [
    { columnDef: 'run_date', header: 'Run Date' },
    { columnDef: 'component', header: 'Component' },
    { columnDef: 'qty_short', header: 'Qty Short' },
    { columnDef: 'supplier', header: 'Supplier' },
    { columnDef: 'planner_comments', header: 'Comments' },
    { columnDef: 'last_updated_by', header: 'Updated By' },
    { columnDef: 'last_updated_date', header: 'Updated Date' },
  ];


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  constructor(private fb: FormBuilder,
    private commonLogicService: CommonLogicService,
    private dialog: MatDialog,
    private commonService: CommonService,
  ) { 
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.WWID = userData['wwid'];
  }

  ngOnInit(): void {
    this.tableColumns = this.tableColumns.concat(this.columns.map(x => x.columnDef));
    this.getPlannerCode();
    this.selectedplannercodedefault = this.selectedval;
    this.getPlanningTableData();
  }

  planningForm: FormGroup = this.fb.group({
    planner_id: new FormControl('ALL'),
  });

  getPlannerCode() {
    this.commonService.getPlannercode().subscribe(res => {
      if (res) {
        this.PlannerCodeList = res.routes;
      } else {
        this.PlannerCodeList = [];
      }
    }, errorResponse => {
      this.PlannerCodeList = [];
      this.commonService.openSnackBar("Server Error", "Error");
    })
  }

  selectedPlannerCode(plannercode_code: any) {
    this.selectedplannercode = plannercode_code;
    this.selectedplannercodedefault = this.selectedplannercode;
    this.filterval = {};
    this.commonService.setClearFilterAction('reset');
    this.getPlanningTableData();
  }

    getPlanningTableData() {
     
    let inputObject = {
      "limit": this.currentPageSize,
      "pageNumber": this.pageIndex + 1,
      "sortKey": this.sortKey,
      "sortType": this.sortType,
      "filter": this.filterval?this.filterval : {}, 
      "planner_code": this.selectedplannercodedefault,      
      "action": '',
      "user" : this.WWID
    }
    this.commonService.getPlannercodeTabledata(inputObject).subscribe((res: any) => {
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

  filterData(event) {
    this.filterval = event;
    this.getPlanningTableData();
  }
  onPaginateChange(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getPlanningTableData();
  }
  addStatus(detail, index) {
    let inputObject = {
      "rowdetail": detail,
      "plannercode": this.selectedplannercodedefault

    }
    this.commonLogicService.setPlanningstatusAction(inputObject);
    const dialogRef = this.dialog.open(AddStatusComponent, { disableClose: true });
    //this.commonLogicService.setPlanningstatusAction(null);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.data) {
        setTimeout(() => {
          this.getPlanningTableData();
        }, 2000);
      }
    });
  }
  exportBtnClick(btnType) {

    let inputObject = {
      "limit": this.currentPageSize,
      "pageNumber": this.pageIndex + 1,
      "sortKey": this.sortKey,
      "sortType": this.sortType,
      "filter": this.filterval?this.filterval : {}, 
      "planner_code": this.selectedplannercodedefault,      
      "action": btnType,
      "user" : this.WWID
    }
    
    this.commonService.getPlannercodeTabledata(inputObject).toPromise().then(res => {
      if (res && res['url'] && btnType == 'export-to-excel') {
        var fileLink = document.createElement('a');
        fileLink.style.display = "hidden";
        fileLink.href = res['url'];
        fileLink.click();
        fileLink.remove();      
      } else {
        this.commonService.openSnackBar(res['message'], "Error");        
      }
    }).catch(err => {      
      this.commonService.openSnackBar("Server Error! Please try again.", "Error");
    });
  }
}
