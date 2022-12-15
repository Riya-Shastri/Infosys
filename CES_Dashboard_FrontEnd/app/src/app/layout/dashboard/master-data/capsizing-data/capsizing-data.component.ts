import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from '../../../../share/Services/masterData/master-api.service';
import { AddCapsizingDataComponent } from '../add-capsizing-data/add-capsizing-data.component';

@Component({
  selector: 'app-capsizing-data',
  templateUrl: './capsizing-data.component.html',
  styleUrls: ['./capsizing-data.component.scss']
})
export class CapsizingDataComponent implements OnInit {

  componentName: any = 'CapSizingData';
  capsizingForm: FormGroup;
  columns = [
    { columnDef: 'line_name', header: 'Manufacturing Line' },
    { columnDef: 'capsize', header: 'CapSize' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ];
  dataSource: any = [];
  totalRecords : any;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: MasterAPIService,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataSource = [];
    this.initFormGroup();
    this.getCapsizingTableData();
  }

  initFormGroup() {
    this.capsizingForm = this.formBuilder.group({
      sortKey: new FormControl('last_updated_date'),
      sortType: new FormControl('desc')
    });
  }

  get f() {
    return this.capsizingForm.controls;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddCapsizingDataComponent,
      { disableClose: true, data: null });

    this.service.setCapSizeTableAction(null);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result;
      } 
    });
  }

  sortChange(event) {
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.capsizingForm.setValue({
          sortKey: 'last_updated_date',
          sortType: 'desc'
        });
      } else {
        this.capsizingForm.setValue({
          sortKey: event['active'],
          sortType: event['direction']
        });
      }
      setTimeout(() => {
        this.getCapsizingTableData();
      }, 1000);
    }
  }

  deleteData(event) {
    if (event && event['detail']) {
      const id = event['detail']['capsize_id'];
      this.service.deleteCapsizingData(id).toPromise().then(res => {
        if (res && res['data']) {
          if ((res['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(res['data']['message'], "Success");
          } else {
            this.commonService.openSnackBar(res['data']['message'], "Error");
          }
        }
        this.getCapsizingTableData();
      }).catch(err => { });
    }
  }

  getCapsizingTableData() {
    this.service.getCapsizingData(this.capsizingForm.value).subscribe(res => {
      if (res && res['routes'].length > 0) {
        this.dataSource = res['routes'];
      } else {
        this.dataSource = [];
        this.totalRecords = 0;
      }
    }, (error) => { });
  }
}
