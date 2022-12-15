import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLocationDataComponent } from './add-location-data.component';
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

describe('AddLocationDataComponent', () => {
  let component: AddLocationDataComponent;
  let fixture: ComponentFixture<AddLocationDataComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLocationDataComponent ],
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
    fixture = TestBed.createComponent(AddLocationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
  var locationDataForm: FormGroup;
  var submitted = false;
  var apiError;
  var isEditPage = false;
  var location_id = null;
  var close = false;
  var dataSource: any = [];
  var dropDownDef = ["Yes", "No"]
  var totalrecords: any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be create for getLocationTableData', () => {
    expect(component.getLocationTableData()).not.toBeNull();    
  });
});
