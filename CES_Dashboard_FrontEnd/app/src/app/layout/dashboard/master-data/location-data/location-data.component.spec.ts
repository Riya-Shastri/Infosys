import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocationDataComponent } from './location-data.component';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterDataModule } from '../master-data.module';
import { LoaderComponent } from 'src/app/share/Common/loader/loader.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
describe('LocationDataComponent', () => {

    let component: LocationDataComponent;
    let fixture: ComponentFixture<LocationDataComponent>;
    let MasterAPIService: jasmine.SpyObj<MasterAPIService>;
    let matDialogService: jasmine.SpyObj<MatDialog>;
    matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LocationDataComponent, LoaderComponent],
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
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        })
        .overrideComponent(LocationDataComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default }
      })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LocationDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    // it('getlocationData Testing', () => {
    //   spyOn(component, 'getlocationData').and.callThrough();
      
    //   let result = component.getlocationData();
    //   fixture.detectChanges();
    //   expect(result).toBeDefined();
    // });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });


    it('declare veriables', () => {
        fixture.detectChanges();
        var componentName: any = 'LocationData'
        var dataSource: any = [];
        var totalRecords: any;
        var currentPageSize: number = 10;
        var pageIndex: number = 0;
        var sortedPageIndex = 0;
        var sortKey: string = "last_updated_date";
        var sortType: string = "DESC";
        var data = [];
        var columns = [
            { columnDef: 'oracle_sub_inventory', header: 'Oracle Sub-Inventory' },
            { columnDef: 'app_mat_script', header: 'Applicable for Material Script' },
            { columnDef: 'app_plan_script', header: 'Applicable for Planning Script' },
            { columnDef: 'last_updated_by', header: 'Last Updated By' },
            { columnDef: 'last_updated_date', header: 'Last Updated Date' },
            { columnDef: 'action', header: 'Action' }
        ];
        var displayColumns: any = {
            'oracle_sub_inventory': 'CES TLA Part',
            'app_mat_script': 'Location',
            'action': 'Action'
        }
    });

    // it('should call ngOnInit', () => {
        
    //     const fixture = TestBed.createComponent(LocationDataComponent);
    //     const component = fixture.debugElement.componentInstance;
    //     fixture.detectChanges();
    //     component.ngOnInit();
    //     const mockcommonService: CommonService = TestBed.get(CommonService);
    //     expect(mockcommonService.getManufacturingLine()).not.toBeNull();
    // });

    // it('getlocationData', () => {

    //     // const service = fixture.debugElement.injector.get(MasterAPIService);
    //     // component.getlocationData();

    //     const mockcommonService: MasterAPIService = TestBed.get(MasterAPIService);
    //     let inputObject = {
    //         limit: 10,
    //         pageNumber: 1,
    //         sortKey: "last_updated_date",
    //         sortType: "desc"
    //     };

    //     let expectedData = {
    //         "totalRecords": 4, "routes": [{
    //             "location_id": 62,
    //             "oracle_sub_inventory": "RES", "app_mat_script": "Yes",
    //             "app_plan_script":
    //                 "Yes", "last_updated_by": "Ranjan Mukherjee",
    //             "last_updated_date":
    //                 "2022-09-13T08:11:25"
    //         }, {
    //             "location_id": 59, "oracle_sub_inventory": "REC RM",
    //             "app_mat_script": "Yes", "app_plan_script": "No",
    //             "last_updated_by": "Santanu Mandal",
    //             "last_updated_date": "2022-08-18T03:05:20"
    //         }]
    //     };

    //     // expect(mockcommonService.getlocationData(inputObject)).not.toBeNull();
    //     mockcommonService.getlocationData(inputObject).subscribe(data => {
    //          expect(expectedData).toEqual(data);
    //          expect(data).not.toBeNull();
    //     });

    // });


    // it('deleteData', () => {
    //     const mockcommonService: MasterAPIService = TestBed.get(MasterAPIService);
    //     const id = '3';
    //     component.deleteData({ detail: { location_id: 3 } });
    //     expect(mockcommonService.locationMasterData(id)).not.toBeNull();
    //     mockcommonService.getlocationData(id).subscribe(data => {
    //         expect(data).not.toBeNull();
    //     });
    // });


});
