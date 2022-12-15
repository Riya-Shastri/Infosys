import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {

  userDetails: any = '';
  userName: string = '';
  middleName: string = '';
  userLastName: string = '';
  WWID: any = '';
  assigned_roles: any;
  userProfileDetails: any;

  constructor() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const getRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    this.userName = userData['firstName'];
    this.middleName = userData['middleName'];
    this.userLastName = userData['lastName'];
    this.WWID = userData['wwid'];
    this.assigned_roles = getRoles;
  }

  ngOnInit(): void {
    
  }

}
