import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';

@Component({
  selector: 'app-add-department-priority',
  templateUrl: './add-department-priority.component.html',
  styleUrls: ['./add-department-priority.component.scss']
})
export class AddDepartmentPriorityComponent implements OnInit {

  departmentForm: FormGroup;
  submitted = false;
  apiError;
  isEditPage = false;
  ManufacturingLine = [];
  departmentId = null;
  dataSource: any = [];

  constructor(
    private masterService: MasterAPIService,
    private formBuilder: FormBuilder,
    private commonService: CommonLogicService,
    private dialogRef: MatDialogRef<AddDepartmentPriorityComponent>,
    private service: CommonService
  ) {
    this.getManufactureLine();
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.masterService.departmentPriorityDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.departmentId = actionDetail['detail']['department_id'];
        this.initFormGroup(actionDetail['detail']);
      } else {
        this.isEditPage = false;
      }
    });
  }

  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.departmentForm = this.formBuilder.group({
      department_name: new FormControl(controlValue && controlValue['department_name'] ? controlValue['department_name'] : '', Validators.compose([
        Validators.required])),
      priority_mat_alloc: new FormControl(controlValue && controlValue['priority_mat_alloc'] ? controlValue['priority_mat_alloc'] : '', Validators.compose([
        Validators.required])),
      last_updated_by: new FormControl(wwid || ''),
    });
  }

  get f() {
    return this.departmentForm.controls;
  }

  getManufactureLine() {
    this.commonService.setCommonData.subscribe(detail => {
      if (detail && detail['mfg_lines']) {
        this.ManufacturingLine = detail['mfg_lines'];
      }
    });
  }

  saveDepartmentData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }

    const finalForm = this.departmentForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.departmentForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }

    this.masterService.addDepartment(finalForm, this.isEditPage, this.departmentId).toPromise().then(response => {
      if (response) {
        if ((response['status'].toLowerCase()) == 'success') {
          this.dialogClose();
          this.service.openSnackBar(response['message'], "Success");
        } else {
          this.dialogClose();
          this.service.openSnackBar(response['message'], "Error");
        }
      }
    }).catch(err => {
      this.service.openSnackBar("Server Error", "Error");
    });
  }

  async dialogClose() {
    await this.getDepartmentTableData().then(res => {
      if (res && res['routes'].length > 0) {
        this.dataSource = res['routes'];
      } else {
        this.dataSource = [];
      }
    }, (error) => { });
    this.dialogRef.close(this.dataSource);
  }

  dialogCancel() {
    this.dialogRef.close();
  }

  getDepartmentTableData() {
    return this.masterService.getDepartment({ sortKey: "last_updated_date", sortType: "desc" }).toPromise();
  }

}
