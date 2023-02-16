import { Component, OnInit } from '@angular/core';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
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

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
}

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
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  accomplishmentsDetailsAllData: any;
  accomplishmentsDetails: any;
  accomplishmentsForm: FormGroup;

//form variable
form_certificationsArray = 'certificationsArray';
form_journalEntryArray = 'journalEntryArray';
form_awardsArray = 'awardsArray';
form_certification_name = 'certificationName';
form_certification_issuedFrom = 'certificationIssuedFrom';
form_certification_description = 'certificationDescription';
form_certification_validityFrom = 'certificationValidityFrom';
form_award_date = 'awardDate';
form_award_title = 'awardTitle';
form_journalEntity_title = 'journalEntityTitle';
form_journalEntity_url = 'journalEntityUrl';
form_journalEntity_publishedOn = 'journalEntityPublishedOn';
form_journalEntity_description = 'journalEntityDescription';

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    // private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private loadingService:LoaderService,
    private skillexService:SkillexService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) { }

  ngOnInit(): void {
    // this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialize();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getAccomplishmentsApiDetails();
     });
   }

   getAccomplishmentsApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.accomplishmentsDetails = this.candidateService.getLocalexperience_details();
      this.accomplishmentsDetailsAllData = this.candidateService.getLocalexperience_details();
      // this.disciplinaryDetails ? this.ifworkDetails() : this.ifNotworkDetails();
    } else {

    }
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
    this.loadingService.setLoading(true)
    if(this.accomplishmentsForm.valid) {
      let accomplishmentsobj:any = {};
      let formArray1 = this.accomplishmentsForm.getRawValue()[this.form_certificationsArray];
      let formArray2 = this.accomplishmentsForm.getRawValue()[this.form_awardsArray];
      let formArray3 = this.accomplishmentsForm.getRawValue()[this.form_journalEntryArray];

      // formArray.forEach(element => {
      //   if (element[this.form_dependent_dob]) {
      //     element[this.form_dependent_dob] = element[this.form_dependent_dob];
      //   }
      // });
      accomplishmentsobj.certification_details = formArray1;
      accomplishmentsobj.awards_details = formArray2;
      accomplishmentsobj.journalEntry_details = formArray3;

      const AccomplishmentsApiRequestDetails = {
        email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "accomplishments_details",
        saving_data: accomplishmentsobj
      }
     this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(AccomplishmentsApiRequestDetails).subscribe((data: any)=> {
      this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data.accomplishments_details);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Accomplishments is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
      });
    } else {
      this.ngAfterViewInit();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray);
    }

  }

  patchaccomplishmentsForm(){
    // this.getCertificationsArr.clear();
    // this.getawardsArr.clear();
    // this.getJournalEntryArr.clear();
    this.accomplishmentsDetails.forEach((element, i) => {
      this.getCertificationsArr.push(this.patchingCertifications(element));
    });
    // this.accomplishmentsDetails.forEach((element, i) => {
    //   this.getawardsArr.push(this.patchingAwards(element));
    // });
    // this.accomplishmentsDetails.forEach((element, i) => {
    //   this.getJournalEntryArr.push(this.patchingjournalentry(element));
    // });
  }

  patchingCertifications(data){
 return this.fb.group({
  [this.form_certification_name]: [data[this.form_certification_name], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
  [this.form_certification_issuedFrom]: [data[this.form_certification_issuedFrom], [Validators.required]],
  [this.form_certification_description]: [data[this.form_certification_description], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
  [this.form_certification_validityFrom]: [data[this.form_certification_validityFrom], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
 })
  }
  patchingAwards(data){
     return this.fb.group({
      [this.form_award_title]: [data[this.form_award_title], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_award_date]: [data[this.form_award_date], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
 })
  }
  patchingjournalentry(data){
    return this.fb.group({
      [this.form_journalEntity_title]: [data[this.form_journalEntity_title], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_url]: [data[this.form_journalEntity_url], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_publishedOn]: [this.dateConvertion(data[this.form_journalEntity_publishedOn]), [Validators.required]],
      [this.form_journalEntity_description]: [data[this.form_journalEntity_description], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
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

  initCertificationsArray(){
    return this.fb.group({
      [this.form_certification_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_certification_issuedFrom]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_certification_description]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_certification_validityFrom]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
  }

  initawardsArray(){
    return this.fb.group({
      [this.form_award_title]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_award_date]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
  }

  initJournalEntryArray(){
    return this.fb.group({
      [this.form_journalEntity_title]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_url]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_journalEntity_publishedOn]: [null],
      [this.form_journalEntity_description]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
  }

  removeCertificationsArray(i) {
    this.getCertificationsArr.removeAt(i);
  }

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
  if (this.getCertificationsArr.valid) {
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
    return this.getawardsArr.push(this.initawardsArray());
   }
   this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray);
}
removeawardsArray(i) {
  this.getawardsArr.removeAt(i);
}

addToJournalEntry() {
  if (this.getJournalEntryArr.length == 0) {
   return this.getJournalEntryArr.push(this.initJournalEntryArray());
  }
  this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray);
}

addMoreJournalEntry() {
  if (this.getJournalEntryArr.valid) {
   return this.getJournalEntryArr.push(this.initJournalEntryArray());
  }
  this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray);
}
removeJournalArray(i){
  this.getJournalEntryArr.removeAt(i);
}

ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
  this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
}
}
