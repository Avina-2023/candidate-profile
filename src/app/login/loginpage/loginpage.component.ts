import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {  ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { SkillexService } from 'src/app/service/skillex.service';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../../config/app-config.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {

  loginForm: FormGroup;
  isProduction = environment.production;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  prePoulteEmailId: any;
  capsOn; any;
  verifyArr = [];
  disableLogin = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    private apiService: ApiServiceService,
    private skillexService: SkillexService,
    private candidateService : CandidateMappersService,
    public toast: ToastrService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.verifyEmail();
    this.formInitialize();
  }

  verifyEmail() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mail'] && params['temp-token']) {

        this.verifyArr.push({
          name: params['mail'],
          temp_token: params['temp-token']
        });
        this.apiCalling();
      }
      if (params['mail']) {
        this.prePoulteEmailId = this.apiService.decrypt(params['mail']);
      } else {
        this.appConfig.routeNavigation('/login');
      }
    });
  }

  apiCalling() {
      // this.apiService.emailVerification(this.verifyArr[0]).subscribe((data: any) => {


      //   this.prePoulteEmailId = this.verifyArr[0]['name'];
      //   this.appConfig.success(`${data.message}`, '');
      //   this.appConfig.routeNavigation('/');
      // }, (err) => {

      //   if (err.status === 400 && err.error.error === 'This User was not found or invalid') {
      //     this.appConfig.error(`${err.error.error}`, '');
      //     this.appConfig.routeNavigation("/emailerror");
      //   }
      // });
  }


  autoPopulateMail() {
    if (this.prePoulteEmailId) {
      this.loginForm.patchValue({
        email: this.prePoulteEmailId ? this.prePoulteEmailId : ''
      });
    }
  }


  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(emailregex)]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
    }), this.autoPopulateMail();
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }


  submit() {
    // this.appConfig.routeNavigation('/profile/candidate/personal')
    this.disableLogin = true;

    const apiData = {
      email: this.apiService.encrypt(this.loginForm.value.email,environment.cryptoEncryptionKey),
      password: this.apiService.encrypt(this.loginForm.value.password,environment.cryptoEncryptionKey)
    };

    // Login API
    if (this.loginForm.valid) {
      if (apiData.email && apiData.password) {
        this.skillexService.login(apiData).subscribe((data:any)=> {
          if(data.success)
          {
          this.appConfig.setLocalData('userId', data && data.data.userId ? data.data.userId : '');
          this.appConfig.setLocalData('userEmail', data && data.data.email ? data.data.email : '');
          this.appConfig.setLocalData('csrf-login', data && data.token ? data.token : '');
          this.candidateService.saveAllProfileToLocal(data.data);
          this.appConfig.setLocalData('username', this.candidateService.getLocalpersonal_details().name);

          // this.appConfig.setLocalData('logout-token', data && data.logout_token ? data.logout_token : '');
          // this.appConfig.setLocalData('masters', data && data.master_list && data.master_list.data ? JSON.stringify(data.master_list.data) : '');
          // this.appConfig.setLocalData('roles', data && data.current_user && data.current_user.roles && data.current_user.roles[1] ? data.current_user.roles[1] : null);
        this.loginRedirection(data);
        }else{
          this.disableLogin = false;
          this.toast.warning(data.message)
          this.appConfig.warning(data.message)
        }


        },(error) => {
            this.disableLogin = false;
          });

          // this.apiService.login(apiData).subscribe((data: any) => {
          //   // this.sharedService.sessionTimeStartSubject.next('start');
          //   this.appConfig.setLocalData('username', data && data.current_user.name ? data.current_user.name : '');
          //   this.appConfig.setLocalData('userId', data && data.current_user.uid ? data.current_user.uid : '');
          //   this.appConfig.setLocalData('userEmail', data && data.current_user.mail ? data.current_user.mail : '');
          //   this.appConfig.setLocalData('csrf-login', data && data.csrf_token ? data.csrf_token : '');
          //   this.appConfig.setLocalData('logout-token', data && data.logout_token ? data.logout_token : '');
          //   this.appConfig.setLocalData('masters', data && data.master_list && data.master_list.data ? JSON.stringify(data.master_list.data) : '');
          //   this.appConfig.setLocalData('roles', data && data.current_user && data.current_user.roles && data.current_user.roles[1] ? data.current_user.roles[1] : null);
          //   this.appConfig.setCustomerConfiguration(data).then((response: any)=> {
          //     this.loginRedirection(data);
          //   }).catch((err)=> {
          //     this.loginRedirection(data);
          //   });
          // }, (error) => {
          //   this.disableLogin = false;
          // });
      }
    } else {
      this.disableLogin = false;
      this.validateAllFields(this.loginForm);
    }
  }

  loginRedirection(data: any) {
    let customersList = data['customers'] && data['customers'] ? data['customers'] : [];
    if (customersList.length > 1 && (data.current_user && data.current_user.roles && data.current_user.roles[1] != 'candidate')) {
      this.appConfig.setLocalData('multiCustomer', 'true');
    }

    //  re this.appConfig.routeNavigation('/profile/candidate/personal');
    this.router.navigate(['/profile/candidate/personal'])

  }

  forgotPassword() {
    this.appConfig.routeNavigation("forgot-password");
  }

  createAccount() {
    this.appConfig.routeNavigation("");
  }
  candidateSignup() {
    this.appConfig.routeNavigation("");
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
