import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlannerCodeComponent } from './add-planner-code.component';
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

describe('AddPlannerCodeComponent', () => {
  let component: AddPlannerCodeComponent;
  let fixture: ComponentFixture<AddPlannerCodeComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlannerCodeComponent ],
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
    fixture = TestBed.createComponent(AddPlannerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    addPlannerCodeForm: FormGroup;
    var submitted = false;
    var apiError;
    var dataSource: any = [];
    var close = false;
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // it('should be create for savePlannerCodeData', (done) =>{
  //   const expectedData = { "message": "Success", "data": { "status": "Success", "message": "Job details updated successfully" } }
  //   let finalForm ={ "records" :[{"flag": "No", "last_updated_by":"Soumya Bose","last_updated_date":"2022-11-03T03:21:57","planner_code":"4","planner_code_id":"85"}]}
  //   let isEditPage = { "records" :[{"isEditPage" : "True"}]}
  //   let planner_code_id = { "records":[{"planner_code_id":"85"}]}
  //   const mockcommonService: MasterAPIService = TestBed.get(MasterAPIService);
  //   mockcommonService.addPlannerCodeData(finalForm, isEditPage, planner_code_id).subscribe(data =>{
  //     expect(data).toEqual(expectedData);
  //     expect(data).not.toBeNull();
  //     done();
  //   })
  //   const testRequest = httpTestingController.expectOne("https://api.cmpdashboard-dev.cummins.com/api/plannercode");
  //   testRequest.flush(expectedData);
  // });

  it('should be create for getTableData', () => {
    expect(component.getTableData()).not.toBeNull();    
  });
  it ('should be create for f', () =>{
    expect(component.addPlannerCodeForm.controls).toBeTruthy();
  });

});
