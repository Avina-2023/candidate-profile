import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { ApiServiceService } from 'src/app/service/api-service.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { SkillexService } from 'src/app/service/skillex.service';

@Component({
  selector: 'app-setPassword',
  templateUrl: './setPassword.component.html',
  styleUrls: ['./setPassword.component.scss']
})
export class SetPasswordComponent implements OnInit {

  createForm: FormGroup;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  toggleVisibilityTempPassword = true;
  currentRoute: string;
  passwordTempToken: any;
  prePoulteEmailId: any;
  type: string;
  capsOn: any;
  getCurrentYear = this.appConfig.getCurrentYear();
  apiemail: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private skillexService: SkillexService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute
  ) {
    // if (this.router.url.includes(CONSTANT.ENDPOINTS.PASSWORD.RESET)) {
      this.verifyPassword();
    // } else {
    // }
   }

  ngOnInit() {
    this.formInitialize();
    this.getEncriptedMail();

  }


  verifyPassword() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['email'] && params['temp-token']) {
        // const ApiData = {
        //   name: params['email'],
        //   temp_token: params['temp-token']
        // };
        // this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.PASSWORD.RESET}`);
        this.passwordTempToken = params['temp-token'];
        this.prePoulteEmailId = params['email'];
        this.apiemail = params['email'];
        this.currentRoute = 'Create the Password';
        if (this.router.url.includes(CONSTANT.ENDPOINTS.PASSWORD.RESET)) {
          this.type = 'reset';
          this.currentRoute = 'Reset the Password';
        }
      } else {
        this.appConfig.error(`Invalid URL found`, '');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.FORGOT);
      }
    });
  }

  getEncriptedMail(){
    this.prePoulteEmailId = this.apiService.decrypt(decodeURI(this.prePoulteEmailId));
    this.autoPopulateMail();     // Function to auto populate mail after form loads.
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailregex), Validators.maxLength(100)]],
      // temp: ['', [Validators.required]],
      password: ['', [Validators.required, FormCustomValidators.patternValidator(), Validators.maxLength(30)]],
      confirmpassword: ['', [Validators.required]]
    }, { validators: FormCustomValidators.identityRevealedValidator }
    )
    // , this.autoPopulateMail(); // Function to auto populate mail after form loads.
  }

  autoPopulateMail() {
    if (this.currentRoute) {
      this.createForm.patchValue({
        email: this.prePoulteEmailId ? this.prePoulteEmailId : ''
      });
      this.createForm.controls['email'].disable();
    }
  }

  get email() {
    return this.createForm.get('email');
  }
  get password() {
    return this.createForm.get('password');
  }
  // get temp() {
  //   return this.createForm.get('temp');
  // }
  get confirmpassword() {
    return this.createForm.get('confirmpassword');
  }

  submit() {
    if (this.createForm.valid) {
      const apiData = {
        email: this.apiemail,
        userSecretkey: this.passwordTempToken ? this.passwordTempToken : '',
        password: this.createForm.value.password
      };
      this.skillexService.passwordReset(apiData).subscribe((success: any) => {

        // this.appConfig.consoleLog('success', success);
        this.appConfig.success((this.currentRoute.includes('Reset')) ? `Password has been reset successfully` :
          `Account has been created Successfully`, '');
        this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.LOGIN, { mail: apiData.email });
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.createForm);
    }

  }

  signIn() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.LOGIN);
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


}
