import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-location-data',
  templateUrl: './add-location-data.component.html',
  styleUrls: ['./add-location-data.component.scss']
})
export class AddLocationDataComponent implements OnInit {

  locationDataForm: FormGroup;
  submitted = false;
  apiError;
  isEditPage = false;
  location_id = null;
  close = false;
  dataSource: any = [];
  dropDownDef = ["Yes", "No"]
  totalrecords: any;

  constructor(
    private formBuilder: FormBuilder,
    private serviceMaster: MasterAPIService,
    private service: CommonService,
    private dialogRef: MatDialogRef<AddLocationDataComponent>,
    private _snackBar: MatSnackBar,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.serviceMaster.locationMasterActionDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.initFormGroup(actionDetail['detail']);
        this.location_id = actionDetail['detail']['location_id'];
      } else {
        this.isEditPage = false;
        // this.initFormGroup();
        //this.locationDataForm.reset();
      }
    })
  }

  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.locationDataForm = this.formBuilder.group({
      oracle_sub_inventory: new FormControl(
        controlValue && controlValue['oracle_sub_inventory'] ? controlValue['oracle_sub_inventory'] : '', Validators.compose([
          Validators.required])),
      app_mat_script: new FormControl(
        controlValue && controlValue['app_mat_script'] ? controlValue['app_mat_script'] : '', Validators.compose([
          Validators.required])),
      app_plan_script: new FormControl(
        controlValue && controlValue['app_plan_script'] ? controlValue['app_plan_script'] : '', Validators.compose([
          Validators.required])),
      last_updated_by: new FormControl(wwid || ''),
    })

  }
  get f() {
    return this.locationDataForm.controls;
  }

  saveLocationMasterData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }

    const finalForm = this.locationDataForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.locationDataForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }

    this.serviceMaster.addlocationData(finalForm, this.isEditPage, this.location_id).toPromise().then(response => {
      if (response) {
        if ((response['status'].toLowerCase()) == 'success') {
          this.dialogClose();
          this.service.openSnackBar(response['message'], "Success");
        } else {
          this.dialogClose();
          this.service.openSnackBar(response['message'], "Error");
        }
      }
      this.close = true;
    }).catch(err => {
      this.service.openSnackBar("Server Error", "Error");
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async dialogClose() {
    await this.getLocationTableData().then(res => {
      if (res && res['routes'].length > 0) {
        this.dataSource = res['routes'];
        this.totalrecords = res['totalRecords'];
      } else {
        this.dataSource = [];
      }
    }, (error) => { });
    this.dialogRef.close({ data: this.dataSource, total: this.totalrecords });
  }

  dialogCancel() {
    this.dialogRef.close();
  }

  getLocationTableData() {
    return this.serviceMaster.getlocationData({ limit: 10, pageNumber: 1, sortKey: "last_updated_date", sortType: "desc" }).toPromise();
  }

}
