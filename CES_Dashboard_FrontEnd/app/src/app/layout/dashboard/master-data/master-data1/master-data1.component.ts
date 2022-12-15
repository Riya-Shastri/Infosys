import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipeMasterComponent } from '../add-recipe-master/add-recipe-master.component';
import { FileUploadComponent } from 'src/app/share/Common/file-upload/file-upload.component';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/share/Services/common.service';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';

@Component({
  selector: 'app-master-data1',
  templateUrl: './master-data1.component.html',
  styleUrls: ['./master-data1.component.scss']
})
export class MasterData1Component implements OnInit {
  componentName: any = 'MasterData';
  totalRecords: any;
  dataSource: any = [];
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortKey: string = "cespart_no";
  sortType: string = "DESC";
  filterval: any;
  sortedPageIndex = 0;

  columns = [
    { columnDef: 'cespart_no', header: 'CES Part No.' },
    { columnDef: 'ces_base_part', header: 'CES Base Part No.' },
    { columnDef: 'style_no', header: 'Style No.' },
    { columnDef: 'assembly_type', header: 'Assembly Type' },
    { columnDef: 'diameter', header: 'Diameter(TLA Level)' },
    { columnDef: 'length', header: 'Length' },
    { columnDef: 'inlet_part', header: 'Inlet Part No.' },
    { columnDef: 'outlet_part', header: 'Outlet Part No.' },
    { columnDef: 'filter_part', header: 'Filter Part No.' },
    { columnDef: 'mixer_part', header: 'Mixer Part No.' },
    { columnDef: 'catmod_no', header: 'Catmod No.(Single Body)' },
    { columnDef: 'inlet_catmod', header: 'Inlet-Catmod' },
    { columnDef: 'canning_diameter_inlet', header: 'Canning Diameter(Inlet)' },
    { columnDef: 'outlet_catmod', header: 'Outlet-Catmod' },
    { columnDef: 'canning_diameter_outlet', header: 'Canning Diameter(Outlet)' },
    { columnDef: 'filter_catmod', header: 'Filter-Catmod' },
    { columnDef: 'canning_diameter_filter', header: 'Canning Diameter(Dpf)' },
    { columnDef: 'fg_rack', header: 'FG Rack' },
    { columnDef: 'audit', header: 'Audit' },
    { columnDef: 'size', header: 'Size' },
    { columnDef: 'build_slot', header: 'Build Slot' },
    { columnDef: 'steering_wheel', header: 'Steering Wheel' },
    { columnDef: 'water_dam', header: 'Water Dam' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ]
  displayColumns: any = {
    'style_no': 'Style#',
    'cespart_no': 'CES Part#',
    'assembly_type': 'Assembly Type',
    'diameter': 'Diameter',
    'length': 'Length',
    'inlet_part': 'Inlet Part#',
    'outlet_part': 'Outlet Part#',
    'filter_part': 'Filter Part#',
    'mixer_part': 'Mixer Part#',
    'catmod_no': 'CATMOD# (Single Body)',
    'inlet_catmod': 'Inlet-CATMOD',
    'canning_diameter_inlet': 'CanningDiameter(Inlet)',
    'outlet_catmod': 'Outlet-CATMOD',
    'canning_diameter_outlet': 'CanningDiameter(Outlet)',
    'filter_catmod': 'Filter-CATMOD',
    'canning_diameter_filter': 'CanningDiameter(DPF/Filter)',
    'audit': 'Audit',
    'size': 'Size',
    'build_slot': 'Build Slot',
    'fg_rack': 'FG Rack',
    'action': 'Action'
  }

  constructor(private dialog: MatDialog,
    private masterDataService: MasterAPIService,
    private router: Router,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.dataSource = [];
  }
  getRecipeMasterData() {
    //return new Promise((resolve, reject) => {
    let inputObject = {
      "limit": this.currentPageSize,
      "pageNumber": this.pageIndex + 1,
      "sortKey": this.sortKey,
      "sortType": this.sortType,
      "filter": this.filterval
    }
    this.masterDataService.fetchRecipeMasterData(inputObject).subscribe((res: any) => {
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
 // });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddRecipeMasterComponent, { width: '100%', disableClose: true, data: null });
    this.masterDataService.setRecipeMasterTableAction(null);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
        //this.getRecipeMasterData();
      } 
    });
  }
  openFileUpload() {
    const dialogRef = this.dialog.open(FileUploadComponent, { disableClose: true, data: this.componentName });
    this.masterDataService.setRecipeMasterTableAction(null);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result['data'];
        this.totalRecords = result['total'];
        //this.getDashboardData();
      } 
    })
  }

  sortMasterDataChange(event) {
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.sortKey = 'last_updated_date';
        this.sortType = 'desc';
      } else {
        this.sortKey = event.active;
        this.sortType = event.direction;
      }
      setTimeout(() => {
        this.getRecipeMasterData();
      }, 1000);
    }

  }
  filterData(event) {
    this.filterval = event;
    this.getRecipeMasterData();
  }

  emitPagesValue(value: any) {
    this.currentPageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.sortedPageIndex = this.pageIndex;
    this.getRecipeMasterData();
  }
  deleteRecipeData(row: any) {
    if (row) {
      this.masterDataService.deleteRecipeMasterData(row['detail']['cespart_details_id']).subscribe(resp => {
        if (resp && resp['data']) {
          if ((resp['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(resp['data']['message'], "Success");
            this.getRecipeMasterData();
          } else {
            this.commonService.openSnackBar(resp['data']['message'], "Error");
          }
          this.getRecipeMasterData();
        }
      })
    }
  }
  downloadExcel() {
    let path = "Recipe"
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

}
