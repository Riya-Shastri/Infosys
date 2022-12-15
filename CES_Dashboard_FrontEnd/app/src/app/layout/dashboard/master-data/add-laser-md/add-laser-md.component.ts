import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { __values } from 'tslib';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-laser-md',
  templateUrl: './add-laser-md.component.html',
  styleUrls: ['./add-laser-md.component.scss']
})
export class AddLaserMdComponent implements OnInit {

  laserRecipeForm: FormGroup;
  submitted = false;
  apiError;
  isEditPage = false;
  laser_md_id = null;

  ces_part_rolledbody: any;
  ces_part_flat: any;
  diameter: any;
  length: any;
  mat_gauge_flat: any;
  cut: any;
  stamp: any;
  flare_pierce_gauge: any;
  manual_roll: any;
  weld: any;
  coin: any;
  lucas: any;
  close = false;
  dropDownDef = ["Yes"];
  dropDownFPG = ["FPG", "FP", "FG", "PG"];
  dataSource: any = [];
  totalrecords: any;

  constructor(
    private formBuilder: FormBuilder,
    private serviceMaster: MasterAPIService,
    private service: CommonService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddLaserMdComponent>,
  ) {
    this.initFormGroup();
  }
  ngOnInit(): void {

    this.serviceMaster.laserRecipeActionDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.initFormGroup(actionDetail['detail']);
        this.laser_md_id = actionDetail['detail']['laser_md_id'];
      } else {
        this.isEditPage = false;
      }
    })
  }

  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.laserRecipeForm = this.formBuilder.group({
      ces_part_rolledbody: new FormControl(
        controlValue && controlValue['ces_part_rolledbody'] ? controlValue['ces_part_rolledbody'] : '', Validators.compose([
          Validators.required])),
      ces_part_flat: new FormControl(
        controlValue && controlValue['ces_part_flat'] ? controlValue['ces_part_flat'] : '', Validators.compose([
          Validators.required])),
      diameter: new FormControl(
        controlValue && controlValue['diameter'] ? controlValue['diameter'] : ''),
      length: new FormControl(
        controlValue && controlValue['length'] ? controlValue['length'] : ''),
      mat_gauge_flat: new FormControl(
        controlValue && controlValue['mat_gauge_flat'] ? controlValue['mat_gauge_flat'] : ''),
      cut: new FormControl(
        controlValue && controlValue['cut'] ? controlValue['cut'] : ''),
      stamp: new FormControl(
        controlValue && controlValue['stamp'] ? controlValue['stamp'] : ''),
      flare_pierce_gauge: new FormControl(
        controlValue && controlValue['flare_pierce_gauge'] ? controlValue['flare_pierce_gauge'] : ''),
      manual_roll: new FormControl(
        controlValue && controlValue['manual_roll'] ? controlValue['manual_roll'] : ''),
      weld: new FormControl(
        controlValue && controlValue['weld'] ? controlValue['weld'] : ''),
      coin: new FormControl(
        controlValue && controlValue['coin'] ? controlValue['coin'] : ''),
      lucas: new FormControl(
        controlValue && controlValue['lucas'] ? controlValue['lucas'] : ''),
      runcell: new FormControl(
        controlValue && controlValue['runcell'] ? controlValue['runcell'] : ''),
      sized: new FormControl(
        controlValue && controlValue['sized'] ? controlValue['sized'] : ''),
      last_updated_by: new FormControl(wwid || ''),
    })

  }
  get f() {
    return this.laserRecipeForm.controls;
  }
  saveLaserRecipeData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }

    const finalForm = this.laserRecipeForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.laserRecipeForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }

    this.serviceMaster.addLaserRecipeData(finalForm, this.isEditPage, this.laser_md_id).toPromise().then(response => {
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
    return this.serviceMaster.fetchLaserRecipeData({
      limit: 10, pageNumber: 1,
      sortKey: "last_updated_date", sortType: "desc"
    }).toPromise();
  }


}
