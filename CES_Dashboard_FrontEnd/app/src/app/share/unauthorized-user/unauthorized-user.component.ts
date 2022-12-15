import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unauthorized-user',
  templateUrl: './unauthorized-user.component.html',
  styleUrls: ['./unauthorized-user.component.scss']
})
export class UnauthorizedUserComponent implements OnInit {

  titleOfPage="USER UNAUTHORIZED";
  authtype: any;
  constructor(public arouter: ActivatedRoute){
    this.authtype = this.arouter.snapshot.params.authtype;
   }

  ngOnInit() {
   
  }
}
