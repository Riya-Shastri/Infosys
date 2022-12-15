import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/share/Services/common.service';
import { async } from '@angular/core/testing/testing';
import { response } from 'express';
import { resolve } from 'dns';

@Component({
  selector: 'app-material-status',
  templateUrl: './material-status.component.html',
  styleUrls: ['./material-status.component.scss']
})
export class MaterialStatusComponent implements OnInit {

  tableColumns = [];
  tableColumns2 = [];
  totalRecords: any;
  dataSource: any = [];
  dataSource2: any = [];
  detaiMaterialData: any;
  materialPayload : any;
  newComment = null;
  wwId = '';

  columns = [
    { columnDef: 'comp_number', header: 'Component No.' },
    { columnDef: 'message', header: 'Message' },
    { columnDef: 'mat_qty_short_ud', header: 'Updated Date' },
        
  ];
  columns2 = [
    { columnDef: 'user_comments', header: 'Comments' },
    { columnDef: 'created_by', header: 'Updated By' },
    { columnDef: 'created_date', header: 'Updated Date' }
    
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public materialDialogData: any,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<MaterialStatusComponent>
  ) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    this.wwId = userData['wwid'];
   }

  ngOnInit() {
    this.tableColumns = this.tableColumns.concat(this.columns.map(x => x.columnDef));
    this.tableColumns2 = this.tableColumns2.concat(this.columns2.map(y => y.columnDef));
    this.getMaterialData();
    this.fetchComment();
  }
 
  getMaterialData(){
    return new Promise((resolve, reject) => {

        if(this.materialDialogData){
        this.detaiMaterialData = this.materialDialogData
        let action = "Materials";
        let job_num = this.detaiMaterialData['job_num'] 

          this.commonService.getMaterialPlanningData(job_num, action).toPromise().then((res) =>{
            
            if((res['routes'] && res['routes'].length > 0)){
              this.dataSource = res['routes']
            }else {
              this.dataSource = [];
            }
          }).catch(error =>{
            this.dataSource = [];
            this.commonService.openSnackBar("Server Error", error);
          })
      } 
      else {
        console.log("No Record");
      }

    });

  }
  stopprop(event: any) {
    event.stopPropagation();
  }

  onClickAddComment(){

  } 
 saveComment(){

  let data; 

  if(this.newComment){

    data = {
      job_num : this.detaiMaterialData['job_num'],
      comment: this.newComment,
      user: this.wwId,
    }
    this.commonService.addMaterialsComment(data).toPromise().then(async (res) => {
      if ((res['status'].toLowerCase()) == 'success') {
        this.commonService.openSnackBar(res['message'], "Success");
        this.newComment = null;
        this.dialogCancel(res['message']);
      } else {
        this.commonService.openSnackBar(res['message'], "Error");
        this.dialogCancel(res['message']);
      }
    }).catch(err => { this.commonService.openSnackBar("Server Error", "Error"); });
  }
  else{
    this.commonService.openSnackBar("Add comment field shouldn't be empty", "Error");
  }
 }
 fetchComment(){
   return new Promise((resolve, reject) =>{
    let job_num = this.detaiMaterialData['job_num'] 
     this.commonService.getMaterialsComment(job_num).toPromise().then((response) =>{
       if((response['routes'] && response['routes'].length > 0)){
         this.dataSource2 = response['routes'];
         resolve(200);
       } else{
         this.dataSource2 = [];
         resolve(200);
       }
     }).catch(error =>{
       this.commonService.openSnackBar("Server Error",error);
       resolve(200);
     })
   })
 }
 dialogCancel(resdata) {
  this.dialogRef.close({ data: resdata });
}
 
}
