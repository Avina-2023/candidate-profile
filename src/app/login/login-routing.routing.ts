import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [

  {
    path: '', component: SignupComponent, children: [
      {
        path: "login", component: LoginpageComponent
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
