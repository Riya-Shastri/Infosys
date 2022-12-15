import { ComponentFixture, TestBed, async, fakeAsync, tick  } from '@angular/core/testing';
import { PlanningStatusComponent } from './planning-status.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CommonService} from 'src/app/share/Services/common.service';
import { CommonLogicService} from 'src/app/share/Services/common-logic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';;
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PlanningStatusComponent', () => {
  let component: PlanningStatusComponent;
  let fixture: ComponentFixture<PlanningStatusComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  //let commonServices: CommonService;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningStatusComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('declare veriables', () => {
    var tableColumns = [];
    var totalRecords: any;
    var dataSource: any = [];
    var detaiPlanningData: any;
    var planningPayload : any;
  
    var columns = [
      {columnDef:'comp_number', header: 'Component No.'},
      {columnDef: 'message', header: 'Message'},
      {columnDef: 'plan_qty_short_ud', header: 'Updated Date'},
      {columnDef: 'plan_user_comments', header: 'User Comments'},
      {columnDef: 'plan_user_comments_ub', header: 'Updated By'},
      {columnDef: 'plan_user_comments_ud', header: 'User Updated Date'},
  
    ]
  });
});
