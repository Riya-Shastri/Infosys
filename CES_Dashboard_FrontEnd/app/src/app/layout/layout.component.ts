import { Component, OnInit, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
@Component({
  selector: 'app-layout',
  template: `
  <app-header (themeChanged)="toggleTheme($event)"></app-header>
  <div class="page-content">
  <router-outlet></router-outlet>
  </div>
  <app-footer></app-footer>
  `})

export class LayoutComponent implements OnInit {

  @HostBinding('class') componentCssClass: any;

  constructor(public overlayContainer: OverlayContainer) { }

  ngOnInit(): void {
    if (localStorage.getItem('theme') != null) {
      let selectedTheme: any = localStorage.getItem('theme');
      this.overlayContainer.getContainerElement().classList.add(selectedTheme);
      this.componentCssClass = localStorage.getItem('theme');
    }
  }

  toggleTheme($event: any) {
    if (this.overlayContainer.getContainerElement().classList.contains('light-theme'))
      this.overlayContainer.getContainerElement().classList.remove('light-theme');
    if (this.overlayContainer.getContainerElement().classList.contains('dark-theme'))
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    this.overlayContainer.getContainerElement().classList.add($event);
    this.componentCssClass = $event;
    localStorage.setItem('theme', $event);
  }
}
