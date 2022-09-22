import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../service/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { environment } from 'src/environments/environment';
import { SkillexService } from 'src/app/service/skillex.service';
// import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-forgo-password',
  templateUrl: './forgo-password.component.html',
  styleUrls: ['./forgo-password.component.scss']
})
export class ForgoPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  notTrue = false;
  getCurrentYear = this.appConfig.getCurrentYear();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private skillexService: SkillexService,
    private appConfig: AppConfigService,
    private candidateServ: CandidateMappersService
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    this.forgotPasswordForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(emailregex)]],
    });
  }

  get mobile() {
    return this.forgotPasswordForm.get('mobile');
  }
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  submit() {

    if ( this.forgotPasswordForm.get('email').valid) {
      let data;

      if (this.forgotPasswordForm.get('email').valid) {
        data = {
          email: this.apiService.encrypt(this.forgotPasswordForm.value.email,environment.cryptoEncryptionKey)
        };
      }

      // this.appConfig.consoleLog('Registration Data which is passed to API', data);
      // API

      this.skillexService.forgotPassword(data).subscribe((success: any) => {
        if(success.success){
        this.appConfig.success(success.message, '');
        this.appConfig.routeNavigation("/login");
        }else{
          this.appConfig.error(success.message, '');
        }
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.forgotPasswordForm);
    }

  }
  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  signIn() {
    this.appConfig.routeNavigation("login");
  }

  inputChanged(f) {

  }

}
