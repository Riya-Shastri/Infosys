import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonLogicService } from 'src/app/share/Services/common-logic.service';
import { CommonService } from 'src/app/share/Services/common.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.scss']
})
export class JobStatusComponent implements OnInit {
  jobStatusForm: FormGroup;
  selected: any;
  jobStatusDropdown = [];
  job_status: any = '';
  parentJobId: any;
  jobStatusId: any;
  line_id: any;
  commentList = [];
  getAllData: any;
  WWID: any;
  manufacturingLine: any;
  close = false;
  dataSource: any = [];
  isComplete: any;
  commentsval: any;

  constructor(private formBuilder: FormBuilder,
    private commonLogicService: CommonLogicService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<JobStatusComponent>,
  ) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.WWID = userData['wwid'];
  }

  async ngOnInit() {
    this.initFormGroup();
    await this.getDropDown();
    await this.fetchComment();
  }

  initFormGroup(controlValue?: any) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const wwid = userData['wwid'];
    this.jobStatusForm = this.formBuilder.group({
      jobstatus_id: new FormControl(this.job_status),
      addComment: new FormControl(controlValue && controlValue['addComment']),
      last_added_by: new FormControl(wwid || ''),
    })
  }

  get f() {
    return this.jobStatusForm.controls;
  }

  getDropDown() {
    return new Promise((resolve, reject) => {
      this.commonLogicService.setCommonData.subscribe(async (detail) => {
        if (detail) {
          if (detail['job_status']) {
            this.jobStatusDropdown = detail['job_status'];
            await this.getDataFromFinal();
            this.fetchComment();
          } else {
            this.jobStatusDropdown = [];
            resolve(200);
          }
        }
      });
    });
  }

  //event handler for the select element's change event
  selectChangeHandler(event: any) {
    //update the ui
    this.job_status = event.target.value;
  }

  getDataFromFinal() {
    return new Promise((resolve, reject) => {
      this.commonLogicService.jobStatusActionDetail.subscribe(detail => {
        if (detail) {
          const getjobId = detail['jobstatus_id'];
          this.isComplete = getjobId;
          this.getAllData = detail;
          const setJobId = this.jobStatusDropdown.filter((item) => {
            return item.status_id == getjobId;
          });
          this.job_status = setJobId[0];
          this.jobStatusForm.patchValue({
            jobstatus_id: this.job_status
          });
          resolve(200);
        } else {
          resolve(200);
        }
      });
    });
  }

  fetchComment() {
    return new Promise((resolve, reject) => {
      const parentLine = this.getAllData['is_parent'];
      const moduleLine = this.getAllData['is_module'];
      const canningLine = this.getAllData['is_canning'];

      let data
      if (parentLine) {
        data = {
          "sortKey": "comment_id",
          "sortType": "Desc",
          "is_parent": this.getAllData['is_parent'],
          "is_module": this.getAllData['is_module'],
          "is_canning": this.getAllData['is_canning'],
          "job_id": this.getAllData['parent_job_id'],
          "status_type": 'jobstatus'
        }
      }
      else if (moduleLine) {
        data = {
          "sortKey": "comment_id",
          "sortType": "Desc",
          "is_parent": this.getAllData['is_parent'],
          "is_module": this.getAllData['is_module'],
          "is_canning": this.getAllData['is_canning'],
          "job_id": this.getAllData['module_job_id'],
          "status_type": 'jobstatus'
        }
      }
      else if (canningLine) {
        data = {
          "sortKey": "comment_id",
          "sortType": "Desc",
          "is_parent": this.getAllData['is_parent'],
          "is_module": this.getAllData['is_module'],
          "is_canning": this.getAllData['is_canning'],
          "job_id": this.getAllData['canning_job_id'],
          "status_type": 'jobstatus'
        }
      }

      this.commonService.fetchCommentData(data).toPromise().then((res) => {
        if ((res['routes'] && res['routes'].length > 0)) {
          this.commentList = res['routes'];
          resolve(200);
        } else {
          this.commentList = [];
          resolve(200);
        }
      }).catch(err => {
        this.commonService.openSnackBar("Server Error", "Error");
        resolve(200);
      });
    });
  }

  saveComment() {
    if (this.jobStatusForm) {
      if (this.jobStatusForm.value.addComment == '' || this.jobStatusForm.value.addComment == null) {
        this.commentsval = "Status changed to " + this.jobStatusForm.value.jobstatus_id['status_name'];
      } else {
        this.commentsval = this.jobStatusForm.value['addComment']
      }
      //Save Comments API Calling
      const parentLine = this.getAllData['is_parent'];
      const moduleLine = this.getAllData['is_module'];
      const canningLine = this.getAllData['is_canning'];
      let data;
      if (parentLine) {
        data = {
          "parent_job_id": this.getAllData['parent_job_id'],
          "status_id": this.jobStatusForm.value.jobstatus_id['status_id'],
          "new_status": this.jobStatusForm.value.jobstatus_id['status_name'],
          "comments": this.commentsval,
          "created_by": this.jobStatusForm.value['last_added_by'],
          "previous_status": this.job_status.status_name,
          "action": "jobstatus",
          line_id: this.getAllData['line_id'],
          line_name: this.getAllData['line_name'],
          scheduled_qunatity: this.getAllData['scheduled_qunatity'],
          job_complete_date : this.getAllData['job_complete_date'],
          job_complete_time : this.getAllData['job_complete_time']

        }
      }
      else if (moduleLine) {
        data = {
          "module_job_id": this.getAllData['module_job_id'],
          "status_id": this.jobStatusForm.value.jobstatus_id['status_id'],
          "new_status": this.jobStatusForm.value.jobstatus_id['status_name'],
          "comments": this.commentsval,
          "created_by": this.jobStatusForm.value['last_added_by'],
          "previous_status": this.job_status.status_name,
          "action": "jobstatus",
          line_id: this.getAllData['line_id'],
          line_name: this.getAllData['line_name'],
          scheduled_qunatity: this.getAllData['scheduled_qunatity'],
          job_complete_date : this.getAllData['job_complete_date'],
          job_complete_time : this.getAllData['job_complete_time']
        }
      }
      else if (canningLine) {
        data = {
          "canning_job_id": this.getAllData['canning_job_id'],
          "status_id": this.jobStatusForm.value.jobstatus_id['status_id'],
          "new_status": this.jobStatusForm.value.jobstatus_id['status_name'],
          "comments": this.commentsval,
          "created_by": this.jobStatusForm.value['last_added_by'],
          "previous_status": this.job_status.status_name,
          "action": "jobstatus",
          line_id: this.getAllData['line_id'],
          line_name: this.getAllData['line_name'],
          scheduled_qunatity: this.getAllData['scheduled_qunatity'],
          job_complete_date : this.getAllData['job_complete_date'],
          job_complete_time : this.getAllData['job_complete_time']
        }
      }

      this.commonService.addCommentData(data).toPromise().then(async (res) => {
        if (res) {
          if ((res['status'].toLowerCase()) == 'success') {
            this.commonService.openSnackBar(res['message'], "Success");
            this.dialogCancel(res['message']);
          } else {
            this.commonService.openSnackBar(res['message'], "Error");
            this.dialogCancel(res['message']);
          }
        } this.close = true;
      }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
    }
  }

  dialogCancel(resdata) {
    this.dialogRef.close({ data: resdata });
  }

}
