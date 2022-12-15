import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertDialogBoxComponent } from './Common/alert-dialog-box/alert-dialog-box.component';
import { LoaderComponent } from './Common/loader/loader.component';
import { FilterComponent } from './Common/filter/filter.component';
import { FileUploadComponent } from './Common/file-upload/file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxFileDropModule } from 'ngx-file-drop';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AlertDialogBoxComponent,
    FooterComponent,
    LoaderComponent,
    FilterComponent,
    FilterComponent,
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxFileDropModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileUploadModule
  ],
  exports: [
    AlertDialogBoxComponent,
    FooterComponent,
    LoaderComponent,
    FilterComponent,
    FileUploadComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} }
   
]
})

export class ShareModule { }
