import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { MatChipInputEvent } from '@angular/material/chips';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { DatePipe } from '@angular/common';
import {ScrollToService,ScrollToConfigOptions,} from '@nicky-lenaers/ngx-scroll-to';
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})

export class SchedulerComponent implements OnInit {

  componentName = 'scheduler';
  schedulerForm: FormGroup;
  schedulerTableForm: FormGroup;
  files: NgxFileDropEntry[] = [];
  addOnBlur = true;
  separatorKeysCodes = [13];
  jobNumber: any = [];
  isfileSelected = false;
  isAccessflag = false;
  runscripflag = false;
  driveDropdown = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ];
  manufacturingLine = [];
  newtableData = {};
  tableColumns = [];
  dataSource: any = [];
  selection = new SelectionModel<any>(true, []);
  wwId = '';
  favoriteLines = [];
  userRole = '';
  norecord = false;
  isRunscriptflag = false;
  isDarkTheme = false;
  MfLineName: any;
  @ViewChild('keywordsInput') dialogContent: ElementRef;
  scrollPosition: any;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private masterDataService: MasterAPIService,
    private datePipe: DatePipe,
    private readonly scrollToService: ScrollToService
  ) {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark-theme' ? this.isDarkTheme = true : this.isDarkTheme = false;
    }
    this.scrollPosition = JSON.parse(localStorage.getItem('schedularscrollPosition') || '{}');
  }

  async ngOnInit() {
    await this.initFormGroup();
    this.initTableFormGroup();
    await this.getManufacturingLine();
     //--- scroll position started-------
     let dialogElement = this.dialogContent.nativeElement as HTMLElement;
     dialogElement.onscroll = () => {
       this.scrollPosition = dialogElement.scrollTop;
       localStorage.setItem('schedularscrollPosition',JSON.stringify(dialogElement.scrollTop));
     };
     
     console.log('after init, pos: ' + this.scrollPosition);
     this.scrollToService
       .scrollTo({
         offset: this.scrollPosition,
         container: dialogElement,
       } as ScrollToConfigOptions)
       .toPromise()
       .then(() => {
         console.log('after scroll pos: ' + dialogElement.scrollTop);
       });
        //--- scroll position end-------
  }

  initFormGroup() {
    return new Promise((resolve, reject) => {
      this.MfLineName = JSON.parse(localStorage.getItem('selectedMFLine') || '{}');
      const userDetail = JSON.parse(localStorage.getItem('userData') || '{}');
      const getRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      const roles = (getRoles && getRoles.length > 0) ? getRoles.join() : '';
      this.wwId = userDetail['wwid'];
      this.userRole = roles;
      if (this.userRole && this.userRole.length > 0 && (this.userRole.includes('CMP-User-Admin')) || this.userRole.includes('CMP-Scheduler') || this.userRole.includes('CMP-Materials')) {
        this.isAccessflag = true;
      } else {
        this.isAccessflag = false;
      }
      if (this.userRole && this.userRole.length > 0 && (this.userRole.includes('CMP-User-Admin')) || this.userRole.includes('CMP-Scheduler')) {
        this.isRunscriptflag = true;
      } else {
        this.isRunscriptflag = false;
      }

      this.schedulerForm = this.formBuilder.group({
        limit: new FormControl(0),
        user: new FormControl(this.wwId),
        role: new FormControl(this.userRole),
        pageNumber: new FormControl(0),
        sortKey: new FormControl('run_date'),
        sortType: new FormControl('desc'),
        line_id: new FormControl(''),
        line_name: new FormControl(''),
        action: new FormControl(''),
        is_parent: new FormControl(1),
        is_module: new FormControl(0),
        is_canning: new FormControl(0),
        filter: new FormControl({}),
        uploadFileOption: new FormControl('no')
      });
      if (this.MfLineName['line_id']) {
        this.schedulerForm.patchValue({
          line_id: this.MfLineName['line_id'],
          line_name: this.MfLineName['line_name'],
          is_parent: this.MfLineName['is_parent'],
          is_module: this.MfLineName['is_module'],
          is_canning: this.MfLineName['is_canning']
        });
      }
      resolve(200);
    });
  }

  get f() {
    return this.schedulerForm.controls;
  }

  getManufacturingLine() {
    return new Promise((resolve, reject) => {
      this.commonService.getManufacturingLine().toPromise().then(async (res) => {
        if (res) {
          this.manufacturingLine = res;
          this.favoriteLines = [];
          this.manufacturingLine.forEach(Line => {
            if (Line.ping == 1) {
              this.favoriteLines.push(Line);
            }
          });
          this.commonService.setClearFilterAction('reset');
          if (this.MfLineName['line_id'] != null) {
            await this.getSchedulerTableData();
          } else {
            if (this.favoriteLines && this.favoriteLines.length > 0) {
              this.schedulerForm.patchValue({
                line_id: this.favoriteLines[0]['line_id'],
                line_name: this.favoriteLines[0]['line_name'],
                is_parent: this.favoriteLines[0]['is_parent'],
                is_module: this.favoriteLines[0]['is_module'],
                is_canning: this.favoriteLines[0]['is_canning'],
                limit: 0,
                pageNumber: 0,
                sortKey: 'run_date',
                sortType: 'desc',
              });

              await this.getSchedulerTableData();
            } else {
              await this.getSchedulerTableData();
            }
          }
        } else {
          this.manufacturingLine = [];
          this.schedulerTableForm.setControl('tableData', new FormArray([]));
        }
        resolve(200);
      }).catch(err => {
        this.manufacturingLine = [];
        this.schedulerTableForm.setControl('tableData', new FormArray([]));
        this.commonService.openSnackBar("Server Error! Please try again.", "Error");
        resolve(200);
      });
    });
  }

  async favoriteBtnClick(obj) {
    this.isfileSelected = false;
    this.schedulerForm.patchValue({
      is_canning: obj['is_canning'],
      is_module: obj['is_module'],
      is_parent: obj['is_parent'],
      line_id: obj['line_id'],
      line_name: obj['line_name'],
      limit: 0,
      pageNumber: 0,
      sortKey: 'run_date',
      sortType: 'desc',
      uploadFileOption: 'no',
      filter: {}
    });
    let MFLine = {
      line_id: this.schedulerForm.value['line_id'],
      line_name: this.schedulerForm.value['line_name'],
      is_canning: obj['is_canning'],
      is_module: obj['is_module'],
      is_parent: obj['is_parent']
    }
    localStorage.setItem('selectedMFLine', JSON.stringify(MFLine));
    this.commonService.setClearFilterAction('reset');
    await this.getSchedulerTableData();
  }

  async filterData(event) {
    if (event) {
      if ((!event['job_num'] || event['job_num'] == null || event['job_num'] == undefined || event['job_num'] == '') &&
        (!event['ces_part_num_catmod'] || event['ces_part_num_catmod'] == null || event['ces_part_num_catmod'] == undefined || event['ces_part_num_catmod'] == '') &&
        (!event['ces_part_num'] || event['ces_part_num'] == null || event['ces_part_num'] == undefined || event['ces_part_num'] == '') &&
        (!event['inlet_ces_part_num'] || event['inlet_ces_part_num'] == null || event['inlet_ces_part_num'] == undefined || event['inlet_ces_part_num'] == '') &&
        (!event['filter_ces_part_num'] || event['filter_ces_part_num'] == null || event['filter_ces_part_num'] == undefined || event['filter_ces_part_num'] == '') &&
        (!event['mixer_ces_part_num'] || event['mixer_ces_part_num'] == null || event['mixer_ces_part_num'] == undefined || event['mixer_ces_part_num'] == '') &&
        (!event['outlet_ces_part_num'] || event['outlet_ces_part_num'] == null || event['outlet_ces_part_num'] == undefined || event['outlet_ces_part_num'] == '') &&
        (!event['start_date'] || event['start_date'] == null || event['start_date'] == undefined || event['start_date'] == '') &&
        (!event['end_date'] || event['end_date'] == null || event['end_date'] == undefined || event['end_date'] == '')
      ) {
        this.schedulerForm.value['filter'] = {};
        this.schedulerForm.patchValue({
          filter: {}
        });
      } else {

        const parentLine = this.schedulerForm.value['is_parent'];
        const moduleLine = this.schedulerForm.value['is_module'];
        const canningLine = this.schedulerForm.value['is_canning'];
        let csPartValue = event['ces_part_num_catmod'];

        if (parentLine) {
          event['ces_part_num'] = csPartValue;
          delete event['ces_part_num_catmod'];
        } else if (moduleLine && (this.schedulerForm.value['line_name']).trim() === 'M-1000') {
          event['inlet_ces_part_num'] = csPartValue;
          delete event['ces_part_num_catmod'];
        } else if (moduleLine && (this.schedulerForm.value['line_name']).trim() === 'M-1100') {
          event['outlet_ces_part_num'] = csPartValue;
          delete event['ces_part_num_catmod'];
        } else if (moduleLine && (this.schedulerForm.value['line_name']).trim() === 'M-1200') {
          event['filter_ces_part_num'] = csPartValue;
          delete event['ces_part_num_catmod'];
        } else if (moduleLine && (this.schedulerForm.value['line_name']).trim() === 'M-1300') {
          event['mixer_ces_part_num'] = csPartValue;
          delete event['ces_part_num_catmod'];
        } else if (canningLine) {
          event['ces_part_num_catmod'] = csPartValue;
        }

        this.schedulerForm.patchValue({
          filter: event
        });
      }
      await this.getSchedulerTableData();
    }
  }

  getselectedLine(mfline_name: any) {
    this.isfileSelected = false;
    this.schedulerForm.patchValue({
      line_name: mfline_name,
      filter: {},
      uploadFileOption: 'no',
    });
    this.commonService.setClearFilterAction('reset');
  }

  enablerunscript(event: any) {
    if (event.keyCode == 13) {
      if (this.jobNumber ?.length <= 10) {
        this.runscripflag = true;
      } else {
        this.runscripflag = false;
      }
    } else {
      this.runscripflag = false;
    }
  }

  async addJobLine(event: MatChipInputEvent) {
    this.runscripflag = true;
    let res = event.value.split(',').map((tag) => tag.trim()).filter((tag) => tag.length !== 0);
    if (res && res.length > 1) {
      const uniqueValueArr = res.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
      this.jobNumber = this.jobNumber.concat(uniqueValueArr);
    } else {
      if (this.jobNumber ?.length > 10) {
        this.commonService.openSnackBar('Maximum 10 job numbers allowed', "Error");
        this.runscripflag = false;
        return;
      } else {
        this.jobNumber = await this.countJobNumber(res);
        if (this.jobNumber && this.jobNumber ?.length > 0 && this.jobNumber ?.length < 11) {
          this.runscripflag = true;
        } else {
          this.runscripflag = false;
        }
      }
    }
    this.jobNumber = [...new Set(this.jobNumber)];
    event.chipInput!.clear();
  }

  countJobNumber(res) {
    return new Promise((resolve, reject) => {
      this.jobNumber.push(...res);
      resolve(this.jobNumber);
    });
  }

  refreshTable() {
    this.commonService.setClearFilterAction('reset');
    this.schedulerForm.patchValue({ filter: {} });
    this.getSchedulerTableData();
  }

  removeJobLine(job: any) {
    const index = this.jobNumber.indexOf(job);
    if (index >= 0) {
      this.jobNumber.splice(index, 1);
    }
    if (this.jobNumber ?.length == 0) {
      this.runscripflag = false;
    } else {
      this.runscripflag = true;
    }
  }

  runScript() {
    let scriptpayload = {
      "job_ids": [],
      "job_numbers": this.jobNumber,
      "line_id": this.schedulerForm.value['line_id'],
      "line_name": this.schedulerForm.value['line_name'],
      "user": this.wwId
    }
    this.commonService.runScriptdata(scriptpayload).toPromise().then(async (res) => {
      if ((res['status'].toLowerCase()) == 'success') {
        this.commonService.openSnackBar(res['message'], "Success");
        this.runscripflag = false;
        this.jobNumber = [];
        // await this.getManufacturingLine();
      } else {
        this.commonService.openSnackBar(res['message'], "Error");
        this.runscripflag = false;
        this.jobNumber = [];
        //await this.getManufacturingLine();
      }
    }).catch(err => {
      this.commonService.openSnackBar("Server Error! Please try again.", "Error");
      this.runscripflag = false;
      this.jobNumber = [];
    });
  }

  isFileUpload(event) {
    this.f['uploadFileOption'].setValue(event.value);
    this.isfileSelected = event.value == 'yes' ? true : false;
  }

  openPinDialog(ispin, index, label) {
    const dialogC = this.dialog.open(AlertDialogBoxComponent, {
      width: '400px',
      data: {
        title: 'Confirm', content: `Are you sure <br> you want to ${!ispin ? 'add' : 'remove'}
       ${label} ${!ispin ? 'in' : 'from'} your favorite list?`, type: "COPY"
      },
      disableClose: false
    });

    dialogC.afterClosed().subscribe(async (result) => {
      if (result == 'Yes') {
        const getfavoriteLineArr = this.manufacturingLine.filter(function (el) { return el.ping == 1 });
        if (getfavoriteLineArr && getfavoriteLineArr.length >= 7 && !ispin) {
          this.commonService.openSnackBar('Favourite lines should not be more than 7', "Error");
        } else {
          await this.updateSelectedLine(ispin, index);
        }
      }
    })
  }

  updateSelectedLine(ispin, index) {
    return new Promise((resolve, rejects) => {
      if (!ispin) {
        this.manufacturingLine[index].ping = 1;
      } else {
        this.manufacturingLine[index].ping = 0;
      }

      let finalReqPayload = {};
      let newfavoriteLineArr = this.manufacturingLine.filter(function (el) { return el.ping == 1 });
      if (newfavoriteLineArr && newfavoriteLineArr.length > 0) {

        let getlinesId = [];
        newfavoriteLineArr.forEach(Line => {
          getlinesId.push(Line['line_id']);
        });

        finalReqPayload = {
          wwid: this.wwId,
          lines: getlinesId
        };

      } else {
        newfavoriteLineArr = [];
        finalReqPayload = {
          wwid: this.wwId,
          lines: []
        };
      }

      this.commonService.updateManufacturingLine(finalReqPayload).toPromise().then(async (res) => {
        if ((res['status'].toLowerCase()) == 'success') {
          this.commonService.openSnackBar(res['message'], "Success");
          await this.getManufacturingLine();
        } else {
          this.commonService.openSnackBar(res['message'], "Error");
        }
        resolve(200);
      }).catch(err => {
        this.commonService.openSnackBar("Server Error! Please try again.", "Error");
        resolve(200);
      });
    });
  }

  initTableFormGroup() {
    this.schedulerTableForm = this.formBuilder.group({
      tableData: this.formBuilder.array([])
    });
  }

  get tableData(): FormArray {
    return this.schedulerTableForm.get('tableData') as FormArray;
  }

  addTableControlsForParent(controlValue: any = {}) {
    return this.formBuilder.group({
      parent_temp_job_id: new FormControl(controlValue['parent_temp_job_id'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      repack_type: new FormControl(controlValue['repack_type'] || null),
      build_slot: new FormControl(controlValue['build_slot'] || null),
      index_no: new FormControl(controlValue['index_no'] || null),
      order_no: new FormControl(controlValue['order_no'] || null),
      ces_part_num: new FormControl(controlValue['ces_part_num'] || null),
      customer_partno: new FormControl(controlValue['customer_partno'] || null),
      assembly_type: new FormControl(controlValue['assembly_type'] || null),
      part_description: new FormControl(controlValue['part_description'] || null),
      drive_dependent_demand: new FormControl(Number(controlValue['drive_dependent_demand'])),
      customer_due_date: new FormControl(controlValue['customer_due_date'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      scheduled_qunatity: new FormControl(controlValue['scheduled_qunatity'] || null),
      remaining_quantity: new FormControl(controlValue['remaining_quantity'] || null),
      part_number_dept: new FormControl(controlValue['part_number_dept'] || null),
      part_num_planner_code: new FormControl(controlValue['part_num_planner_code'] || null),
      firsttime_runner: new FormControl(controlValue['firsttime_runner'] || null),
      diameter: new FormControl(controlValue['diameter'] || null),
      inlet_partno: new FormControl(controlValue['inlet_partno'] || null),
      outlet_partno: new FormControl(controlValue['outlet_partno'] || null),
      filter_partno: new FormControl(controlValue['filter_partno'] || null),
      mixer_partno: new FormControl(controlValue['mixer_partno'] || null),
      inlet_catmod: new FormControl(controlValue['inlet_catmod'] || null),
      outlet_catmod: new FormControl(controlValue['outlet_catmod'] || null),
      filter_catmod: new FormControl(controlValue['filter_catmod'] || null),
      fg_rack: new FormControl(controlValue['fg_rack'] || null),
      comments: new FormControl(controlValue['comments'] || null),
      last_updated_by: new FormControl(this.wwId),
    });
  }

  addTableControlsForModule(controlValue: any = {}) {
    return this.formBuilder.group({
      module_temp_job_id: new FormControl(controlValue['module_temp_job_id'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      inlet_ces_part_num: new FormControl(controlValue['inlet_ces_part_num'] || null),
      internal_customer: new FormControl(controlValue['internal_customer'] || null),
      drive_dependent_demand: new FormControl(Number(controlValue['drive_dependent_demand'])),
      part_description: new FormControl(controlValue['part_description'] || null),
      customer_due_date: new FormControl(controlValue['customer_due_date'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      run_date_service: new FormControl(controlValue['run_date_service'] || null),
      scheduled_qunatity: new FormControl(controlValue['scheduled_qunatity'] || null),
      remaining_quantity: new FormControl(controlValue['remaining_quantity'] || null),
      part_number_dept: new FormControl(controlValue['part_number_dept'] || null),
      part_num_planner_code: new FormControl(controlValue['part_num_planner_code'] || null),
      diameter: new FormControl(controlValue['diameter'] || null),
      inlet_catmod: new FormControl(controlValue['inlet_catmod'] || null),
      comments: new FormControl(controlValue['comments'] || null),
      last_updated_by: new FormControl(this.wwId),
    });
  }

  addTableControlsForChild(controlValue: any = {}) {
    return this.formBuilder.group({
      canning_temp_job_id: new FormControl(controlValue['canning_temp_job_id'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      ces_part_num_catmod: new FormControl(controlValue['ces_part_num_catmod'] || null),
      part_description: new FormControl(controlValue['part_description'] || null),
      customer_due_date: new FormControl(controlValue['customer_due_date'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      scheduled_qunatity: new FormControl(controlValue['scheduled_qunatity'] || null),
      remaining_quantity: new FormControl(controlValue['remaining_quantity'] || null),
      part_number_dept: new FormControl(controlValue['part_number_dept'] || null),
      part_num_planner_code: new FormControl(controlValue['part_num_planner_code'] || null),
      internal_customer: new FormControl(controlValue['internal_customer'] || null),
      canning_diameter: new FormControl(controlValue['canning_diameter'] || null),
      comments: new FormControl(controlValue['comments'] || null),
      last_updated_by: new FormControl(this.wwId),
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  async sortData(value: any) {
    if (value && value['direction']) {
      this.schedulerForm.patchValue({
        sortKey: value['active'],
        sortType: value['direction'],
      });
    } else {
      this.schedulerForm.patchValue({
        sortKey: 'run_date',
        sortType: 'desc',
      });
    }
    await this.getSchedulerTableData();
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  async selectedLine() {
    this.isfileSelected = false;
    const selectedLineId = this.schedulerForm.value['line_id'];
    const selectedLineDetail = this.manufacturingLine.filter(function (el) {
      return el.line_id == selectedLineId;
    });
    if (selectedLineDetail) {
      this.runscripflag = false;
      this.jobNumber = [];
      this.schedulerForm.patchValue({
        filter: {},
        is_parent: selectedLineDetail[0]['is_parent'],
        is_module: selectedLineDetail[0]['is_module'],
        is_canning: selectedLineDetail[0]['is_canning'],
        line_name: selectedLineDetail[0]['line_name'],
        limit: 0,
        pageNumber: 0,
        sortKey: 'run_date',
        sortType: 'desc',
      });
      let MFLine = {
        line_id: this.schedulerForm.value['line_id'],
        line_name: selectedLineDetail[0]['line_name'],
        is_parent: selectedLineDetail[0]['is_parent'],
        is_module: selectedLineDetail[0]['is_module'],
        is_canning: selectedLineDetail[0]['is_canning']

      }
      localStorage.setItem('selectedMFLine', JSON.stringify(MFLine));
      await this.getSchedulerTableData();
    }
  }

  runscriptFromdata() {
    const updatedTableData = this.schedulerTableForm.value['tableData'];
    const parentLine = this.schedulerForm.value['is_parent'];
    const moduleLine = this.schedulerForm.value['is_module'];
    const childLine = this.schedulerForm.value['is_canning'];
    let runscriptPayload = [];
    var job_ids = [];
    var job_num = [];
    if (this.selection['selected'] && this.selection['selected'].length > 0) {
      if (parentLine) {
        runscriptPayload = [];
        runscriptPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['parent_temp_job_id'] === o2['parent_temp_job_id']));
        runscriptPayload.forEach(data => {
          if (data['run_date'] != null && data['run_date'] != '' && data['run_date'] != undefined) {
            this.commonService.openSnackBar("selected record should be capsizing", "Error");
            this.selection.clear();
          } else {
            job_ids.push(data['parent_temp_job_id']);
            job_num.push(data['job_num'])
          }
        });
      } else if (moduleLine) {
        runscriptPayload = [];
        runscriptPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['module_temp_job_id'] === o2['module_temp_job_id']));
        runscriptPayload.forEach(data => {
          if (data['run_date'] != null && data['run_date'] != '' && data['run_date'] != undefined) {
            this.commonService.openSnackBar("selected record should be capsizing", "Error");
            this.selection.clear();
          } else {
            job_ids.push(data['module_temp_job_id']);
            job_num.push(data['job_num'])
          }
        });
      } else if (childLine) {
        runscriptPayload = [];
        runscriptPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['canning_temp_job_id'] === o2['canning_temp_job_id']));
        runscriptPayload.forEach(data => {
          if (data['run_date'] != null && data['run_date'] != '' && data['run_date'] != undefined) {
            this.commonService.openSnackBar("selected record should be capsizing", "Error");
            this.selection.clear();
          } else {
            job_ids.push(data['canning_temp_job_id']);
            job_num.push(data['job_num'])
          }
        });
      }
      const checkduplicatejob = new Set(job_num);
      if (job_num.length !== checkduplicatejob.size) {
        this.commonService.openSnackBar('Duplicate job numbers not allowed', "Error");
      } else {
        let scriptpayload = {
          "job_ids": job_ids,
          "job_numbers": job_num,
          "line_id": this.schedulerForm.value['line_id'],
          "line_name": this.schedulerForm.value['line_name'],
          "user": this.wwId
        }
        if (scriptpayload.job_numbers[0] != null) {
          if (scriptpayload.job_numbers[0] != "") {
            this.commonService.runScriptdata(scriptpayload).toPromise().then(async (res) => {
              if ((res['status'].toLowerCase()) == 'success') {
                this.commonService.openSnackBar(res['message'], "Success");
                this.selection.clear();
              } else {
                this.commonService.openSnackBar(res['message'], "Error");
              }
            }).catch(err => {
              this.commonService.openSnackBar("Server Error! Please try again.", "Error");
            });
          } else {
            this.commonService.openSnackBar("Please input job number to run script.", "Error");
          }
        } else {
          this.commonService.openSnackBar("Please input job number to run script.", "Error");
        }
      }
    } else {
      this.commonService.openSnackBar("Please select the table data to do this action.", "Error");
    }
  }

  saveData(actionType) {

    const updatedTableData = this.schedulerTableForm.value['tableData'];
    const parentLine = this.schedulerForm.value['is_parent'];
    const moduleLine = this.schedulerForm.value['is_module'];
    const childLine = this.schedulerForm.value['is_canning'];

    let lockdata = [];
    let saveRequestPayload = [];
    let lineType = '';
    const selectedIds = [];
    const selectedJobNumbers = [];
    let finalPayload = { records: [] };
    let lockpayload = {};
    let publishpaylod = {};

    if (this.selection['selected'] && this.selection['selected'].length > 0) {

      if (parentLine) {
        saveRequestPayload = [];
        finalPayload['records'] = [];
        saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['parent_temp_job_id'] === o2['parent_temp_job_id']));
        lineType = 'parent';

        saveRequestPayload.forEach(data => {
          if (actionType === 'publish') {
            if (data['job_num'] != null && data['job_num'] != '' && data['job_num'] != undefined) {
              selectedIds.push(data['parent_temp_job_id']);
            } else {
              actionType = "unpublish";
              this.commonService.openSnackBar("Job number should not be empty", "Error");
            }
          } else {
            selectedIds.push(data['parent_temp_job_id']);
            selectedJobNumbers.push(data['job_num']);
          }
          finalPayload['records'].push({
            job_num: data['job_num'],
            ces_part_num: data['ces_part_num'],
            parent_temp_job_id: data['parent_temp_job_id'],
            drive_dependent_demand: data['drive_dependent_demand'],
            customer_due_date: data['customer_due_date'],
            comments: data['comments'],
            customer_partno: data['customer_partno'],
            mixer_partno: data['mixer_partno'],
            inlet_catmod: data['inlet_catmod'],
            outlet_catmod: data['outlet_catmod'],
            filter_catmod: data['filter_catmod'],
            order_no: data['order_no'],
            last_updated_by: this.wwId,
          });
        });
        if (actionType === 'publish') {
          publishpaylod = {
            "parent_job_ids": selectedIds
          }
        }

      } else if (moduleLine) {
        lockdata = this.selection['selected'];
        saveRequestPayload = [];
        finalPayload['records'] = [];
        saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['module_temp_job_id'] === o2['module_temp_job_id']));
        lineType = 'module';

        saveRequestPayload.forEach(data => {
          if (actionType === 'publish') {
            if (data['job_num'] != null && data['job_num'] != '' && data['job_num'] != undefined) {
              selectedIds.push(data['module_temp_job_id']);
            } else {
              actionType = "unpublish";
              this.commonService.openSnackBar("Job number should not be empty", "Error");
            }

          } else {
            selectedIds.push(data['module_temp_job_id']);
            selectedJobNumbers.push(data['job_num']);
          }
          finalPayload['records'].push({
            module_temp_job_id: data['module_temp_job_id'],
            comments: data['comments'],
            job_num: data['job_num'],
            inlet_ces_part_num: data['inlet_ces_part_num'],
            drive_dependent_demand: data['drive_dependent_demand'],
            customer_due_date: data['customer_due_date'],
            last_updated_by: this.wwId
          });
        });

        if (actionType === 'lock') {
          let checkislock = lockdata.some(function (data) {
            return data['lock'] === 1 || data['created_by'] != null
          });

          if (checkislock) {
            actionType = "unlock";
            this.commonService.openSnackBar("Please select the appropriate jobs to lock. Selected jobs are already locked or can't be locked by you!", "Error");
            this.getSchedulerTableData();
          }

          lockpayload = {
            "module_temp_job_ids": selectedIds,
            "locked_by": this.wwId
          }
        }

        if (actionType === 'publish') {
          publishpaylod = {
            "module_job_ids": selectedIds
          }
        }

      } else if (childLine) {
        lockdata = this.selection['selected'];

        saveRequestPayload = [];
        finalPayload['records'] = [];
        saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['canning_temp_job_id'] === o2['canning_temp_job_id']));
        lineType = 'canning';

        saveRequestPayload.forEach(data => {
          if (actionType === 'publish') {
            if (data['job_num'] != null && data['job_num'] != '' && data['job_num'] != undefined) {
              selectedIds.push(data['canning_temp_job_id']);
            } else {
              actionType = "unpublish";
              this.commonService.openSnackBar("Job number should not be empty", "Error");
            }

          } else {
            selectedIds.push(data['canning_temp_job_id']);
            selectedJobNumbers.push(data['job_num']);
          }
          finalPayload['records'].push({
            job_num: data['job_num'],
            canning_temp_job_id: data['canning_temp_job_id'],
            comments: data['comments'],
            customer_due_date: data['customer_due_date'],
            ces_part_num_catmod: data['ces_part_num_catmod'],
            last_updated_by: this.wwId
          });
        });

        if (actionType === 'lock') {
          let checkislock = lockdata.some(function (data) {
            return data['lock'] === 1 || data['created_by'] != null
          });

          if (checkislock) {
            actionType = "unlock";
            this.commonService.openSnackBar("Please select the appropriate jobs to lock. Selected jobs are already locked or can't be locked by you!", "Error");
            this.getSchedulerTableData();
          }
          lockpayload = {
            "canning_temp_job_ids": selectedIds,
            "locked_by": this.wwId
          }
        }

        if (actionType === 'publish') {
          publishpaylod = {
            "canning_job_ids": selectedIds

          }
        }
      } else {
        saveRequestPayload = [];
        finalPayload['records'] = [];
        lockpayload = {};
        publishpaylod = {};
      }

      if (actionType === 'delete' && selectedIds && selectedIds.length > 0 &&
        selectedJobNumbers && selectedJobNumbers.length > 0) {
        const deleteDialog = this.dialog.open(AlertDialogBoxComponent, {
          width: '400px',
          data: {
            title: 'Confirm',
            content: `Are you sure <br> you want to delete selected data?`,
            type: "COPY"
          },
          disableClose: false
        });

        deleteDialog.afterClosed().subscribe((result) => {
          if (result && (result == 'Yes' || result == 'yes')) {
            this.commonService.deleteSchedulerData(selectedIds, lineType, selectedJobNumbers.toString()).toPromise().then(async (res) => {
              if ((res['data']['status'].toLowerCase()) == 'success') {
                await this.getSchedulerTableData();
                this.commonService.openSnackBar(res['data']['message'], "Success");
              } else {
                this.commonService.openSnackBar(res['data']['message'], "Error");
              }
            }).catch(err => {
              this.commonService.openSnackBar("Server Error! Please try again.", "Error");
            });
            saveRequestPayload = [];
            finalPayload['records'] = [];
          } else {
            finalPayload['records'] = [];
            saveRequestPayload = [];
          }
        })

      } else if (actionType === 'save' && finalPayload && finalPayload['records'].length > 0) {
        finalPayload['records'].forEach(element => {
          if (element['customer_due_date']) {
            let due_date = this.datePipe.transform(element['customer_due_date'], 'yyyy-MM-dd');
            element['customer_due_date'] = due_date;
          }
        });

        const editDialog = this.dialog.open(AlertDialogBoxComponent, {
          width: '400px',
          data: {
            title: 'Confirm',
            content: `Are you sure <br> you want to save changes for selected data?`,
            type: "COPY"
          },
          disableClose: false
        });
        editDialog.afterClosed().subscribe((result) => {
          if (result && (result == 'Yes' || result == 'yes')) {
            if (moduleLine || childLine) {
              const checkduplicatejob = new Set(selectedJobNumbers);
              if (selectedJobNumbers.length !== checkduplicatejob.size) {
                this.commonService.openSnackBar('Duplicate job numbers not allowed', "Error");
              } else {
                this.commonService.saveSchedulerData(finalPayload).toPromise().then(async (res) => {
                  if ((res['data']['status'].toLowerCase()) == 'success') {
                    this.commonService.openSnackBar(res['data']['message'], "Success");
                    await this.getSchedulerTableData();
                  } else {
                    this.commonService.openSnackBar(res['data']['message'], "Error");
                  }
                }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
                saveRequestPayload = [];
                finalPayload['records'] = [];
              }
            } else {
              this.commonService.saveSchedulerData(finalPayload).toPromise().then(async (res) => {
                if ((res['data']['status'].toLowerCase()) == 'success') {
                  this.commonService.openSnackBar(res['data']['message'], "Success");
                  await this.getSchedulerTableData();
                } else {
                  this.commonService.openSnackBar(res['data']['message'], "Error");
                }
              }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
              saveRequestPayload = [];
              finalPayload['records'] = [];
            }
          } else {
            saveRequestPayload = [];
            finalPayload['records'] = [];
          }
        });
      } else if (actionType === 'lock' && selectedIds && selectedIds.length > 0) {
        const lockDialog = this.dialog.open(AlertDialogBoxComponent, {
          width: '400px',
          data: {
            title: 'Confirm',
            content: `Are you sure <br> you want to lock selected data?`,
            type: "COPY"
          },
          disableClose: false
        });

        lockDialog.afterClosed().subscribe((result) => {
          if (result && (result == 'Yes' || result == 'yes')) {

            this.commonService.lockSchedulerData(lockpayload).toPromise().then(async (res) => {
              if ((res['status'].toLowerCase()) == 'success') {
                await this.getSchedulerTableData();
                this.commonService.openSnackBar(res['message'], "Success");
              } else {
                this.commonService.openSnackBar(res['message'], "Error");
              }
            }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
            saveRequestPayload = [];
            finalPayload['records'] = [];
          } else {
            finalPayload['records'] = [];
            saveRequestPayload = [];
          }
        })

      } else if (actionType === 'publish' && selectedIds && selectedIds.length > 0) {
        const lockDialog = this.dialog.open(AlertDialogBoxComponent, {
          width: '400px',
          data: {
            title: 'Confirm',
            content: `Are you sure <br> you want to publish selected data?`,
            type: "COPY"
          },
          disableClose: false
        });

        lockDialog.afterClosed().subscribe((result) => {
          if (result && (result == 'Yes' || result == 'yes')) {

            this.commonService.publishSchedulerData(publishpaylod).toPromise().then(async (res) => {
              if ((res['status'].toLowerCase()) == 'success') {
                await this.getSchedulerTableData();
                this.commonService.openSnackBar(res['message'], "Success");
              } else {
                this.commonService.openSnackBar(res['message'], "Error");
              }
            }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
            saveRequestPayload = [];
            finalPayload['records'] = [];
          } else {
            finalPayload['records'] = [];
            saveRequestPayload = [];
          }
        })

      }
    } else {
      this.commonService.openSnackBar("Please select the table data to do this action.", "Error");
    }
  }

  getSchedulerTableData() {
    return new Promise((resolve, reject) => {
      this.selection.clear();
      this.tableColumns = [];
      this.dataSource = new MatTableDataSource<any>([]);
      const finalFormData = { ...this.schedulerForm.value };
      delete finalFormData['uploadFileOption'];
      if (finalFormData['line_id'] !== '' || finalFormData['line_id']) {
        this.commonService.getSchedulerData(finalFormData).toPromise().then(response => {
          if (response) {
            this.newtableData = response;
            this.tableColumns = this.tableColumns.concat(this.newtableData['col'].map(x => x.columnDef));
            this.dataSource = new MatTableDataSource<any>(this.newtableData['routes']);

            if (this.newtableData && this.newtableData['routes'].length > 0) {
              this.tableColumns.unshift('select');
              this.norecord = false;
              this.schedulerTableForm.setControl('tableData', new FormArray([]));
              this.newtableData['routes'].forEach(schedulerData => {
                if (this.schedulerForm.value['is_parent']) {
                  this.tableData.push(this.addTableControlsForParent(schedulerData));
                } else if (this.schedulerForm.value['is_module']) {
                  this.tableData.push(this.addTableControlsForModule(schedulerData));
                } else if (this.schedulerForm.value['is_canning']) {
                  this.tableData.push(this.addTableControlsForChild(schedulerData));
                }
              });
              resolve(200);
            } else {
              this.norecord = true;
              this.schedulerTableForm.setControl('tableData', new FormArray([]));
              resolve(200);
            }
          } else {
            resolve(200);
            this.newtableData = {};
            this.norecord = true;
            this.schedulerTableForm.setControl('tableData', new FormArray([]));
          }
        }).catch(err => {
          this.commonService.openSnackBar("Server Error! Please try again.", "Error");
          resolve(200);
        })
      } else {
        resolve(200);
      }
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

    this.schedulerForm.patchValue({
      action: btnType
    });

    let Payload = this.schedulerForm.value;
    this.commonService.getSchedulerData(Payload).toPromise().then(res => {
      if (res && res['url'] && btnType == 'export-to-excel') {
        var fileLink = document.createElement('a');
        fileLink.style.display = "hidden";
        fileLink.href = res['url'];
        fileLink.click();
        fileLink.remove();
        this.schedulerForm.patchValue({
          action: ''
        });
      }
      if (res && res['status'] && btnType == 'export-to-email' && (res['status'].toLowerCase()) == 'success') {
        this.commonService.openSnackBar(res['message'], "Success");
        this.schedulerForm.patchValue({
          action: ''
        });
      } else {
        this.commonService.openSnackBar(res['message'], "Error");
        this.schedulerForm.patchValue({
          action: ''
        });
      }
    }).catch(err => {
      this.schedulerForm.patchValue({
        action: ''
      });
      this.commonService.openSnackBar("Server Error! Please try again.", "Error");
    });
  }

}
