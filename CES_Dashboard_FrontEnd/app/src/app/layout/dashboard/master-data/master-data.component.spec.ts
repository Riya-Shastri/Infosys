import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataComponent } from './master-data.component';
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
import { RouterTestingModule } from '@angular/router/testing';

describe('MasterDataComponent', () => {
  let component: MasterDataComponent;
  let fixture: ComponentFixture<MasterDataComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataComponent ],
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
        BrowserAnimationsModule,
        RouterTestingModule
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
    fixture = TestBed.createComponent(MasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
  var subMenu: any = [];
  var currentTabIndex = 0;
});
it('should call ngoninit', () => {
  let currentURL;
  if (currentURL) {
    const laser = currentURL.indexOf("laser-md");
    const proto = currentURL.indexOf("proto");
    const RecipeMasterData = currentURL.indexOf("master/data");
    const location = currentURL.indexOf("location");
    const department = currentURL.indexOf("department-priority");
    const capsize = currentURL.indexOf("capsize");
    const planner = currentURL.indexOf("planner")
  }
  let proto;
  let RecipeMasterData;
  let laser;
  let location;
  let department;
  let capsize;
  let planner
  if (proto > 0) {
    component.currentTabIndex = 1;
  } else if (RecipeMasterData > 0) {
    component.currentTabIndex = 2;
  } else if (laser > 0) {
    component.currentTabIndex = 0;
  } else if (location > 0) {
    component.currentTabIndex = 3;
  } else if (department > 0) {
    component.currentTabIndex = 4;
  } else if (capsize > 0) {
    component.currentTabIndex = 5;
  } else if (planner > 0) {
    component.currentTabIndex = 6;
  }
});
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
