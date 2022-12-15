import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-update-shift-timing',
  templateUrl: './update-shift-timing.component.html',
  styleUrls: ['./update-shift-timing.component.scss']
})
export class UpdateShiftTimingComponent implements OnInit {
  submitted = false;
  isEditPage = false;
  apiError;
  dataSource: any = [];
  totalrecords: any;
  close = false;
  line_id = null;
  line_name: any;
  userData: any;
  protoTypeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpdateShiftTimingComponent>,
    private serviceMaster: MasterAPIService,
    private commonService: CommonService
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData') || '{}');

  }

  ngOnInit(): void {
    this.serviceMaster.shiftTimeDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.line_id = actionDetail['detail']['line_id'];
        this.line_name = actionDetail['detail']['line_name'];
        this.updateShiftForm.get('first_shift_s_t') ?.setValue(actionDetail['detail']['first_shift_s_t']);
        this.updateShiftForm.get('first_shift_e_t') ?.setValue(actionDetail['detail']['first_shift_e_t']);
        this.updateShiftForm.get('second_shift_s_t') ?.setValue(actionDetail['detail']['second_shift_s_t']);
        this.updateShiftForm.get('second_shift_e_t') ?.setValue(actionDetail['detail']['second_shift_e_t']);
        this.updateShiftForm.get('third_shift_s_t') ?.setValue(actionDetail['detail']['third_shift_s_t']);
        this.updateShiftForm.get('third_shift_e_t') ?.setValue(actionDetail['detail']['third_shift_e_t']);
      } else {
        this.isEditPage = false;
      }
    })

  }

  public updateShiftForm: FormGroup = this.formBuilder.group({
    first_shift_s_t: ['', Validators.compose([
      Validators.required])],
    first_shift_e_t: ['', Validators.compose([
      Validators.required])],
    second_shift_s_t: ['', Validators.compose([
      Validators.required])],
    second_shift_e_t: ['', Validators.compose([
      Validators.required])],
    third_shift_s_t: ['', Validators.compose([
      Validators.required])],
    third_shift_e_t: ['', Validators.compose([
      Validators.required])],
    st_updated_by: ['']
  });
  async dialogClose() {
    await this.getShiftTimingData().then(res => {
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

  saveShiftTimeData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }

    const finalForm = this.updateShiftForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.userData['wwid'];
      delete finalForm['last_updated_by'];
    } else {
      finalForm['st_updated_by'] = this.userData['wwid'];
    }

    this.serviceMaster.addShiftTimingData(finalForm, this.isEditPage, this.line_id).toPromise().then(response => {
      if (response) {
        if ((response['status'].toLowerCase()) == 'success') {
          this.dialogClose();
          this.commonService.openSnackBar(response['message'], "Success");
        } else {
          this.dialogClose();
          this.commonService.openSnackBar(response['message'], "Error");
        }
      }
    }).catch(err => {
      this.commonService.openSnackBar("Server Error", "Error");
    });
  }

  getShiftTimingData() {
    return this.serviceMaster.fetchShiftTimingData({ limit: 10, pageNumber: 1, sortKey: "st_updated_date", sortType: "DESC" }).toPromise();
  }


}
