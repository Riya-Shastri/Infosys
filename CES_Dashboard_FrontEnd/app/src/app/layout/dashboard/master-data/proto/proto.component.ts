import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddProtoComponent } from '../add-proto/add-proto.component';
import { FileUploadComponent } from 'src/app/share/Common/file-upload/file-upload.component';
import { CommonService } from 'src/app/share/Services/common.service';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';


@Component({
  selector: 'app-proto',
  templateUrl: './proto.component.html',
  styleUrls: ['./proto.component.scss']
})
export class ProtoComponent implements OnInit {
  componentName: any = 'Proto'
  dataSource: any = [];
  totalRecords: any;
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortedPageIndex = 0;
  sortKey: string = "ces_tla_part";
  sortType: string = "DESC";
  parsedObjfilter: any = { "ces_tla_part": "" };
  selected: any = 'masterData';
  filterval: any;
  title!: string;
  rowIndex: any;
  SelectedarrayData: any = [];
  errMsg2: any;
  filterArray: any = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  columns = [
    { columnDef: 'ces_tla_part', header: 'CES TLA Part No.' },
    { columnDef: 'repack_type', header: 'Repack Type' },
    { columnDef: 'inlet_catmod', header: 'Inlet Catmod No.' },
    { columnDef: 'outlet_catmod', header: 'Outlet Catmod No.' },
    { columnDef: 'filter_catmod', header: 'Filter/Dpf Catmod No.' },
    { columnDef: 'mixer', header: 'Mixer' },
    { columnDef: 'build_slot', header: 'Build Slot' },
    { columnDef: 'fg_rack', header: 'FG Rack' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ];
  displayColumns: any = {
    'ces_tla_part': 'CES TLA PART#',
    'repack_type': 'Repack Type',
    'inlet_catmod': 'INLET CATMOD#',
    'outlet_catmod': 'OUTLET CATMOD#',
    'filter_catmod': 'FILTER/DPF CATMOD#',
    'mixer': 'MIXER',
    'build_slot': 'Build Slot',
    'fg_rack': 'FG Rack',
    //'action'  : 'Action'
  }

  constructor(private dialog: MatDialog, private commonService: CommonService,
    private masterDataService: MasterAPIService) { }

  ngOnInit(): void {
    this.dataSource = [];
  }
  getProtoData() {
    return new Promise((resolve, reject) => {
    let inputObject = {
      "limit": this.currentPageSize,
      "pageNumber": this.pageIndex + 1,
      "sortKey": this.sortKey,
      "sortType": this.sortType,
      "filter": this.filterval
    }
    this.masterDataService.fetchProtoTypeData(inputObject).subscribe((res: any) => {
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

  openDialog() {
    const dialogRef = this.dialog.open(AddProtoComponent, { disableClose: true, data: null });
    this.masterDataService.setProtoTableAction(null);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
      } 
    });
  }

  openFileUpload() {
    const dialogRef = this.dialog.open(FileUploadComponent, { disableClose: true, data: this.componentName });
    this.masterDataService.setProtoTypeTableAction(null);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
      } 
    })
  }

  sortProtoChange(event) {
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.sortKey = 'last_updated_date';
        this.sortType = 'desc';
      } else {
        this.sortKey = event.active;
        this.sortType = event.direction;
      }
      setTimeout(() => {
        this.getProtoData();
      }, 1000);
    }
  }

  emitPagesValue(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.sortedPageIndex = this.pageIndex;
    this.getProtoData();
  }

  deleteProtoData(row: any) {
    if (row) {
      this.masterDataService.deleteProtoTypeData(row['detail']['proto_id']).subscribe(resp => {

        if (resp && resp['data']) {
          if ((resp['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(resp['data']['message'], "Success");
          } else {
            this.commonService.openSnackBar(resp['data']['message'], "Error");
          }
          this.getProtoData();
        }
      })
    }

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
    this.getProtoData();
  }
  downloadExcel() {
    let path = "Proto"
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

}
