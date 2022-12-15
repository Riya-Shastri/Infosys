import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss']
})
export class MasterDataComponent implements OnInit {

  subMenu: any = [];
  currentTabIndex = 0;

  constructor(
    private router: Router,
    private service: MasterAPIService) {
    this.service.submenuList.subscribe(menuDetail => {
      this.subMenu = menuDetail;
    });
  }

  ngOnInit(): void {
    const currentURL = this.router.url;
    if (currentURL) {
      const laser = currentURL.indexOf("laser-md");
      const proto = currentURL.indexOf("proto");
      const RecipeMasterData = currentURL.indexOf("master/data");
      const location = currentURL.indexOf("location");
      const department = currentURL.indexOf("department-priority");
      const capsize = currentURL.indexOf("capsize");
      const planner = currentURL.indexOf("planner");
      const shiftTiming = currentURL.indexOf("shift-timing")
      if (proto > 0) {
        this.currentTabIndex = 1;
      } else if (RecipeMasterData > 0) {
        this.currentTabIndex = 2;
      } else if (laser > 0) {
        this.currentTabIndex = 0;
      } else if (location > 0) {
        this.currentTabIndex = 3;
      } else if (department > 0) {
        this.currentTabIndex = 4;
      } else if (capsize > 0) {
        this.currentTabIndex = 5;
      } else if (planner > 0) {
        this.currentTabIndex = 6;
      }else if (shiftTiming > 0) {
        this.currentTabIndex = 7;
      }
    }
  }

  activeTab(currentIndex: any, menuTitle: any) {
    this.currentTabIndex = currentIndex;
    this.router.navigate([menuTitle['submenu_url']]);
  }

}
