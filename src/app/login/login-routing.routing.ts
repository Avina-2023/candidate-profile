import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { ForgoPasswordComponent } from './forgo-password/forgo-password.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { SetPasswordComponent } from './setPassword/setPassword.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [

  {
    path: '', component: SignupComponent, children: [
      {
        path: "login", component: LoginpageComponent
      },
      {
        path: "forgot-password", component: ForgoPasswordComponent
      },
      {
        path: "setpwd", component: SetPasswordComponent
      },
      {
        path: "resetpwd", component: SetPasswordComponent
      },
      {
        path: '',
        redirectTo: "login",
        pathMatch: 'full'
      }
]
},{
  path: "externallogin", component: ExternalLinkComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
