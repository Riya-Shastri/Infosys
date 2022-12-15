import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ScrollToService, ScrollToConfigOptions, } from '@nicky-lenaers/ngx-scroll-to';
import { JobFlowComponent } from '../job-flow/job-flow.component';
@Component({
  selector: 'app-scheduler-final',
  templateUrl: './scheduler-final.component.html',
  styleUrls: ['./scheduler-final.component.scss']
})

export class SchedulerFinalComponent implements OnInit {

  componentName = 'schedulerFinal';
  schedulerFinalForm: FormGroup;
  schedulerFinalTableForm: FormGroup;
  files: NgxFileDropEntry[] = [];
  mfline: any;
  manufacturingLine = [];
  newtableData = {};
  tableColumns = [];
  dataSource: any = [];
  selection = new SelectionModel<any>(true, []);
  wwId = '';
  favoriteLines = [];
  userRole = '';
  norecord = false;
  isfilterApplied = false;
  isAccessflag = false;
  previousTableData = [];
  isDarkTheme = false;
  MfLineName: any;
  @ViewChild('keywordsInput') dialogContent: ElementRef;
  scrollPosition: any;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private masterDataService: MasterAPIService,
    private readonly scrollToService: ScrollToService
  ) {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark-theme' ? this.isDarkTheme = true : this.isDarkTheme = false;
    }
    this.scrollPosition = JSON.parse(localStorage.getItem('scrollPosition') || '{}');
    //this.scrollPosition = 107;
  }

  async ngOnInit() {
    await this.initFormGroup();
    this.initTableFormGroup();
    await this.getManufacturingLine();
    //--- scroll position started-------
    let dialogElement = this.dialogContent.nativeElement as HTMLElement;
    dialogElement.onscroll = () => {
      this.scrollPosition = dialogElement.scrollTop;
      localStorage.setItem('scrollPosition', JSON.stringify(dialogElement.scrollTop));
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
      if (this.userRole && this.userRole.length > 0 &&
        (this.userRole.includes('CMP-User-Admin')) ||
        this.userRole.includes('CMP-Scheduler') ||
        this.userRole.includes('CMP-Materials')) {
        this.isAccessflag = true;
      } else {
        this.isAccessflag = false;
      }

      this.schedulerFinalForm = this.formBuilder.group({
        limit: new FormControl(0),
        user: new FormControl(this.wwId),
        role: new FormControl(this.userRole),
        pageNumber: new FormControl(0),
        sortKey: new FormControl('run_date'),
        sortType: new FormControl('asc'),
        line_id: new FormControl(''),
        line_name: new FormControl(''),
        is_parent: new FormControl(1),
        is_module: new FormControl(0),
        is_canning: new FormControl(0),
        action: new FormControl(''),
        filter: new FormControl({}),

      });

      if (this.MfLineName['line_id']) {
        this.schedulerFinalForm.patchValue({
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
    return this.schedulerFinalForm.controls;
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
            await this.getSchedulerFinalTableData();
          } else {
            if (this.favoriteLines && this.favoriteLines.length > 0) {
              this.schedulerFinalForm.patchValue({
                line_id: this.favoriteLines[0]['line_id'],
                line_name: this.favoriteLines[0]['line_name'],
                is_parent: this.favoriteLines[0]['is_parent'],
                is_module: this.favoriteLines[0]['is_module'],
                is_canning: this.favoriteLines[0]['is_canning']
              });
              await this.getSchedulerFinalTableData();
            } else {
              await this.getSchedulerFinalTableData();
            }
          }
        } else {
          this.manufacturingLine = [];
          this.schedulerFinalTableForm.setControl('tableData', new FormArray([]));
        }
        resolve(200);
      }).catch(err => {
        this.manufacturingLine = [];
        this.schedulerFinalTableForm.setControl('tableData', new FormArray([]));
        this.commonService.openSnackBar("Server Error", "Error");
        resolve(200);
      });
    });
  }

  async favoriteBtnClick(obj) {
    this.schedulerFinalForm.patchValue({
      is_canning: obj['is_canning'],
      is_module: obj['is_module'],
      is_parent: obj['is_parent'],
      line_id: obj['line_id'],
      line_name: obj['line_name'],
      limit: 0,
      pageNumber: 0,
      sortKey: 'run_date',
      sortType: 'asc',
      filter: {}
    });
    let MFLine = {
      line_id: this.schedulerFinalForm.value['line_id'],
      line_name: this.schedulerFinalForm.value['line_name'],
      is_canning: obj['is_canning'],
      is_module: obj['is_module'],
      is_parent: obj['is_parent']
    }
    localStorage.setItem('selectedMFLine', JSON.stringify(MFLine));
    this.commonService.setClearFilterAction('reset');
    await this.getSchedulerFinalTableData();
  }

  getselectedLine(mfline_name: any) {
    this.schedulerFinalForm.patchValue({
      line_name: mfline_name,
      filter: {}
    });
    this.commonService.setClearFilterAction('reset');
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
        this.isfilterApplied = false;
        this.schedulerFinalForm.value['filter'] = {};
        this.schedulerFinalForm.patchValue({
          filter: {}
        });
      } else {
        this.isfilterApplied = true;
        const parentLine = this.schedulerFinalForm.value['is_parent'];
        const moduleLine = this.schedulerFinalForm.value['is_module'];
        const canningLine = this.schedulerFinalForm.value['is_canning'];
        let csPartValue = event['ces_part_num_catmod'];
        if (csPartValue) {
          if (parentLine) {
            event['ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.schedulerFinalForm.value['line_name']).trim() === 'M-1000') {
            event['inlet_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.schedulerFinalForm.value['line_name']).trim() === 'M-1100') {
            event['outlet_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.schedulerFinalForm.value['line_name']).trim() === 'M-1200') {
            event['filter_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.schedulerFinalForm.value['line_name']).trim() === 'M-1300') {
            event['mixer_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (canningLine) {
            event['ces_part_num_catmod'] = csPartValue;
          }
        }
        this.schedulerFinalForm.patchValue({
          filter: event
        });
      }
      await this.getSchedulerFinalTableData();
    }
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
          // await this.getManufacturingLine();
        }
      }
    });
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
    this.schedulerFinalTableForm = this.formBuilder.group({
      tableData: this.formBuilder.array([])
    });
  }

  get tableData(): FormArray {
    return this.schedulerFinalTableForm.get('tableData') as FormArray;
  }

  addTableControlsForParent(controlValue: any = {}) {
    return this.formBuilder.group({
      assembly_type: new FormControl(controlValue['assembly_type'] || null),
      audit: new FormControl(controlValue['audit'] || null),
      catmod_no_singlebody: new FormControl(controlValue['catmod_no_singlebody'] || null),
      ces_part_no_flat: new FormControl(controlValue['ces_part_no_flat'] || null),
      customer_partno: new FormControl(controlValue['customer_partno'] || null),
      ces_part_no_rolledbody: new FormControl(controlValue['ces_part_no_rolledbody'] || null),
      ces_part_num: new FormControl(controlValue['ces_part_num'] || null),
      coin: new FormControl(controlValue['coin'] || null),
      comments: new FormControl(controlValue['comments'] || null),
      customer_due_date: new FormControl(controlValue['customer_due_date'] || null),
      cut: new FormControl(controlValue['cut'] || null),
      diameter: new FormControl(controlValue['diameter'] || null),
      drive_dependent_demand: new FormControl(Number(controlValue['drive_dependent_demand']) || 1),
      fg_rack: new FormControl(controlValue['fg_rack'] || null),
      filter_catmod: new FormControl(controlValue['filter_catmod'] || null),
      filter_partno: new FormControl(controlValue['filter_partno'] || null),
      firsttime_runner: new FormControl(controlValue['firsttime_runner'] || null),
      index_no: new FormControl(controlValue['index_no']),
      inlet_catmod: new FormControl(controlValue['inlet_catmod'] || null),
      inlet_partno: new FormControl(controlValue['inlet_partno'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      last_updated_by: new FormControl(this.wwId || null),
      last_updated_date: new FormControl(controlValue['last_updated_date'] || null),
      lucas: new FormControl(controlValue['lucas'] || null),
      manual_roll: new FormControl(controlValue['manual_roll'] || null),
      material_gauge: new FormControl(controlValue['material_gauge'] || null),
      mixer_partno: new FormControl(controlValue['mixer_partno'] || null),
      order_no: new FormControl(controlValue['order_no'] || null),
      outlet_catmod: new FormControl(controlValue['outlet_catmod'] || null),
      outlet_partno: new FormControl(controlValue['outlet_partno'] || null),
      parent_job_id: new FormControl(controlValue['parent_job_id'] || null),
      part_description: new FormControl(controlValue['part_description'] || null),
      part_num_planner_code: new FormControl(controlValue['part_num_planner_code'] || null),
      part_number_dept: new FormControl(controlValue['part_number_dept'] || null),
      remaining_quantity: new FormControl(controlValue['remaining_quantity'] || null),
      repack_type: new FormControl(controlValue['repack_type'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      scheduled_qunatity: new FormControl((controlValue['scheduled_qunatity'] == 0) ? 0 :
        (controlValue['scheduled_qunatity']) ? controlValue['scheduled_qunatity'] : null),
      sheet_steel: new FormControl(controlValue['sheet_steel'] || null),
      size: new FormControl(controlValue['size'] || null),
      stamp: new FormControl(controlValue['stamp'] || null),
      sequence: new FormControl(controlValue['sequence'] || null),
      is_published_finaldb: new FormControl(controlValue['is_published_finaldb'] || null),
      weld: new FormControl(controlValue['weld'] || null),
    });
  }

  addTableControlsForModule(controlValue: any = {}) {
    return this.formBuilder.group({
      customer_due_date: new FormControl(controlValue['customer_due_date'] || null),
      comments: new FormControl(controlValue['comments'] || null),
      diameter: new FormControl(controlValue['diameter'] || null),
      drive_dependent_demand: new FormControl(Number(controlValue['drive_dependent_demand']) || null),
      filter_catmod: new FormControl(controlValue['filter_catmod'] || null),
      inlet_catmod: new FormControl(controlValue['inlet_catmod'] || null),
      inlet_ces_part_num: new FormControl(controlValue['inlet_ces_part_num'] || null),
      internal_customer: new FormControl(controlValue['internal_customer'] || null),
      is_runscript: new FormControl(controlValue['is_runscript'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      last_updated_by: new FormControl(this.wwId || null),
      last_updated_date: new FormControl(controlValue['last_updated_date'] || null),
      lock: new FormControl(controlValue['lock'] || null),
      locked_at: new FormControl(controlValue['locked_at'] || null),
      locked_by: new FormControl(controlValue['locked_by'] || null),
      module_job_id: new FormControl(controlValue['module_job_id'] || null),
      outlet_catmod: new FormControl(controlValue['outlet_catmod'] || null),
      parent_job_ids: new FormControl(controlValue['parent_job_ids'] || null),
      part_description: new FormControl(controlValue['part_description'] || null),
      part_num_planner_code: new FormControl(controlValue['part_num_planner_code'] || null),
      part_number_dept: new FormControl(controlValue['part_number_dept'] || null),
      remaining_quantity: new FormControl(controlValue['remaining_quantity'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      sequence: new FormControl(controlValue['sequence'] || null),
      is_published_finaldb: new FormControl(controlValue['is_published_finaldb'] || null),
      is_cancelled: new FormControl(controlValue['is_cancelled'] || 0),
      run_date_service: new FormControl(controlValue['run_date_service'] || null),
      edit_scheduled_qunatity: new FormControl(controlValue['edit_scheduled_qunatity'] || 0),
      scheduled_qunatity: new FormControl((controlValue['scheduled_qunatity'] == 0) ? 0 :
        (controlValue['scheduled_qunatity']) ? controlValue['scheduled_qunatity'] : null),
    });
  }

  addTableControlsForChild(controlValue: any = {}) {
    return this.formBuilder.group({
      canning_diameter: new FormControl(controlValue['canning_diameter'] || null),
      comments: new FormControl(controlValue['comments'] || null),
      canning_job_id: new FormControl(controlValue['canning_job_id'] || null),
      ces_part_num_catmod: new FormControl(controlValue['ces_part_num_catmod'] || null),
      customer_due_date: new FormControl(controlValue['customer_due_date'] || null),
      internal_customer: new FormControl(controlValue['internal_customer'] || null),
      is_moved: new FormControl(controlValue['is_moved'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      last_updated_by: new FormControl(this.wwId || null),
      last_updated_date: new FormControl(controlValue['last_updated_date'] || null),
      length: new FormControl(controlValue['length'] || null),
      lock: new FormControl(controlValue['lock'] || null),
      locked_at: new FormControl(controlValue['locked_at'] || null),
      locked_by: new FormControl(controlValue['locked_by'] || null),
      module_job_ids: new FormControl(controlValue['module_job_ids'] || null),
      parent_job_ids: new FormControl(controlValue['parent_job_ids'] || null),
      part_description: new FormControl(controlValue['part_description'] || null),
      part_num_planner_code: new FormControl(controlValue['part_num_planner_code'] || null),
      part_number_dept: new FormControl(controlValue['part_number_dept'] || null),
      remaining_quantity: new FormControl(controlValue['remaining_quantity'] || null),
      run_date: new FormControl(controlValue['run_date'] || null),
      scheduled_qunatity: new FormControl((controlValue['scheduled_qunatity'] == 0) ? 0 :
        (controlValue['scheduled_qunatity']) ? controlValue['scheduled_qunatity'] : null),
      edit_scheduled_qunatity: new FormControl(controlValue['edit_scheduled_qunatity'] || 0),
      sequence: new FormControl(controlValue['sequence'] || null),
      is_cancelled: new FormControl(controlValue['is_cancelled'] || 0),
      is_published_finaldb: new FormControl(controlValue['is_published_finaldb'] || null),
      style_no: new FormControl(controlValue['style_no'] || null),
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

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  async selectedLine() {

    const selectedLineId = this.schedulerFinalForm.value['line_id'];
    const selectedLineDetail = this.manufacturingLine.filter(function (el) {
      return el.line_id == selectedLineId;
    });
    if (selectedLineDetail) {
      this.schedulerFinalForm.patchValue({
        filter: {},
        is_parent: selectedLineDetail[0]['is_parent'],
        is_module: selectedLineDetail[0]['is_module'],
        is_canning: selectedLineDetail[0]['is_canning'],
        line_name: selectedLineDetail[0]['line_name'],
      });
      let MFLine = {
        line_id: this.schedulerFinalForm.value['line_id'],
        line_name: selectedLineDetail[0]['line_name'],
        is_parent: selectedLineDetail[0]['is_parent'],
        is_module: selectedLineDetail[0]['is_module'],
        is_canning: selectedLineDetail[0]['is_canning']

      }
      localStorage.setItem('selectedMFLine', JSON.stringify(MFLine));
      await this.getSchedulerFinalTableData();
    }
  }

  saveData(actionType) {

    const updatedTableData = this.schedulerFinalTableForm.value['tableData'];
    const parentLine = this.schedulerFinalForm.value['is_parent'];
    const moduleLine = this.schedulerFinalForm.value['is_module'];
    const childLine = this.schedulerFinalForm.value['is_canning'];
    const lineId = this.schedulerFinalForm.value['line_id'];
    const lineName = this.schedulerFinalForm.value['line_name'];

    let saveRequestPayload = [];
    let lineType = '';
    let jobNumbers = '';
    const selectedIds = [];
    let isPublishArr = [];
    // let checkDelete = [];
    let finalPayload = { line_name: '', records: [] };

    if (this.selection['selected'] && this.selection['selected'].length > 0) {
      if (parentLine) {

        saveRequestPayload = [];
        finalPayload['records'] = [];
        saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['parent_job_id'] === o2['parent_job_id']));
        lineType = 'parent';

        saveRequestPayload.forEach((data, index) => {

          let is_impact_flag = 0;
          let getPrevioudDataIndex = this.previousTableData.map(
            function (element) { return element.parent_job_id; }).indexOf(data['parent_job_id']);
          let preScheduledQua = this.previousTableData[getPrevioudDataIndex]['scheduled_qunatity'];

          if (preScheduledQua !== data['scheduled_qunatity'] && data['edit_scheduled_qunatity'] == 0 && data['is_cancelled'] == 0) {
            is_impact_flag = 1;
          } else {
            is_impact_flag = 0;
          }

          selectedIds.push(data['parent_job_id']);
          isPublishArr.push(data['is_published_finaldb']);

          jobNumbers += (saveRequestPayload.length) - 1 !== index ? `${data['job_num']},` : `${data['job_num']}`;

          finalPayload['records'].push({
            comments: data['comments'],
            is_cancelled: 0,
            customer_partno: data['customer_partno'],
            job_number: data['job_num'],
            last_updated_by: this.wwId,
            parent_job_id: data['parent_job_id'],
            scheduled_qunatity: data['scheduled_qunatity'],
            impact_flag: is_impact_flag
          });
        });

      } else if (moduleLine) {

        saveRequestPayload = [];
        finalPayload['records'] = [];
        saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['module_job_id'] === o2['module_job_id']));
        lineType = 'module';
console.log(saveRequestPayload,'save payload')
        saveRequestPayload.forEach((data, index) => {
          let is_impact_flag;
          // let edit_canning_flag = 0;
          let getPrevioudDataIndex = this.previousTableData.map(
            function (element) { return element.module_job_id; }).indexOf(data['module_job_id']);
          let preScheduledQua = this.previousTableData[getPrevioudDataIndex]['scheduled_qunatity'];

          // if (preScheduledQua !== data['scheduled_qunatity'] && data['is_cancelled'] === 1) {
          //   data['is_cancelled'] = 0;
          // }

          // if (preScheduledQua !== data['scheduled_qunatity'] && data['edit_scheduled_qunatity'] === 1) {
          //   data['edit_scheduled_qunatity'] = 0;
          //   edit_canning_flag = 1;
          // } else if (preScheduledQua !== data['scheduled_qunatity'] &&
          //   (data['edit_scheduled_qunatity'] === 0 || !data['edit_scheduled_qunatity'])) {
          //   data['edit_scheduled_qunatity'] = 1;
          //   edit_canning_flag = 1;
          // }

          if (preScheduledQua !== data['scheduled_qunatity'] && data['edit_scheduled_qunatity'] == 0 && data['is_cancelled'] == 0) {
            is_impact_flag = 1;
          } else {
            is_impact_flag = 0;
          }

          selectedIds.push(data['module_job_id']);
          isPublishArr.push(data['is_published_finaldb']);
          jobNumbers += (saveRequestPayload.length) - 1 !== index ? `${data['job_num']},` : `${data['job_num']}`;

          finalPayload['records'].push({
            comments: data['comments'],
            is_cancelled: 0,
            last_updated_by: this.wwId,
            module_job_id: data['module_job_id'],
            scheduled_qunatity: data['scheduled_qunatity'],
            job_number: data['job_num'],
            impact_flag: is_impact_flag
          });

        });
      } else if (childLine) {

        saveRequestPayload = [];
        finalPayload['records'] = [];
        saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['canning_job_id'] === o2['canning_job_id']));
        lineType = 'canning';

        saveRequestPayload.forEach((data, index) => {
          let is_impact_flag;
          let getPrevioudDataIndex = this.previousTableData.map(
            function (element) { return element.canning_job_id; }).indexOf(data['canning_job_id']);
          let preScheduledQua = this.previousTableData[getPrevioudDataIndex]['scheduled_qunatity'];

          // if (preScheduledQua !== data['scheduled_qunatity'] &&
          //   (data['is_cancelled'] === 1 || data['edit_scheduled_qunatity'])) {
          //   data['is_cancelled'] = 0;
          //   data['edit_scheduled_qunatity'] = 0;
          // }
          if (preScheduledQua !== data['scheduled_qunatity'] && data['edit_scheduled_qunatity'] == 0 && data['is_cancelled'] == 0) {
            is_impact_flag = 1;
          } else {
            is_impact_flag = 0;
          }
          selectedIds.push(data['canning_job_id']);
          isPublishArr.push(data['is_published_finaldb']);
          jobNumbers += (saveRequestPayload.length) - 1 !== index ? `${data['job_num']},` : `${data['job_num']}`;

          finalPayload['records'].push({
            comments: data['comments'],
            canning_job_id: data['canning_job_id'],
            is_cancelled: 0,
            scheduled_qunatity: data['scheduled_qunatity'],
            last_updated_by: 0,
            job_number: data['job_num'],
            impact_flag: is_impact_flag
          });
        });

      } else {
        saveRequestPayload = [];
        finalPayload['records'] = [];
      }

      if (actionType === 'delete' && selectedIds && selectedIds.length > 0) {
        var deleteSelected = [];
        this.selection['selected'].forEach( data=> {
          if(data['job_status'] !== 'Not-Started' ){      
            deleteSelected.push(data['job_num'])
          }  
        }); 
        if (parentLine) {
          if(deleteSelected.length > 0){            
            this.commonService.openSnackBar(deleteSelected +" can't be delete","Error") 
          }
          else{
          const deleteDialog = this.dialog.open(AlertDialogBoxComponent, {
            width: '400px',
            data: {
              title: 'Confirm',
              content: `
              Kindly note any unsaved sequencing will be lost if you proceed further. <br>
              Do you want to continue and delete selected data ?`,
              type: "COPY"
            },
            disableClose: false
          });
          deleteDialog.afterClosed().subscribe((result) => {
            const selectedLine = this.schedulerFinalForm.value['line_name'];
            if (result && (result == 'Yes' || result == 'yes')) {
              let recreate = 'NO';
              this.commonService.deleteSchedulerFinalData(selectedIds, lineType, jobNumbers, recreate, selectedLine).toPromise().then(async (res) => {
                if ((res['data']['status'].toLowerCase()) == 'success') {
                  await this.getSchedulerFinalTableData();
                  this.commonService.openSnackBar(res['data']['message'], "Success");
                } else {
                  this.commonService.openSnackBar(res['data']['message'], "Error");
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
          if(deleteSelected.length > 0){
            this.commonService.openSnackBar(deleteSelected +" can't be delete","Error") 
          }
          else{
          const deleteDialog = this.dialog.open(AlertDialogBoxComponent, {
            width: '400px',
            data: {
              title: 'ConfirmDelete',
              content: `
      If you want to delete and re-create the job in <br>Scheduler Dashboard,click Re-Create. Else click Yes, if you are sure to Delete the Job or <br> click Cancel to close the popup. 
     `,
              type: "DELETE"
            },
            disableClose: false
          });
          deleteDialog.afterClosed().subscribe((result) => {
            const selectedLine = this.schedulerFinalForm.value['line_name'];
            if (result && (result == 'Yes' || result == 'yes')) {
              let recreate = 'NO';
              this.commonService.deleteSchedulerFinalData(selectedIds, lineType, jobNumbers, recreate, selectedLine).toPromise().then(async (res) => {
                if ((res['data']['status'].toLowerCase()) == 'success') {
                  await this.getSchedulerFinalTableData();
                  this.commonService.openSnackBar(res['data']['message'], "Success");
                } else {
                  this.commonService.openSnackBar(res['data']['message'], "Error");
                }
              }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
              saveRequestPayload = [];
              finalPayload['records'] = [];
            } else if (result && (result == 'Recreate' || result == 'recreate')) {
              let recreate = 'YES';
              this.commonService.deleteSchedulerFinalData(selectedIds, lineType, jobNumbers, recreate, selectedLine).toPromise().then(async (res) => {
                if ((res['data']['status'].toLowerCase()) == 'success') {
                  await this.getSchedulerFinalTableData();
                  this.commonService.openSnackBar(res['data']['message'], "Success");
                } else {
                  this.commonService.openSnackBar(res['data']['message'], "Error");
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
        }

      } else if (actionType === 'save' && finalPayload && finalPayload['records'].length > 0) {

        const editDialog = this.dialog.open(AlertDialogBoxComponent, {
          width: '400px',
          data: {
            title: 'Confirm',
            content: `
            Kindly note any unsaved sequencing will be lost if you proceed further. <br>
            Do you want to continue and save the changes?`,
            type: "COPY"
          },
          disableClose: false
        });
        editDialog.afterClosed().subscribe((result) => {
          finalPayload['line_name'] = this.schedulerFinalForm.value['line_name'];
          if (result && (result == 'Yes' || result == 'yes')) {
            this.commonService.saveSchedulerFinalData(finalPayload).toPromise().then(async (res) => {
              if ((res['data']['status'].toLowerCase()) == 'success') {
                this.commonService.openSnackBar(res['data']['message'], "Success");
                await this.getSchedulerFinalTableData();
              } else {
                this.commonService.openSnackBar(res['data']['message'], "Error");
              }
            }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
            saveRequestPayload = [];
            finalPayload['records'] = [];
          } else {
            saveRequestPayload = [];
            finalPayload['records'] = [];
          }
        });
      } else if (actionType === 'publish' && selectedIds && selectedIds.length > 0) {
        if (isPublishArr.indexOf(1) !== -1) {
          this.commonService.openSnackBar("One or more selected job already published", "Error");
        } else {
          const publishDialog = this.dialog.open(AlertDialogBoxComponent, {
            width: '400px',
            data: {
              title: 'Confirm',
              content: `Are you sure <br> you want to publish selected data?`,
              type: "COPY"
            },
            disableClose: false
          });

          publishDialog.afterClosed().subscribe((result) => {

            if (result && (result == 'Yes' || result == 'yes')) {

              let publishpaylod = {};

              if (parentLine) {
                publishpaylod = {
                  "parent_job_ids": selectedIds,
                  "published_by": this.wwId,
                  "line_id": lineId,
                  "line_name": lineName
                };
              } else if (moduleLine) {
                publishpaylod = {
                  "module_job_ids": selectedIds,
                  "published_by": this.wwId,
                  "line_id": lineId,
                  "line_name": lineName,
                };
              } else if (childLine) {
                publishpaylod = {
                  "canning_job_ids": selectedIds,
                  "published_by": this.wwId,
                  "line_id": lineId,
                  "line_name": lineName,
                };
              }

              this.commonService.publishSchedulerFinalData(publishpaylod).toPromise().then(async (res) => {
                if ((res['status'].toLowerCase()) == 'success') {
                  await this.getSchedulerFinalTableData();
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
          });
        }
      } else if (actionType === 'Move' && selectedIds && selectedIds.length > 0) {

        const moveDialog = this.dialog.open(AlertDialogBoxComponent, {
          width: '400px',
          data: {
            title: 'Confirm',
            content: `Are you sure <br> you want to move the selected job(s) from ${lineName} to ${lineName == 'A2000' ? 'A2100' : 'A2000'}?`,
            type: "COPY"
          },
          disableClose: false
        });

        moveDialog.afterClosed().subscribe((result) => {
          if (result && (result == 'Yes' || result == 'yes')) {
            const reqPayload = {
              line_name: lineName,
              moved_ids: selectedIds
            };
            this.commonService.moveDataSFD(reqPayload).toPromise().then(async (res) => {
              if ((res['status'].toLowerCase()) == 'success') {
                await this.getSchedulerFinalTableData();
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
      //Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code>  
      else if (actionType === 'bom' && selectedIds && selectedIds.length > 0) {
        if (selectedIds.length > 1) {
          this.commonService.openSnackBar("Please select only 1 job to refresh BOM details", "Error");
        }
        else {
          const bomDialog = this.dialog.open(AlertDialogBoxComponent, {
            width: '400px',
            data: {
              title: 'Confirm',
              content: `
              Are you sure want to update bom detail?`,
              type: "COPY"
            },
            disableClose: false
          });

          bomDialog.afterClosed().subscribe((result) => {
            if (result && (result == 'Yes' || result == 'yes')) {
              if (parentLine) {
                let saveRequestPayload = [];
                finalPayload['records'] = [];
                saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['parent_job_id'] === o2['parent_job_id']));
                saveRequestPayload.forEach(data => {
                  selectedIds.push(data['parent_job_id']);
                  finalPayload['records'].push({
                    job_num: data['job_num'],
                    scheduled_qunatity: data['scheduled_qunatity'],
                    mfgLine: lineName
                  });
                });
              }
              if (moduleLine) {
                let saveRequestPayload = [];
                finalPayload['records'] = [];
                saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['module_job_id'] === o2['module_job_id']));
                saveRequestPayload.forEach(data => {
                  selectedIds.push(data['module_job_id']);
                  finalPayload['records'].push({
                    job_num: data['job_num'],
                    scheduled_qunatity: data['scheduled_qunatity'],
                    mfgLine: lineName
                  });
                });
              }
              if (childLine) {
                let saveRequestPayload = [];
                finalPayload['records'] = [];
                saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['canning_job_id'] === o2['canning_job_id']));
                saveRequestPayload.forEach(data => {
                  selectedIds.push(data['canning_job_id']);
                  finalPayload['records'].push({
                    job_num: data['job_num'],
                    scheduled_qunatity: data['scheduled_qunatity'],
                    mfgLine: lineName
                  });
                });

              }
              this.commonService.updateBomDetail(finalPayload).toPromise().then(async (res) => {
                if ((res['data']['status'].toLowerCase()) == 'success') {
                  this.commonService.openSnackBar(res['data']['message'], "Success");
                  await this.getSchedulerFinalTableData();
                } else {
                  this.commonService.openSnackBar(res['data']['message'], "Error");
                }
              }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
            }

          })
        }
      }
      else if (actionType === 'acknowledge' && selectedIds && selectedIds.length > 0) {
        var schd_qty = [];
        var schd_qty_intllegence = [];
        var edit_scheduled_qunatity : any= [];
        var is_cancelled : any = [];
          this.selection['selected'].forEach( data=> {      
            console.log(data,"Data")
              schd_qty.push(data['scheduled_qunatity'])     
              schd_qty_intllegence.push(data['sched_qty_mod'])
              edit_scheduled_qunatity.push(data['edit_scheduled_qunatity'])
              is_cancelled.push(data['is_cancelled'])

          }); 
        if (selectedIds.length > 1) {
          this.commonService.openSnackBar("Please select only 1 job to acknowledge", "Error");
        }
        else {
          if(edit_scheduled_qunatity != 1 && is_cancelled != 1){
            this.commonService.openSnackBar("Nothing to acknowledge for this job.","Error")
          }
          else{
          const acknowledgeDialog = this.dialog.open(AlertDialogBoxComponent, {
            width: '400px',
            data: {
              title: 'Confirm',
              content: `${"The scheduled quantity of job should be"} ${schd_qty_intllegence+".<br>"}
              ${"Are you sure <br>you want to update scheduled quantity to"} ${schd_qty+"?"}`,              
              type: "COPY"
            },
            disableClose: false
          });
          let shdPayload = {
            action : lineType
          }
          acknowledgeDialog.afterClosed().subscribe((result) => {
            if (result && (result == 'Yes' || result == 'yes')) {
              this.commonService.acknowledgeSchdQty(selectedIds, shdPayload).toPromise().then(async (res) => {
                if ((res['data']['status'].toLowerCase()) == 'success') {
                  await this.getSchedulerFinalTableData();
                  this.commonService.openSnackBar(res['data']['message'], "Success");
                } else {
                  this.commonService.openSnackBar(res['data']['message'], "Error");
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
      }
      }
      //Release 2 Changes - CHG0116719 - End
    } else {
      this.commonService.openSnackBar("Please select the table data to do this action.", "Error");
    }
  }

  getSchedulerFinalTableData() {
    return new Promise((resolve, reject) => {
      this.selection.clear();
      this.tableColumns = [];
      this.dataSource = new MatTableDataSource<any>([]);
      const finalFormData = { ...this.schedulerFinalForm.value };
      delete finalFormData['uploadFileOption'];
      if (finalFormData['line_id'] !== '' || finalFormData['line_id']) {
        this.commonService.getSchedulerFinalData(finalFormData).toPromise().then(response => {
          if (response) {
            this.newtableData = response;
            this.tableColumns = this.tableColumns.concat(this.newtableData['col'].map(x => x.columnDef));
            this.dataSource = new MatTableDataSource<any>(this.newtableData['routes']);

            if (this.newtableData && this.newtableData['routes'].length > 0) {
              this.previousTableData = this.newtableData['routes'];
              if (this.userRole.includes('CMP-User-Admin') ||
                this.userRole.includes('CMP-Scheduler') ||
                this.userRole.includes('CMP-Materials')) {
                this.tableColumns.unshift('select');
              }

              this.norecord = false;
              this.schedulerFinalTableForm.setControl('tableData', new FormArray([]));
              this.newtableData['routes'].forEach(schedulerData => {
                if (this.schedulerFinalForm.value['is_parent']) {
                  this.tableData.push(this.addTableControlsForParent(schedulerData));
                } else if (this.schedulerFinalForm.value['is_module']) {
                  this.tableData.push(this.addTableControlsForModule(schedulerData));
                } else if (this.schedulerFinalForm.value['is_canning']) {
                  this.tableData.push(this.addTableControlsForChild(schedulerData));
                }
              });
              resolve(200);
            } else {
              this.norecord = true;
              this.schedulerFinalTableForm.setControl('tableData', new FormArray([]));
              resolve(200);
            }
          } else {
            resolve(200);
            this.newtableData = {};
            this.norecord = true;
            this.schedulerFinalTableForm.setControl('tableData', new FormArray([]));
          }
        }).catch(err => {
          this.commonService.openSnackBar("Server Error", "Error");
          resolve(200);
        })
      } else {
        resolve(200);
      }
    });
  }

  dropTable(event: CdkDragDrop<any[]>) {

    const parentLine = this.schedulerFinalForm.value['is_parent'];
    const moduleLine = this.schedulerFinalForm.value['is_module'];
    const childLine = this.schedulerFinalForm.value['is_canning'];

    if (this.userRole.includes('CMP-User-Admin') ||
      this.userRole.includes('CMP-Scheduler') ||
      this.userRole.includes('CMP-Materials')) {

      if (this.dataSource && this.dataSource['_data'] && this.newtableData['routes'] &&
        this.newtableData['routes'].length > 0 && this.dataSource['_data']['_value'] &&
        this.dataSource['_data']['_value'].length > 0 && event && event['item'] && event['item']['data']) {

        let prevIndex: any;

        const selectedRowRunDate = this.datePipe.transform(new Date(event.item.data['run_date']), "MM-dd-yyyy");
        const previousIndexValue = this.dataSource._data._value[event.currentIndex];
        const previousIndexRunDate = this.datePipe.transform(new Date(previousIndexValue['run_date']), "MM-dd-yyyy");

        if (selectedRowRunDate === previousIndexRunDate) {

          if (parentLine) {
            prevIndex = this.dataSource._data._value.findIndex((d) => d.parent_job_id === event.item.data['parent_job_id']);
          } else if (moduleLine) {
            prevIndex = this.dataSource._data._value.findIndex((d) => d.module_job_id === event.item.data['module_job_id']);
          } else if (childLine) {
            prevIndex = this.dataSource._data._value.findIndex((d) => d.canning_job_id === event.item.data['canning_job_id']);
          }

          this.tableData.controls[prevIndex].patchValue({ sequence: previousIndexValue['sequence'] });
          this.tableData.controls[event.currentIndex].patchValue({ sequence: event.item.data['sequence'] });

          this.dataSource = [...this.dataSource['_data']['_value']];
          moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
          this.dataSource = new MatTableDataSource<any>(this.dataSource);
        }
      }

    }
  }

  createJobSequencePayload() {
    return new Promise((resolve, reject) => {

      let finalpayload = [];
      const parentLine = this.schedulerFinalForm.value['is_parent'];
      const moduleLine = this.schedulerFinalForm.value['is_module'];
      const childLine = this.schedulerFinalForm.value['is_canning'];
      let primaryKeyName = '';

      if (parentLine) {
        primaryKeyName = "parent_job_id";
      } else if (moduleLine) {
        primaryKeyName = "module_job_id";
      } else if (childLine) {
        primaryKeyName = "canning_job_id";
      }

      this.dataSource['_data']['_value'].forEach((element, index) => {
        finalpayload.push({ [primaryKeyName]: element[primaryKeyName], sequence: index + 1 });
        if (index === (this.dataSource['_data']['_value'].length - 1)) {
          resolve(finalpayload);
        }
      });

    });
  }

  async saveJobSequence() {
    if (this.isfilterApplied) {
      this.commonService.openSnackBar('Please clear the applied filter to save squence.', "Error");
    } else {
      const sequencePayload = await this.createJobSequencePayload();
      const sequenceDialog = this.dialog.open(AlertDialogBoxComponent, {
        width: '400px',
        data: {
          title: 'Confirm',
          content: ` Kindly note any unsaved record will be lost if you proceed further. <br>
          Do you want to continue and save the sequence?`,
          type: "COPY"
        },
        disableClose: false
      });

      sequenceDialog.afterClosed().subscribe((result) => {
        if (result && (result == 'Yes' || result == 'yes')) {
          if (sequencePayload) {
            const seqReqPayload = { records: sequencePayload };
            this.commonService.saveJobSequenceData(seqReqPayload).toPromise().then(async res => {
              if ((res['status'].toLowerCase()) == 'success') {
                this.commonService.openSnackBar(res['message'], "Success");
                await this.getSchedulerFinalTableData();
              } else {
                this.commonService.openSnackBar(res['message'], "Error");
              }
            }).catch(err => {
              this.commonService.openSnackBar("Server Error", "Error");
            });
          }
        }
      });
    }

  }

  downloadExcel() {
    let path = "SchedulerFinal"
    this.masterDataService.downloadExcelRequest(path).subscribe(response => {
      if (response.url != undefined && response.url != "") {
        this.download(response.url)
      } else {
        this.commonService.openSnackBar('No Valid Records To Download.', "Error");
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

  exportBtnClick(btnType) {

    this.schedulerFinalForm.patchValue({
      action: btnType
    });

    let Payload = this.schedulerFinalForm.value;
    this.commonService.getSchedulerFinalData(Payload).toPromise().then(res => {
      if (res && res['url'] && btnType == 'export-to-excel') {
        var fileLink = document.createElement('a');
        fileLink.style.display = "hidden";
        fileLink.href = res['url'];
        fileLink.click();
        fileLink.remove();
        this.schedulerFinalForm.patchValue({
          action: ''
        });
      }
      if (res && res['status'] && btnType == 'export-to-email' && (res['status'].toLowerCase()) == 'success') {
        this.commonService.openSnackBar(res['message'], "Success");
        this.schedulerFinalForm.patchValue({
          action: ''
        });
      } else {
        this.commonService.openSnackBar(res['message'], "Error");
        this.schedulerFinalForm.patchValue({
          action: ''
        });
      }
    }).catch(err => {
      this.schedulerFinalForm.patchValue({
        action: ''
      });
      this.commonService.openSnackBar("Server Error! Please try again.", "Error");
    });
  }
  // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
  jobFlow(detail) {
    console.log(detail,"Detail")
    // const sharedData = {
    //   jobstatus_id: detail['jobstatus_id'],
    //   is_parent: this.finalForm.value['is_parent'],
    //   is_module: this.finalForm.value['is_module'],
    //   is_canning: this.finalForm.value['is_canning'],
    //   line_id: this.finalForm.value['line_id'],
    //   line_name: this.finalForm.value['line_name'],
    //   scheduled_qunatity: detail['scheduled_qunatity'],
    //   statusName : detail['status_name'],
    //   job_complete_date : detail['job_complete_date'],
    //   job_complete_time : detail['job_complete_time']
    // }
    // const parentLine = this.finalForm.value['is_parent'];
    // const moduleLine = this.finalForm.value['is_module'];
    // const canningLine = this.finalForm.value['is_canning'];

    // if (parentLine) {
    //   sharedData['parent_job_id'] = detail['parent_job_id']
    // } else if (moduleLine) {
    //   sharedData['module_job_id'] = detail['module_job_id']
    // } else if (canningLine) {
    //   sharedData['canning_job_id'] = detail['canning_job_id']
    // }

    //this.commonLogicService.setjobstatusAction(sharedData);
    const dialogRef = this.dialog.open(JobFlowComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result ?.data) {
        setTimeout(() => {
          this.getSchedulerFinalTableData();
        }, 2000);
      }
    });

  }
  //Release 2 Changes - CHG0116719 - End
}
