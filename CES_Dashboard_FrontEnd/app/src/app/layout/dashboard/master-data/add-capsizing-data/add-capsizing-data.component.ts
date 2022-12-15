import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-add-capsizing-data',
  templateUrl: './add-capsizing-data.component.html',
  styleUrls: ['./add-capsizing-data.component.scss']
})
export class AddCapsizingDataComponent implements OnInit {

  capsizingForm: FormGroup;
  submitted = false;
  apiError;
  isEditPage = false;
  close = false;
  ManufacturingLine = [];
  capsize_id = null;
  dataSource: any = [];
  selectedLine = '';

  constructor(
    private masterService: MasterAPIService,
    private commonService: CommonLogicService,
    private service: CommonService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddCapsizingDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getManufactureLine();
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.masterService.capsizeActionDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.initFormGroup(actionDetail['detail']);
        this.selectedLine = actionDetail['detail']['line_name'];
        this.capsize_id = actionDetail['detail']['capsize_id'];
      } else {
        this.isEditPage = false;
      }
    });
  }

  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.capsizingForm = this.formBuilder.group({
      line_id: new FormControl(
        controlValue && controlValue['line_id'] ? controlValue['line_id'] : '', Validators.compose([
          Validators.required])),
      capsize: new FormControl(controlValue && controlValue['capsize'] ? controlValue['capsize'] : '', Validators.compose([
        Validators.required])),
      last_updated_by: new FormControl(wwid || ''),
    });
  }

  get f() {
    return this.capsizingForm.controls;
  }

  getManufactureLine() {
    this.commonService.setCommonData.subscribe(detail => {
      if (detail && detail['mfg_lines']) {
        const Line = detail['mfg_lines'];
        if (Line && Line.length > 0) {
          Line.forEach(element => {
            if (element['is_module'] || element['is_canning']) {
              this.ManufacturingLine.push(element);
            }
          });
        }
      }
    });
  }

  saveCapsizeData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }
    const finalForm = this.capsizingForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.capsizingForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }

    this.masterService.addCapsizingData(finalForm, this.isEditPage, this.capsize_id).toPromise().then(response => {
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
    if (message) {
      this._snackBar.open(message, action);
    }
  }

  async dialogClose() {
    await this.getCapsizingTableData().then(res => {
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

  getCapsizingTableData() {
    return this.masterService.getCapsizingData({
      sortKey: "last_updated_date",
      sortType: "desc"
    }).toPromise();
  }

}

