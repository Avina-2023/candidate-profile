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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ModalBoxComponent } from './shared/modal-box/modal-box.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MaterialModule } from './material.module';
import { IsLoggedinGuard } from './gaurds/is-loggedin.guard';
import { CandidateCanloadGuard } from './gaurds/candidate_canload.guard';
import { AppConfigService } from './config/app-config.service';
import { InterceptorService } from './interceptor/interceptor.service';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
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
    NgbModule,

  ],
  entryComponents:[ModalBoxComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
      },
    AppConfigService,NgxSpinnerService,IsLoggedinGuard,CandidateCanloadGuard, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class AppModule { }
