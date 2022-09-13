import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgoPasswordComponent } from './forgo-password/forgo-password.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
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
        path: '',
        redirectTo: "login",
        pathMatch: 'full'
      }
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
