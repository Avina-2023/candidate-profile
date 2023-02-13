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

@Component({
  selector: 'app-general-joining-project-details',
  templateUrl: './general-joining-project-details.component.html',
  styleUrls: ['./general-joining-project-details.component.scss']
})
export class GeneralJoiningProjectDetailsComponent implements OnInit {
  projectForm: FormGroup;
  form_projectDetails = "projectDetails";
  form_projectTitle = 'projectTitle';
  projectTypeList = [
    {
      label: 'Academy',
      value: 'Academy'
    },
    {
      label: 'Academy',
      value: 'Academy'
    }

  ]
  form_typeList = 'typeList';
  form_teamSize = 'teamSize';
  form_projectOrganization = 'projectOrganization';
  form_periodFrom = 'periodFrom';
  form_periodTo = 'periodTo';
  form_projectDescription = 'projectDescription';
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  customerName: any;
  projectDetailsAllData: any;
  projectDetails: any;
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
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getProjectApiDetails();
     });
   }

   getProjectApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.projectDetails = this.candidateService.getLocalexperience_details();
      this.projectDetailsAllData = this.candidateService.getLocalexperience_details();
      // this.disciplinaryDetails ? this.ifworkDetails() : this.ifNotworkDetails();
    } else {

    }

  }

  get projectTitle() {
    return this.projectForm.get(this.form_projectTitle);
  }

  get typeList() {
    return this.projectForm.get(this.form_typeList);
  }

  get teamSize() {
    return this.projectForm.get(this.form_teamSize);
  }

  get projectOrganization() {
    return this.projectForm.get(this.form_projectOrganization);
  }

  get periodFrom() {
    return this.projectForm.get(this.form_periodFrom);
  }

  get periodTo() {
    return this.projectForm.get(this.form_periodTo);
  }

  get projectDescription() {
    return this.projectForm.get(this.form_projectDescription);
  }

  patchProjectForm() {
    this.projectForm.patchValue({
      [this.form_projectDetails]: this.projectDetails[this.form_projectDetails],
      [this.form_projectTitle]: this.projectDetails[this.form_projectTitle],
      [this.form_typeList]: this.projectDetails[this.form_typeList],
      [this.form_teamSize]: this.projectDetails[this.form_teamSize],
      [this.form_projectOrganization]: this.projectDetails[this.form_projectOrganization],
      [this.form_periodFrom]: this.projectDetails[this.form_periodFrom],
      [this.form_periodTo]: this.projectDetails[this.form_periodTo],
      [this.form_projectDescription]: this.projectDetails[this.form_projectDescription],
    });
  }


  formInitialize() {
    this.projectForm = this.fb.group({
      [this.form_projectDetails]: [null, [Validators.required]],
      [this.form_projectTitle]: [null, [Validators.required]],
      [this.form_typeList]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_teamSize]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_projectOrganization]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_periodFrom]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_periodTo]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_projectDescription]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
  }

  formSubmit(routeValue?:any) {
    this.loadingService.setLoading(true)
    if (this.projectForm.valid) {
      let rawprojectFormValue = this.projectForm.getRawValue();
      const apiData = {
        "projectDetails":{

          [this.form_projectDetails]: rawprojectFormValue[this.form_projectDetails],
          [this.form_projectTitle]: rawprojectFormValue[this.form_projectTitle],
          [this.form_typeList]: rawprojectFormValue[this.form_typeList],
          [this.form_teamSize]: rawprojectFormValue[this.form_teamSize],
          [this.form_projectOrganization]: rawprojectFormValue[this.form_projectOrganization],
          [this.form_periodFrom]: rawprojectFormValue[this.form_periodFrom],
          [this.form_periodTo]: rawprojectFormValue[this.form_periodTo],
          [this.form_projectDescription]: rawprojectFormValue[this.form_projectDescription],

        },

      };
      const ProjectApiRequestDetails = {
        email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "project_details",
        saving_data: apiData
      }
    this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(ProjectApiRequestDetails).subscribe((data: any)=> {
      setTimeout(() => {
        this.loadingService.setLoading(false)

      }, 2000);
      if(data && data.success)
        {
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Project details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
      }else{
        this.appConfig.nzNotification('error', 'Not Saved', data && data.message ? data.message : 'Project details not updated');
        return false
      }
      });
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.loadingService.setLoading(false)
      this.glovbal_validators.validateAllFields(this.projectForm);
    }
  }

   saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any) => {

      if (result.result == 'save') {
        this.formSubmit(result.route);
      }
    });
  }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('project');
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
      if (data.current == 'project') {
        if (!this.projectForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
    if (!this.projectForm.dirty) {
      if (route == 'work') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
      } else {
        if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().experience_details == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS);
        } else {
          if (this.projectForm.valid) {
            return this.sharedService.openJoiningRoutePopUp.next(route == 'work' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS);
          }
          this.glovbal_validators.validateAllFields(this.projectForm);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'work' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS);
    }
}

ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
  this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
}

}
