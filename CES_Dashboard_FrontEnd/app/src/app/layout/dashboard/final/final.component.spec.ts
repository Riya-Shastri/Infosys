
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FinalComponent } from './final.component';
import { CommonService } from 'src/app/share/Services/common.service';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SelectionModel } from '@angular/cdk/collections';
import {ScrollToService,ScrollToConfigOptions,} from '@nicky-lenaers/ngx-scroll-to';

describe('FinalComponent', () => {
  let component: FinalComponent;
  let fixture: ComponentFixture<FinalComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      declarations: [FinalComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: matDialogService
        }, { provide: ScrollToService, useValue: {} },
        DatePipe,
        CommonService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('declare veriables', () => {
    var componentName = 'Final';
    var selected: any;
    var finalForm: FormGroup;
    var finalTableForm: FormGroup;
    let files: NgxFileDropEntry[] = [];
    let addOnBlur = true;
    let jobNumber = [];
    let isfileSelected = false;
    let mfline: any;
    var manufacturingLine = [];
    var kitDropDown = [];
    var mfgQualityDropDown = [];
    var seqDropDown = [];
    var subAssemblyDropDown = [];
    var QSubAssemblyDropDown = [];
    var jobStatusDropDown = [];
    var kitStatusValue = [];
    var mfgQualityValue = [];
    var seqDropDownValue = [];
    var subAssemblyvalue = [];
    var qSubAssemblyvalue = [];
    var jobStatusValue = [];
    var newtableData = {};
    var tableColumns = [];
    var dataSource: any = [];
    var selection = new SelectionModel<any>(true, []);
    var wwId = '';
    var favoriteLines = [];
    var userRole = '';
    var norecord = false;
    var isAccessflag = false;
    var jobStatusId: any;
    var selectedKitStatus: any = {};
    var newComment = null;
    var commentList = [];
    var selectedJobId = '';
    var actionType = null;
  });

  it('saveComment should be call', () => {
    let data;
    const parentLine = 1;
    const moduleLine = 0;
    const canningLine = 0;
    component.newComment = 'abc';
    expect(component.newComment).toBeTruthy();
  });

  it('addTableControlsForParent form should be ', () => {
    let controlValue: any;
    expect(component.addTableControlsForParent(controlValue).valid).toBeTruthy();

    parent_temp_job_id: null;
    catmod_no_singlebody: null;
    customer_partno: null;
    job_num: null;
    sequence: null;
    repack_type: null;
    build_slot: null;
    index_no: null;;
    order_no: null;
    ces_part_num: null;
    assembly_type: null;
    part_description: null;
    material_ordering_style: null;
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
    last_updated_by: 'sm626';
    seq: null;
    materials: null;
    kits: null;
    mfg_quality: null;
    planning: null;
    sub_assesmbly: null;
    job_status: null;
    style_number: null;
    length: null;
    sub_assembly_q_section: null;
    sub_assembly_formit: null;
    catmod_mo_number: null;
    catmod: null
    customer_part_number: null;
    audit: null;
    size: null;
    sheet_steel: null;
    stamp: null;
    flare_pierce_guage: null;
    material_gauge: null;
    manual_roll: null;
    weld: null;
    coin: null;
    department: null;
    cut: null;
    internal_customer: null;
    is_moved: null;
    is_published_finaldb: null;
    lucas: null;
    mfg_qa_status_id: null;
    seq_status_id: null;
    kit_status_id: null;
    subassembly_status_id: null;
    subassembly_q_status_id: null;
    jobstatus_id: null;

  })
  it('addTableControlsForModule form should be ', () => {
    let controlValue: any;
    expect(component.addTableControlsForModule(controlValue).valid).toBeTruthy();
    module_temp_job_id: null;
    job_num: null;
    inlet_ces_part_num: null;
    internal_customer: null;
    drive_dependent_demand: null;
    part_description: null;
    customer_due_date: null;
    run_date: null
    run_date_service: null;
    scheduled_qunatity: null;
    remaining_quantity: null;
    part_number_dept: null;
    part_num_planner_code: null;
    diameter: null;
    inlet_catmod: null;
    comments: null;
    last_updated_by: null;
    seq: null;
    materials: null;
    kits: null;
    mfg_quality: null;
    planning: null;
    sub_assesmbly: null;
    job_status: null;
    outlet_ces_part_num: null;
    outlet_catmod: null;
    filter_ces_part_num: null;
    filter_catmod: null;
    mixer_ces_part_num: null;
    mfg_qa_status_id: null;
    seq_status_id: null;
    kit_status_id: null;
    subassembly_status_id: null;

  })

  it('addTableControlsForChild form should be ', () => {
    let controlValue: any;
    expect(component.addTableControlsForChild(controlValue).valid).toBeTruthy();
    canning_temp_job_id: null;
    job_num: null;
    ces_part_num_catmod: null;
    part_description: null;
    customer_due_date: null;
    run_date: null;
    scheduled_qunatity: null;
    remaining_quantity: null;
    part_number_dept: null;
    part_num_planner_code: null;
    internal_customer: null;
    canning_diameter: null;
    comments: null;
    last_updated_by: null;
    diameter: null;
    seq: null;
    materials: null;
    kits: null;
    mfg_quality: null;
    planning: null
    job_status: null;
    style: null;
    tla_wla: null;
    length: null;
    mfg_qa_status_id: null;
    seq_status_id: null;
    kit_status_id: null;
    subassembly_status_id: null;
  })
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });


  it(`should toggle all lines`, () => {
    component.ngOnInit();
    fixture.detectChanges();
    numSelected: 1;
    numRows: 11;
    fixture.whenStable().then(() => {
      expect(component.isAllSelected.length).toEqual(0);
    });
  });

});

