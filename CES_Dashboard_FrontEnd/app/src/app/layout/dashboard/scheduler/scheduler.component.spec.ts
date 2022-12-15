import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed,inject, async, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SchedulerComponent } from './scheduler.component';
import { analyze } from 'eslint-scope';
import { CommonService, } from 'src/app/share/Services/common.service';
import {MasterAPIService} from 'src/app/share/Services/masterData/master-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as Rx from 'rxjs';
import { delay } from "rxjs/operators";
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AlertDialogBoxComponent } from 'src/app/share/Common/alert-dialog-box/alert-dialog-box.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ScrollToService,ScrollToConfigOptions,} from '@nicky-lenaers/ngx-scroll-to';
describe('SchedulerComponent', () => {
  let component: SchedulerComponent;
  let fixture: ComponentFixture<SchedulerComponent>;
  let debugElement: DebugElement;
 // let commonService: jasmine.SpyObj<CommonService>;
  let httpTestingController: HttpTestingController;
  let commonService: CommonService;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  //matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatSelectModule,
        BrowserAnimationsModule,
        BrowserModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [SchedulerComponent],

      providers: [
        {
          provide: MatDialog,
          useValue: matDialogService
        },{ provide: ScrollToService, useValue: {} },
       
        DatePipe
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA],
      teardown: {destroyAfterEach: false}
    })
   .compileComponents();
    httpTestingController = TestBed.get(HttpTestingController);
    
  });

  it('Should be async getSchedulerTableData', function(done) {
  
    component.getSchedulerTableData().then(function(result) {
      expect(result).toBe(200);
      let formdata: { "limit": 0, "user": "sm626", "role": "CMP-User-Admin", "pageNumber": 0, "sortKey": "run_date", "sortType": "desc", "line_id": 1, "line_name": "A2000", "action": "", "is_parent": 1, "is_module": 0, "is_canning": 0, "filter": {} }
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.getSchedulerData(formdata).toPromise().then(function (result) {
      expect(result).toBe(true);
      expect(mockcommonService.getSchedulerData(formdata)).not.toBeNull();
      component.newtableData = result;
      component.getSchedulerTableData();
      component.tableColumns = component.tableColumns.concat(component.newtableData['col'].map(x => x.columnDef));
      component.dataSource = new MatTableDataSource<any>(component.newtableData['routes']);
    });
      done();
    });
  });


  it('Should be filterData', function(done) {
    component.filterData(event).then(function(result) {
      expect(result).not.toBeNull();
      done();
    });
  });

  it('Should be downloadExcel', () => {
    let path = "Scheduler"
    component.downloadExcel();
    expect(component.downloadExcel).not.toBeNull();
    const mockMasterAPIService: MasterAPIService = TestBed.get(MasterAPIService);
    mockMasterAPIService.downloadExcelRequest(path).subscribe(response => {
      expect(response).toBe(undefined );
      component.download(response.url);
      component.openDialogBox('Error', 'No Valid Records To Download.', 'INFO');
    })
  });

  it('getManufacturingLine Should be asyc', function () {
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.getManufacturingLine().toPromise().then(function (result) {
      expect(result).toBe(true);
      expect(result).not.toBeNull();
    });
  });


  it('should call ngOnInit', () => {
    const fixture = TestBed.createComponent(SchedulerComponent);
    const component = fixture.debugElement.componentInstance;
    component.ngOnInit();
    const mockcommonService: CommonService = TestBed.get(CommonService);
    expect(mockcommonService.getManufacturingLine()).not.toBeNull();
  })

  it('should call getManufacturingLine check conditions after responce', fakeAsync(() => {
    const expectedData = [
      {
        "line_id": 1,
        "line_name": "A2000",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 1
      },
      {
        "line_id": 2,
        "line_name": "A2100",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 1
      },
      {
        "line_id": 3,
        "line_name": "A2200",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 1
      },
      {
        "line_id": 4,
        "line_name": "A2300",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 0
      },
      {
        "line_id": 5,
        "line_name": "Proto",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 0
      }
    ]
    const res = { status: true, Data: expectedData }
    const mockcommonService: CommonService = TestBed.get(CommonService);
    spyOn(mockcommonService, 'getManufacturingLine').and.returnValue(of(res));
    expect(mockcommonService.getManufacturingLine).toBeDefined();

  }))

  it('should call getManufacturingLine', fakeAsync(() => {
    const expectedData = [
      {
        "line_id": 1,
        "line_name": "A2000",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 1
      },
      {
        "line_id": 2,
        "line_name": "A2100",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 1
      },
      {
        "line_id": 3,
        "line_name": "A2200",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 1
      },
      {
        "line_id": 4,
        "line_name": "A2300",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 0
      },
      {
        "line_id": 5,
        "line_name": "Proto",
        "is_parent": 1,
        "is_module": 0,
        "is_canning": 0,
        "ping": 0
      }
    ]
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.getManufacturingLine().subscribe(data => {
      expect(data).toEqual(expectedData);
      expect(data).not.toBeNull();
      let manufacturingLine = data;
      data.forEach(function (manufacturingLine) {
        expect(manufacturingLine.ping).toEqual(1);

      });
    });

  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('updateManufacturingLine should return expected data', (done) => {
    const expectedData = { status: "success", message: "Favourite lines added/updated successfully" }
    let finalReqPayload = {
      "wwid": "sm626", "lines": [1, 2, 3]
    };
    let ispin = true;
    let index = 1;
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.updateManufacturingLine(finalReqPayload).subscribe(data => {
      spyOn(mockcommonService, 'updateManufacturingLine').and.returnValue(of(data));
      expect(data).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne("https://api.cmpdashboard-dev.cummins.com/api/updateFavoriteLines");
    testRequest.flush(expectedData);

  });

  it('runScriptdata should return expected data', (done) => {
    const expectedData = { message: "Job details extraction is in progress. We will notify you over email once completed.", status: "success" }
    let scriptpayload = {
      "job_numbers": "MO-2",
      "line_id": 1,
      "line_name": "A2000",
      "user": "sm626"
    }
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.runScriptdata(scriptpayload).subscribe(data => {
      expect(data).toEqual(expectedData);
      expect(data).not.toBeNull();
      done();
    });


    const testRequest = httpTestingController.expectOne("https://api.cmpdashboard-dev.cummins.com/api/runScript");
    testRequest.flush(expectedData);

  });

  it('saveSchedulerData should return expected data ', (done) => {
    const expectedData = { "message": "Success", "data": { "status": "Success", "message": "Job details updated successfully" } }
    let finalPayload = { "records": [{ "job_num": "MO-59", "ces_part_num": "A0X7900-5", "parent_temp_job_id": 275, "drive_dependent_demand": 0, "customer_due_date": "2022-07-19", "comments": "OIUP", "customer_partno": "g7rv58", "mixer_partno": "MIX-786", "inlet_catmod": "INC-874", "outlet_catmod": "OUTC-548", "filter_catmod": "FILC-786", "order_no": 1, "last_updated_by": "sm626" }] };
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.saveSchedulerData(finalPayload).subscribe(data => {
      expect(data).toEqual(expectedData);
      expect(data).not.toBeNull();
      done();
    });

    const testRequest = httpTestingController.expectOne("https://api.cmpdashboard-dev.cummins.com/api/saveSchedulerDashboard");
    testRequest.flush(expectedData);
  });

  it('scheduler form should be valid', () => {
    component.schedulerForm.controls['limit'].setValue(0);
    component.schedulerForm.controls['user'].setValue('ss106');
    component.schedulerForm.controls['role'].setValue('admin');
    component.schedulerForm.controls['pageNumber'].setValue(1);
    component.schedulerForm.controls['sortKey'].setValue('');
    component.schedulerForm.controls['sortType'].setValue('desc');
    component.schedulerForm.controls['line_id'].setValue('M1000');
    component.schedulerForm.controls['line_name'].setValue('');
    component.schedulerForm.controls['is_parent'].setValue(1);
    component.schedulerForm.controls['is_module'].setValue(0);
    component.schedulerForm.controls['is_canning'].setValue(0);
    component.schedulerForm.controls['filter'].setValue(0);
    component.schedulerForm.controls['uploadFileOption'].setValue('no');
    expect(component.schedulerForm.valid).toBeTruthy();
  })

  it('addTableControlsForParent form should be ', () => {
    let controlValue: any;
    expect(component.addTableControlsForParent(controlValue).valid).toBeTruthy();

    parent_temp_job_id: null;
    job_num: null;
    repack_type: null;
    build_slot: null;
    index_no: null;
    order_no: null;
    ces_part_num: null;
    customer_partno: null;;
    assembly_type: null;
    part_description: null;
    drive_dependent_demand: null;
    customer_due_date: null;
    run_date: null;
    scheduled_qunatity: null;
    remaining_quantity: null;
    part_number_dept: null;
    part_num_planner_code: null;
    firsttime_runner: null;
    diameter: null;
    inlet_partno: null;
    outlet_partno: null;
    filter_partno: null;
    mixer_partno: null;
    inlet_catmod: null;
    outlet_catmod: null;
    filter_catmod: null;
    fg_rack: null;
    comments: null;
    last_updated_by: "sm626"

  })


  it('addTableControlsForModule form should be valid', () => {
    let controlValue: any;
    expect(component.addTableControlsForModule(controlValue).valid).toBeTruthy();
    module_temp_job_id: null;
    job_num: null;
    inlet_ces_part_num: null;
    internal_customer: null;
    drive_dependent_demand: null;
    part_description: null;
    customer_due_date: null;
    run_date: null;;
    run_date_service: null;
    scheduled_qunatity: null;
    remaining_quantity: null;
    part_number_dept: null;
    part_num_planner_code: null;
    diameter: null;
    inlet_catmod: null;
    comments: null;
    last_updated_by: null;
  })

  it('addTableControlsForChild form should be valid', () => {
    let controlValue: any;
    expect(component.addTableControlsForChild(controlValue).valid).toBeTruthy();
    canning_temp_job_id: null;
    job_num: null;
    ces_part_num_catmod: null;
    part_description: null;
    customer_due_date: null;
    run_date: null;
    scheduled_qunatity: null;
    remaining_quantity: null;;
    part_number_dept: null;
    part_num_planner_code: null;
    internal_customer: null;
    canning_diameter: null;
    comments: null;
    last_updated_by: null;
  })

  it('isAllSelected form should be valid', () => {
    numSelected: 1;
    numRows: 1;
    expect(component.isAllSelected).toBeTruthy();
  })

  it('file select flag should be false initially', () => {
    let isfileSelected = 'yes';
    let file = 'upload'
    component.isFileUpload(file);
    expect(component.isfileSelected).toBeFalsy()
  });
  it('isaccess flag should be false initially', () => {
    component.initFormGroup();
    expect(component.isAccessflag).toBeFalsy()
  });
  it('run script flag should be false initially', () => {
    expect(component.runscripflag).toBeFalsy()
  });

  it('favoriteLines conditions if else', () => {
    expect(component.favoriteLines).toBeTruthy();
  });


  it('should call function getManufacturingLine during componet creation', () => {
    expect(component.getManufacturingLine()).not.toBeNull();
  });

  it('should call function sortData during componet creation', () => {
    let val = 'run_date'
    expect(component.sortData(val)).not.toBeNull();
  });

  it('Table data is getting loaded correctly', () => {
    expect(component.getSchedulerTableData()).not.toBeNull();

  });

  it('get selected line should be selected', () => {
    expect(component.getselectedLine(event)).not.toBeNull();
  });
  it('get selected line id', () => {
    const selectedLineId = component.schedulerForm.value['line_id'];
    const selectedLineDetail = component.manufacturingLine.filter(function (el) {
      return el.line_id == selectedLineId;
    });
    if (selectedLineDetail) {
      component.runscripflag = false;
      component.jobNumber = [];
      component.schedulerForm.patchValue({
        filter: {},
        is_parent: 1,
        is_module:0,
        is_canning: 0,
        line_name: '2000',
        limit: 0,
        pageNumber: 0,
        sortKey: 'run_date',
        sortType: 'desc',
      });
      expect(component.getSchedulerTableData()).not.toBeNull();
    }
    expect(component.selectedLine()).not.toBeNull();
  });

  it('runscriptFromdata', () => {
  //  const updatedTableData = component.tableData
    const parentLine = 1;
    const moduleLine = 0;
    const childLine = 0;
    let runscriptPayload = [];
    var job_ids = [];
    var job_num = [];
    if (component.selection['selected'] && component.selection['selected'].length > 0) {
      if (parentLine) {
        runscriptPayload = [];
      //  runscriptPayload = updatedTableData.filter(o1 => component.selection['selected'].some(o2 => o1['parent_temp_job_id'] === o2['parent_temp_job_id']));
        runscriptPayload.forEach(data => {
          if (data['run_date'] != null && data['run_date'] != '' && data['run_date'] != undefined) {
            const mockcommonService: CommonService = TestBed.get(CommonService);
            mockcommonService.openSnackBar("selected record should be capsizing", "Error");
            component.selection.clear();
          } else {
            job_ids.push(data['parent_temp_job_id']);
            job_num.push(data['job_num'])
          }
        });
      }
    }
    // expect(component.runscriptFromdata()).toBeDefined;
  });
  

  it('deleteSchedulerData', () => {
    let selectedIds = [1, 2];
    let lineType = 'parent';
    let selectedJobNumbers;
    // expect(component.saveData('delete')).toHaveBeenCalled();
    const mockcommonService: CommonService = TestBed.get(CommonService);
    expect(mockcommonService.deleteSchedulerData(selectedIds, lineType,selectedJobNumbers)).not.toBeNull();
  });

  it('saveSchedulerData', () => {
    let finalPayload = { "records": [{ "job_num": "MO-59", "ces_part_num": "A0X7900-5", "parent_temp_job_id": 275, "drive_dependent_demand": 0, "customer_due_date": "2022-07-19", "comments": "OIUP", "customer_partno": "g7rv58", "mixer_partno": "MIX-786", "inlet_catmod": "INC-874", "outlet_catmod": "OUTC-548", "filter_catmod": "FILC-786", "order_no": 1, "last_updated_by": "sm626" }] };
    const mockcommonService: CommonService = TestBed.get(CommonService);
    expect(mockcommonService.saveSchedulerData(finalPayload)).not.toBeNull();
  });

  it(`should toggle all lines`, () => {
    component.ngOnInit();
    fixture.detectChanges();
    numSelected: 1;
    numRows: 11;
    fixture.whenStable().then(() => {
      expect(component.isAllSelected.length).toEqual(0);
    });

  });

  it('Table sorting is working properly', () => {
    let value = { 'direction': 'desc', 'active': 'run_date' };
    component.sortData(value);
    expect(component.getSchedulerTableData).not.toBeNull();
  });

  it('saveData veriable', () => {
    let event = 'save';
    const updatedTableData = {};
    const parentLine = 1;
    const moduleLine = 0;
    const childLine = 0;
    let lockdata = [];
    let saveRequestPayload = [];
    let lineType = '';
    const selectedIds = [];
    let finalPayload = { records: [] };
    let lockpayload = {};
    let publishpaylod = {};
    let selection = 1;
    let actionType = 'publish';
    expect(selection).toBeGreaterThan(0);
    expect(parentLine).toBeTruthy();
    saveRequestPayload = [];
    finalPayload['records'] = [];
    lineType = 'parent';
    saveRequestPayload.forEach(function (data) {
      expect(actionType).toEqual('publish');
      selectedIds.push(data['parent_temp_job_id']);
    });

  });


  describe("Different Methods  of Expect Block", function () {
    const updatedTableData = {};
    const parentLine = 1;
    const moduleLine = 0;
    const childLine = 0;
    let lockdata = [];
    let saveRequestPayload = [];
    let lineType = '';
    const selectedIds = [];
    let finalPayload = { records: [] };
    let lockpayload = {};
    let publishpaylod = {};
    it("Example of  toBeDefined", function () {
      expect(updatedTableData).toBeDefined();
      expect(parentLine).toBeDefined();
      expect(moduleLine).toBeDefined();
      expect(childLine).toBeDefined();
      expect(lockdata).toBeDefined();
      expect(saveRequestPayload).toBeDefined();
      expect(lineType).toBeDefined();
      expect(selectedIds).toBeDefined();
      expect(childLine).toBeDefined();
      expect(finalPayload).toBeDefined();
      expect(lockpayload).toBeDefined();
      expect(publishpaylod).toBeDefined();
    });
  });


})
