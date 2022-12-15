import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtoComponent } from './proto.component';
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
describe('ProtoComponent', () => {
  let component: ProtoComponent;
  let fixture: ComponentFixture<ProtoComponent>;
  let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProtoComponent],
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
      ],
      teardown: {destroyAfterEach: false}
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('declare veriables', () => {
    var componentName: any = 'Proto'
    var dataSource: any = [];
    var totalRecords: any;
    var currentPageSize: number = 10;
    var pageIndex: number = 0;
    var sortedPageIndex = 0;
    var sortKey: string = "ces_tla_part";
    var sortType: string = "DESC";
    var parsedObjfilter: any = { "ces_tla_part": "" };
    var selected: any = 'masterData';
    var filterval: any;
    var title!: string;
    var rowIndex: any;
    var SelectedarrayData: any = [];
    var errMsg2: any;
    var filterArray: any = [];

    var columns = [
      { columnDef: 'ces_tla_part', header: 'CES TLA Part No.' },
      { columnDef: 'repack_type', header: 'Repack Type' },
      { columnDef: 'inlet_catmod', header: 'Inlet Catmod No.' },
      { columnDef: 'outlet_catmod', header: 'Outlet Catmod No.' },
      { columnDef: 'filter_catmod', header: 'Filter/Dpf Catmod No.' },
      { columnDef: 'mixer', header: 'Mixer' },
      { columnDef: 'build_slot', header: 'Build Slot' },
      { columnDef: 'fg_rack', header: 'FG Rack' },
      { columnDef: 'last_updated_by', header: 'Last Updated By' },
      { columnDef: 'last_updated_date', header: 'Last Updated Date' },
      { columnDef: 'action', header: 'Action' }
    ];
    var displayColumns: any = {
      'ces_tla_part': 'CES TLA PART#',
      'repack_type': 'Repack Type',
      'inlet_catmod': 'INLET CATMOD#',
      'outlet_catmod': 'OUTLET CATMOD#',
      'filter_catmod': 'FILTER/DPF CATMOD#',
      'mixer': 'MIXER',
      'build_slot': 'Build Slot',
      'fg_rack': 'FG Rack',
      //'action'  : 'Action'
    }
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should be async getProtoData', async () => { (function(done) {
  
    component.getProtoData().then(function(result) {
      expect(result).toBe(200);
      let formdata: { limit :  10,
        pageNumber : 1,
        sortKey : "last_updated_date",
        sortType : "desc",
        filter : {}
       }
    const masterAPIService: MasterAPIService = TestBed.get(CommonService);
    masterAPIService.fetchProtoTypeData(formdata).toPromise().then(function (result) {
      expect(result).toBe(true);
      expect(masterAPIService.fetchProtoTypeData(formdata)).not.toBeNull();
      component.getProtoData();
    });
      done();
    });
  })
});
  it('Should be downloadExcel', () => {
    let path = "Proto"
    component.downloadExcel();
    expect(component.downloadExcel).not.toBeNull(); 
  });

});
