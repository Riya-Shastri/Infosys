import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { MasterDataComponent } from './master-data.component';
import { LaserMDComponent } from './laser-md/laser-md.component';
import { ProtoComponent } from './proto/proto.component';
import { MasterData1Component } from './master-data1/master-data1.component';
import { LocationDataComponent } from './location-data/location-data.component';
import { CapsizingDataComponent } from './capsizing-data/capsizing-data.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MasterCommonTableComponent } from './master-common-table/master-common-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddLaserMdComponent } from './add-laser-md/add-laser-md.component';
import { AddProtoComponent } from './add-proto/add-proto.component';
import { AddLocationDataComponent } from './add-location-data/add-location-data.component';
import { AddCapsizingDataComponent } from './add-capsizing-data/add-capsizing-data.component';
import { PriorityDepartmentComponent } from './priority-department/priority-department.component';
import { AddRecipeMasterComponent } from './add-recipe-master/add-recipe-master.component';
import { AddDepartmentPriorityComponent } from './add-department-priority/add-department-priority.component';
import { MatOptionModule } from '@angular/material/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileUploadModule } from 'ng2-file-upload';
import { ShareModule } from 'src/app/share/share.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PlannerCodeComponent } from './planner-code/planner-code.component';
import { AddPlannerCodeComponent } from './add-planner-code/add-planner-code.component';
import { ShiftTimingComponent } from './shift-timing/shift-timing.component';
import { UpdateShiftTimingComponent } from './update-shift-timing/update-shift-timing.component';
@NgModule({
  declarations: [
    MasterDataComponent,
    LaserMDComponent,
    ProtoComponent,
    MasterData1Component,
    LocationDataComponent,
    CapsizingDataComponent,
    MasterCommonTableComponent,
    AddLaserMdComponent,
    AddProtoComponent,
    AddLocationDataComponent,
    AddCapsizingDataComponent,
    PriorityDepartmentComponent,
    AddRecipeMasterComponent,
    AddDepartmentPriorityComponent,
    PlannerCodeComponent,
    AddPlannerCodeComponent,
    ShiftTimingComponent,
    UpdateShiftTimingComponent,


  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    NgxFileDropModule,
    FileUploadModule,
    ShareModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class MasterDataModule { }
