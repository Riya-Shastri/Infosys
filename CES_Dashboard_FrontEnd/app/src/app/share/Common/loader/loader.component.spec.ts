import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef,MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { analyze } from 'eslint-scope';
import { CommonService, } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
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
import { NgxFileDropEntry } from 'ngx-file-drop';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonService: CommonService;
  let matDialogService: jasmine.SpyObj<MatDialog>;
   matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderComponent ],
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
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialog,
          useValue: matDialogService
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        DatePipe,
        CommonService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
   var show: Boolean = false;
  var color = 'warn';
  var mode: any = 'indeterminate';
  var value = 50;
  var isLoading: boolean = false;

  });
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
