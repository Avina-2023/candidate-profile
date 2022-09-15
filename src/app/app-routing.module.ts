import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>     import('./login/login.module')
      .then(m => m.LoginModule)
    },
    {
      path: 'profile',
      loadChildren: () =>     import('./general_profile/general-module.module')
        .then(m => m.GeneralModuleModule)
      },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
