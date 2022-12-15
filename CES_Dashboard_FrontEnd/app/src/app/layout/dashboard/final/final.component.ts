import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/share/Services/common.service';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { SubAssemblyComponent } from './sub-assembly/sub-assembly.component';
import { MaterialStatusComponent } from './material-status/material-status.component';
import { PlanningStatusComponent } from './planning-status/planning-status.component';
import {ScrollToService,ScrollToConfigOptions,} from '@nicky-lenaers/ngx-scroll-to';
import { JobFlowComponent } from '../job-flow/job-flow.component';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.scss']
})

export class FinalComponent implements OnInit, AfterViewInit {

  componentName = 'Final';
  selected: any;
  finalForm: FormGroup;
  finalTableForm: FormGroup;
  files: NgxFileDropEntry[] = [];
  addOnBlur = true;
  jobNumber = [];
  isfileSelected = false;
  mfline: any;
  manufacturingLine = [];
  kitDropDown = [];
  mfgQualityDropDown = [];
  seqDropDown = [];
  subAssemblyDropDown = [];
  QSubAssemblyDropDown = [];
  jobStatusDropDown = [];
  kitStatusValue = [];
  mfgQualityValue = [];
  seqDropDownValue = [];
  subAssemblyvalue = [];
  qSubAssemblyvalue = [];
  jobStatusValue = [];
  newtableData = {};
  tableColumns = [];
  dataSource: any = [];
  selection = new SelectionModel<any>(true, []);
  wwId = '';
  favoriteLines = [];
  userRole = '';
  norecord = false;
  isAccessflag = false;
  jobStatusId: any;
  selectedKitStatus: any = {};
  newComment = null;
  commentList = [];
  selectedJobId = '';
  actionType = null;
  MfLineName:any;
  
