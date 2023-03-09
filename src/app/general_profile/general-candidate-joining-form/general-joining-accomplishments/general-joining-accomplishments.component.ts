import { Component, OnInit , ViewChild, TemplateRef } from '@angular/core';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { SharedServiceService } from 'src/app/service/shared-service.service';
import { SkillexService } from 'src/app/service/skillex.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import * as moment from 'moment'; //in your component
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const MY_FORMATS_Month = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-general-joining-accomplishments',
  templateUrl: './general-joining-accomplishments.component.html',
  styleUrls: ['./general-joining-accomplishments.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GeneralJoiningAccomplishmentsComponent implements OnInit {
  @ViewChild('confirmDialog', { static: false }) matDialogRef: TemplateRef<any>;
  removeArr1: boolean = false;
  removeArr2: boolean = false;
  removeArr3: boolean = false;
  currentDeleteIndex: number ;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  accomplishmentDetailsAllData: any;
  accomplishmentDetails: any;
  accomplishmentsForm: FormGroup;
  maxDate: Date;
  minDate: Date;

//form variable
form_certificationsArray = 'certifications';
form_journalEntryArray = 'journals';
form_awardsArray = 'awards';
form_certification_name = 'certificationName';
form_certification_issuedFrom = 'certificationIssuedFrom';
form_certification_description = 'certificationDescription';
form_certification_validityFrom = 'certificationValidityFrom';
form_certification_validityUpto = 'certificationValidityUpto';
form_isexpire = 'isexpire'
form_award_date = 'awardDate';
form_award_title = 'awardTitle';
form_journalEntity_title = 'journalEntityTitle';
form_journalEntity_url = 'journalEntityUrl';
form_journalEntity_publishedOn = 'journalEntityPublishedOn';
form_journalEntity_description = 'journalEntityDescription';
check: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    // private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private loadingService:LoaderService,
    private skillexService:SkillexService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private matDialog: MatDialog,
    public dialog: MatDialog,
  ) {
    this.dateValidation();

  }

  ngOnInit(): void {
    // this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialize();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
    this.getAccomplishmentsApiDetails();
    this.check = this.getCertificationsArr?.controls[this.getCertificationsArr.controls.length-1]?.value?.isexpire

  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getAccomplishmentsApiDetails();
     });
   }

   getAccomplishmentsApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      console.log(this.candidateService.getLocalProfileData(),'this.candidateService.getLocalProfileData()');
      console.log(this.candidateService.getLocalaccomplishments_details(),'this.candidateService.this.candidateService.getLocalaccomplishments_details()()');

      this.formInitialize();
      this.accomplishmentDetails = this.candidateService.getLocalaccomplishments_details();
      // this.accomplishmentsDetailsAllData = this.candidateService.getLocalAccomplishment_details();
      console.log(this.accomplishmentDetails,'accomplishmentsDetails');

