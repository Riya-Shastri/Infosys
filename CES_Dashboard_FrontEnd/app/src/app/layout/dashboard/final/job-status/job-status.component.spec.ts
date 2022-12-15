import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobStatusComponent } from './job-status.component';
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
describe('JobStatusComponent', () => {
  let component: JobStatusComponent;
  let fixture: ComponentFixture<JobStatusComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobStatusComponent ],
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
    fixture = TestBed.createComponent(JobStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('declare veriables', () => {
  var jobStatusForm: FormGroup;
  var selected: any;
  var jobStatusDropdown = [];
  var job_status: any = '';
  var parentJobId: any;
  var jobStatusId: any;
  var line_id: any;
  var commentList = [];
  var getAllData: any;
  var WWID: any;
  var manufacturingLine: any;
  var close = false;
  var dataSource: any = [];
  var isComplete: any;
  var commentsval: any;
});

  // it('initFormGroup test', () => {
  //     let controlValue: any;
  //     expect(component.initFormGroup(controlValue)).toBeTruthy();
      
  // });
  
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

//   it('Should be async fetchComment', async () => { (function(done) {
  
//     component.fetchComment().then(function(result) {
//       expect(result).toBe(200);
//       let formdata: { 
//         sortKey: "comment_id",
//         sortType: "Desc",
//         is_parent: 1,
//         is_module: 0,
//         is_canning: 0,
//         job_id: 100,
//         status_type: 'jobstatus'
//        }
//     const commonService: CommonService = TestBed.get(CommonService);
//     commonService.fetchCommentData(formdata).toPromise().then(function (result) {
//       expect(result).toBe(true);
//       expect(commonService.fetchCommentData(formdata)).not.toBeNull();
//       component.fetchComment();
//     });
//       done();
//     });
//   })
// });
});