  @ViewChild('keywordsInput') dialogContent: ElementRef;
  scrollPosition: any;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private commonLogicService: CommonLogicService,
    private readonly scrollToService: ScrollToService
  ) { 
    this.scrollPosition = JSON.parse(localStorage.getItem('scrollPositionFinal') || '{}');
  }

  async ngOnInit() {
    await this.getAllTableDropDown();
    await this.initFormGroup();
    this.initTableFormGroup();

    
  }

  async ngAfterViewInit() {
    await this.getManufacturingLine();
    //--- scroll position started-------
    let dialogElement = this.dialogContent.nativeElement as HTMLElement;
    dialogElement.onscroll = () => {
      this.scrollPosition = dialogElement.scrollTop;
      localStorage.setItem('scrollPositionFinal',JSON.stringify(dialogElement.scrollTop));
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
      if (this.userRole && this.userRole.length > 0) {
        this.isAccessflag = true;
      } else {
        this.isAccessflag = false;
      }

      this.finalForm = this.formBuilder.group({
        user: new FormControl(this.wwId),
        role: new FormControl(this.userRole),
        sortKey: new FormControl('run_date'),
        sortType: new FormControl('asc'),
        line_id: new FormControl(''),
        line_name: new FormControl(''),
        is_parent: new FormControl(1),
        is_module: new FormControl(0),
        is_canning: new FormControl(0),
        action: new FormControl(''),
        filter: new FormControl({}),
        selectedStatusValue: new FormControl(null),
      });
      if(this.MfLineName['line_id']){
        this.finalForm.patchValue({
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
    return this.finalForm.controls;
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
          if(this.MfLineName['line_id']!=null){
            await this.getFinalTableData();
          }else{
          if (this.favoriteLines && this.favoriteLines.length > 0) {
            this.finalForm.patchValue({
              line_id: this.favoriteLines[0]['line_id'],
              line_name: this.favoriteLines[0]['line_name'],
              is_parent: this.favoriteLines[0]['is_parent'],
              is_module: this.favoriteLines[0]['is_module'],
              is_canning: this.favoriteLines[0]['is_canning'],
              sortKey: 'run_date',
              sortType: 'asc',
            });
            await this.getFinalTableData();
          } else {
            await this.getFinalTableData();
          }
        }
        } else {
          this.manufacturingLine = [];
          this.finalTableForm.setControl('tableData', new FormArray([]));
        }
        resolve(200);
      }).catch(err => {
        this.manufacturingLine = [];
        this.finalTableForm.setControl('tableData', new FormArray([]));
        this.commonService.openSnackBar("Server Error", "Error");
        resolve(200);
      });
    });
  }

  async favoriteBtnClick(obj) {
    this.finalForm.patchValue({
      is_canning: obj['is_canning'],
      is_module: obj['is_module'],
      is_parent: obj['is_parent'],
      line_id: obj['line_id'],
      line_name: obj['line_name'],
      sortKey: 'run_date',
      sortType: 'asc',
      filter: {}
    });
    let MFLine = {
      line_id: this.finalForm.value['line_id'],
      line_name: this.finalForm.value['line_name'],
      is_canning: obj['is_canning'],
      is_module: obj['is_module'],
      is_parent: obj['is_parent']
    }
    localStorage.setItem('selectedMFLine', JSON.stringify(MFLine));
    this.commonService.setClearFilterAction('reset');
    await this.getFinalTableData();
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
        (!event['end_date'] || event['end_date'] == null || event['end_date'] == undefined || event['end_date'] == '') &&
        (!event['jobstatus_id'] || event['jobstatus_id'] == null || event['jobstatus_id'] == undefined || event['jobstatus_id'] == '')
      ) {
        this.finalForm.value['filter'] = {};
        this.finalForm.patchValue({
          filter: {}
        });
      } else {

        const parentLine = this.finalForm.value['is_parent'];
        const moduleLine = this.finalForm.value['is_module'];
        const canningLine = this.finalForm.value['is_canning'];
        let csPartValue = event['ces_part_num_catmod'];
        if (csPartValue) {
          if (parentLine) {
            event['ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.finalForm.value['line_name']).trim() === 'M-1000') {
            event['inlet_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.finalForm.value['line_name']).trim() === 'M-1100') {
            event['outlet_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.finalForm.value['line_name']).trim() === 'M-1200') {
            event['filter_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (moduleLine && (this.finalForm.value['line_name']).trim() === 'M-1300') {
            event['mixer_ces_part_num'] = csPartValue;
            delete event['ces_part_num_catmod'];
          } else if (canningLine) {
            event['ces_part_num_catmod'] = csPartValue;
          }
        }
        this.finalForm.patchValue({
          filter: event
        });
      }
      await this.getFinalTableData();
    }
  }

  getselectedLine(mfline_name: any) {
    this.finalForm.patchValue({
      line_name: mfline_name,
      filter: {}
    });
    this.commonService.setClearFilterAction('reset');
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
          //await this.getManufacturingLine();
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
        resolve(200);
        this.commonService.openSnackBar("Server Error! Please try again.", "Error");
      });
    });
  }

  initTableFormGroup() {
    this.finalTableForm = this.formBuilder.group({
      tableData: this.formBuilder.array([])
    });
  }

  get tableData(): FormArray {
    return this.finalTableForm.get('tableData') as FormArray;
  }

  setTableDropDownValue(controlValue) {
    return new Promise((resolve, reject) => {
      if (this.kitDropDown && this.kitDropDown.length > 0) {
        this.kitStatusValue = this.kitDropDown.filter((obj) => {
          return obj.status_id === controlValue['kit_status_id'];
        });
      }

      if (this.mfgQualityDropDown && this.mfgQualityDropDown.length > 0) {
        this.mfgQualityValue = this.mfgQualityDropDown.filter((obj) => {
          return obj.status_id === controlValue['mfg_qa_status_id'];
        });
      }

      if (this.seqDropDown && this.seqDropDown.length > 0) {
        this.seqDropDownValue = this.seqDropDown.filter((obj) => {
          return obj.status_id === controlValue['seq_status_id'];
        });
      }

      if (this.subAssemblyDropDown && this.subAssemblyDropDown.length > 0) {
        this.subAssemblyvalue = this.subAssemblyDropDown.filter((obj) => {
          return obj.status_id === controlValue['subassembly_status_id'];
        });
      }
      if (this.jobStatusDropDown && this.jobStatusDropDown.length > 0) {
        this.jobStatusValue = this.jobStatusDropDown.filter((obj) => {
          return obj.status_id === controlValue['jobstatus_id'];
        });
      }
      if (this.QSubAssemblyDropDown && this.QSubAssemblyDropDown.length > 0) {
        this.qSubAssemblyvalue = this.QSubAssemblyDropDown.filter((obj) => {
          return obj.status_id === controlValue['subassembly_q_status_id'];
        });
      }
      resolve(200);
    });
  }

  addTableControlsForParent(controlValue: any = {}) {
    this.setTableDropDownValue(controlValue);
    return this.formBuilder.group({
      parent_job_id: new FormControl(controlValue['parent_job_id'] || null),
      catmod_no_singlebody: new FormControl(controlValue['catmod_no_singlebody'] || null),
      customer_partno: new FormControl(controlValue['customer_partno'] || null),
      job_num: new FormControl(controlValue['job_num'] || null),
      sequence: new FormControl(controlValue['sequence'] || null),
      repack_type: new FormControl(controlValue['repack_type'] || null),
      build_slot: new FormControl(controlValue['build_slot'] || null),
      index_no: new FormControl(controlValue['index_no'] || null),
      order_no: new FormControl(controlValue['order_no'] || null),
      ces_part_num: new FormControl(controlValue['ces_part_num'] || null),
      assembly_type: new FormControl(controlValue['assembly_type'] || null),
      part_description: new FormControl(controlValue['part_description'] || null),
      material_ordering_style: new FormControl(controlValue['material_ordering_style'] || null),
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
      seq: new FormControl(controlValue['seq'] || null),
      materials: new FormControl(controlValue['materials'] || null),
      kits: new FormControl(controlValue['kits'] || ''),
      mfg_quality: new FormControl(controlValue['mfg_quality'] || null),
      planning: new FormControl(controlValue['planning'] || null),
      sub_assesmbly: new FormControl(controlValue['sub_assesmbly'] || null),
      job_status: new FormControl(controlValue['job_status'] || null),
      style_number: new FormControl(controlValue['style_number'] || null),
      length: new FormControl(controlValue['length'] || null),
      sub_assembly_q_section: new FormControl(controlValue['sub_assembly_q_section'] || null),
      sub_assembly_formit: new FormControl(controlValue['sub_assembly_formit'] || null),
      catmod_mo_number: new FormControl(controlValue['catmod_mo_number'] || null),
      catmod: new FormControl(controlValue['catmod'] || null),
      customer_part_number: new FormControl(controlValue['customer_part_number'] || null),
      audit: new FormControl(controlValue['audit'] || null),
      size: new FormControl(controlValue['size'] || null),
      sheet_steel: new FormControl(controlValue['sheet_steel'] || null),
      stamp: new FormControl(controlValue['stamp'] || null),
      flare_pierce_guage: new FormControl(controlValue['flare_pierce_guage'] || null),
      material_gauge: new FormControl(controlValue['material_gauge'] || null),
      manual_roll: new FormControl(controlValue['manual_roll'] || null),
      weld: new FormControl(controlValue['weld'] || null),
      coin: new FormControl(controlValue['coin'] || null),
      department: new FormControl(controlValue['department'] || null),
      cut: new FormControl(controlValue['cut'] || null),
      internal_customer: new FormControl(controlValue['internal_customer'] || null),
      is_moved: new FormControl(controlValue['is_moved'] || null),
      is_published_finaldb: new FormControl(controlValue['is_moved'] || null),
      lucas: new FormControl(controlValue['lucas'] || null),
      
      mfg_qa_status_id: new FormControl(this.mfgQualityValue[0] || null),
      seq_status_id: new FormControl(this.seqDropDownValue[0] || null),
      kit_status_id: new FormControl((this.kitStatusValue[0]) || null),
      subassembly_status_id: new FormControl(this.subAssemblyvalue[0] || null),
      subassembly_q_status_id: new FormControl(this.qSubAssemblyvalue[0] || null),
      jobstatus_id: new FormControl(this.jobStatusValue[0] || null),
      material_ord_style : new FormControl(controlValue['material_ord_style'] || null)
    });
  }

  addTableControlsForModule(controlValue: any = {}) {
    this.setTableDropDownValue(controlValue);

    return this.formBuilder.group({
      module_job_id: new FormControl(controlValue['module_job_id'] || null),
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
      seq: new FormControl(controlValue['seq'] || null),
      materials: new FormControl(controlValue['materials'] || null),
      kits: new FormControl(controlValue['kits'] || ''),
      mfg_quality: new FormControl(controlValue['mfg_quality'] || null),
      planning: new FormControl(controlValue['planning'] || null),
      sub_assesmbly: new FormControl(controlValue['sub_assesmbly'] || null),
      job_status: new FormControl(controlValue['job_status'] || null),
      outlet_ces_part_num: new FormControl(controlValue['outlet_ces_part_num'] || null),
      outlet_catmod: new FormControl(controlValue['outlet_catmod'] || null),
      filter_ces_part_num: new FormControl(controlValue['filter_ces_part_num'] || null),
      filter_catmod: new FormControl(controlValue['filter_catmod'] || null),
      mixer_ces_part_num: new FormControl(controlValue['mixer_ces_part_num'] || null),
      mfg_qa_status_id: new FormControl(this.mfgQualityValue[0] || null),
      seq_status_id: new FormControl(this.seqDropDownValue[0] || null),
      kit_status_id: new FormControl((this.kitStatusValue[0]) || null),
      subassembly_status_id: new FormControl(this.subAssemblyvalue[0] || null),
      material_ord_style : new FormControl(controlValue['material_ord_style'] || null)
    });
  }

  addTableControlsForChild(controlValue: any = {}) {
    this.setTableDropDownValue(controlValue);

    return this.formBuilder.group({
      canning_job_id: new FormControl(controlValue['canning_job_id'] || null),
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
      diameter: new FormControl(controlValue['diameter'] || null),
      seq: new FormControl(controlValue['seq'] || null),
      materials: new FormControl(controlValue['materials'] || null),
      kits: new FormControl(controlValue['kits'] || ''),
      mfg_quality: new FormControl(controlValue['mfg_quality'] || null),
      planning: new FormControl(controlValue['planning'] || null),
      //sub_assesmbly: new FormControl(controlValue['sub_assesmbly'] || null),
      job_status: new FormControl(controlValue['job_status'] || null),
      style: new FormControl(controlValue['style'] || null),
      tla_wla: new FormControl(controlValue['tla_wla'] || null),
      length: new FormControl(controlValue['length'] || null),
      mfg_qa_status_id: new FormControl(this.mfgQualityValue[0] || null),
      seq_status_id: new FormControl(this.seqDropDownValue[0] || null),
      kit_status_id: new FormControl((this.kitStatusValue[0]) || null),
      subassembly_status_id: new FormControl(this.subAssemblyvalue[0] || null),
      material_ord_style : new FormControl(controlValue['material_ord_style'] || null)
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
    const selectedLineId = this.finalForm.value['line_id'];
    const selectedLineDetail = this.manufacturingLine.filter(function (el) {
      return el.line_id == selectedLineId;
    });
    if (selectedLineDetail) {
      this.jobNumber = [];
      this.finalForm.patchValue({
        filter: {},
        is_parent: selectedLineDetail[0]['is_parent'],
        is_module: selectedLineDetail[0]['is_module'],
        is_canning: selectedLineDetail[0]['is_canning'],
        line_name: selectedLineDetail[0]['line_name'],
        sortKey: 'run_date',
        sortType: 'asc',
      });
      let MFLine = {
        line_id: this.finalForm.value['line_id'],
        line_name: selectedLineDetail[0]['line_name'],
        is_parent: selectedLineDetail[0]['is_parent'],
        is_module: selectedLineDetail[0]['is_module'],
        is_canning: selectedLineDetail[0]['is_canning']
      }
      localStorage.setItem('selectedMFLine', JSON.stringify(MFLine));
      await this.getFinalTableData();
    }
  }

  openDialogBox(head: string, asc: string, type: string) {
    const dialogC = this.dialog.open(AlertDialogBoxComponent, {
      width: '400px',
      data: { title: head, content: asc, type: type },
      disableClose: false
    });
    dialogC.afterClosed().subscribe(result => {
      console.log(result);
    })
  }

  stopprop(event: any) {
    event.stopPropagation();
  }

  jobStatus(detail) {
    const sharedData = {
      jobstatus_id: detail['jobstatus_id'],
      is_parent: this.finalForm.value['is_parent'],
      is_module: this.finalForm.value['is_module'],
      is_canning: this.finalForm.value['is_canning'],
      line_id: this.finalForm.value['line_id'],
      line_name: this.finalForm.value['line_name'],
      scheduled_qunatity: detail['scheduled_qunatity'],
      statusName : detail['status_name'],
      job_complete_date : detail['job_complete_date'],
      job_complete_time : detail['job_complete_time']
    }
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    if (parentLine) {
      sharedData['parent_job_id'] = detail['parent_job_id']
    } else if (moduleLine) {
      sharedData['module_job_id'] = detail['module_job_id']
    } else if (canningLine) {
      sharedData['canning_job_id'] = detail['canning_job_id']
    }

    this.commonLogicService.setjobstatusAction(sharedData);
    const dialogRef = this.dialog.open(JobStatusComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.data) {
        setTimeout(() => {
          this.getFinalTableData();
        }, 2000);
      }
    });

  }

  getAllTableDropDown() {
    return new Promise((resolve, reject) => {
      this.commonLogicService.setCommonData.subscribe(detail => {
        if (detail) {
          if (detail['seq']) {
            this.seqDropDown = detail['seq'];
          }
          if (detail['kit']) {
            this.kitDropDown = detail['kit'];
          }
          if (detail['mfg_quality']) {
            this.mfgQualityDropDown = detail['mfg_quality'];
          }
          if (detail['sub_assembly']) {
            this.subAssemblyDropDown = detail['sub_assembly'];
          }
          if (detail['q_sec_sub_assmbly']) {
            this.QSubAssemblyDropDown = detail['q_sec_sub_assmbly'];
          }
          resolve(200);
        } else {
          resolve(200);
        }
      });
    });
  }

  getFinalTableData() {
    return new Promise((resolve, reject) => {

      this.selection.clear();
      this.tableColumns = [];
      this.dataSource = new MatTableDataSource<any>([]);
      const finalFormData = { ...this.finalForm.value };

      if (finalFormData['line_id'] !== '' || finalFormData['line_id']) {
        this.commonService.getFinalDashboardData(finalFormData).toPromise().then(response => {
          if (response) {
            this.newtableData = response;
            this.tableColumns = this.tableColumns.concat(this.newtableData['col'].map(x => x.columnDef));
            this.dataSource = new MatTableDataSource<any>(this.newtableData['routes']);
            if (this.newtableData && this.newtableData['routes'].length > 0) {
              if ((this.userRole.includes('CMP-User-Admin') ||
                this.userRole.includes('CMP-Materials'))) {
                this.tableColumns.unshift('select');
              }
              this.norecord = false;
              this.finalTableForm.setControl('tableData', new FormArray([]));
              
              this.newtableData['routes'].forEach(async (schedulerData) => {
                if (this.finalForm.value['is_parent']) {
                  this.tableData.push(this.addTableControlsForParent(schedulerData));
                } else if (this.finalForm.value['is_module']) {
                  this.tableData.push(this.addTableControlsForModule(schedulerData));
                } else if (this.finalForm.value['is_canning']) {
                  this.tableData.push(this.addTableControlsForChild(schedulerData));
                }
              });
              resolve(200);
            } else {
              this.norecord = true;
              this.finalForm.setControl('tableData', new FormArray([]));
              resolve(200);
            }
          } else {
            resolve(200);
            this.newtableData = {};
            this.norecord = true;
            this.finalForm.setControl('tableData', new FormArray([]));
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

  async onClickAddComment(RowData, statusId, action) {

    if (action == 'kit_status_id') {
      this.actionType = 'kit';
    } else if (action == 'mfg_qa_status_id') {
      this.actionType = 'MFG/Quality';
    } else if (action == 'seq_status_id') {
      this.actionType = 'SEQ';
    } else if (action == 'subassembly_q_status_id') {
      this.actionType = 'Q-Section-Sub-Assembly';
    }

    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    if (parentLine) {
      this.selectedJobId = RowData['parent_job_id']
    } else if (moduleLine) {
      this.selectedJobId = RowData['module_job_id']
    } else if (canningLine) {
      this.selectedJobId = RowData['canning_job_id']
    }

    this.jobStatusId = (statusId) ? statusId : null;
    if (!this.jobStatusId) {
      this.commonService.openSnackBar("Please select value to add comment", "Error");
    } else {
      this.newComment = '';
      await this.fetchComment(this.actionType);
    }
  }

  saveComment() {
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    let data;

    if (this.newComment) {

      if (parentLine) {
        data = {
          parent_job_id: this.selectedJobId,
          status_id: this.jobStatusId,
          new_status: this.jobStatusId,
          comments: this.newComment,
          created_by: this.wwId,
          action: this.actionType,
          line_id: this.finalForm.value['line_id'],
          line_name: this.finalForm.value['line_name'],
        }
        
      }
      else if (moduleLine) {
        data = {
          module_job_id: this.selectedJobId,
          status_id: this.jobStatusId,
          new_status: this.jobStatusId,
          comments: this.newComment,
          created_by: this.wwId,
          action: this.actionType,
          line_id: this.finalForm.value['line_id'],
          line_name: this.finalForm.value['line_name'],
        }
      }
      else if (canningLine) {
        data = {
          canning_job_id: this.selectedJobId,
          status_id: this.jobStatusId,
          new_status: this.jobStatusId,
          comments: this.newComment,
          created_by: this.wwId,
          action: this.actionType,
          line_id: this.finalForm.value['line_id'],
          line_name: this.finalForm.value['line_name'],
        }
      }

      this.commonService.addCommentData(data).toPromise().then(async (res) => {
        if ((res['status'].toLowerCase()) == 'success') {
          this.commonService.openSnackBar(res['message'], "Success");
          this.newComment = null;
          this.getFinalTableData();
        } else {
          this.commonService.openSnackBar(res['message'], "Error");
          this.getFinalTableData();
        }
      }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
    } else {
      this.commonService.openSnackBar("Please add comment for save.", "Error");
    }

  }

  fetchComment(actionType) {
    return new Promise((resolve, reject) => {

      const data = {
        "sortKey": "comment_id",
        "sortType": "desc",
        is_parent: this.finalForm.value['is_parent'],
        is_module: this.finalForm.value['is_module'],
        is_canning: this.finalForm.value['is_canning'],
        job_id: this.selectedJobId,
        status_type: actionType
      };

      this.commonService.fetchCommentData(data).toPromise().then((res) => {
        if ((res['routes'] && res['routes'].length > 0)) {
          this.commentList = res['routes'];
          resolve(200);
        } else {
          this.commentList = [];
          resolve(200);
        }
      }).catch(err => {
        this.commonService.openSnackBar("Server Error", "Error");
        resolve(200);
      });
    });
  }

  getDropdownValue(selectedValue, index, selectedRowData) {

    if (selectedValue == 'kit_status_id') {
      this.actionType = 'kit';
    } else if (selectedValue == 'mfg_qa_status_id') {
      this.actionType = 'MFG/Quality';
    } else if (selectedValue == 'seq_status_id') {
      this.actionType = 'SEQ';
    } else if (selectedValue == 'subassembly_q_status_id') {
      this.actionType = 'Q-Section-Sub-Assembly';
    }
    const selectedObj = this.tableData.value[index][selectedValue];
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    let Payload = {
      status_id: selectedObj['status_id'],
      action: this.actionType
    };

    if (selectedObj && selectedRowData) {
      if (parentLine) {
        Payload['parent_job_id'] = selectedRowData['parent_job_id'];
      }
      else if (moduleLine) {
        Payload['module_job_id'] = selectedRowData['module_job_id'];
      }
      else if (canningLine) {
        Payload['canning_job_id'] = selectedRowData['canning_job_id'];
      }

      this.commonService.updateFDStatus(Payload).toPromise().then(async (res) => {
        if ((res['status'].toLowerCase()) == 'success') {
          this.commonService.openSnackBar(res['message'], "Success");
        } else {
          this.commonService.openSnackBar(res['message'], "Error");
        }
      }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
    }

  }

  selectRadioBtn(event) {
    this.f['selectedStatusValue'].setValue(event.value);
  }

  moveOrder() {
    
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];   
    const updatedTableData = this.finalTableForm.value['tableData'];

    let saveRequestPayload = [];
    let finalPayload = { records: [] };
    const selectedIds = [];
   
    if (this.userRole && this.userRole.length > 0 &&
      (this.userRole.includes('CMP-User-Admin') ||
        this.userRole.includes('CMP-Materials')) &&
      this.finalForm.value.selectedStatusValue !== null) {
        if (this.selection['selected'] && this.selection['selected'].length > 0){
          if(parentLine){
            let saveRequestPayload = [];
            finalPayload['records'] = [];            
            saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['parent_job_id'] === o2['parent_job_id']));
            saveRequestPayload.forEach(data => {
              selectedIds.push(data['parent_job_id']);
              finalPayload['records'].push({
                job_num: data['job_num'],
                scheduled_qunatity: data['scheduled_qunatity'],
                material_ord_style: this.f['selectedStatusValue'].value,
                parent_job_id: data['parent_job_id'],
                action: this.f['selectedStatusValue'].value                  
              });      
            });            
          }  
          if(moduleLine){
            let saveRequestPayload = [];
            finalPayload['records'] = [];            
            saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['module_job_id'] === o2['module_job_id']));
            saveRequestPayload.forEach(data => {
              selectedIds.push(data['module_job_id']);
              finalPayload['records'].push({
                job_num: data['job_num'],
                scheduled_qunatity: data['scheduled_qunatity'],
                material_ord_style: this.f['selectedStatusValue'].value,
                module_job_id: data['module_job_id'],
                action: this.f['selectedStatusValue'].value                  
              });      
            }); 
          }
          if(canningLine){
            let saveRequestPayload = [];
            finalPayload['records'] = [];            
            saveRequestPayload = updatedTableData.filter(o1 => this.selection['selected'].some(o2 => o1['canning_job_id'] === o2['canning_job_id']));
            saveRequestPayload.forEach(data => {
              selectedIds.push(data['canning_job_id']);
              finalPayload['records'].push({
                job_num: data['job_num'],
                scheduled_qunatity: data['scheduled_qunatity'],
                material_ord_style: this.f['selectedStatusValue'].value,
                canning_job_id: data['canning_job_id'],
                action: this.f['selectedStatusValue'].value                  
              });  
            }); 

          }
        if(this.finalForm.value.selectedStatusValue == 'SEQ'){   
            var seqSelected = [];
            this.selection['selected'].forEach( data=> {
              if(data['seq_move_order'] == 'SEQ' ){
                seqSelected.push(data['job_num'])                
              }              
            });    
            if(seqSelected.length > 0){
              if(seqSelected.length>1){
                this.commonService.openSnackBar(seqSelected + " are already moved to Oracle.", "Error")
              }
              else{
                this.commonService.openSnackBar(seqSelected + " is already moved to Oracle.", "Error")
              }
            }
            else{                          
              this.commonService.moveOrderOracle(finalPayload).toPromise().then((response) => {
                if (response) {
                  if ((response.data['status'].toLowerCase()) == 'success') {
                    this.commonService.openSnackBar(response.data['message'], "Success");
                    this.getFinalTableData();
                    this.f['selectedStatusValue'].reset();
                  } else {
                    this.commonService.openSnackBar(response.data['message'], "Error");
                  }
                }
             });
            }
          
        }
        if(this.finalForm.value.selectedStatusValue == 'JIT'){
          this.commonService.moveOrderOracle(finalPayload).toPromise().then((response) => {
            if (response) {
              if ((response.data['status'].toLowerCase()) == 'success') {
                this.commonService.openSnackBar(response.data['message'], "Success");
                this.getFinalTableData();
                    this.f['selectedStatusValue'].reset();
              } else {
                this.commonService.openSnackBar(response.data['message'], "Error");
              }
            }
         });
        }
        if(this.finalForm.value.selectedStatusValue == 'KIT'){
            if(this.selection['selected'].length > 1){
              this.commonService.openSnackBar("Please select 1 job at a time.", "Error")
            }
            else {
              var seqSelected = [];
              this.selection['selected'].forEach( data=> {
                if(data['kit_move_order'] == 'KIT' ){
                  seqSelected.push(data['job_num'])                
                }              
              });    
              if(seqSelected.length > 0){                
                  this.commonService.openSnackBar(seqSelected + " is already moved to Oracle.", "Error")                
              }
              else{                          
                this.commonService.moveOrderOracle(finalPayload).toPromise().then((response) => {
                  if (response) {
                    if ((response.data['status'].toLowerCase()) == 'success') {
                      this.commonService.openSnackBar(response.data['message'], "Success");
                      this.getFinalTableData();
                    this.f['selectedStatusValue'].reset();
                    } else {
                      this.commonService.openSnackBar(response.data['message'], "Error");
                    }
                  }
               });
              }
            }
        }        
        }
        else{
          this.commonService.openSnackBar("Please select Job(s) to do this action.", "Error")
        }
    } else {
     this.commonService.openSnackBar("Select status option first", "Error");
    }

  }

  getsubassembly(assemblydata) {
    const sharedData = {
      is_parent: this.finalForm.value['is_parent'],
      is_module: this.finalForm.value['is_module'],
      is_canning: this.finalForm.value['is_canning'],
      line_id: this.finalForm.value['line_id'],
      line_name: this.finalForm.value['line_name'],
    }
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    if (parentLine) {
      sharedData['parent_job_id'] = assemblydata['parent_job_id']
    } else if (moduleLine) {
      sharedData['module_job_id'] = assemblydata['module_job_id']
    } else if (canningLine) {
      sharedData['canning_job_id'] = assemblydata['canning_job_id']
    }

    const dialogRef = this.dialog.open(SubAssemblyComponent, { disableClose: true, data: sharedData });

    dialogRef.afterClosed().subscribe(async (result) => {      
             
    });
  }

  getMaterialStatus(materialData) {
    const sharedData = {}
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    if (parentLine) {
      sharedData['job_num'] = materialData['job_num']
    } else if (moduleLine) {
      sharedData['job_num'] = materialData['job_num']
    } else if (canningLine) {
      sharedData['job_num'] = materialData['job_num']
    }

    const dialogRef = this.dialog.open(MaterialStatusComponent, { disableClose: true, data: sharedData });

    dialogRef.afterClosed().subscribe(async (result) => {      
    });
  }

  getPlanningStatus(planningData) {
    const sharedData = {}
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    if (parentLine) {
      sharedData['job_num'] = planningData['job_num']
    } else if (moduleLine) {
      sharedData['job_num'] = planningData['job_num']
    } else if (canningLine) {
      sharedData['job_num'] = planningData['job_num']
    }

    const dialogRef = this.dialog.open(PlanningStatusComponent, { disableClose: false, data: sharedData });

    dialogRef.afterClosed().subscribe(async (result) => {         
    });

  }

  refreshTable() {
    this.commonService.setClearFilterAction('reset');
    this.finalForm.patchValue({
      filter: {}
    });
    this.getFinalTableData()
  }

  exportBtnClick(btnType) {

    this.finalForm.patchValue({
      action: btnType
    });

    let Payload = this.finalForm.value;
    this.commonService.getFinalDashboardData(Payload).toPromise().then(res => {
      if (res && res['url'] && btnType == 'export-to-excel') {
        var fileLink = document.createElement('a');
        fileLink.style.display = "hidden";
        fileLink.href = res['url'];
        fileLink.click();
        fileLink.remove();
        this.finalForm.patchValue({
          action: ''
        });
      }
      if (res && res['status'] && btnType == 'export-to-email' && (res['status'].toLowerCase()) == 'success') {
        this.commonService.openSnackBar(res['message'], "Success");
        this.finalForm.patchValue({
          action: ''
        });
      } else {
        this.commonService.openSnackBar(res['message'], "Error");
        this.finalForm.patchValue({
          action: ''
        });
      }
    }).catch(err => {
      this.finalForm.patchValue({
        action: ''
      });
      this.commonService.openSnackBar("Server Error! Please try again.", "Error");
    });
  }
   // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
  jobFlow(detail) {
    const sharedData = {
      jobstatus_id: detail['jobstatus_id'],
      is_parent: this.finalForm.value['is_parent'],
      is_module: this.finalForm.value['is_module'],
      is_canning: this.finalForm.value['is_canning'],
      line_id: this.finalForm.value['line_id'],
      line_name: this.finalForm.value['line_name'],
      scheduled_qunatity: detail['scheduled_qunatity'],
      statusName : detail['status_name'],
      job_complete_date : detail['job_complete_date'],
      job_complete_time : detail['job_complete_time']
    }
    const parentLine = this.finalForm.value['is_parent'];
    const moduleLine = this.finalForm.value['is_module'];
    const canningLine = this.finalForm.value['is_canning'];

    if (parentLine) {
      sharedData['parent_job_id'] = detail['parent_job_id']
    } else if (moduleLine) {
      sharedData['module_job_id'] = detail['module_job_id']
    } else if (canningLine) {
      sharedData['canning_job_id'] = detail['canning_job_id']
    }

    this.commonLogicService.setjobstatusAction(sharedData);
    const dialogRef = this.dialog.open(JobFlowComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.data) {
        setTimeout(() => {
          this.getFinalTableData();
        }, 2000);
      }
    });

  }
  //Release 2 Changes - CHG0116719 - End
}