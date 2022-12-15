import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaserMDComponent } from './laser-md.component';
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
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
describe('LaserMDComponent', () => {
  let component: LaserMDComponent;
  let fixture: ComponentFixture<LaserMDComponent>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
    let matDialogService: jasmine.SpyObj<MatDialog>;
    matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaserMDComponent ],
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
        { provide: DatePipe, useValue: {}},
        { provide: ComponentFixtureAutoDetect, useValue: true }
    ],
    teardown: {destroyAfterEach: false}
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaserMDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    
    var dataSource: any = [];
    var componentName: any = 'LaserMd';
    var totalRecords: any;
    var currentPageSize: number = 10;
    var pageIndex: number = 0;
    var sortedPageIndex = 0;
    var sortKey: string = "ces_part_flat";
    var sortType: string = "DESC";
    var filterval: any;
    var parsedObjfilter: any
    var selected: any = 'masterData';
    var title!: string;
    var rowIndex: any;
    var SelectedarrayData: any = [];
    var errMsg2: any;
    var filterArray: any = [];
  
    var columns = [
      { columnDef: 'ces_part_rolledbody', header: 'CES Part No.(Rolled Body)' },
      { columnDef: 'ces_part_flat', header: 'CES Part No.(Flat)' },
      { columnDef: 'diameter', header: 'Diameter' },
      { columnDef: 'length', header: 'Length' },
      { columnDef: 'mat_gauge_flat', header: 'Material Gauge of the Flat' },
      { columnDef: 'cut', header: 'Cut' },
      { columnDef: 'stamp', header: 'Stamp' },
      { columnDef: 'flare_pierce_gauge', header: 'Flare Pierce Gauge' },
      { columnDef: 'manual_roll', header: 'Manual Roll' },
      { columnDef: 'weld', header: 'Weld' },
      { columnDef: 'coin', header: 'Coin' },
      { columnDef: 'lucas', header: 'Lucas' },
      { columnDef: 'runcell', header: 'Run Cell' },
      { columnDef: 'sized', header: 'Sized' },
      { columnDef: 'last_updated_by', header: 'Last Updated By' },
      { columnDef: 'last_updated_date', header: 'Last Updated Date' },
      { columnDef: 'action', header: 'Action' }
    ];
  
    let displayColumns: any = {
      'ces_part_rolledbody': 'CES Part No. (Rolled Body)',
      'ces_part_flat': 'CES Part No. (Flat)',
      'diameter': 'Diameter',
      'length': 'Length',
      'mat_gauge_flat': 'Material Gauge of the Flat',
      'cut': 'Cut',
      'stamp': 'Stamp',
      'flare_pierce_gauge': 'Flare Pierce Gauge',
      'manaul_roll': 'Manual Roll',
      'weld': 'Weld',
      'coin': 'Coin',
      'lucas': 'Lucas',
      'action': 'Action'
    }
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('Should be downloadExcel', () => {
    let path = "Laser"
    component.downloadExcel();
    expect(component.downloadExcel).not.toBeNull(); 
  });

  it('Should be async getDashboardData', async () => { (function(done) {
  
    component.getDashboardData().then(function(result) {
      expect(result).toBe(200);
      let formdata: { limit :  10,
        pageNumber : 1,
        sortKey : "last_updated_date",
        sortType : "desc",
        filter : {}
       }
    const masterAPIService: MasterAPIService = TestBed.get(CommonService);
    masterAPIService.fetchLaserRecipeData(formdata).toPromise().then(function (result) {
      expect(result).toBe(true);
      expect(masterAPIService.fetchLaserRecipeData(formdata)).not.toBeNull();
      component.getDashboardData();
    });
      done();
    });
  })
});
});
