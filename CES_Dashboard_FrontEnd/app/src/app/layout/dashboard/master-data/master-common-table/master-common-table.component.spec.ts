import { ComponentFixture, TestBed} from '@angular/core/testing';

import { MasterCommonTableComponent } from './master-common-table.component';
import { MatDialog,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
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

describe('MasterCommonTableComponent', () => {
  let component: MasterCommonTableComponent;
  let fixture: ComponentFixture<MasterCommonTableComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterCommonTableComponent ],
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
    fixture = TestBed.createComponent(MasterCommonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

//   it('declare veriables', () => {
//   var dataSource: any;
//   var displayedColumns: any = [];
//   var pageIndex: any;
//   var pageLength: any;
//   var currentPageSize: any;
//   var norecord: boolean = false;
// var defaultShortKey: 'DESC';

//   });


// it('onPaginateChange Testing', () => {
//   const preventDefaultSpy = spyOn(event, 'preventDefault').and.stub();
//   component.onPaginateChange(event);

//   expect(preventDefaultSpy).not.toHaveBeenCalled(); 
// });
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
