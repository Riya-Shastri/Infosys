import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLaserMdComponent } from './add-laser-md.component';
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

describe('AddLaserMdComponent', () => {
  let component: AddLaserMdComponent;
  let fixture: ComponentFixture<AddLaserMdComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLaserMdComponent ],
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
    fixture = TestBed.createComponent(AddLaserMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
  var laserRecipeForm: FormGroup;
  var submitted = false;
  var apiError;
  var isEditPage = false;
  var laser_md_id = null;
  var ces_part_rolledbody: any;
  var ces_part_flat: any;
  var diameter: any;
  var length: any;
  var mat_gauge_flat: any;
  var cut: any;
  var stamp: any;
  var flare_pierce_gauge: any;
  var manual_roll: any;
  var weld: any;
  var coin: any;
  var lucas: any;
  var close = false;
  var dropDownDef = ["Yes"];
  var dropDownFPG = ["FPG", "FP", "FG", "PG"];
  var dataSource: any = [];
  var totalrecords: any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be create for getTableData', () => {
    expect(component.getTableData()).not.toBeNull();    
  });
});
