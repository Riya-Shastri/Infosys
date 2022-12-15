import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulerFinalComponent } from './scheduler-final/scheduler-final.component';
import { FinalComponent } from './final/final.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MaterialModule } from 'src/app/material/material.module';
import { ShareModule } from 'src/app/share/share.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { JobStatusComponent } from './final/job-status/job-status.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { PlanningComponent } from './planning/planning.component';
import { AddStatusComponent } from './planning/add-status/add-status.component';
import { SubAssemblyComponent } from './final/sub-assembly/sub-assembly.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MaterialStatusComponent } from './final/material-status/material-status.component';
import { PlanningStatusComponent } from './final/planning-status/planning-status.component';
import {ScrollToService,ScrollToConfigOptions,} from '@nicky-lenaers/ngx-scroll-to';
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { JobFlowComponent } from './job-flow/job-flow.component';
@NgModule({
  declarations: [
    DashboardComponent,
    SchedulerComponent,
    SchedulerFinalComponent,
    FinalComponent,
    UserprofileComponent,
    JobStatusComponent,
    PlanningComponent,
    AddStatusComponent,
    SubAssemblyComponent,
    MetricsComponent,
    MaterialStatusComponent,
    PlanningStatusComponent,
    JobFlowComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFileDropModule,
    MaterialModule,
    ShareModule,
    DragDropModule,
    CdkScrollableModule,
    ScrollToModule.forRoot()
  ],
  providers: [ScrollToService],
  
})
export class DashboardModule { }
