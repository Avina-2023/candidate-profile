import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { JobComponent } from './job/job.component';

const routes: Routes = [
  {
    path: '', component: JobComponent, children:[
      {
        path:'jobdescription',component:JobDescriptionComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class JobRoutingModule { }
