import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService, } from 'src/app/share/Services/common.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common'
describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let commonService: CommonService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterComponent],
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
        BrowserAnimationsModule
      ],
      providers: [
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('resetForm', () => {
    component.isOpen = false;
    component.SelectedfilterValue = {};
    component.filterForm.reset();
    component.schFilterval = {};
    component.filterValue = {};
    const mockcommonService: CommonService = TestBed.get(CommonService);

    mockcommonService.setClearFilterAction('reset');
    component.emitfilterval({});
    expect(component.resetForm()).not.toBeNull();


  });
  it('selectChangeHandler', () => {
    component.job_status = null;
    component.filterForm.patchValue({
      jobstatus_id: null
    });
  });

  it('Apply filter', () => {
    let selectedremovfilter;
    let datefilterdata;
    let startDate;
    let endDate;
    let edate;
 
    component.filterForm.get('jobNumber') ?.reset();
    component.filterForm.get('jobstatus_id') ?.reset();
    component.filterForm.controls['jobNumber'].reset();
    component.filterForm.controls['jobstatus_id'].reset();

    let fval = component.filterValue;
    datefilterdata = fval;
    component.SelectedfilterValue = { ...datefilterdata };
    component.SelectedfilterValue.start_date = startDate + "-" + endDate;

  
    var dateend = new Date(edate);
 

  });





  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
