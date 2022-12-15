import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLaserMdComponent } from '../add-laser-md/add-laser-md.component';
import { FileUploadComponent } from 'src/app/share/Common/file-upload/file-upload.component';
import { CommonService } from 'src/app/share/Services/common.service';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';

@Component({
  selector: 'app-laser-md',
  templateUrl: './laser-md.component.html',
  styleUrls: ['./laser-md.component.scss']
})
export class LaserMDComponent implements OnInit {
  dataSource: any = [];
  componentName: any = 'LaserMd';
  totalRecords: any;
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortedPageIndex = 0;
  sortKey: string = "ces_part_flat";
  sortType: string = "DESC";
  filterval: any;
  parsedObjfilter: any
  selected: any = 'masterData';
  title!: string;
  rowIndex: any;
  SelectedarrayData: any = [];
  errMsg2: any;
  filterArray: any = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  columns = [
    { columnDef: 'ces_part_rolledbody', header: 'CES Part No.(Rolled Body)' },
    { columnDef: 'ces_part_flat', header: 'CES Part No.(Flat)' },
    { columnDef: 'diameter', header: 'Diameter' },
    { columnDef: 'length', header: 'Length' },
    { columnDef: 'mat_gauge_flat', header: 'Material Gauge of the Flat' },
    { columnDef: 'cut', header: 'Cut' },
    { columnDef: 'stamp', header: 'Stamp' },
    { columnDef: 'flare_pierce_gauge', header: 'Flare Pierce Gauge' },
    { columnDef: 'manual_roll', header: 'Manual Roll' },
    { columnDef: 'weld', header: 'Weld' },
    { columnDef: 'coin', header: 'Coin' },
    { columnDef: 'lucas', header: 'Lucas' },
    { columnDef: 'runcell', header: 'Run Cell' },
    { columnDef: 'sized', header: 'Sized' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ];

  displayColumns: any = {
    'ces_part_rolledbody': 'CES Part No. (Rolled Body)',
    'ces_part_flat': 'CES Part No. (Flat)',
    'diameter': 'Diameter',
    'length': 'Length',
    'mat_gauge_flat': 'Material Gauge of the Flat',
    'cut': 'Cut',
    'stamp': 'Stamp',
    'flare_pierce_gauge': 'Flare Pierce Gauge',
    'manaul_roll': 'Manual Roll',
    'weld': 'Weld',
    'coin': 'Coin',
    'lucas': 'Lucas',
    'action': 'Action'
  }

  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private masterDataService: MasterAPIService) { }

  ngOnInit(): void {
    this.dataSource = [];
  }

  getDashboardData() {
    return new Promise((resolve, reject) => {
    let inputObject = {
      "limit": this.currentPageSize,
      "pageNumber": this.pageIndex + 1,
      "sortKey": this.sortKey,
      "sortType": this.sortType,
      "filter": this.filterval
    }

    this.masterDataService.fetchLaserRecipeData(inputObject).subscribe((res: any) => {
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
  });
  }

  openFileUpload() {

    const dialogRef = this.dialog.open(FileUploadComponent, {
      disableClose: true, data: this.componentName
    });

    this.masterDataService.setLaserTableAction(null);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
      } 
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddLaserMdComponent,
      { disableClose: true, data: null });
    this.masterDataService.setLaserTableAction(null);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
      } 
    });
  }

  sortLaserMdChange(event) {
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.sortKey = 'last_updated_date';
        this.sortType = 'desc';
      } else {
        this.sortKey = event.active;
        this.sortType = event.direction;
      }
      setTimeout(() => {
        this.getDashboardData();
      }, 1000);
    }
  }

  emitPagesValue(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.sortedPageIndex = this.pageIndex;
    this.getDashboardData();
  }

  deleteLaserData(row: any) {
    if (row) {
      this.masterDataService.deleteLaserRecipeData(row['detail']['laser_md_id']).subscribe(resp => {
        if (resp && resp['data']) {
          if ((resp['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(resp['data']['message'], "Success");
            this.getDashboardData();
          } else {
            this.commonService.openSnackBar(resp['data']['message'], "Error");
          }
          this.getDashboardData();
        }
      })
    }
  }

  downloadExcel() {
    let path = "Laser"
    this.masterDataService.downloadExcelRequest(path).subscribe(response => {
      if (response.url != undefined && response.url != "") {
        this.download(response.url)
      } else {
        this.openDialogBox('Error', 'No Valid Records To Download.', 'INFO');
      }
    });
  }

  download(file_url: any) {
    let fileUrl = file_url;
    var fileLink = document.createElement('a');
    document.body.appendChild(fileLink);
    fileLink.href = fileUrl;
    fileLink.click();
  }

  openDialogBox(head: string, desc: string, type: string) {
    const dialogC = this.dialog.open(AlertDialogBoxComponent, {
      width: '400px',
      data: { title: head, content: desc, type: type },
      disableClose: false
    });
    dialogC.afterClosed().subscribe(result => {
      console.log(result);
    })
  }

  filterData(event) {
    this.filterval = event;
    this.getDashboardData();
  }
}