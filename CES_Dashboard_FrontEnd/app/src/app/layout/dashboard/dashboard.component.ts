import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  mainMenu: any = [];
  masterDataSubMenu: any = [];
  currentTabIndex = 0;

  constructor(
    private router: Router,
    private service: CommonService,
    private commonService: CommonLogicService,
    private MasterService: MasterAPIService,
  ) { }

  async ngOnInit() {
    const currentURL = this.router.url;
    await this.getManufactureLine();
    await this.getMenu();
    if (currentURL) {
      const schedulerfinal = currentURL.indexOf("schedulerfinal");
      const scheduler = currentURL.indexOf("scheduler");
      const final = currentURL.indexOf("final");
      const master = currentURL.indexOf("master");
      const profile = currentURL.indexOf("profile");
      const planning = currentURL.indexOf("planning");
      const metrics = currentURL.indexOf("metrics");

      if (this.mainMenu && this.mainMenu.length > 0) {
        if (schedulerfinal > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf('Scheduler Final Dashboard');
        } else if (scheduler > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf("Scheduler Dashboard");
        } else if (final > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf("Ops Dashboard");
        } else if (master > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf("Configuration");
        } else if (profile > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf("My Profile");
        } else if (planning > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf("Planning");
        } else if (metrics > 0) {
          this.currentTabIndex = this.mainMenu.map(function (e) { return e.menu; }).indexOf("Metrics");
        }
      }
    }
  }

  activeTab(currentIndex: any, dashboardText: any) {
    this.currentTabIndex = currentIndex;
    this.router.navigate([dashboardText['menu_url']]);
  }

  getManufactureLine() {
    return new Promise((resolve, reject) => {
      this.commonService.getManufactureLine().toPromise().then(res => {
        this.commonService.setCommonMasterData(res);
        resolve(200);
      }).catch(err => { resolve(200); })
    });
  }

  getMenu() {
    return new Promise((resolve, reject) => {
      this.service.GetMainMenu().subscribe((res: any) => {
        if (res && res.menus && res.menus.length > 0) {
          res.menus.forEach((list, index) => {
            this.mainMenu.push(list);
            if (list['submenus'] && list['submenus'].length > 1) {
              this.masterDataSubMenu = list['submenus'];
            }
            if (index === this.mainMenu.length - 1) {
              this.MasterService.getMasterSubMenu(this.masterDataSubMenu);
              resolve(200);
            }
          });
        } else {
          this.mainMenu = [];
          this.masterDataSubMenu = [];
          resolve(200);
        }
      });
    });
  }

}
