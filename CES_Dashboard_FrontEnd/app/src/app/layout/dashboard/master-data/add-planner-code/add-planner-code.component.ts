import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-planner-code',
  templateUrl: './add-planner-code.component.html',
  styleUrls: ['./add-planner-code.component.scss']
})
export class AddPlannerCodeComponent implements OnInit {

  addPlannerCodeForm: FormGroup;
  submitted = false;
  isEditPage = false;
  apiError;
  dataSource: any = [];
  totalrecords: any;
  close = false;
  // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
  driveDropdown = ["Yes", "No"];
  //Release 2 Changes - CHG0116719 - End
  planner_code_id = null;
  

  constructor(
    private formBuilder: FormBuilder,
    private serviceMaster: MasterAPIService,
    private service: CommonService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddPlannerCodeComponent>) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
    this.serviceMaster.plannerCodeActionDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.initFormGroup(actionDetail['detail']);
        this.planner_code_id = actionDetail['detail']['planner_code_id'];
      } else {
        this.isEditPage = false;
      }
    })
    //Release 2 Changes - CHG0116719 - End
  }
  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.addPlannerCodeForm = this.formBuilder.group({
      planner_code: new FormControl(
        controlValue && controlValue['planner_code'] ? controlValue['planner_code'] : '', Validators.compose([
          Validators.required])),
      // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
      bom_check: new FormControl(
        controlValue && controlValue['bom_check'] ? controlValue['bom_check'] : '', Validators.compose([
          Validators.required])),
      material_script_check: new FormControl(
        controlValue && controlValue['material_script_check'] ? controlValue['material_script_check'] : '', Validators.compose([
          Validators.required])),
      planning_script_check: new FormControl(
        controlValue && controlValue['planning_script_check'] ? controlValue['planning_script_check'] : '', Validators.compose([
          Validators.required])),
      last_updated_by: new FormControl(wwid || ''),
      //Release 2 Changes - CHG0116719 - End
    })
  }
  get f() {
    return this.addPlannerCodeForm.controls;
  }
  savePlannerCodeData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }
    // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
    const finalForm = this.addPlannerCodeForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.addPlannerCodeForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }
    this.serviceMaster.addPlannerCodeData(finalForm, this.isEditPage, this.planner_code_id).toPromise().then(response => {
    //Release 2 Changes - CHG0116719 - End  
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
  async dialogClose() {
    await this.getTableData().then(res => {
      if (res && res['routes'].length > 0) {
        this.totalrecords = res['totalRecords'];
        this.dataSource = res['routes'];
      } else {
        this.dataSource = [];
      }
    }, (error) => { });
    this.dialogRef.close({ data: this.dataSource, total: this.totalrecords });
  }

  
  getTableData() {
    return this.serviceMaster.fetchPlannerCodeData({
      limit: 10, 
      pageNumber: 1,
      // Release 2 Changes - CHG0116719 - Start <Phase 2 Changes code> 
      sortKey: "last_updated_date",      
      //Release 2 Changes - CHG0116719 - End
       sortType: "desc"
    }).toPromise();
  }
  dialogCancel() {
    this.dialogRef.close();
  }

}
