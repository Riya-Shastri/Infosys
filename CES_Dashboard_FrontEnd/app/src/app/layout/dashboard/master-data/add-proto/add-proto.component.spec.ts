import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProtoComponent } from './add-proto.component';
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

describe('AddProtoComponent', () => {
  let component: AddProtoComponent;
  let fixture: ComponentFixture<AddProtoComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProtoComponent ],
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
    fixture = TestBed.createComponent(AddProtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    protoTypeForm: FormGroup;
    var submitted = false;
    var apiError;
    var isEditPage = false;
    var proto_id = null;
    var dropDownDef = ["Yes", "No"];
    var dataSource: any = [];
    var ces_tla_part: any;
    var repack_type: any;
    var inlet_catmod: any;
    var outlet_catmod: any;
    var filter_catmod: any;
    var mixer: any;
    var build_slot: any;
    var fg_rack: any;
    var totalrecords: any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should be create for getProtoTableData', () => {
    expect(component.getProtoTableData()).not.toBeNull();    
  });
});
