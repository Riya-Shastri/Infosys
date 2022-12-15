import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricsComponent } from './metrics.component';
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


describe('MetricsComponent', () => {
  let component: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetricsComponent],
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
    fixture = TestBed.createComponent(MetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var componentName = 'Metrics';
    var metricsForm: FormGroup;
    var metricsTableForm: FormGroup;
    var manufacturingLine = [];
    var newtableData = {};
    var dataSource: any = [];
    var wwId = '';
    var favoriteLines = [];
    var userRole = '';
    var norecord = false;
    var isAccessflag: boolean = false;
    var todayDate = '';
  });
  it('addTableControls form should be ', () => {
    let controlValue: any;
    expect(component.addTableControls(controlValue).valid).toBeTruthy();
    qty_comp_sum: null;
    qty_comp_sum_s1: null;
    qty_comp_sum_s2: null;
    qty_comp_sum_s3: null;
    qty_sch_sum: null;
    run_date: null;
    sch_adh: null;
    sch_count:  null;
  
  });

  it('should call download', () => {
    let file_url;
    let fileUrl = file_url;
    var fileLink = document.createElement('a');
    document.body.appendChild(fileLink);
    fileLink.href = fileUrl;
  //  expect(component.download(file_url)).not.toBeNull();
  });

  it('get selected line should be selected', () => {
    expect(component.selectedLine()).not.toBeNull();
  });
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
