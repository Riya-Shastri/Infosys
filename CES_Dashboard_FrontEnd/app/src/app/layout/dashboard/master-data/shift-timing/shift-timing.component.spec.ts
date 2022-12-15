
import { ShiftTimingComponent } from './shift-timing.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
describe('ShiftTimingComponent', () => {
  let component: ShiftTimingComponent;
  let fixture: ComponentFixture<ShiftTimingComponent>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftTimingComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        MasterDataModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MasterAPIService, useValue: {} },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var dataSource: any = [];
    var componentName: any = 'ShiftTiming';
    var totalRecords: any;
    var currentPageSize: number = 10;
    var pageIndex: number = 0;
    var sortKey: string = "line_id";
    var sortType: string = "ASC";
    var sortedPageIndex = 0;

    var columns = [
      { columnDef: 'line_name', header: 'Line' },
      { columnDef: 'first_shift_s_t', header: '1st Shift Start' },
      { columnDef: 'first_shift_e_t', header: '1st Shift End' },
      { columnDef: 'second_shift_s_t', header: '2nd Shift Start' },
      { columnDef: 'second_shift_e_t', header: '2nd Shift End' },
      { columnDef: 'third_shift_s_t', header: '3rd Shift Start' },
      { columnDef: 'third_shift_e_t', header: '3rd Shift End' },
      { columnDef: 'action', header: 'Action' }
    ]

  });
  
  
  
  // it('getShiftTimingData shoul be call', function(done) {
  
  //   expect(component.getShiftTimingData()).not.toBeNull();
  //   const mockcommonService: CommonService = TestBed.get(CommonService);
  //   mockcommonService.getSchedulerData(formdata).toPromise().then(function (result) {
  //     expect(result).toBe(true);
  //     expect(mockcommonService.getSchedulerData(formdata)).not.toBeNull();
  //     component.newtableData = result;
  //     component.getSchedulerTableData();
  //     component.tableColumns = component.tableColumns.concat(component.newtableData['col'].map(x => x.columnDef));
  //     component.dataSource = new MatTableDataSource<any>(component.newtableData['routes']);
  //   });
      
  // });
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
