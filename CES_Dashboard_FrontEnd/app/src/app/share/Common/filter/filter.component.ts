import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../Services/common.service';
import { CommonLogicService } from '../../Services/common-logic.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  filterValue: any;
  filterVal: any;
  schFilterval: any;
  SelectedfilterValue: any;
  isOpen = false;
  filterForm: FormGroup;
  @Input() componentName: any;
  @Output() filterData: EventEmitter<any> = new EventEmitter<any>();
  jobStatusDropdown = [];
  job_status: any = '';
  isDarkTheme = false;
  minDate = new Date();

  constructor(
    private datePipe: DatePipe,
    private commonService: CommonService,
    private commonLogicService: CommonLogicService,
  ) {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.filterForm = new FormGroup({
      jobNumber: new FormControl(''),
      ces_part_rolledbody: new FormControl(''),
      start_date: new FormControl(),
      end_date: new FormControl(),
      comp_number: new FormControl(),
      jobstatus_id: new FormControl({ status_color: null, status_name: null, status_id: null }),
    });
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark-theme' ? this.isDarkTheme = true : this.isDarkTheme = false;
    }
    this.getDropDown();
  }

  get f() {
    return this.filterForm.controls;
  }

  selectChangeHandler(event: any) {
    this.job_status = event.target.value;
    this.filterForm.patchValue({
      jobstatus_id: event.target.value
    });
  }

  getDropDown() {
    return new Promise((resolve, reject) => {
      this.commonLogicService.setCommonData.subscribe(async (detail) => {
        if (detail) {
          if (detail['job_status']) {
            this.jobStatusDropdown = detail['job_status'];
          } else {
            this.jobStatusDropdown = [];
            resolve(200);
          }
        }
      });
    });
  }

  ngOnInit(): void {
    this.commonService.clearFilterAction.subscribe((res: any) => {
      if (res && res == 'reset') {
        this.isOpen = false;
        this.SelectedfilterValue = {};
        this.filterForm.reset();
        this.commonService.setClearFilterAction(null);
      }
    });
  }

  openFliter() {
    this.isOpen = !this.isOpen;
  }

  resetForm() {
    this.isOpen = false;
    this.SelectedfilterValue = {};
    this.filterForm.reset();
    this.schFilterval = {};
    this.filterValue = {};
    this.commonService.setClearFilterAction('reset');
    this.emitfilterval({});
  }

  ApplyFliter() {

    let endDate: any;
    let startDate: any;
    let datefilterdata: any;

    if (this.componentName === "LaserMd") {
      for (const filter_key in this.filterForm.value) {
        if (filter_key === "ces_part_rolledbody") {
          this.filterVal = this.filterForm.value.ces_part_rolledbody;
        }
      }
      this.filterValue = {
        "ces_part_rolledbody": this.filterForm.value.ces_part_rolledbody
      }
      this.emitfilterval(this.filterValue);
      this.SelectedfilterValue = { ...this.filterValue };
    }
    else if (this.componentName === "Proto") {
      for (const filter_key in this.filterForm.value) {
        if (filter_key === "ces_tla_part") {
          this.filterVal = this.filterForm.value.ces_part_rolledbody;
        }
      }
      this.filterValue = {
        "ces_tla_part": this.filterForm.value.ces_part_rolledbody
      }
      this.emitfilterval(this.filterValue);
      this.SelectedfilterValue = { ...this.filterValue };
    }
    else if (this.componentName === "MasterData") {
      for (const filter_key in this.filterForm.value) {
        if (filter_key === "cespart_no") {
          this.filterVal = this.filterForm.value.ces_part_rolledbody;
        }
      }
      this.filterValue = {
        "cespart_no": this.filterForm.value.ces_part_rolledbody
      }
      this.emitfilterval(this.filterValue);
      this.SelectedfilterValue = { ...this.filterValue };
    }
    else if (this.componentName === "scheduler" || this.componentName === "schedulerFinal"
      || this.componentName === "Final" || this.componentName === "Metrics") {

      if (this.componentName === "Metrics") {
        this.filterValue = {
          start_date: this.filterForm.value.start_date,
          end_date: this.filterForm.value.end_date
        }
      } else {
        this.filterValue = {
          job_num: this.filterForm.value.jobNumber,
          ces_part_num_catmod: this.filterForm.value.ces_part_rolledbody,
          start_date: this.filterForm.value.start_date,
          end_date: this.filterForm.value.end_date
        }
      }

      if (this.componentName !== "Metrics") {
        if (this.componentName === "Final" && this.filterForm.value && this.filterForm.value.jobstatus_id
          && this.filterForm.value.jobstatus_id['status_id']) {
          this.filterValue['jobstatus_id'] = this.filterForm.value.jobstatus_id['status_id'];
        } else {
          this.filterValue['jobstatus_id'] = {};
        }
      }

      if (this.filterValue?.end_date) {
        let latest_date = this.datePipe.transform(this.filterValue?.end_date, 'dd-MMM-yy');
        endDate = latest_date;
        var edate = this.datePipe.transform(this.filterValue.end_date, 'yyyy-MM-dd');
        var dateend = new Date(edate);
        // this.filterValue.end_date = new Date(dateend.setDate(dateend.getDate() + 1));
        this.filterValue.end_date = this.datePipe.transform(this.filterValue.end_date, 'yyyy-MM-dd');
      }

      if (this.filterValue?.start_date) {
        let latest_date = this.datePipe.transform(this.filterValue?.start_date, 'dd-MMM-yy');
        startDate = latest_date;
        this.filterValue.start_date = this.datePipe.transform(this.filterValue.start_date, 'yyyy-MM-dd');
      }

      var stringifiedfilter = JSON.stringify(this.filterValue);
      this.schFilterval = JSON.parse(stringifiedfilter);
      const newfilter = JSON.parse(JSON.stringify(this.schFilterval));

      setTimeout(() => {
        this.emitfilterval(newfilter);
      }, 100);

      let fval = this.filterValue;
      datefilterdata = fval;
      delete datefilterdata.end_date;
      delete datefilterdata.start_date;
      this.SelectedfilterValue = { ...datefilterdata };
      this.SelectedfilterValue.start_date = startDate + "-" + endDate;

    } else if (this.componentName === "planning") {
      this.filterValue = {
        comp_number: this.filterForm.value.comp_number,
        start_date: this.filterForm.value.start_date,
        end_date: this.filterForm.value.end_date
      }
      if (this.filterValue?.end_date) {
        let latest_date = this.datePipe.transform(this.filterValue?.end_date, 'dd-MMM-yy');
        endDate = latest_date;
        var edate = this.datePipe.transform(this.filterValue.end_date, 'yyyy-MM-dd');
        var dateend = new Date(edate);
        this.filterValue.end_date = new Date(dateend.setDate(dateend.getDate()));
      }
      if (this.filterValue?.start_date) {
        let latest_date = this.datePipe.transform(this.filterValue?.start_date, 'dd-MMM-yy');
        startDate = latest_date;
        this.filterValue.start_date = this.datePipe.transform(this.filterValue.start_date, 'yyyy-MM-dd');
      }
      var stringifiedfilter = JSON.stringify(this.filterValue);
      this.schFilterval = JSON.parse(stringifiedfilter);
      const newfilter = JSON.parse(JSON.stringify(this.schFilterval));
      this.emitfilterval(newfilter);

      let fval = this.filterValue;
      datefilterdata = fval;
      delete datefilterdata.end_date;
      delete datefilterdata.start_date;
      this.SelectedfilterValue = { ...datefilterdata };
      this.SelectedfilterValue.start_date = startDate + "-" + endDate;
      //this.SelectedfilterValue.jobstatus_id = this.filterForm.value.jobstatus_id['status_name'];
    }

    for (const filter_key in this.SelectedfilterValue) {
      if (this.componentName == "LaserMd") {
        if (filter_key === "ces_part_rolledbody") {
          this.SelectedfilterValue["CES Part"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
      }
      if (this.componentName == "Proto") {
        if (filter_key === "ces_tla_part") {
          this.SelectedfilterValue["CES Part"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
      }
      if (this.componentName == "MasterData") {
        if (filter_key === "cespart_no") {
          this.SelectedfilterValue["CES Part"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
      }
      if (this.componentName === "scheduler" || this.componentName === "schedulerFinal"
        || this.componentName === "Final" || this.componentName === "Metrics") {
        if (filter_key === "job_num") {
          this.SelectedfilterValue["Job Number"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
        if (filter_key === "ces_part_num_catmod") {
          this.SelectedfilterValue["CES Part"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
        if (filter_key === "start_date" || filter_key === 'end_date') {
          this.SelectedfilterValue["Run Date"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
        if (filter_key === "jobstatus_id") {
          this.jobStatusDropdown.forEach(element => {
            if (element['status_id'] === this.SelectedfilterValue[filter_key]) {
              this.SelectedfilterValue["Job Status"] = element['status_name'];
              delete this.SelectedfilterValue[filter_key];
            }
          });
        }
      }
      if (this.componentName == "planning") {
        if (filter_key === "comp_number") {
          this.SelectedfilterValue["Component"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
        if (filter_key === "start_date" || filter_key === 'end_date') {
          this.SelectedfilterValue["Run Date"] = this.SelectedfilterValue[filter_key];
          delete this.SelectedfilterValue[filter_key];
        }
      }
    }
    this.isOpen = false;
  }

  removeFilter(selectedFilter: any) {
    delete this.SelectedfilterValue[selectedFilter];

    if (this.componentName == "LaserMd") {
      if (selectedFilter === "CES Part") {
        selectedFilter = "ces_part_rolledbody"
      }
    }

    if (this.componentName == "Proto") {
      if (selectedFilter === "CES Part") {
        selectedFilter = "ces_tla_part"
      }
    }

    if (this.componentName == "MasterData") {
      if (selectedFilter === "CES Part") {
        selectedFilter = "cespart_no"
      }
    }

    if (this.componentName === "scheduler" || this.componentName === "schedulerFinal"
      || this.componentName === "Final" || this.componentName === "Metrics") {
      if (selectedFilter === "Job Number") {
        selectedFilter = "job_num"
      }
      if (selectedFilter === "CES Part") {
        selectedFilter = "ces_part_num_catmod"
      }
      if (selectedFilter === "Run Date") {
        selectedFilter = "start_date"
      }
      if (selectedFilter === "End Date") {
        selectedFilter = "end_date"
      }
      if (selectedFilter === "Job Status") {
        selectedFilter = "jobstatus_id"
      }
    }

    var selectedremovfilter = selectedFilter;

    if (this.componentName === "scheduler" || this.componentName === "schedulerFinal"
      || this.componentName === "Final" || this.componentName === "Metrics") {

      if (selectedremovfilter == "start_date" || selectedremovfilter == 'end_date') {
        this.schFilterval['start_date'] = '';
        this.schFilterval['end_date'] = '';
        delete this.schFilterval.end_date;
        delete this.schFilterval.start_date;
        this.filterForm.get('end_date')?.reset();
        this.filterForm.get('start_date')?.reset();
      } else if (selectedremovfilter == 'ces_part_num_catmod') {
        if (this.schFilterval['ces_part_num']) {
          this.schFilterval['ces_part_num'] = null;
          delete this.schFilterval['ces_part_num'];
        } else if (this.schFilterval['inlet_ces_part_num']) {
          this.schFilterval['inlet_ces_part_num'] = null;
          delete this.schFilterval['inlet_ces_part_num'];
        } else if (this.schFilterval['outlet_ces_part_num']) {
          this.schFilterval['outlet_ces_part_num'] = null;
          delete this.schFilterval['outlet_ces_part_num'];
        } else if (this.schFilterval['filter_ces_part_num']) {
          this.schFilterval['filter_ces_part_num'] = null;
          delete this.schFilterval['filter_ces_part_num'];
        } else if (this.schFilterval['mixer_ces_part_num']) {
          this.schFilterval['mixer_ces_part_num'] = null;
          delete this.schFilterval['mixer_ces_part_num'];
        } else {
          this.schFilterval[selectedremovfilter] = null;
          delete this.schFilterval[selectedremovfilter];
        }
        this.filterForm.get('ces_part_rolledbody')?.reset();
      } else if(selectedremovfilter=="job_num"){
        this.schFilterval[selectedremovfilter] = null;
        delete this.schFilterval[selectedremovfilter];
        this.filterForm.get('jobNumber')?.reset();
        this.filterForm.controls['jobNumber'].reset();
      } else {
        this.schFilterval[selectedremovfilter] = null;
        delete this.schFilterval[selectedremovfilter];
        if( this.componentName === "Final"){
        this.schFilterval['jobstatus_id'] = null; 
        }   
        //this.filterForm.get('jobNumber')?.reset();
        this.filterForm.get('jobstatus_id')?.reset();
        //this.filterForm.controls['jobNumber'].reset();
        this.filterForm.controls['jobstatus_id'].reset();
      }
    } else if (this.componentName === "planning") {
      if (selectedremovfilter == 'Component') {
        if (this.schFilterval['comp_number']) {
          this.schFilterval['comp_number'] = null;
          delete this.schFilterval['comp_number'];
          this.filterForm.get('comp_number')?.reset();
        }
      } else if (selectedremovfilter == "Run Date" || selectedremovfilter == "start_date" || selectedremovfilter == 'end_date') {
        this.schFilterval['start_date'] = '';
        this.schFilterval['end_date'] = '';
        delete this.schFilterval.end_date;
        delete this.schFilterval.start_date;
        this.filterForm.get('end_date')?.reset();
        this.filterForm.get('start_date')?.reset();
      }
    } else {
      this.filterValue[selectedremovfilter] = null;
      delete this.filterValue[selectedremovfilter];
      this.filterForm.get(selectedremovfilter)?.reset(); 
      if(selectedremovfilter == "ces_tla_part" || selectedremovfilter =='cespart_no'){
      this.filterForm.controls['ces_part_rolledbody'].reset();
      } else{        
        this.filterForm.controls[selectedremovfilter].reset();
      }
    }

    if (this.componentName === "scheduler" || this.componentName === "schedulerFinal"
      || this.componentName === "Final" || this.componentName === "planning") {
      this.emitfilterval(this.schFilterval);
    } else {
      this.emitfilterval(this.filterValue);
    }
  }

  emitfilterval(filterval: any) {
    this.filterData.emit(filterval);
  }

}
