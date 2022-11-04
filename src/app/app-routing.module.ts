import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateCanloadGuard } from './gaurds/candidate_canload.guard';
import { IsLoggedinGuard } from './gaurds/is-loggedin.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>     import('./login/login.module').then(m => m.LoginModule),canActivate:[IsLoggedinGuard]
    },
    {
      path: 'job',
      loadChildren: () =>     import('./jobApplication/job.module').then(m => m.JobModule), canLoad: [ CandidateCanloadGuard ], canActivate: [ CandidateCanloadGuard ]
    },
    {
      path: 'profile',
      loadChildren: () =>     import('./general_profile/general-module.module').then(m => m.GeneralModuleModule), canLoad: [ CandidateCanloadGuard ], canActivate: [ CandidateCanloadGuard ]
      },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
