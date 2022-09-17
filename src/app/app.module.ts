import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ModalBoxComponent } from './shared/modal-box/modal-box.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MaterialModule } from './material.module';
import { IsLoggedinGuard } from './gaurds/is-loggedin.guard';
import { CandidateCanloadGuard } from './gaurds/candidate_canload.guard';
import { AppConfigService } from './config/app-config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    HttpClientModule,
    SharedModule,

    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true
    }),
  ],
  entryComponents:[ModalBoxComponent],
  providers: [AppConfigService,NgxSpinnerService,IsLoggedinGuard,CandidateCanloadGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class AppModule { }
