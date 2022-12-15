import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterData1Component } from './master-data1.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { MasterDataModule } from '../master-data.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/share/Services/common.service';
describe('MasterData1Component', () => {
  let component: MasterData1Component;
  let fixture: ComponentFixture<MasterData1Component>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterData1Component],
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
    fixture = TestBed.createComponent(MasterData1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var componentName: any = 'MasterData';
    var totalRecords: any;
    var dataSource: any = [];
    var currentPageSize: number = 10;
    var pageIndex: number = 0;
    var sortKey: string = "cespart_no";
    var sortType: string = "DESC";
    var filterval: any;
    var sortedPageIndex = 0;

    var columns = [
      { columnDef: 'cespart_no', header: 'CES Part No.' },
      { columnDef: 'ces_base_part', header: 'CES Base Part No.' },
      { columnDef: 'style_no', header: 'Style No.' },
      { columnDef: 'assembly_type', header: 'Assembly Type' },
      { columnDef: 'diameter', header: 'Diameter(TLA Level)' },
      { columnDef: 'length', header: 'Length' },
      { columnDef: 'inlet_part', header: 'Inlet Part No.' },
      { columnDef: 'outlet_part', header: 'Outlet Part No.' },
      { columnDef: 'filter_part', header: 'Filter Part No.' },
      { columnDef: 'mixer_part', header: 'Mixer Part No.' },
      { columnDef: 'catmod_no', header: 'Catmod No.(Single Body)' },
      { columnDef: 'inlet_catmod', header: 'Inlet-Catmod' },
      { columnDef: 'canning_diameter_inlet', header: 'Canning Diameter(Inlet)' },
      { columnDef: 'outlet_catmod', header: 'Outlet-Catmod' },
      { columnDef: 'canning_diameter_outlet', header: 'Canning Diameter(Outlet)' },
      { columnDef: 'filter_catmod', header: 'Filter-Catmod' },
      { columnDef: 'canning_diameter_filter', header: 'Canning Diameter(Dpf)' },
      { columnDef: 'fg_rack', header: 'FG Rack' },
      { columnDef: 'audit', header: 'Audit' },
      { columnDef: 'size', header: 'Size' },
      { columnDef: 'build_slot', header: 'Build Slot' },
      { columnDef: 'steering_wheel', header: 'Steering Wheel' },
      { columnDef: 'water_dam', header: 'Water Dam' },
      { columnDef: 'last_updated_by', header: 'Last Updated By' },
      { columnDef: 'last_updated_date', header: 'Last Updated Date' },
      { columnDef: 'action', header: 'Action' }
    ]
   var displayColumns: any = {
      'style_no': 'Style#',
      'cespart_no': 'CES Part#',
      'assembly_type': 'Assembly Type',
      'diameter': 'Diameter',
      'length': 'Length',
      'inlet_part': 'Inlet Part#',
      'outlet_part': 'Outlet Part#',
      'filter_part': 'Filter Part#',
      'mixer_part': 'Mixer Part#',
      'catmod_no': 'CATMOD# (Single Body)',
      'inlet_catmod': 'Inlet-CATMOD',
      'canning_diameter_inlet': 'CanningDiameter(Inlet)',
      'outlet_catmod': 'Outlet-CATMOD',
      'canning_diameter_outlet': 'CanningDiameter(Outlet)',
      'filter_catmod': 'Filter-CATMOD',
      'canning_diameter_filter': 'CanningDiameter(DPF/Filter)',
      'audit': 'Audit',
      'size': 'Size',
      'build_slot': 'Build Slot',
      'fg_rack': 'FG Rack',
      'action': 'Action'
    }

  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

//     it('Should be async getRecipeMasterData', async () => { (function(done) {
  
//     component.getRecipeMasterData().then(function(result) {
//       expect(result).toBe(200);
//       let formdata: { limit :  10,
//         pageNumber : 1,
//         sortKey : "last_updated_date",
//         sortType : "desc",
//         filter : {}
//        }
//     const masterAPIService: MasterAPIService = TestBed.get(CommonService);
//     masterAPIService.fetchRecipeMasterData(formdata).toPromise().then(function (result) {
//       expect(result).toBe(true);
//       expect(masterAPIService.fetchRecipeMasterData(formdata)).not.toBeNull();
//       component.getRecipeMasterData();
//     });
//       done();
//     });
//   })
// });

it('Should be downloadExcel', () => {
  let path = "Recipe"
  component.downloadExcel();
  expect(component.downloadExcel).not.toBeNull(); 
});

});
