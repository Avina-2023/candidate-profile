import { Component, OnInit ,AfterViewInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-general-joining-disciplinary-details',
  templateUrl: './general-joining-disciplinary-details.component.html',
  styleUrls: ['./general-joining-disciplinary-details.component.scss']
})
export class GeneralJoiningDisciplinaryDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  discipilinaryForm: FormGroup;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;


  // form_disciplinaryDetails = "bgv_details";
  form_convicted_by_Court = "convicted_by_Court";
  form_arrested = "arrested";
  form_prosecuted = "prosecuted";
  form_detention = "detention";
  form_fined_by_court = "fined_by_court";
  form_debarred_exam_university = "debarred_exam_university";
  form_debarred_psc_company = "debarred_psc_company";
  form_court_case_pending = "court_case_pending";
  form_university_case_pending = "university_case_pending";
  form_disciplinary_proceedings = "disciplinary_proceedings";
  form_full_particulars = "full_particulars"
  disciplinaryDetails: any;
  disciplinaryDetailsAllData: any;
  customerName: any;
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
    this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialize();
    this.getDisciplinaryApiDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
  }

  formInitialize() {
    this.discipilinaryForm = this.fb.group({
      [this.form_convicted_by_Court]: [null],
      [this.form_arrested]: [null],
      [this.form_prosecuted]: [null],
      [this.form_detention]: [null],
      [this.form_fined_by_court]: [null],
      [this.form_debarred_exam_university]: [null],
      [this.form_debarred_psc_company]: [null],
      [this.form_court_case_pending]: [null],
      [this.form_university_case_pending]: [null],
      [this.form_disciplinary_proceedings]: [null],
      [this.form_full_particulars]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
    })
  }


  requiredDesc() {
    let formValues = this.discipilinaryForm.getRawValue();
    const bgvDetails = {
      [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
      [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
      [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
      [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
      [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
      [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
      [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
      [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
      [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
      [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
      [this.form_full_particulars]: formValues[this.form_full_particulars]
    }
    if (bgvDetails[this.form_convicted_by_Court] == '1' || bgvDetails[this.form_arrested] == '1' || bgvDetails[this.form_prosecuted] == '1' || bgvDetails[this.form_detention] == '1' || bgvDetails[this.form_fined_by_court] == '1' || bgvDetails[this.form_debarred_exam_university] == '1' || bgvDetails[this.form_debarred_psc_company] == '1' || bgvDetails[this.form_court_case_pending] == '1' || bgvDetails[this.form_university_case_pending] == '1' || bgvDetails[this.form_disciplinary_proceedings] == '1') {
      this.discipilinaryForm.get(this.form_full_particulars).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
    } else {
      this.discipilinaryForm.get(this.form_full_particulars).setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]), { emitEvent: false };
    }
    this.discipilinaryForm.get(this.form_full_particulars).updateValueAndValidity(), { emitEvent: false };
    console.log( bgvDetails,'fsef');
  }
  saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any) => {

      if (result.result == 'save') {
        this.formSubmit(result.route);
      }
    });
  }

  formSubmit(routeValue?: any) {
    this.requiredDesc();
    let formValues = this.discipilinaryForm.getRawValue();
    console.log(formValues,'formValues');

    if (this.discipilinaryForm.valid) {
      const bgv_details = {
        [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
        [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
        [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
        [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
        [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
        [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
        [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
        [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
        [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
        [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
        [this.form_full_particulars]: formValues[this.form_full_particulars]
      }
      let apiData = {
        bgv_details
      };

      const disciplinaryApiRequestDetails = {
        email:  this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "discipilinary_details",
        saving_data:  apiData
      }
      this.loadingService.setLoading(true)
     this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(disciplinaryApiRequestDetails).subscribe((data: any) => {
      this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
        console.log(data.data,'save');
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Discipilinary details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
      });
    } else {
      this.ngAfterViewInit();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      // this.glovbal_validators.validateAllFields(this.discipilinaryForm);
    }
    console.log( this.discipilinaryForm,'apiData');
  }

  OtherConditionsPatch(data) {
    this.discipilinaryForm.patchValue({
      [this.form_convicted_by_Court]: data[this.form_convicted_by_Court] && data[this.form_convicted_by_Court] == '1' ? true : false,
      [this.form_arrested]: data[this.form_arrested] && data[this.form_arrested] == '1' ? true : false,
      [this.form_prosecuted]: data[this.form_prosecuted] && data[this.form_prosecuted] == '1' ? true : false,
      [this.form_detention]: data[this.form_detention] && data[this.form_detention] == '1' ? true : false,
      [this.form_fined_by_court]: data[this.form_fined_by_court] && data[this.form_fined_by_court] == '1' ? true : false,
      [this.form_debarred_exam_university]: data[this.form_debarred_exam_university] && data[this.form_debarred_exam_university] == '1' ? true : false,
      [this.form_debarred_psc_company]: data[this.form_debarred_psc_company] && data[this.form_debarred_psc_company] == '1' ? true : false,
      [this.form_court_case_pending]: data[this.form_court_case_pending] && data[this.form_court_case_pending] == '1' ? true : false,
      [this.form_university_case_pending]: data[this.form_university_case_pending] && data[this.form_university_case_pending] == '1' ? true : false,
      [this.form_disciplinary_proceedings]: data[this.form_disciplinary_proceedings] && data[this.form_disciplinary_proceedings] == '1' ? true : false,
      [this.form_full_particulars]: data[this.form_full_particulars]
    });
    this.requiredDesc();
  }
  get convicted_by_Court() {
    return this.discipilinaryForm.get(this.form_convicted_by_Court);
  }
  get arrested() {
    return this.discipilinaryForm.get(this.form_arrested);
  }
  get prosecuted() {
    return this.discipilinaryForm.get(this.form_prosecuted);
  }
  get detention() {
    return this.discipilinaryForm.get(this.form_detention);
  }
  get fined_by_court() {
    return this.discipilinaryForm.get(this.form_fined_by_court);
  }
  get debarred_exam_university() {
    return this.discipilinaryForm.get(this.form_debarred_exam_university);
  }
  get debarred_psc_company() {
    return this.discipilinaryForm.get(this.form_debarred_psc_company);
  }
  get court_case_pending() {
    return this.discipilinaryForm.get(this.form_court_case_pending);
  }
  get university_case_pending() {
    return this.discipilinaryForm.get(this.form_university_case_pending);
  }
  get disciplinary_proceedings() {
    return this.discipilinaryForm.get(this.form_disciplinary_proceedings);
  }
  get full_particulars() {
    return this.discipilinaryForm.get(this.form_full_particulars);
  }
  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getDisciplinaryApiDetails();
     });
   }

  getDisciplinaryApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.disciplinaryDetails = this.candidateService.getLocaldisciplinary_details();
      console.log(this.candidateService.getLocaldisciplinary_details() );
      this.disciplinaryDetailsAllData = this.candidateService.getLocaldisciplinary_details();
      // this.disciplinaryDetails ? this.ifworkDetails() : this.ifNotworkDetails();
      this.patchWorkForm();
    } else {

    }
  }
  patchWorkForm() {
    console.log(this.disciplinaryDetails,'patch');
    if (this.disciplinaryDetails.bgvDetails) {
      this.OtherConditionsPatch(this.disciplinaryDetails.bgvDetails);
    }
    // this.changeInTrainingExp({value: this.workDetailsForm.value[this.form_training_is_articleship_status]});
  }
  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
      if (data.current == 'disciplinary') {
        if (!this.discipilinaryForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }
  // ifworkDetails() {
  //   let disciplinary = {
  //     bgvDetails: this.disciplinaryDetails && this.disciplinaryDetails.bgv_details ? this.disciplinaryDetails.bgv_details : null,

  //   }

  //   this.patchWorkForm();
  // }



  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('disciplinary');
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

  routeNext(route) {
    if (!this.discipilinaryForm.dirty) {
      if (route == 'upload') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
      } else {
        if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().discipilinary_details == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
        } else {
          if (this.discipilinaryForm.valid) {
            return this.sharedService.openJoiningRoutePopUp.next(route == 'upload' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
          }
          this.glovbal_validators.validateAllFields(this.discipilinaryForm);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'upload' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
    }
}
ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
  this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
  }


}
