import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapsizingDataComponent } from './capsizing-data/capsizing-data.component';
import { LaserMDComponent } from './laser-md/laser-md.component';
import { LocationDataComponent } from './location-data/location-data.component';
import { MasterDataComponent } from './master-data.component';
import { MasterData1Component } from './master-data1/master-data1.component';
import { ProtoComponent } from './proto/proto.component';
import { PriorityDepartmentComponent } from './priority-department/priority-department.component';
import { AddLaserMdComponent } from './add-laser-md/add-laser-md.component';
import { PlannerCodeComponent } from './planner-code/planner-code.component';
import { ShiftTimingComponent } from './shift-timing/shift-timing.component';

const routes: Routes = [
  {
    path: '',
    component: MasterDataComponent,
    children: [
      {
        path: 'laser-md',
        component: LaserMDComponent
      },
      {
        path: 'proto',
        component: ProtoComponent
      },
      {
        path: 'data',
        component: MasterData1Component
      },
      {
        path: 'location',
        component: LocationDataComponent
      },
      {
        path: 'capsize',
        component: CapsizingDataComponent
      },
      {
        path: 'department-priority',
        component: PriorityDepartmentComponent
      },
      { path: '', redirectTo: 'laser-md', pathMatch: 'full' },
      
      { path: 'editLaserMd' , component: AddLaserMdComponent},
      {
        path:'planner',
        component: PlannerCodeComponent
      },
      {
        path:'shift-timing',
        component: ShiftTimingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
