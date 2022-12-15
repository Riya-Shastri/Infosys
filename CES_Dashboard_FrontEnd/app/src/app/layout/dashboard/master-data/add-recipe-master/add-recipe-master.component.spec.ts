import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { AddRecipeMasterComponent } from './add-recipe-master.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/share/Services/common.service';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddRecipeMasterComponent', () => {
  let component: AddRecipeMasterComponent;
  let fixture: ComponentFixture<AddRecipeMasterComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecipeMasterComponent ],
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
    fixture = TestBed.createComponent(AddRecipeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('declare veriables', () => {
    addRecipeMasterForm: FormGroup;
    var submitted = false;
    var apiError;
    var isEditPage = false;
    var cespart_details_id = null;
    var assemplyDropDown = ["TLA", "WLA", "SERVICE"];
    var auditDropDown = ["ABS", "DNV GL"];
    var sizeDropDown = ["String"];
    var dropDownDef = ["Yes"];
    var dataSource: any = [];
    var close = false;
    var totalrecords: any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be create for getTableData', () => {
    expect(component.getTableData()).not.toBeNull();    
  });
});

