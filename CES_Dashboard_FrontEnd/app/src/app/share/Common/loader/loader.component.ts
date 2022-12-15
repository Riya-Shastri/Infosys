import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  show: Boolean = false;
  color = 'warn';
  mode: any = 'indeterminate';
  value = 50;
  isLoading: boolean = false;

  constructor(public loaderService: LoaderService) {
  }
  ngOnInit(): void {
    this.loaderService.isLoading.subscribe(data => { this.isLoading = data })
  }

}
