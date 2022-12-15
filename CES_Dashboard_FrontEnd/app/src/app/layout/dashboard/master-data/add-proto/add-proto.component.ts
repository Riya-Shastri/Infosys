import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MasterAPIService } from 'src/app/share/Services/masterData/master-api.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-proto',
  templateUrl: './add-proto.component.html',
  styleUrls: ['./add-proto.component.scss']
})
export class AddProtoComponent implements OnInit {

  protoTypeForm: FormGroup;
  submitted = false;
  apiError;
  isEditPage = false;
  proto_id = null;
  dropDownDef = ["Yes", "No"];
  dataSource: any = [];
  ces_tla_part: any;
  repack_type: any;
  inlet_catmod: any;
  outlet_catmod: any;
  filter_catmod: any;
  mixer: any;
  build_slot: any;
  fg_rack: any;
  totalrecords: any;


  constructor(private formBuilder: FormBuilder,
    private service: MasterAPIService,
    private dialogRef: MatDialogRef<AddProtoComponent>,
    private commonService: CommonService) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.service.protoTypeActionDetail.subscribe(actionDetail => {
      if (actionDetail) {
        this.isEditPage = true;
        this.initFormGroup(actionDetail['detail']);
        this.proto_id = actionDetail['detail']['proto_id'];
      } else {
        this.isEditPage = false;
      }
    })
  }

  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.protoTypeForm = this.formBuilder.group({
      ces_tla_part: new FormControl(
        controlValue && controlValue['ces_tla_part'] ? controlValue['ces_tla_part'] : '', Validators.compose([
          Validators.required])),
      repack_type: new FormControl(
        controlValue && controlValue['repack_type'] ? controlValue['repack_type'] : '', //Validators.compose([Validators.required])
        ),
      inlet_catmod: new FormControl(
        controlValue && controlValue['inlet_catmod'] ? controlValue['inlet_catmod'] : '', //Validators.compose([Validators.required])
        ),
      outlet_catmod: new FormControl(
        controlValue && controlValue['outlet_catmod'] ? controlValue['outlet_catmod'] : '', //Validators.compose([Validators.required])
        ),
      filter_catmod: new FormControl(
        controlValue && controlValue['filter_catmod'] ? controlValue['filter_catmod'] : '', //Validators.compose([Validators.required])
        ),
      mixer: new FormControl(
        controlValue && controlValue['mixer'] ? controlValue['mixer'] : '', //Validators.compose([Validators.required])
        ),
      build_slot: new FormControl(
        controlValue && controlValue['build_slot'] ? controlValue['build_slot'] : '', //Validators.compose([Validators.required])
        ),
      fg_rack: new FormControl(
        controlValue && controlValue['fg_rack'] ? controlValue['fg_rack'] : '', //Validators.compose([Validators.required])
        ),
      last_updated_by: new FormControl(wwid || ''),
    })

  }

  get f() {
    return this.protoTypeForm.controls;
  }

  saveProtoTypeData(valid) {
    this.submitted = true;
    if (!valid) {
      return;
    }

    const finalForm = this.protoTypeForm.value;
    if (!this.isEditPage) {
      finalForm['created_by'] = this.protoTypeForm.value.last_updated_by;
      delete finalForm['last_updated_by'];
    }

    this.service.addProtoTypeData(finalForm, this.isEditPage, this.proto_id).toPromise().then(response => {
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

  async dialogClose() {
    await this.getProtoTableData().then(res => {
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

  getProtoTableData() {
    return this.service.fetchProtoTypeData({ limit: 10, pageNumber: 1, sortKey: "last_updated_date", sortType: "desc" }).toPromise();
  }


}
