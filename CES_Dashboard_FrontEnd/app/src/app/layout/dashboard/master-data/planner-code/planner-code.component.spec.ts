import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlannerCodeComponent } from './planner-code.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterDataModule } from '../master-data.module';
import { LoaderComponent } from 'src/app/share/Common/loader/loader.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
describe('PlannerCodeComponent', () => {
  let component: PlannerCodeComponent;
  let fixture: ComponentFixture<PlannerCodeComponent>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerCodeComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        MasterDataModule,
        BrowserAnimationsModule,
        RouterTestingModule
        
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MasterAPIService, useValue: {} },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: DatePipe, useValue: {} },
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
   var dataSource: any = [];
   var componentName: any = 'PlannerCode';
   var totalRecords: any;
   var currentPageSize: number = 10;
   var pageIndex: number = 0;
   var sortKey: string = "planner_code";
    var sortType: string = "DESC";
    var sortedPageIndex = 0;
    var columns = [
      {columnDef : 'planner_code', header: 'Planner Code'},
      {columnDef : 'bom_check', header: 'Bom Check'},
      {columnDef : 'material_script_check', header: 'Material Script Check'},
      {columnDef : 'planning_script_check', header: 'Planning Script Check'},
      {columnDef : 'last_updated_by', header: 'Last Updated By'},
      {columnDef : 'last_updated_date', header :'Last Updated Date'},
      {columnDef: 'action', header: 'Action'}
    ];
    
  });


  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  
  // it('should be create for getPlannerCodeData', function(done) {
  //   component.getPlannerCodeData().then(function (result) {

  //   })      
  // })
});
