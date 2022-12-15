
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})

export class MetricsComponent implements OnInit {

  componentName = 'Metrics';
  metricsForm: FormGroup;
  metricsTableForm: FormGroup;
  manufacturingLine = [];
  newtableData = {};
  dataSource: any = [];
  wwId = '';
  favoriteLines = [];
  userRole = '';
  norecord = false;
  isAccessflag: boolean = false;
  todayDate = '';

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private dialog: MatDialog,
    private masterDataService: MasterAPIService,
    private datePipe: DatePipe,
  ) {
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  async ngOnInit() {
    await this.initFormGroup();
    this.initTableFormGroup();
  }

  async ngAfterViewInit() {
    await this.getManufacturingLine();
  }

  initFormGroup() {
    return new Promise((resolve, reject) => {
      const userDetail = JSON.parse(localStorage.getItem('userData') || '{}');
      const getRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      const roles = (getRoles && getRoles.length > 0) ? getRoles.join() : '';
      this.wwId = userDetail['wwid'];
      this.userRole = roles;
      if (this.userRole && this.userRole.length > 0) {
        this.isAccessflag = true;
      } else {
        this.isAccessflag = false;
      }

      this.metricsForm = this.formBuilder.group({
        line_id: new FormControl('all'),
        line_name: new FormControl('All'),
        filter: new FormControl(null),
        user: new FormControl(this.wwId),
        role: new FormControl(this.userRole),
        output_type: new FormControl('all'),
        action: new FormControl("")
      });
      resolve(200);
    });
  }

  get f() {
    return this.metricsForm.controls;
  }

  getManufacturingLine() {
    return new Promise((resolve, reject) => {
      this.commonService.getManufacturingLine().toPromise().then(async (res) => {
        if (res) {
          this.manufacturingLine = res;
          this.manufacturingLine.unshift({
            line_id: 'all',
            line_name: "All"
          });
          this.commonService.setClearFilterAction('reset');
          await this.getTableData();
        } else {
          this.manufacturingLine = [];
          this.metricsTableForm.setControl('tableData', new FormArray([]));
        }
        resolve(200);
      }).catch(err => {
        this.manufacturingLine = [];
        this.metricsTableForm.setControl('tableData', new FormArray([]));
        this.commonService.openSnackBar("Server Error", "Error");
        resolve(200);
      });
    });
  }

  initTableFormGroup() {
    this.metricsTableForm = this.formBuilder.group({
      tableData: this.formBuilder.array([])
    });
  }

  get tableData(): FormArray {
    return this.metricsTableForm.get('tableData') as FormArray;
  }

  async selectedLine() {
    const selectedLineId = this.metricsForm.value['line_id'];
    const selectedLineDetail = this.manufacturingLine.filter(function (el) {
      return el.line_id == selectedLineId;
    });

    if (selectedLineDetail && selectedLineDetail.length > 0 && selectedLineDetail[0]['line_name']) {
      this.metricsForm.patchValue({
        filter: null,
        line_name: selectedLineDetail[0]['line_name'],
        output_type: selectedLineId === 'all' ? 'all' : 'specific_line'
      });
      this.commonService.setClearFilterAction('reset');
    }
    await this.getTableData();
  }

  getTableData() {
    return new Promise((resolve, reject) => {


      const finalData = { ...this.metricsForm.value };
      this.dataSource = new MatTableDataSource<any>([]);

      this.commonService.fetchMetrices(finalData).toPromise().then(async (res) => {
        if (res && res['routes'] && res['routes'].length > 0) {
          this.norecord = false;
          this.newtableData = res;
          this.dataSource = new MatTableDataSource<any>(this.newtableData['routes']);
          this.metricsForm.patchValue({
            action: ''
          });
          if (this.newtableData && this.newtableData['routes'] && this.newtableData['routes'].length > 0) {
            this.metricsTableForm.setControl('tableData', new FormArray([]));
            this.newtableData['routes'].forEach((schedulerData) => {
              this.tableData.push(this.addTableControls(schedulerData));
            });
          }
          resolve(200);
        } else {
          this.newtableData['routes'] = [];
          this.norecord = true;
          resolve(200);
        }

      }).catch(err => { this.norecord = true; resolve(200); });

    });
  }

  async filterData(event) {
    
    if (event) {
      if ((!event['start_date'] || event['start_date'] == null ||
        event['start_date'] == undefined || event['start_date'] == '') &&
        (!event['end_date'] || event['end_date'] == null ||
          event['end_date'] == undefined || event['end_date'] == '')) {
        this.metricsForm.value['filter'] = null;
        this.metricsForm.patchValue({
          filter: null
        });
      } else {
        this.metricsForm.patchValue({
          filter: event
        });
      }
      await this.getTableData();
    }
  }

  addTableControls(controlValue: any = {}) {
    return this.formBuilder.group({
      qty_comp_sum: new FormControl(controlValue['qty_comp_sum'] || null),
      qty_comp_sum_s1: new FormControl(controlValue['qty_comp_sum_s1'] || null),
      qty_comp_sum_s2: new FormControl(controlValue['qty_comp_sum_s2'] || null),
      qty_comp_sum_s3: new FormControl(controlValue['qty_comp_sum_s3'] || null),
      qty_sch_sum: new FormControl(controlValue['qty_sch_sum'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      sch_adh: new FormControl(controlValue['sch_adh'] || null),
      sch_count: new FormControl(controlValue['sch_count'] || null)
    });
  }


  downloadExcel() {
    let path = "Scheduler"
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

  exportBtnClick(btnType) {

    this.metricsForm.patchValue({
      action: btnType ? btnType : ''
    });

    let Payload = this.metricsForm.value;

    this.commonService.fetchMetrices(Payload).toPromise().then(async (res) => {
      if (res && res['url'] && btnType == 'export-to-excel') {
        var fileLink = document.createElement('a');
        fileLink.style.display = "hidden";
        fileLink.href = res['url'];
        fileLink.click();
        fileLink.remove();
        this.metricsForm.patchValue({
          action: ''
        });
      }
      if (res && res['status'] && btnType == 'export-to-email' && (res['status'].toLowerCase()) == 'success') {
        this.commonService.openSnackBar(res['message'], "Success");
        this.metricsForm.patchValue({
          action: ''
        });
      } else {
        this.commonService.openSnackBar(res['message'], "Error");
        this.metricsForm.patchValue({
          action: ''
        });
      }

    }).catch(err => {
      this.commonService.openSnackBar("Server Error! Please try again.", "Error");
    });

  }
}