this.patchaccomplishmentsForm();
    } else {
    }

  }
  patchaccomplishmentsForm(){

    console.log(this.accomplishmentDetails,'patchthis.accomplishmentsDetails');
if(this.accomplishmentDetails && this.accomplishmentDetails[this.form_certificationsArray] && this.accomplishmentDetails[this.form_certificationsArray].length > 0 ){
  this.getCertificationsArr.clear();
  this.accomplishmentDetails[this.form_certificationsArray].forEach((element, i) => {
    this.getCertificationsArr.push(this.patchingCertifications(element, i));
  });
}
if(this.accomplishmentDetails && this.accomplishmentDetails[this.form_awardsArray] && this.accomplishmentDetails[this.form_awardsArray].length > 0 ){
  this.getawardsArr.clear();
  this.accomplishmentDetails[this.form_awardsArray].forEach((element, i) => {
    this.getawardsArr.push(this.patchingAwards(element, i));
  });
}
if(this.accomplishmentDetails && this.accomplishmentDetails[this.form_journalEntryArray] && this.accomplishmentDetails[this.form_journalEntryArray].length > 0 ){
  this.getJournalEntryArr.clear();
  this.accomplishmentDetails[this.form_journalEntryArray].forEach((element, i) => {
    this.getJournalEntryArr.push(this.patchingjournalentry(element, i));
  });
}
this.setCertificationArrValidation();
this.setjournalArrValidation();
this.setAwardArrValidation();
  }
  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 20, 11, 31);
}

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
     return split;
    }
    }

  dateConvertion(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
     return split == 'Invalid date' ? null : split;
    }
  }

  saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any) => {

      if (result.result == 'save') {
        // this.formSubmit(result.route);
      }
    });
  }

  formSubmit(routeValue?: any) {
    // let rawaccomplishmentsFormValue = this.accomplishmentsForm.getRawValue();
    // console.log(rawaccomplishmentsFormValue,'rawaccomplishmentsFormValue');
    if(this.accomplishmentsForm.valid) {
      // const accomplishmentsobj = {
      //   [this.form_certificationsArray]: rawaccomplishmentsFormValue[this.form_certificationsArray],
      //   [this.form_awardsArray]: rawaccomplishmentsFormValue[this.form_awardsArray],
      //   [this.form_journalEntryArray]: rawaccomplishmentsFormValue[this.form_journalEntryArray],
      // };
      const certifications =  this.accomplishmentsForm.getRawValue()[this.form_certificationsArray];
      let awards =  this.accomplishmentsForm.getRawValue()[this.form_awardsArray];
      let journals =  this.accomplishmentsForm.getRawValue()[this.form_journalEntryArray];
      let apiData = {
        certifications,
        awards,
        journals
      }
      console.log(apiData,'apiData');

      const AccomplishmentsApiRequestDetails = {
        email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "accomplishment_details",
        saving_data: apiData
      }
      this.loadingService.setLoading(true)
     this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(AccomplishmentsApiRequestDetails).subscribe((data: any)=> {
      this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
        console.log(data.data.saved_data  ,'data.data.saved_data');

        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Accomplishments is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
      });
    } else {
      this.ngAfterViewInit();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      // this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray);
      this.glovbal_validators.validateAllFields(this.accomplishmentsForm);
    }
    console.log(this.accomplishmentsForm,'accomplishmentsForm');
  }



  patchingCertifications(data, i){
 return this.fb.group({
  [this.form_certification_name]: [data[this.form_certification_name], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
  [this.form_certification_issuedFrom]: [data[this.form_certification_issuedFrom], [Validators.required]],
  [this.form_certification_description]: [data[this.form_certification_description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
  [this.form_certification_validityFrom]: [data[this.form_certification_validityFrom], [ Validators.required, this.startTrue(true)]],
  [this.form_certification_validityUpto]: [this.dateConvertion(data[this.form_certification_validityUpto]), [Validators.required, this.startTrue(true)]],
[this.form_isexpire]:[data[this.form_isexpire]?data[this.form_isexpire]: false]
 })
  }
  patchingAwards(data, i){
     return this.fb.group({
      [this.form_award_title]: [data[this.form_award_title], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_award_date]: [data[this.form_award_date], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
 })
  }
  patchingjournalentry(data, i){
    return this.fb.group({
      [this.form_journalEntity_title]: [data[this.form_journalEntity_title], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_url]: [data[this.form_journalEntity_url], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_publishedOn]: [this.dateConvertion(data[this.form_journalEntity_publishedOn]), [Validators.required]],
      [this.form_journalEntity_description]: [data[this.form_journalEntity_description], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
  }

  regexValidator(error: ValidationErrors, param): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }
      let check;
      // let yearofPassing = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_yearpassing]['value'] ? control['_parent']['controls'][this.form_yearpassing]['value'] : null;
      let startDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_certification_validityFrom]['value'] ? control['_parent']['controls'][this.form_certification_validityFrom]['value'] : null;
      let endDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_certification_validityUpto]['value'] ? control['_parent']['controls'][this.form_certification_validityUpto]['value'] : null;
      // if (yearofPassing) {
        let start = moment(control.value).format('YYYY-MM-DD');
        // let yearofPassing1 = moment(yearofPassing).format('YYYY-MM-DD');
        // error.notValid = this.momentFormMonth(yearofPassing);
        // check = moment(start).isSameOrBefore(yearofPassing1, 'month');
        // check = !check;
      // }
      if (!param) {
        return check ? error : null;
      } else {
        // this.detectStartDateCalc(startDate, endDate, control);
        return null;
      }
    };
  }
  startTrue(param) {
    return this.regexValidator({notValid: true}, param);
  }
  formInitialize() {
    this.accomplishmentsForm = this.fb.group({
      [this.form_certificationsArray]: this.fb.array([]),
      [this.form_awardsArray]: this.fb.array([]),
      [this.form_journalEntryArray]: this.fb.array([]),
    })
  }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('accomplishments');
  }
  ngAfterViewInit() {
    this.showStepper();
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
      if (data.current == 'accomplishments') {
        if (!this.accomplishmentsForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
    if (!this.accomplishmentsForm.dirty) {
      if (route == 'project') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT);
      } else {
        if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().experience_details == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
        } else {
          if (this.accomplishmentsForm.valid) {
            return this.sharedService.openJoiningRoutePopUp.next(route == 'project' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
          }
          this.glovbal_validators.validateAllFields(this.accomplishmentsForm);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'project' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
    }
}

 // Form getters
  // convenience getters for easy access to form fields
  get getCertificationsArr() { return this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray; }
  get getawardsArr() { return this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray; }
  get getJournalEntryArr() { return this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray; }

  get certificationName() {
    return this.accomplishmentsForm.get(this.form_certification_name);
    }
    get certificationIssuedFrom() {
      return this.accomplishmentsForm.get(this.form_certification_issuedFrom);
      }
      get certificationDescription() {
        return this.accomplishmentsForm.get(this.form_certification_description);
        }
        get certificationValidityFrom() {
          return this.accomplishmentsForm.get(this.form_certification_validityFrom);
          }
          get isexpire(){
            return this.accomplishmentsForm.get(this.form_isexpire);
          }
          get  certificationValidityUpto(){
            return this.accomplishmentsForm.get(this.form_certification_validityUpto);
          }
          get awardTitle() {
            return this.accomplishmentsForm.get(this.form_award_title);
            }
           get awardDate() {
            return this.accomplishmentsForm.get(this.form_award_date);
            }
          get journalEntityTitle() {
            return this.accomplishmentsForm.get(this.form_journalEntity_title);
            }
            get journalEntityUrl() {
              return this.accomplishmentsForm.get(this.form_journalEntity_url);
              }
              get journalEntityPublishedOn() {
                return this.accomplishmentsForm.get(this.form_journalEntity_publishedOn);
                }
                get journalEntityDescription() {
                  return this.accomplishmentsForm.get(this.form_journalEntity_description);
                  }
  initCertificationsArray(){
    return this.fb.group({
      [this.form_certification_name]: [null,[Validators.required,this.glovbal_validators.alphaNum255()]],
      [this.form_certification_issuedFrom]: [null,[Validators.required,this.glovbal_validators.alphaNum255()]],
      [this.form_certification_description]:[null,[Validators.required,this.glovbal_validators.alphaNum255()]],
      [this.form_certification_validityFrom]: [null,[Validators.required]],
      [this.form_certification_validityUpto]: [null,[Validators.required]],
      [this.form_isexpire]:[false]
    })
  }
  setCertificationArrValidation(){
    this.getCertificationsArr.controls.forEach((data, index) => {
    if(this.getCertificationsArr.length){
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_name].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_issuedFrom].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_description].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityFrom].setValidators([Validators.required, this.startTrue(true)],{ emitEvent: false });
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityUpto].setValidators([Validators.required, this.startTrue(true)],{ emitEvent: false });

      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_name].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_issuedFrom].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_description].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_validityFrom].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_validityUpto].updateValueAndValidity();
    }else {
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityUpto].setValue(null);
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_issuedFrom].setValue(null);
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_description].setValue(null);
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityFrom].setValue(null);
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityUpto].setValue(null);

      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityUpto].clearValidators();
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_issuedFrom].clearValidators();
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_description].clearValidators();
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityFrom].clearValidators();
      this.getCertificationsArr.controls[index]['controls'][this.form_certification_validityUpto].clearValidators();

      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_name].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_issuedFrom].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_description].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_validityFrom].updateValueAndValidity();
      this.getCertificationsArr['controls'][index]['controls'][this.form_certification_validityUpto].updateValueAndValidity();
    } })
}

  isCertificateExpire(e, i:number) {
    if (e.checked) {
        this.check = true
        this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto].setValue(null);
        this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto].clearValidators();
        this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto].updateValueAndValidity();
        console.log(this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto])
      }  else {
      this.check = false
      this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto].setValidators([Validators.required, this.startTrue(true) ],{ emitEvent: false });
      this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto].updateValueAndValidity();
      console.log(this.getCertificationsArr.controls[i]['controls'][this.form_certification_validityUpto]);
    }
  }

  initawardsArray(){
    return this.fb.group({
      [this.form_award_title]: [null,[Validators.required,this.glovbal_validators.alphaNum255()]],
      [this.form_award_date]: [null,[Validators.required]],
    })
  }
  setAwardArrValidation(){
    this.getawardsArr.controls.forEach((data, index) => {
    if(this.getawardsArr.length){
      this.getawardsArr.controls[index]['controls'][this.form_award_title].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getawardsArr.controls[index]['controls'][this.form_award_date].setValidators([Validators.required,this.glovbal_validators.urlRegex()],{ emitEvent: false });

      this.getawardsArr['controls'][index]['controls'][this.form_award_title].updateValueAndValidity();
      this.getawardsArr['controls'][index]['controls'][this.form_award_date].updateValueAndValidity();
    }else {
      this.getawardsArr.controls[index]['controls'][this.form_award_title].setValue(null);
      this.getawardsArr.controls[index]['controls'][this.form_award_date].setValue(null);

      this.getawardsArr.controls[index]['controls'][this.form_award_title].clearValidators();
      this.getawardsArr.controls[index]['controls'][this.form_award_date].clearValidators();

      this.getawardsArr['controls'][index]['controls'][this.form_award_title].updateValueAndValidity();
      this.getawardsArr['controls'][index]['controls'][this.form_award_date].updateValueAndValidity();
    } })
    }
  initJournalEntryArray(){
    return this.fb.group({
      [this.form_journalEntity_title]: [null,[Validators.required,this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_url]: [null,[Validators.required,this.glovbal_validators.urlRegex()]],
      [this.form_journalEntity_publishedOn]: [null],
      [this.form_journalEntity_description]: [null],
    })
  }
  setjournalArrValidation(){
    this.getJournalEntryArr.controls.forEach((data, index) => {
    if(this.getJournalEntryArr.length){
      this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_title].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_url].setValidators([Validators.required,this.glovbal_validators.urlRegex()],{ emitEvent: false });

      this.getJournalEntryArr['controls'][index]['controls'][this.form_journalEntity_title].updateValueAndValidity();
      this.getJournalEntryArr['controls'][index]['controls'][this.form_journalEntity_url].updateValueAndValidity();
    }else {
      this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_title].setValue(null);
      this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_url].setValue(null);

      this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_title].clearValidators();
      this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_url].clearValidators();

      this.getJournalEntryArr['controls'][index]['controls'][this.form_certification_name].updateValueAndValidity();
      this.getJournalEntryArr['controls'][index]['controls'][this.form_journalEntity_url].updateValueAndValidity();
    } })
    }

 // Open dailog
 openDialog(component, data) {
  let dialogDetails: any;

  dialogDetails = {
    iconName: data.iconName,
    showCancel: data.showCancel,
    showConfirm: data.showConfirm,
    showOk: data.showOk,
    dataToBeShared: data.sharedData,
  };

  /**
   * Dialog modal window
   */
  // tslint:disable-next-line: one-variable-per-declaration
  const dialogRef = this.matDialog.open(component, {
    width: 'auto',
    height: 'auto',
    autoFocus: false,
    data: dialogDetails
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(this.getCertificationsArr.length && this.removeArr1){
        this.getCertificationsArr.removeAt(this.currentDeleteIndex );
      }
      if(this.getawardsArr.length && this.removeArr2){
        this.getawardsArr.removeAt(this.currentDeleteIndex );
      }
      if(this.getJournalEntryArr.length && this.removeArr3){
        this.getJournalEntryArr.removeAt(this.currentDeleteIndex );
      }
    }
  });
}
removeData(i,removeArr) {
  if(removeArr == "certification"){
    this.removeArr1=true;
  }
  if(removeArr == "awards"){
    this.removeArr2=true;
  }
  if(removeArr == "journalEntry"){
    this.removeArr3=true;
  }
  const data = {
    iconName: '',
    sharedData: {
      confirmText: 'Are you sure you want to delete?',
      componentData: '',
      type: 'delete',
      identity: 'logout'
    },
    showConfirm: 'Ok',
    showCancel: 'Cancel',
    showOk: ''
  };
  this.openDialog(ModalBoxComponent, data);
}


  // removeCertificationsArray(i) {
  //   this.getCertificationsArr.removeAt(i);
  // }

