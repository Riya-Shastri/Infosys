import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialStatusComponent } from './material-status.component';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/share/Services/common.service';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
describe('MaterialStatusComponent', () => {
  let component: MaterialStatusComponent;
  let fixture: ComponentFixture<MaterialStatusComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialStatusComponent],
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
    fixture = TestBed.createComponent(MaterialStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var tableColumns = [];
    var tableColumns2 = [];
    var totalRecords: any;
    var dataSource: any = [];
    var dataSource2: any = [];
    var detaiMaterialData: any;
    var materialPayload: any;
    var newComment = null;
    var wwId = '';

    var columns = [
      { columnDef: 'comp_number', header: 'Component No.' },
      { columnDef: 'message', header: 'Message' },
      { columnDef: 'mat_qty_short_ud', header: 'Updated Date' },

    ];
    var columns2 = [
      { columnDef: 'user_comments', header: 'Comments' },
      { columnDef: 'created_by', header: 'Updated By' },
      { columnDef: 'created_date', header: 'Updated Date' }

    ];
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  it('declare variables', () =>{
  var   tableColumns = [];
  var tableColumns2 = [];
  var totalRecords: any;
  var dataSource: any = [];
  var dataSource2: any = [];
  var detaiMaterialData: any;
  var aterialPayload : any;
  var newComment = null;
  var wwId = '';
  var columns = [
    { columnDef: 'comp_number', header: 'Component No.' },
    { columnDef: 'message', header: 'Message' },
    { columnDef: 'mat_qty_short_ud', header: 'Updated Date' },
  ];
  var columns2 = [
    { columnDef: 'user_comments', header: 'Comments' },
    { columnDef: 'created_by', header: 'Updated By' },
    { columnDef: 'created_date', header: 'Updated Date' }
    
  ]; 
  });
});
