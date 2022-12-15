import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.scss']
})
export class AddStatusComponent implements OnInit {
 // StatusForm: FormGroup;
  silecteddetails: any;
  dataSource: any = [];
  totalrecords: any;
  WWID: any;
  controlValue:any;
  constructor(private fb: FormBuilder,
    private commonLogicService: CommonLogicService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<AddStatusComponent>) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.WWID = userData['wwid'];
  }

  ngOnInit(): void {
    this.commonLogicService.planningStatusActionDetail.subscribe(res => {
      if (res) {
        this.controlValue=res.rowdetail;
        this.StatusForm.get('planner_comments')?.setValue(this.controlValue['planner_comments']);
        this.silecteddetails=res;
      }
    });
  }

  public StatusForm: FormGroup = this.fb.group({
    planner_comments: ['', [Validators.required]],
    
  });
  async dialogClose(resdata) {
     this.dialogRef.close({ data: resdata });    
  }

  savecommentData(valid) {
    if (!valid) {
      return;
    }
  let component=this.silecteddetails.rowdetail.component;
    let inputObject = {
      "comp_comment_id" : this.silecteddetails.rowdetail.comp_comment_id,
      "planner_comments": this.StatusForm.value.planner_comments,
      "last_updated_by": this.WWID
    }
    this.commonService.updatestatuscommnet(inputObject,component).subscribe((response: any) => {
      if (response) {
        if ((response.data['status'].toLowerCase()) == 'success') {
          this.dialogClose(response.data['message']);
          this.commonService.openSnackBar(response.data['message'], "Success");
        } else {
          this.dialogClose(response.data['message']);
          this.commonService.openSnackBar(response.data['message'], "Error");
        }
      }
  }, errorResponse => {
  console.log(errorResponse);
})

  }

    
}
