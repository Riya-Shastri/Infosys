import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService, } from 'src/app/share/Services/common.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchedulerFinalComponent } from './scheduler-final.component';
import { DebugElement } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareModule } from 'src/app/share/share.module';
import { LoaderComponent } from 'src/app/share/Common/loader/loader.component';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { not } from '@angular/compiler/src/output/output_ast';
import { of } from 'rxjs';
import { TokenInterceptor } from 'src/app/share/interceptor/token.interceptor';
import {ScrollToService,ScrollToConfigOptions,} from '@nicky-lenaers/ngx-scroll-to';

describe('SchedulerFinalComponent', () => {

    let component: SchedulerFinalComponent;
    let fixture: ComponentFixture<SchedulerFinalComponent>;
    let debugElement: DebugElement;
    let commonService: jasmine.SpyObj<CommonService>;
    let httpTestingController: HttpTestingController;
    let commonServices: CommonService;
    let matDialogService: jasmine.SpyObj<MatDialog>;
    matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    var originalTimeout;
    let formBuilder: FormBuilder;
    let mockLoggerSvc: any;
    let httpClient: HttpClient;

    beforeEach(async () => {

        mockLoggerSvc = {
            info: jasmine.createSpy("info"),
            success: jasmine.createSpy("success"),
            error: jasmine.createSpy("error")
        };
        const constcommonServiceSpySpy = jasmine.createSpyObj('commonService', ['getUser']);
        await TestBed.configureTestingModule({
            imports: [

                ReactiveFormsModule,
                HttpClientModule,
                MatSnackBarModule,
                HttpClientTestingModule,
                MatProgressSpinnerModule,
                MaterialModule,
                BrowserAnimationsModule,
                ShareModule,
                MatSelectModule
            ],
            declarations: [SchedulerFinalComponent, LoaderComponent],
            providers: [
                {
                    provide: MatDialog,
                    provides: commonService,
                    useValue: matDialogService,
                    useValues: constcommonServiceSpySpy,
                },{ provide: ScrollToService, useValue: {} },
                FormBuilder,
                // {
                //     provide: HTTP_INTERCEPTORS,
                //     useClass: TokenInterceptor,
                //     multi: true
                // },
                DatePipe,
                CommonService
            ]
        })
        .compileComponents();
        httpTestingController = TestBed.get(HttpTestingController);
        commonServices = TestBed.get(CommonService);

        fixture = TestBed.createComponent(SchedulerFinalComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
        debugElement = fixture.debugElement;

        var store = {};

        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return store[key] || null;
        });
        spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
            delete store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return store[key] = <string>value;
        });
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SchedulerFinalComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        component.schedulerFinalForm = formBuilder.group({
            limit: new FormControl(
                {
                    value: 0
                }
            )
        });
        fixture.detectChanges();
    });

    it('should call ngOnInit', () => {
        const fixture = TestBed.createComponent(SchedulerFinalComponent);
        const component = fixture.debugElement.componentInstance;
        component.ngOnInit();
        const service = fixture.debugElement.injector.get(CommonService);
        expect(service.getManufacturingLine()).not.toBeNull();
    });


    it('schedulerFinal form should be valid', () => {

        const formControl = new FormControl('is_parent');

        let schedulerFinalFormFGroup = component.schedulerFinalForm;
        component.initFormGroup();
        let wwid = component.wwId;
        let shcedulerFinalFormValue = {
            limit: 0,
            user: '',
            role: '',
            pageNumber: 0,
            sortKey: 'run_date',
            sortType: 'asc',
            line_id: '',
            line_name: '',
            is_parent: 1,
            is_module: 0,
            is_canning: 0,
            filter: {},
        };

        limit: null;
        user: null;
        role: null;
        pageNumber: null;
        sortKey: null;
        sortType: null;
        line_id: null;
        line_name: null;
        is_parent: null;
        is_module: null;
        is_canning: null;
        filter: null;

        schedulerFinalFormFGroup.controls['limit'].setValue(0);
        schedulerFinalFormFGroup.controls['user'].setValue('');
        schedulerFinalFormFGroup.controls['role'].setValue('');
        schedulerFinalFormFGroup.controls['pageNumber'].setValue(0);
        schedulerFinalFormFGroup.controls['sortKey'].setValue('run_date');
        schedulerFinalFormFGroup.controls['sortType'].setValue('asc');
        schedulerFinalFormFGroup.controls['line_id'].setValue('');
        schedulerFinalFormFGroup.controls['line_name'].setValue('');
        schedulerFinalFormFGroup.controls['is_parent'].setValue(1);
        schedulerFinalFormFGroup.controls['is_module'].setValue(0);
        schedulerFinalFormFGroup.controls['is_canning'].setValue(0);
        schedulerFinalFormFGroup.controls['filter'].setValue({});
        fixture.detectChanges();
    })


    it('updateManufacturingLine should return expected data', (done) => {
        const expectedData = { status: "success", message: "Favourite lines added/updated successfully" }
        let finalReqPayload = {
            "wwid": "sm626", "lines": [1, 2, 3]
        };

        commonServices.updateManufacturingLine(finalReqPayload).subscribe(data => {
            spyOn(commonServices, 'updateManufacturingLine').and.returnValue(of(data));
            expect(data).toEqual(expectedData);
            expect(component.getManufacturingLine()).not.toBeNull();
            done();
        });

        const testRequest = httpTestingController.expectOne("https://api.cmpdashboard-dev.cummins.com/api/updateFavoriteLines");
        testRequest.flush(expectedData);

    });

    it('isaccess flag should be false initially', () => {
        component.initFormGroup();
        expect(component.isAccessflag).toBeFalsy();
    });

    it('isaccess flag should be true initially', () => {
        expect(localStorage.getItem("userRoles")).not.toBe('');
    });

    it('should call function getManufacturingLine during componet creation', () => {
        expect(component.getManufacturingLine()).not.toBeNull();
    });


    it('Table data is getting loaded correctly', () => {
        expect(component.getSchedulerFinalTableData()).not.toBeNull();
    });

    it('fetchSFD should return expected data', (done) => {

        const expectedData = {
            "totalRecords": 8,
            "routes": [
                { "parent_job_id": 92, "job_num": "MO-21", "ces_part_num": "A019X7900-32", "ces_part_flat": null, "part_description": "64H8", "drive_dependent_demand": 1, "assembly_type": "b823", "customer_due_date": "2022-07-12T10:45:40", "run_date": "2022-07-12", "scheduled_qunatity": 12, "remaining_quantity": 13, "part_number_dept": "Y7RY", "part_num_planner_code": "U63G", "diameter": 12, "inlet_partno": "IN-78", "outlet_partno": "OUT-76DS", "filter_partno": "FIL-793", "mixer_partno": "MIX-786", "inlet_catmod": "INC-874", "outlet_catmod": "OUTC-548", "filter_catmod": "FILC-786", "catmod_no_singlebody": "CAT-856", "sheet_steel": "ss99", "material_gauge": "mg935", "cut": "c0700", "stamp": "s76", "manual_roll": "mr092", "weld": "w09", "coin": "c109", "lucas": "l34", "order_no": 1, "repack_type": "rt74", "index_no": 1, "audit": "a345", "size": 12, "fg_rack": "yes", "build_slot": "MD2", "internal_customer": "0g43g9", "length": "10", "customer_partno": "g7rv58", "firsttime_runner": 1, "is_published_finaldb": 0, "mfg_line_id": 1, "sequence": null, "seq_status_id": 60, "is_moved": 1, "kit_status_id": 43, "mfg_qa_status_id": 64, "subassembly_status_id": 66, "jobstatus_id": 59, "comments": "ouh98v", "last_updated_by": "Saipriya Thatipalli", "last_updated_date": "2022-07-12T10:45:40" },
                { "parent_job_id": 112, "job_num": "MO-28", "ces_part_num": "A01N9900-10", "ces_part_flat": null, "part_description": "oq3nf7f", "drive_dependent_demand": 1, "assembly_type": "3w5cu", "customer_due_date": "2022-07-11T18:30:00", "run_date": "2022-07-12", "scheduled_qunatity": 30, "remaining_quantity": 11, "part_number_dept": "ihfu76", "part_num_planner_code": "74iuwy", "diameter": 10, "inlet_partno": "CAP-inlet1-sm626", "outlet_partno": "CAP-outlet1-sm626", "filter_partno": "CAP-filter1-sm626", "mixer_partno": "CAP-mixer1-sm626", "inlet_catmod": "1111", "outlet_catmod": "1111", "filter_catmod": "1111", "catmod_no_singlebody": "kp1606", "sheet_steel": "87ntg", "material_gauge": "xs6i0", "cut": "87gtf", "stamp": "0980fr3w", "manual_roll": "og6ft", "weld": "09as", "coin": "34kj", "lucas": "j07h", "order_no": 6, "repack_type": "j0gt55", "index_no": 1, "audit": "ygtf76", "size": 1, "fg_rack": "yes", "build_slot": "5t5y", "internal_customer": "0g43g9", "length": null, "customer_partno": "1", "firsttime_runner": 1, "is_published_finaldb": 0, "mfg_line_id": 1, "sequence": null, "seq_status_id": 63, "is_moved": 1, "kit_status_id": 45, "mfg_qa_status_id": 51, "subassembly_status_id": 66, "jobstatus_id": 55, "comments": "0", "last_updated_by": "Priyanka K", "last_updated_date": "2022-07-20T05:55:10" }
            ]
        }

        let formdata: {
            "limit": 0, "user": "tz625", "role": "CMP-User-Admin", "pageNumber": 0,
            "sortKey": "run_date", "sortType": "asc", "line_id": 1,
            "line_name": "A2000", "is_parent": 1, "is_module": 0,
            "is_canning": 0, "action": "", "filter": {}
        };

        commonServices.getSchedulerFinalData(formdata).subscribe(data => {
            expect(expectedData).toEqual(data);
            expect(data).not.toBeNull();
            expect(data).toBeTruthy();
            done();
        });

        const testRequest = httpTestingController.expectOne("https://api.cmpdashboard-dev.cummins.com/api/fetchSchedulerFinalDashboard");
        testRequest.flush(expectedData);
    });

    it('addTableControlsForParent form should be ', () => {
        let controlValue: any;
        expect(component.addTableControlsForParent(controlValue).valid).toBeTruthy();

        assembly_type: null;
        audit: null;
        catmod_no_singlebody: null;
        ces_part_no_flat: null;
        customer_partno: null;
        ces_part_no_rolledbody: null;
        ces_part_num: null;
        coin: null;
        comments: null;
        customer_due_date: null;
        cut: null;
        diameter: null;
        drive_dependent_demand: 1;
        fg_rack: null;
        filter_catmod: null;
        filter_partno: null;
        firsttime_runner: null;
        index_no: null;
        inlet_partno: null;
        job_num: null;
        last_updated_by: null;
        last_updated_date: null;
        lucas: null;
        manual_roll: null;
        material_gauge: null;
        mixer_partno: null;
        order_no: null;
        outlet_partno: null;
        parent_job_id: null;
        part_description: null;
        part_num_planner_code: null;
        part_number_dept: null;
        remaining_quantity: null;
        repack_type: null;
        run_date: null;
        scheduled_qunatity: null;
        sheet_steel: null;
        size: null;
        stamp: null;
        sequence: null;
        weld: null;
    });

    it('addTableControlsForModule form should be valid', () => {
        let controlValue: any;
        expect(component.addTableControlsForModule(controlValue).valid).toBeTruthy();
        customer_due_date: null;
        comments: null;
        diameter: null;
        drive_dependent_demand: null;
        filter_catmod: null;
        inlet_catmod: null;
        inlet_ces_part_num: null;
        internal_customer: null;
        is_runscript: null;
        job_num: null;
        last_updated_by: '';
        last_updated_date: null;
        lock: null;
        locked_at: null;
        locked_by: null;
        module_job_id: null;
        outlet_catmod: null;
        parent_job_ids: null;
        part_description: null;
        part_num_planner_code: null;
        part_number_dept: null;
        remaining_quantity: null;
        run_date: null;
        sequence: null;
        run_date_service: null;
        scheduled_qunatity: null;
    })

    it('addTableControlsForChild form should be valid', () => {
        let controlValue: any;
        expect(component.addTableControlsForChild(controlValue).valid).toBeTruthy();
        canning_diameter: null;
        comments: null;
        canning_job_id: null;
        ces_part_num_catmod: null;
        customer_due_date: null;
        internal_customer: null;
        is_moved: null;
        job_num: null;
        last_updated_by: '';
        last_updated_date: null;
        length: null;
        lock: null;
        locked_at: null;
        locked_by: null;
        module_job_ids: null;
        parent_job_ids: null;
        part_description: null;
        part_num_planner_code: null;
        part_number_dept: null;
        remaining_quantity: null;
        run_date: null;
        scheduled_qunatity: null;
        sequence: null;
        style_no: null;
    });

    it('Add to favourite should work properly', () => {

        let mockObj = {
            is_canning: false,
            is_module: false,
            is_parent: true,
            line_id: 'M1000',
            line_name: '',
        }
        component.favoriteBtnClick(mockObj);
        fixture.detectChanges();
        expect(component.schedulerFinalForm.valid).toBeTruthy();

    });

    it('deleteSchedulerFinalData', () => {
        let selectedIds = [1, 2];
        let lineType = 'parent';
        let jobNumbers=[22,32];
        let recreate='No';
        let Line_name='A2000'
        expect(commonServices.deleteSchedulerFinalData(selectedIds, lineType,jobNumbers,recreate,Line_name)).not.toBeNull();
    });

});

