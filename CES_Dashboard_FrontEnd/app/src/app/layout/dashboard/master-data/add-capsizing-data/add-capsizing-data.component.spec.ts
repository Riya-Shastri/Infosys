import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCapsizingDataComponent } from './add-capsizing-data.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service'
describe('AddCapsizingDataComponent', () => {
  let component: AddCapsizingDataComponent;
  let fixture: ComponentFixture<AddCapsizingDataComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCapsizingDataComponent],
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
        { provide: MatDialogRef, useValue: matDialogService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        DatePipe,
        CommonService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCapsizingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var capsizingForm: FormGroup;
    var submitted = false;
    var apiError;
    var isEditPage = false;
    var close = false;
    var ManufacturingLine = [];
    var capsize_id = null;
    var dataSource: any = [];
    var selectedLine = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be create for getCapsizingTableData', () => {
    expect(component.getCapsizingTableData()).not.toBeNull();
  });
  it('should be create for getManufactureLine', () => {
    expect(component.getManufactureLine()).not.toBeNull();
  });

  // it('#saveCapsizeData should be define', (done) => {
  //   let response = {"status": "error", "message": "CapSizing Master data already exists"};
  //   let paylod = { "line_id": 9, "capsize": 5, "created_by": "sm626" };
  //   let isEditPage = false;
  //   let capsize_id = '1';
  //   let valid=true;
  //   const mockMasterAPIService: MasterAPIService = TestBed.get(MasterAPIService);
  //   spyOn(mockMasterAPIService, 'addCapsizingData').and.returnValue(of(response));
  //   component.saveCapsizeData(valid)
  //     .then(r => {
  //       expect(mockMasterAPIService.addCapsizingData).toHaveBeenCalled();
  //       done();
  //     })
  //     .catch(e => fail(e));
  // });
});