addToCertifications() {
  console.log(this.getCertificationsArr,'ooo');
if(this.getCertificationsArr.length == 0){
  if (this.accomplishmentsForm) {
    return this.getCertificationsArr.push(this.initCertificationsArray());
   }
   this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray);
}

}

addMoreCertifications(){
  if (this.getCertificationsArr.valid && this.getCertificationsArr.length > 0) {
    this.setCertificationArrValidation()

    return this.getCertificationsArr.push(this.initCertificationsArray());
   }
   this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray);
}

addToawards() {
  if (this.getawardsArr.length == 0) {
   return this.getawardsArr.push(this.initawardsArray());
  }
  this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray);
}

addMoreAwards(){
  if (this.getawardsArr.valid) {
    this.setAwardArrValidation();
    return this.getawardsArr.push(this.initawardsArray());
   }
   this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray);
}
// removeawardsArray(i) {
//   this.getawardsArr.removeAt(i);
// }

addToJournalEntry() {
  if (this.getJournalEntryArr.length == 0) {
   return this.getJournalEntryArr.push(this.initJournalEntryArray());
  }
  this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray);
}

addMoreJournalEntry() {
  if (this.getJournalEntryArr.valid  ) {
    this.setjournalArrValidation()
   return this.getJournalEntryArr.push(this.initJournalEntryArray());
  }
  this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray);
}
// removeJournalArray(i){
//   this.getJournalEntryArr.removeAt(i);
// }

ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
  this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
}
}
