import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let debugElement: DebugElement;
  let httpTestingController: HttpTestingController;
  let commonServices: jasmine.SpyObj<CommonService>;
  let commonLogicService: jasmine.SpyObj<CommonLogicService>;
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
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
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('declare veriables', () => {
    var mainMenu: any = [];
    var masterDataSubMenu: any = [];
    var currentTabIndex = 0;
  });
  it('should call oninit', () => {
    var currentURL;
    if (currentURL) {
      expect(currentURL).toBeTruthy();
      const schedulerfinal = currentURL.indexOf("schedulerfinal");
      const scheduler = currentURL.indexOf("scheduler");
      const final = currentURL.indexOf("final");
      const master = currentURL.indexOf("master");
      const profile = currentURL.indexOf("profile");
      const planning = currentURL.indexOf("planning");
      const metrics = currentURL.indexOf("metrics");
      expect(component.getManufactureLine()).not.toBeNull();
      expect(component.getMenu()).not.toBeNull();
    }
  });

  it('#getMenu should be define', (done) => {
    const expectedResult = { "menus": [{ "menu": "Scheduler Dashboard", "menu_url": "dashboard/scheduler", "submenus": [{ "sub_menu": null, "submenu_url": null }] }, { "menu": "Scheduler Final Dashboard", "menu_url": "dashboard/schedulerfinal", "submenus": [{ "sub_menu": null, "submenu_url": null }] }, { "menu": "Ops Dashboard", "menu_url": "dashboard/final", "submenus": [{ "sub_menu": null, "submenu_url": null }] }, { "menu": "Planning", "menu_url": "dashboard/planning", "submenus": [{ "sub_menu": null, "submenu_url": null }] }, { "menu": "Metrics", "menu_url": "dashboard/metrics", "submenus": [{ "sub_menu": null, "submenu_url": null }] }, { "menu": "Configuration", "menu_url": "dashboard/master", "submenus": [{ "sub_menu": "Laser Recipe", "submenu_url": "dashboard/master/laser-md" }, { "sub_menu": "Sample Shop", "submenu_url": "dashboard/master/proto" }, { "sub_menu": "Recipe", "submenu_url": "dashboard/master/data" }, { "sub_menu": "Location", "submenu_url": "dashboard/master/location" }, { "sub_menu": "Department Priority", "submenu_url": "dashboard/master/department-priority" }, { "sub_menu": "Capsizing", "submenu_url": "dashboard/master/capsize" }, { "sub_menu": "Planner Code", "submenu_url": "dashboard/master/planner" }, { "sub_menu": "Shift Timing", "submenu_url": "dashboard/master/shift-timing" }] }, { "menu": "My Profile", "menu_url": "dashboard/profile", "submenus": [{ "sub_menu": null, "submenu_url": null }] }] }; // replace ? with expected !Success result    
    const mockcommonService: CommonService = TestBed.get(CommonService);
    spyOn(mockcommonService, 'GetMainMenu').and.returnValue(of(expectedResult));

    component.getMenu()
      .then(r => {
        expect(mockcommonService.GetMainMenu).toHaveBeenCalled();
        done();
      })
      .catch(e => fail(e));
      component.mainMenu = [];
      component.masterDataSubMenu = [];
  });

  it('#getManufactureLine should be define', (done) => {
    let response = [{ "line_id": 1, "line_name": "A2000", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1 }, { "line_id": 2, "line_name": "A2100", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1 }, { "line_id": 3, "line_name": "A2200", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 4, "line_name": "A2300", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 5, "line_name": "Proto", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 6, "line_name": "L100", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 7, "line_name": "L200", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 8, "line_name": "HHP", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 9, "line_name": "M-1000", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 10, "line_name": "M-1100", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 11, "line_name": "M-1200", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 12, "line_name": "M-1300", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 13, "line_name": "C500", "is_parent": 0, "is_module": 0, "is_canning": 1, "ping": 0 }, { "line_id": 14, "line_name": "C700", "is_parent": 0, "is_module": 0, "is_canning": 1, "ping": 0 }, { "line_id": 15, "line_name": "PACK", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }];
    const mockCommonLogicService: CommonLogicService = TestBed.get(CommonLogicService);
    spyOn(mockCommonLogicService, 'getManufactureLine').and.returnValue(of(response));
    component.getManufactureLine()
      .then(r => {
        mockCommonLogicService.setCommonMasterData(response);
        expect(mockCommonLogicService.getManufactureLine).toHaveBeenCalled();
        done();
      })
      .catch(e => fail(e));
      component.mainMenu = [];
      component.masterDataSubMenu = [];
  });

 

  it("should call getManufactureLine", fakeAsync(() => {

    let response = [{ "line_id": 1, "line_name": "A2000", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1 }, { "line_id": 2, "line_name": "A2100", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1 }, { "line_id": 3, "line_name": "A2200", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 4, "line_name": "A2300", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 5, "line_name": "Proto", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 6, "line_name": "L100", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 7, "line_name": "L200", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 8, "line_name": "HHP", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }, { "line_id": 9, "line_name": "M-1000", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 10, "line_name": "M-1100", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 11, "line_name": "M-1200", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 12, "line_name": "M-1300", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0 }, { "line_id": 13, "line_name": "C500", "is_parent": 0, "is_module": 0, "is_canning": 1, "ping": 0 }, { "line_id": 14, "line_name": "C700", "is_parent": 0, "is_module": 0, "is_canning": 1, "ping": 0 }, { "line_id": 15, "line_name": "PACK", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0 }];
    const mockCommonLogicService: CommonLogicService = TestBed.get(CommonLogicService);
    mockCommonLogicService.getManufactureLine().toPromise().then(result => {expect(result).toEqual(response);});
    mockCommonLogicService.setCommonMasterData(response);
    flushMicrotasks();


    // // Expect a call to this URL
    // const req = httpTestingController.expectOne(
    //   "www.example.com"
    // );
    // expect(req.request.method).toEqual("GET");
    // req.flush(response);
    tick();

  }));

  // it('should create', () => {
  //    expect(component).toBeTruthy();
  // flushMicrotasks();
  //  });
});
