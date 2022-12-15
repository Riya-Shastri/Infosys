import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-planning-status',
  templateUrl: './planning-status.component.html',
  styleUrls: ['./planning-status.component.scss']
})
export class PlanningStatusComponent implements OnInit {

  tableColumns = [];
  totalRecords: any;
  dataSource: any = [];
  detaiPlanningData: any;
  planningPayload : any;

  columns = [
    {columnDef:'comp_number', header: 'Component No.'},
    {columnDef: 'message', header: 'Message'},
    {columnDef: 'plan_qty_short_ud', header: 'Updated Date'},
    {columnDef: 'plan_user_comments', header: 'User Comments'},
    {columnDef: 'plan_user_comments_ub', header: 'Updated By'},
    {columnDef: 'plan_user_comments_ud', header: 'User Updated Date'},

  ]

  constructor( @Inject(MAT_DIALOG_DATA) public planningDialogData: any,
  private commonService: CommonService) { }

  async ngOnInit() {
    this.tableColumns = this.tableColumns.concat(this.columns.map(x => x.columnDef));
    await this.getPlanningData();
  }

  getPlanningData(){
    return new Promise((resolve, reject) => {
     
      if(this.planningDialogData){
        this.detaiPlanningData = this.planningDialogData
        let action = "Planning"
        let job_num = this.detaiPlanningData['job_num'] 
                 
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

}
