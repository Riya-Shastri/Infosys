import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'CES_Dashboard_FrontEnd';
  @HostBinding('class') componentCssClass: any;

  constructor() {
  }

  ngOnInit(): void {
 
  }

}
