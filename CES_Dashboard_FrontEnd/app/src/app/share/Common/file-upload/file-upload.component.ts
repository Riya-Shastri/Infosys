import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { CommonLogicService } from '../../Services/common-logic.service';
import { CommonService } from '../../Services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MasterAPIService } from '../../Services/masterData/master-api.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  files: NgxFileDropEntry[] = [];
  errorMsg: any = null;
  filetoUpload: string;
  uploadPresignedUrl: any;
  uploadFileName: File;
  WWID: any;
  fname: any;
  current = new Date();
  timestamp = this.current.getTime();
  fileUploadS3: any;
  dataSource: any = [];
  totalrecords: any;
  fileuploaded: boolean = false;
  runscriptflag: boolean = false;
  uploadedfileFlag = false;
  arrayBuffer: any;
  jsondata: any;
  @Input() componentName: any;
  @Input() mfLine: any;
  isDarkTheme = false;
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;

  show: Boolean = false;
  color = 'warn';
  mode: any = 'indeterminate';
  value = 50;
  isLoading: boolean = false;

  constructor(
    private commonLogicService: CommonLogicService,
    private commonService: CommonService,
    private serviceMaster: MasterAPIService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FileUploadComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.WWID = userData['wwid'];
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark-theme' ? this.isDarkTheme = true : this.isDarkTheme = false;
    }
  }

  ngOnInit(): void {
    
  }

  dropped(files: NgxFileDropEntry[]) {
    this.files = [];
    if (files.length !== 1) {
      this.errorMsg = 'Cannot add more than 1 Files at a time';
    } else {
      this.errorMsg = '';
      for (const droppedFile of files) {
        if (droppedFile.fileEntry.isFile) {
          this.fileuploaded = true;
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            this.uploadFileName = file;
            const fileName = file.name;
            this.fname = file.name;
            const fileSize = file.size;
            const extension = fileName.split(".")[1];
            var filewithoutExt = fileName.replace(/\.[^/.]+$/, "")
            var nameSplit = filewithoutExt.split(" ");

            if (fileSize <= 3000000) {
              if (extension === 'xlsx' || extension === 'xls') {
                const formData = new FormData();
                this.files = files;
                formData.append(fileName, file, droppedFile.relativePath)
              } else {
                this.errorMsg = 'Invalid file format';
              }
            } else {
              this.errorMsg = 'Max size of a file allowed is 3mb, files with size more than 3mb is discarded.';
            }
            if (this.componentName == 'scheduler') {
              let file = this.uploadFileName;
              let fileReader = new FileReader();
              fileReader.readAsArrayBuffer(file);
              fileReader.onload = (e) => {
                this.arrayBuffer = fileReader?.result;
                var data = new Uint8Array(this.arrayBuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                var workbook = XLSX.read(bstr, { type: "binary" });
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                this.jsondata = XLSX.utils.sheet_to_json(worksheet);
                if (this.jsondata.length > 30 || this.jsondata.length == 0) {
                  this.fileuploaded = false;
                  this.runscriptflag = true;
                  this.files = [];
                  this.commonService.openSnackBar('Records should be more than 0 or less than or euqal to 30', "Error");
                  return;
                } else {
                  this.uploadfileData();
                }
              }
              this.filetoUpload = nameSplit[0] + "_" + this.mfLine + "_" + this.WWID + "_" + this.timestamp + "." + fileName.split(".")[1];
            } else {
              this.filetoUpload = filewithoutExt + "_" + this.WWID + "_" + this.timestamp + "." + fileName.split(".")[1];
            }
          });
        } else {
          this.errorMsg = 'Please select file';
        }
      }
    }
  }

  uploadfileData() {
    if (this.componentName == 'scheduler') {
      var data = {
        file_name: this.filetoUpload,
        user: this.WWID,
        action: 'Dashboard'
      }
    } else {
      var data = {
        file_name: this.filetoUpload,
        user: this.WWID,
        action: 'Data_config'
      }
    }

    this.commonLogicService.uploadfile(data).subscribe(res => {
      if (res['url']) {
        this.uploadPresignedUrl = (res['url']);
        var newFile: File = new File([this.uploadFileName], this.filetoUpload, { type: this.uploadFileName.type });
        this.fileUploadS3 = newFile;
        this.putFileOnS3(this.fileUploadS3, this.uploadPresignedUrl)
      } else {
        if ((res['status'].toLowerCase()) == 'error') {
          this.commonService.openSnackBar(res['message'], "Error");
          this.dialogCancel();
        }
      }
    }, errorResponse => {
      if (errorResponse.errorMessage == undefined) {
        this.commonService.openSnackBar('Error Occurred While Uploading File', "Error");
        this.dialogCancel();
      }
    })

  }

  putFileOnS3(file_to_upload: any, uploadPresignedUrl: any) {
    this.isLoading = true;
    this.commonLogicService.putFileToS3(file_to_upload, uploadPresignedUrl).subscribe((data: any) => {
      if (this.componentName == 'scheduler') {
        this.fileuploaded = false;
        this.runscriptflag = true;
        this.files = [];
        this.commonService.openSnackBar('Job details extraction is in progress. We will notify you over email once completed.', "Success");
        this.isLoading = false;
      } else {
        this.isLoading = true;
        this.parsefiledata();
      }
    }, errorResponse => {
      this.commonService.openSnackBar('Error Occurred While Uploading File s3', "Error");
      this.dialogCancel();
      return false;
    })
  }

  parsefiledata() {
    let data = {
      file_name: this.filetoUpload,
      user: this.WWID
    }
    this.commonLogicService.parseuploadfile(data).subscribe(res => {
      if (res) {
        if ((res['status'].toLowerCase()) == 'success') {
          this.dialogClose();
          this.commonService.openSnackBar(res['message'], "Success");
        } else {
          this.dialogClose();
          this.commonService.openSnackBar(res['message'], "Error");
        }
      }
    }, errorResponse => {
      this.dialogCancel();
      if (errorResponse.errorMessage == undefined) {
        this.commonService.openSnackBar('Error Occurred While Uploading File', "Error");
      }
    })

  }

  fileOver(event: any) {
    console.log(event);
  }

  fileLeave(event: any) {
    console.log(event);
  }

  removeFile() {
    this.files = [];
    this.fileuploaded = false;
  }

  deleteFileDialog() {
    const title = 'Confirm';
    const content = `Are you sure <br> you want to remove file ?`;
    const width = '400px';
    const type = "COPY";
    const result = this.commonLogicService.openCommonAlertDialog(title, content, width, type);
    result.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        console.log('User want to delete this file');
      } else {
        console.log('User dont want to delete this file');
      }
    })
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
    if (this.data == 'LaserMd') {
      return this.serviceMaster.fetchLaserRecipeData({
        limit: 10, pageNumber: 1,
        sortKey: "last_updated_date", sortType: "desc"
      }).toPromise();
    }
    else if (this.data == 'Proto') {
      return this.serviceMaster.fetchProtoTypeData({
        limit: 10, pageNumber: 1,
        sortKey: "last_updated_date", sortType: "desc"
      }).toPromise();
    }
    else if (this.data == 'MasterData') {
      return this.serviceMaster.fetchRecipeMasterData({
        limit: 10, pageNumber: 1,
        sortKey: "last_updated_date", sortType: "desc"
      }).toPromise();
    }
  }

}
