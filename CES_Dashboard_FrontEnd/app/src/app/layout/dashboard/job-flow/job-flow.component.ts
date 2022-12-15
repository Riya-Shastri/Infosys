import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-flow',
  templateUrl: './job-flow.component.html',
  styleUrls: ['./job-flow.component.scss']
})
export class JobFlowComponent implements OnInit {

  job =
  {"parent": {"child": [{"color": "#008000", "ces_part": null, "schd_qty": 20, "line_name": "M-1000", "grandChild": [{"color": "", "ces_part": "utr65", "schd_qty": 11, "line_name": "C500", "job_number": "MO-161", "deletedClass": "N"}], "job_number": "MO-6846164", "deletedClass": "N"}], "multiparent": [{"color": "#CCCC00", "ces_part": "A055P698-00", "schd_qty": 20, "line_name": "A2100", "job_number": "MO-6846172", "deletedClass": "N"}]}}
 
  
  constructor() { }

  ngOnInit(): void {
  }

}
