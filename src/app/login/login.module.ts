import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginRoutingModule } from './login-routing.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { ForgoPasswordComponent } from './forgo-password/forgo-password.component';
import { SetPasswordComponent } from './setPassword/setPassword.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../material.module';
import { ExternalLinkComponent } from './external-link/external-link.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MaterialModule
  ],
  entryComponents:[],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [LoginpageComponent,SignupComponent,ForgoPasswordComponent,SetPasswordComponent, ExternalLinkComponent]
})
export class LoginModule { }
