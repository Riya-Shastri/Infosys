import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-alert-dialog-box',
  templateUrl: './alert-dialog-box.component.html',
  styleUrls: ['./alert-dialog-box.component.scss']
})
export class AlertDialogBoxComponent {

  displayedColumns: string[] = ['name', 'message'];
  displayedColumnsSuccess: string[] = ['name', 'message'];
  displayedColumnsNames = [{ name: "Name & WWID", message: "Message" }];
  dataSource: any;
  dataSourceSuccess: any;
  dataSourceFailure: any;
  constructor(
    public dialogRef: MatDialogRef<AlertDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  content: any = "";
  title = "";
  type = "";

  onOkClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.content = this.data.content;
    this.type = this.data.type;
    if (this.data.showSuccess) {
      this.title = "Success";
    } else {
      this.title = this.data.title;
    }
    if (this.data.tableData) {
      this.dataSourceSuccess = this.data.tableData.successArray;
      this.dataSourceFailure = this.data.tableData.failureArray;
    }
  }
}
