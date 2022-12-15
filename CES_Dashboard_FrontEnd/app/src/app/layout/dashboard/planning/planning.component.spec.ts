import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanningComponent } from './planning.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By, BrowserModule } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CommonService } from 'src/app/share/Services/common.service';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';

describe('PlanningComponent', () => {
  let component: PlanningComponent;
  let fixture: ComponentFixture<PlanningComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogService
        },
        DatePipe,
        CommonService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var dataSource: any = [];
    var filterval: any;
    var componentName: any = 'Planning';
    var totalRecords: any;
    var currentPageSize: number = 10;
    var pageIndex: number = 0;
    var sortKey: string = "run_date";
    var sortType: string = "ASC";
    var rowIndex: any;
    var tableColumns = [];
    var tableData: any = [];
    var selection = new SelectionModel<any>(true, []);
    var PlannerCodeList = [];
    var selectedplannercode: any;
    var selectedplannercodedefault: any;
    var isPlannerSelected: boolean = false;
    var selectedval = 'ALL';
    var WWID: any;
    var columns = [
      { columnDef: 'run_date', header: 'Run Date' },
      { columnDef: 'component', header: 'Component' },
      { columnDef: 'qty_short', header: 'Qty Short' },
      { columnDef: 'supplier', header: 'Supplier' },
      { columnDef: 'planner_comments', header: 'Comments' },
      { columnDef: 'last_updated_by', header: 'Updated By' },
      { columnDef: 'last_updated_date', header: 'Updated Date' },
    ];
  });
  it('selectedPlannerCode', () => {
    var plannercode_code;
    component.selectedplannercode = plannercode_code;
    component.selectedplannercodedefault = component.selectedplannercode;
    component.filterval = {};
    const mockcommonService: CommonService = TestBed.get(CommonService);
    mockcommonService.setClearFilterAction('reset');
    expect(component.selectedPlannerCode(plannercode_code)).not.toBeNull();
  });



  it('#getPlannerCode should be define', (done) => {
    let response = { "totalRecords": 26, "routes": [{ "planner_code_id": 95, "planner_code": "CMP PLAN 3", "bom_check": "Yes", "material_script_check": "No", "planning_script_check": "No", "last_updated_by": "Yashraj Vijay", "last_updated_date": "2022-11-23T07:57:40" }, { "planner_code_id": 90, "planner_code": "p-997", "bom_check": "No", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Ayush Soni", "last_updated_date": "2022-11-16T03:50:29" }, { "planner_code_id": 85, "planner_code": "4", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-03T03:21:57" }, { "planner_code_id": 83, "planner_code": "6", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-03T02:23:14" }, { "planner_code_id": 82, "planner_code": "456", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-03T02:07:53" }, { "planner_code_id": 81, "planner_code": "1234", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-03T01:58:06" }, { "planner_code_id": 80, "planner_code": "123", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-03T01:57:34" }, { "planner_code_id": 79, "planner_code": "1", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-03T00:09:01" }, { "planner_code_id": 77, "planner_code": "abcd", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": "Soumya Bose", "last_updated_date": "2022-11-02T08:32:10" }, { "planner_code_id": 76, "planner_code": "DJHD", "bom_check": "Yes", "material_script_check": "Yes", "planning_script_check": "Yes", "last_updated_by": null, "last_updated_date": "2022-11-02T02:08:31" }] };
    let paylod = { "limit": 10, "pageNumber": 1, "sortKey": "last_updated_date", "sortType": "desc" };
    const mockcommonService: CommonService = TestBed.get(CommonService);
    spyOn(mockcommonService, 'getPlannercode').and.returnValue(of(response));
    component.getPlannerCode()
    {
      expect(mockcommonService.getPlannercode).toHaveBeenCalled();
      done();
    }
  });


  it('#exportBtnClick should be define', (done) => {
    let response = { "url": "https://cmpdashboard-docs-dev-bucket.s3.amazonaws.com/excelDownload/planning_screen_ALL_sm626_20221128_122516.xlsx?AWSAccessKeyId=ASIA5DYEMB2Q5PZM5OEX&Signature=ulZSsStgVLwMXrisEKa7%2B8GDZA8%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEC0aCXVzLWVhc3QtMSJHMEUCIE0wt5wGC94Vc9EmsuGUt8on5PHBG6ob6Kt2jdYFyyFXAiEAhEdvI1jeZF3xZCrgnYdyEGNpht1w8ySFswXuJg6e4T0qlQMIRhADGgw5MDE0MTU0NDAwMzMiDLmdzmiUbCihum4toiryAstPM07qsIpzBFjVlIlrYG6GubfMKGQ%2FvdP1JtCxPG487NuJsZb0pij6DoD0rIb9CA8a7kXQ5%2Bszgx5xIwu%2FVJkJY%2BuzTggvA7a1dG4fs4LlXjDeqNuoARA8xaXRvwy5bi4EwB9NqmyB1kMvsH9%2B3GSLxoCfsZv8jFt9mD8N3E0WHpMjICtFkQeWXgwFJnYwK1DREjDUIqqj%2B7ALPRAs7u234NipZ6D1%2FWpIG0lc5d%2BMWrn9x%2FlliZN0os3XsqcTiLB8KF1jN7FScZ4RDHzljMQXS7JuBf12Jv4rL1m56jfm6Ep2Y7N7p0agvMj5799mhgyAcV8KtyTWesASEq%2Bv2OZCS7s3kSu488w4xN8c8teFrhirSgWAR9Sr7HsEI2q9Ffr1FZLhqJlXGCB%2B9T3fdB2%2FKGORcNyMDtqPUbT0cIv1%2Fdxhj0alfw91qjjQae3woWNeuavuS8jIRqcdffLc5K%2BZ68sIgxZnScyaDyW2vhwtK4swq9GSnAY6nQGwxvm7X%2BEvajAAZnzR7e%2FDMH2QfZcHj2CVWnjLrClHcjn%2BLrf5%2FBR9BieGk%2FMNOLv0m8p5R5NSAD8u%2B9qNCB2fNOJ6al2WVjIiWWJ0rNPBSAlthy%2FHqxwrDpfv9Pyf8o6%2FPvkGQo0jvK%2B8EDx%2FT4E%2BfqD0pmRnBbWiBwsp6mTm4QIQfh2PHdL5OvtWzsft4smmZOnUhc6WPwANkL7r&Expires=1669638625" };
    let btnType = 'export-to-excel';
    let paylod = { "limit": 10, "pageNumber": 1, "sortKey": "run_date", "sortType": "ASC", "filter": {}, "planner_code": "ALL", "action": "export-to-excel", "user": "sm626" }
    const mockcommonService: CommonService = TestBed.get(CommonService);
   // spyOn(mockcommonService, 'getPlannercodeTabledata').and.returnValue(of(response));
    component.exportBtnClick(btnType)
    {
      window.onbeforeunload = () =>
     //mockcommonService.getPlannercodeTabledata(response);
      expect(mockcommonService.getPlannercodeTabledata).toHaveBeenCalled();
      done();
    }
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
