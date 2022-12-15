import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CommonService } from './common.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('CommonService', () => {
  let service: CommonService;
  let httpController: HttpTestingController;
  let API_HOST_URL = `${environment.apiHostUrl}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,MatSnackBarModule],
    });
    service = TestBed.inject(CommonService);
    httpController = TestBed.inject(HttpTestingController);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
  // it('should call GetMainMenu', () => {
  //   let expectedres={"menus": [{"menu": "Scheduler Dashboard", "menu_url": "dashboard/scheduler", "submenus": [{"sub_menu": null, "submenu_url": null}]}, {"menu": "Scheduler Final Dashboard", "menu_url": "dashboard/schedulerfinal", "submenus": [{"sub_menu": null, "submenu_url": null}]}, {"menu": "Ops Dashboard", "menu_url": "dashboard/final", "submenus": [{"sub_menu": null, "submenu_url": null}]}, {"menu": "Planning", "menu_url": "dashboard/planning", "submenus": [{"sub_menu": null, "submenu_url": null}]}, {"menu": "Metrics", "menu_url": "dashboard/metrics", "submenus": [{"sub_menu": null, "submenu_url": null}]}, {"menu": "Configuration", "menu_url": "dashboard/master", "submenus": [{"sub_menu": "Laser Recipe Master", "submenu_url": "dashboard/master/laser-md"}, {"sub_menu": "Sample Shop", "submenu_url": "dashboard/master/proto"}, {"sub_menu": "Recipe Master", "submenu_url": "dashboard/master/data"}, {"sub_menu": "Location Master", "submenu_url": "dashboard/master/location"}, {"sub_menu": "Department Priority", "submenu_url": "dashboard/master/department-priority"}, {"sub_menu": "Capsizing Master", "submenu_url": "dashboard/master/capsize"}, {"sub_menu": "Planner Code", "submenu_url": "dashboard/master/planner"}]}, {"menu": "My Profile", "menu_url": "dashboard/profile", "submenus": [{"sub_menu": null, "submenu_url": null}]}]};
  //   const userDetail = JSON.parse(localStorage.getItem('userRoles') || '[]');
  //   const userRole = userDetail.join(',');
  //   service.GetMainMenu().subscribe((res) => {
  //     expect(res).toEqual(expectedres);
  //   });
  //   const req = httpController.expectOne({
  //     method: 'GET',
  //     url: `${API_HOST_URL}/menu/sm626`,
  //   });
  //   req.flush(expectedres);
  // });

//   it('should call GetMainMenu', () => {
//     let expectedres=[{"line_id": 1, "line_name": "A2000", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1}, {"line_id": 2, "line_name": "A2100", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1}, {"line_id": 3, "line_name": "A2200", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0}, {"line_id": 4, "line_name": "A2300", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0}, {"line_id": 5, "line_name": "Proto", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 1}, {"line_id": 6, "line_name": "L100", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0}, {"line_id": 7, "line_name": "L200", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0}, {"line_id": 8, "line_name": "HHP", "is_parent": 1, "is_module": 0, "is_canning": 0, "ping": 0}, {"line_id": 9, "line_name": "M-1000", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0}, {"line_id": 10, "line_name": "M-1100", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0}, {"line_id": 11, "line_name": "M-1200", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0}, {"line_id": 12, "line_name": "M-1300", "is_parent": 0, "is_module": 1, "is_canning": 0, "ping": 0}, {"line_id": 13, "line_name": "C500", "is_parent": 0, "is_module": 0, "is_canning": 1, "ping": 0}, {"line_id": 14, "line_name": "C700", "is_parent": 0, "is_module": 0, "is_canning": 1, "ping": 0}]
//     service.getManufacturingLine().subscribe((res) => {
//       expect(res).toEqual(expectedres);
//     });
//     const req = httpController.expectOne({
//       method: 'GET',
//       url: `${API_HOST_URL}'/favoriteLines/sm626'`,
//     });
//     req.flush(expectedres);
//   });
 });
