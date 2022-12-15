import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLocationDataComponent } from '../add-location-data/add-location-data.component';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-location-data',
  templateUrl: './location-data.component.html',
  styleUrls: ['./location-data.component.scss']
})
export class LocationDataComponent implements OnInit {

  componentName = 'LocationData'
  dataSource: any = [];
  totalRecords: any;
  currentPageSize = 10;
  pageIndex = 0;
  sortedPageIndex = 0;
  sortKey = "last_updated_date";
  sortType = "DESC";
  data = [];
  columns = [
    { columnDef: 'oracle_sub_inventory', header: 'Oracle Sub-Inventory' },
    { columnDef: 'app_mat_script', header: 'Applicable for Material Script' },
    { columnDef: 'app_plan_script', header: 'Applicable for Planning Script' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ];

  displayColumns = {
    'oracle_sub_inventory': 'CES TLA Part',
    'app_mat_script': 'Location',
    'action': 'Action'
  };

  constructor(
    private dialog: MatDialog,
    private service: MasterAPIService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.dataSource = [];
  }

  openDialog() {
    const dialogRef = this.dialog.open(
      AddLocationDataComponent, { disableClose: true, data: null });
    this.service.setlocationTableAction(null);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
      } 
    });
  }

  sortChange(event) {
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.sortKey = "last_updated_date";
        this.sortType = "DESC";
      } else {
        this.sortKey = event['active'];
        this.sortType = event['direction'];
      }
      setTimeout(() => {
        this.getlocationData();
      }, 1000);
    }
  }

  emitPagesValue(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.sortedPageIndex = this.pageIndex;
    this.getlocationData();
  }


  getlocationData() {

    let inputObject = {
      "limit": this.currentPageSize,
      "pageNumber": this.pageIndex + 1,
      "sortKey": this.sortKey,
      "sortType": this.sortType,

    }
    this.service.getlocationData(inputObject).subscribe((res: any) => {
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

  deleteData(event) {
    if (event && event['detail']) {
      const id = event['detail']['location_id'];
      this.service.locationMasterData(id).toPromise().then(res => {
        if (res && res['data']) {
          if ((res['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(res['data']['message'], "Success");
          } else {
            this.commonService.openSnackBar(res['data']['message'], "Error");
          }
          this.getlocationData();
        }
      }).catch(err => { });
    }
  }

}
