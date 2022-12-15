import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulerFinalComponent } from './scheduler-final/scheduler-final.component';
import { FinalComponent } from './final/final.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { PlanningComponent } from './planning/planning.component';
import { MetricsComponent } from './metrics/metrics.component';
import { ShiftTimingComponent } from './master-data/shift-timing/shift-timing.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'scheduler',
        component: SchedulerComponent
      },
      {
        path: 'schedulerfinal',
        component: SchedulerFinalComponent
      },
      {
        path: 'final',
        component: FinalComponent
      },
      {
        path: 'profile',
        component: UserprofileComponent
      },
      {
        path: 'planning',
        component: PlanningComponent
      },
      {
        path: 'metrics',
        component: MetricsComponent
      },
      { path: 'master', loadChildren: () => import('./master-data/master-data.module').then(m => m.MasterDataModule) },
      { path: '', redirectTo: 'final', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
