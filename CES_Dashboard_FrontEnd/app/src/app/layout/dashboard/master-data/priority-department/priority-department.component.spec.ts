import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityDepartmentComponent } from './priority-department.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterDataModule } from '../master-data.module';
import { LoaderComponent } from 'src/app/share/Common/loader/loader.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';

describe('PriorityDepartmentComponent', () => {
  let component: PriorityDepartmentComponent;
  let fixture: ComponentFixture<PriorityDepartmentComponent>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityDepartmentComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        MasterDataModule,
        BrowserAnimationsModule,
        RouterTestingModule

      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MasterAPIService, useValue: {} },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: DatePipe, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var componentName: any = 'DepartmentPriority';
    var totalRecords: any;
    var dataSource: any = [];
    var columns = [
      { columnDef: 'department_name', header: 'Department Name' },
      { columnDef: 'priority_mat_alloc', header: 'Priority for Material Allocation' },
      { columnDef: 'last_updated_by', header: 'Last Updated By' },
      { columnDef: 'last_updated_date', header: 'Last Updated Date' },
      { columnDef: 'action', header: 'Action' }
    ];
  });

   it('should call oninit', () => {
    component.dataSource = [];
    component.initFormGroup();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
