import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/share/Services/common.service';

@Component({
  selector: 'app-sub-assembly',
  templateUrl: './sub-assembly.component.html',
  styleUrls: ['./sub-assembly.component.scss']
})
export class SubAssemblyComponent implements OnInit {

  dataSource: any = [];
  filterval: any;
  componentName: any = 'subassembly';
  totalRecords: any;
  currentPageSize: number = 10;
  pageIndex: number = 0;
  sortKey: string = "run_date";
  sortType: string = "ASC";
  rowIndex: any;
  tableColumns = [];
  tableData: any = [];
  detailData: any;
  assemblydetaildata: any;

  columns = [
    { columnDef: 'line_name', header: 'Line Name' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'job_num', header: 'Job Number' },
    { columnDef: 'part_num', header: 'Part Number' },
    { columnDef:'scheduled_qunatity', header: 'Sched Qty' },
    { columnDef:'remaining_quantity', header: 'Qty Remain' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dilogdata: any,
    private commonService: CommonService) { }

  async ngOnInit() {
    this.tableColumns = this.tableColumns.concat(this.columns.map(x => x.columnDef));
    await this.getAssemblydata();
  }

  getAssemblydata() {
    return new Promise((resolve, reject) => {
      // this.commonLogicService.setsubassemblyActionDetails.subscribe(detail => {
      if (this.dilogdata) {
        this.detailData = this.dilogdata;
        const parentLine = this.detailData['is_parent'];
        const moduleLine = this.detailData['is_module'];
        const canningLine = this.detailData['is_canning'];

        if (parentLine) {
          this.assemblydetaildata = {
            "parent_job_id": this.detailData['parent_job_id'],
            "line_id": this.detailData['line_id'],
            "line_name": this.detailData['line_name'],
          }
        }
        else if (moduleLine) {
          this.assemblydetaildata = {
            "module_job_id": this.detailData['module_job_id'],
            "line_id": this.detailData['line_id'],
            "line_name": this.detailData['line_name'],
          }
        }
        else if (canningLine) {
          this.assemblydetaildata = {
            "canning_job_id": this.detailData['canning_job_id'],
            "line_id": this.detailData['line_id'],
            "line_name": this.detailData['line_name'],
          }
        }
        this.commonService.fetchSubAssemblyData(this.assemblydetaildata).toPromise().then((res) => {
          if ((res['subassembly_list'] && res['subassembly_list'].length > 0)) {
            this.dataSource = res['subassembly_list']
          } else {
            this.dataSource = [];
          }

        }).catch(error => {
          this.dataSource = [];
          this.commonService.openSnackBar("Server Error1:" + error, "Error");
        })
      } else {
        console.log('no record')
      }
    });
  }

}
