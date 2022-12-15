import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapsizingDataComponent } from './capsizing-data.component';
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
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ChangeDetectorRef } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
describe('CapsizingDataComponent', () => {
  let component: CapsizingDataComponent;
  let fixture: ComponentFixture<CapsizingDataComponent>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
  // let commonServices: jasmine.SpyObj<CommonService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CapsizingDataComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        MasterDataModule,
        RouterTestingModule,
        BrowserAnimationsModule
        
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MasterAPIService, useValue: {} },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapsizingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
  var componentName: any = 'CapSizingData';
  var columns = [
    { columnDef: 'line_name', header: 'Manufacturing Line' },
    { columnDef: 'capsize', header: 'CapSize' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ];
  var dataSource: any = [];
  var totalRecords : any;
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
