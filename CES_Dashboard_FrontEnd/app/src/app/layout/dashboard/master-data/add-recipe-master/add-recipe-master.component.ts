import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-recipe-master',
  templateUrl: './add-recipe-master.component.html',
  styleUrls: ['./add-recipe-master.component.scss']
})
export class AddRecipeMasterComponent implements OnInit {

  addRecipeMasterForm: FormGroup;
  submitted = false;
  apiError;
  isEditPage = false;
  cespart_details_id = null;
  assemplyDropDown = ["TLA", "WLA", "SERVICE"];
  auditDropDown = ["ABS", "DNV GL"];
  sizeDropDown = ["String"];
  dropDownDef = ["Yes"];
  dataSource: any = [];
  close = false;
  totalrecords: any;


  constructor(
    private formBuilder: FormBuilder,
    private serviceMaster: MasterAPIService,
    private service: CommonService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddRecipeMasterComponent>,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.serviceMaster.recipeMasterActionDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.initFormGroup(actionDetail['detail']);
        this.cespart_details_id = actionDetail['detail']['cespart_details_id'];
      } else {
        this.isEditPage = false;
      }
    })
  }
  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.addRecipeMasterForm = this.formBuilder.group({
      cespart_no: new FormControl(
        controlValue && controlValue['cespart_no'] ? controlValue['cespart_no'] : '', Validators.compose([
          Validators.required])),
      ces_base_part: new FormControl(
        controlValue && controlValue['ces_base_part'] ? controlValue['ces_base_part'] : '', Validators.compose([
          Validators.required])),
      style_no: new FormControl(
        controlValue && controlValue['style_no'] ? controlValue['style_no'] : null),
      assembly_type: new FormControl(
        controlValue && controlValue['assembly_type'] ? controlValue['assembly_type'] : ''),
      diameter: new FormControl(
        controlValue && controlValue['diameter'] ? controlValue['diameter'] : ''),
      length: new FormControl(
        controlValue && controlValue['length'] ? controlValue['length'] : ''),
      inlet_part: new FormControl(
        controlValue && controlValue['inlet_part'] ? controlValue['inlet_part'] : '',
      ),
      outlet_part: new FormControl(
        controlValue && controlValue['outlet_part'] ? controlValue['outlet_part'] : '',
      ),
      filter_part: new FormControl(
        controlValue && controlValue['filter_part'] ? controlValue['filter_part'] : '',
      ),
      mixer_part: new FormControl(
        controlValue && controlValue['mixer_part'] ? controlValue['mixer_part'] : '',
      ),
      catmod_no: new FormControl(
        controlValue && controlValue['catmod_no'] ? controlValue['catmod_no'] : '',
      ),
      inlet_catmod: new FormControl(
        controlValue && controlValue['inlet_catmod'] ? controlValue['inlet_catmod'] : '',
      ),
      canning_diameter_inlet: new FormControl(
        controlValue && controlValue['canning_diameter_inlet'] ? controlValue['canning_diameter_inlet'] : ''),
      outlet_catmod: new FormControl(
        controlValue && controlValue['outlet_catmod'] ? controlValue['outlet_catmod'] : '',
      ),
      canning_diameter_outlet: new FormControl(
        controlValue && controlValue['canning_diameter_outlet'] ? controlValue['canning_diameter_outlet'] : ''),
      filter_catmod: new FormControl(
        controlValue && controlValue['filter_catmod'] ? controlValue['filter_catmod'] : '',
      ),
      canning_diameter_filter: new FormControl(
        controlValue && controlValue['canning_diameter_filter'] ? controlValue['canning_diameter_filter'] : '',
      ),
      fg_rack: new FormControl(
        controlValue && controlValue['fg_rack'] ? controlValue['fg_rack'] : ''),
      audit: new FormControl(
        controlValue && controlValue['audit'] ? controlValue['audit'] : ''),
      size: new FormControl(
        controlValue && controlValue['size'] ? controlValue['size'] : ''),
      build_slot: new FormControl(
        controlValue && controlValue['build_slot'] ? controlValue['build_slot'] : ''),
      steering_wheel: new FormControl(
        controlValue && controlValue['steering_wheel'] ? controlValue['steering_wheel'] : ''),
      water_dam: new FormControl(
        controlValue && controlValue['water_dam'] ? controlValue['water_dam'] : ''),
      last_updated_by: new FormControl(wwid || ''),
    })
  }
  get f() {
    return this.addRecipeMasterForm.controls;
  }
  saveRecipeMasterData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }
    const finalForm = this.addRecipeMasterForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.addRecipeMasterForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }
    this.serviceMaster.addRecipeMasterData(finalForm, this.isEditPage, this.cespart_details_id).toPromise().then(response => {
      if (response) {
        if ((response['status'].toLowerCase()) == 'success') {
          this.dialogClose();
          this.service.openSnackBar(response['message'], "Success");
        }
        else {
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
  dialogCancel() {
    this.dialogRef.close();
  }
  getTableData() {
    return this.serviceMaster.fetchRecipeMasterData({
      limit: 10, pageNumber: 1,
      sortKey: "last_updated_date", sortType: "desc"
    }).toPromise();
  }
}
