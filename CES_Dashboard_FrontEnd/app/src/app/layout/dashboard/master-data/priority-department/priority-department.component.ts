import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { AddDepartmentPriorityComponent } from '../add-department-priority/add-department-priority.component';
@Component({
  selector: 'app-priority-department',
  templateUrl: './priority-department.component.html',
  styleUrls: ['./priority-department.component.scss']
})
export class PriorityDepartmentComponent implements OnInit {

  componentName: any = 'DepartmentPriority';
  columns = [
    { columnDef: 'department_name', header: 'Department Name' },
    { columnDef: 'priority_mat_alloc', header: 'Priority for Material Allocation' },
    { columnDef: 'last_updated_by', header: 'Last Updated By' },
    { columnDef: 'last_updated_date', header: 'Last Updated Date' },
    { columnDef: 'action', header: 'Action' }
  ];
  totalRecords: any;
  departmentForm: FormGroup;
  dataSource: any = [];

  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private service: MasterAPIService
  ) { }

  ngOnInit(): void {
    this.dataSource = [];
    this.initFormGroup();
  }

  initFormGroup() {
    this.departmentForm = this.formBuilder.group({
      sortKey: new FormControl('priority_mat_alloc'),
      sortType: new FormControl('DESC')
    });
  }

  get f() {
    return this.departmentForm.controls;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDepartmentPriorityComponent, { disableClose: true });
    this.service.setDepartmentTableAction(null);


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = result;
      } 
    });
  }

  sortChange(event) {
    if (event) {
      if (!event['direction'] || event['direction'] == '') {
        this.departmentForm.setValue({
          sortKey: 'last_updated_date',
          sortType: 'desc'
        });
      } else {
        this.departmentForm.setValue({
          sortKey: event['active'],
          sortType: event['direction']
        });
      }
      setTimeout(() => {
        this.getData();
      }, 1000);
    }
  }

  deleteData(event) {
    if (event && event['detail']) {
      const id = event['detail']['department_id'];
      this.service.deleteDepartment(id).toPromise().then(res => {
        if (res && res['data']) {
          if ((res['data']['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(res['data']['message'], "Success");
          } else {
            this.commonService.openSnackBar(res['data']['message'], "Error");
          }
          this.getData();
        }
      }).catch(err => { });
    }
  }

  getData() {
    this.service.getDepartment(this.departmentForm.value).subscribe(res => {
      if (res && res['routes'].length > 0) {
        this.dataSource = res['routes'];
        //this.totalRecords = res.totalRecords;
      } else {
        this.dataSource = [];
        this.totalRecords = 0;
      }
    }, (error) => { });
  }

}
