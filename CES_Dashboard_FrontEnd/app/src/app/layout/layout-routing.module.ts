import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthenticationGuard } from '../authentication/Guard/authentication.guard';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthenticationGuard]
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutRoutingModule { }
