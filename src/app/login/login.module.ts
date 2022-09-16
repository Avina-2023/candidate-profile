import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginRoutingModule } from './login-routing.routing';
import {MatFormFieldModule}from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { SignupComponent } from './signup/signup.component';
import { ForgoPasswordComponent } from './forgo-password/forgo-password.component';
import { SetPasswordComponent } from './setPassword/setPassword.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  entryComponents:[],

  declarations: [LoginpageComponent,SignupComponent,ForgoPasswordComponent,SetPasswordComponent]
})
export class LoginModule { }
