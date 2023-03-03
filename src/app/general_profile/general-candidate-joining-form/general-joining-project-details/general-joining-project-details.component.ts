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
import * as  moment from 'moment';
import { LoaderService } from 'src/app/service/loader-service.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

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
@Component({
  selector: 'app-general-joining-project-details',
  templateUrl: './general-joining-project-details.component.html',
  styleUrls: ['./general-joining-project-details.component.scss'],
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
  ]
})
export class GeneralJoiningProjectDetailsComponent implements OnInit {
  projectForm: FormGroup;
  form_projectArray = 'projects';
  form_projectDetails = "projectDetails";

  projectTypeList = [
    {
      label: 'Academy',
      value: 'Academy'
    },
    {
      label: 'Industry',
      value: 'Industry'
    }

  ]
  minDate: Date;
  maxDate: Date;
  form_projectTitle = 'projectTitle';
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
    // this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialize();
    this.saveRequestRxJs();
    this.getProjectApiDetails();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getProjectApiDetails();
     });
   }

   getProjectApiDetails() {
    console.log(this.candidateService.getLocalProfileData());

    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.projectDetails = this.candidateService.getLocalproject_details().projects;
      this.projectDetails && this.projectDetails.length >0 ? this.ifProjectDetails() : this.ifNotProjectDetails();
      console.log(this.projectDetails,'projectDetails');
    } else {
    }
  }
  ifProjectDetails() {
    this.patchProjectForm();
    console.log('yes');

  }
  ifNotProjectDetails() {
    this.projectDetails = [];
      this.getprojectArr.push(this.initProjectArray());
      console.log('no');
    }

  removeProjectArray(i) {
    this.getprojectArr.removeAt(i);
  }
  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 1);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      return split;
    }
  }

  momentForm1(date) {
    if (date) {
      const split = moment(date).format();
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
  patchProjectForm() {
      // this.getprojectArr.clear();
      // this.projectDetails[this.form_projectArray].forEach((element, i) => {
      //   this.getprojectArr.push(this.patchingProjectdetails(element, i));
      // });


    this.getprojectArr.clear();
    this.projectDetails.forEach((element, i) => {
      this.getprojectArr.push(this.patchingProjectdetails(element, i));
    });
    console.log(this.getprojectArr);

  }
  patchingProjectdetails(data, i){
    return this.fb.group({
      [this.form_typeList]: [data[this.form_typeList], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_teamSize]: [data[this.form_teamSize], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_projectTitle]: [data[this.form_projectTitle], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_periodFrom]:[this.dateConvertion(data[this.form_periodFrom]) , [Validators.required]],
      [this.form_periodTo]:[this.dateConvertion(data[this.form_periodTo]) , [Validators.required]],
      [this.form_projectDescription]: [data[this.form_projectDescription], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_projectOrganization]: [data[this.form_projectOrganization], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
    })
     }

  formInitialize() {
    this.projectForm = this.fb.group({
      [this.form_projectArray]: this.fb.array([]),
    })
  }

  addMoreCertifications(){
    if (this.getprojectArr.valid) {
      return this.getprojectArr.push(this.initProjectArray());
     }
     this.glovbal_validators.validateAllFormArrays(this.projectForm.get([this.form_projectArray]) as FormArray);
  }

  get getprojectArr() { return this.projectForm.get([this.form_projectArray]) as FormArray; }
  get typeList() {
    return this.projectForm.get(this.form_typeList);
    }
    get teamSize() {
      return this.projectForm.get(this.form_teamSize);
      }get projectTitle() {
        return this.projectForm.get(this.form_projectTitle);
        }get periodFrom() {
          return this.projectForm.get(this.form_periodFrom);
          }get periodTo() {
            return this.projectForm.get(this.form_periodTo);
            }get projectDescription() {
              return this.projectForm.get(this.form_projectDescription);
              }get projectOrganization() {
                return this.projectForm.get(this.form_projectOrganization);
                }


  initProjectArray(){
    return this.fb.group({
      [this.form_typeList]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_teamSize]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_projectTitle]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_periodFrom]: [null, [Validators.required]],
      [this.form_periodTo]: [null, [Validators.required]],
      [this.form_projectDescription]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_projectOrganization]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],

    })
  }


  formSubmit(routeValue?:any) {
    // this.loadingService.setLoading(true)
    // if(this.projectForm.valid) {
    //   let projectobj:any = {};
    //   let formArray = this.projectForm.getRawValue()[this.form_projectArray];
    //   projectobj.project_details = formArray

    this.loadingService.setLoading(true)
    let rawprojectFormValue = this.projectForm.getRawValue();
    if (this.projectForm.valid) {
      const projectobj = {
        [this.form_projectArray]: rawprojectFormValue[this.form_projectArray],

      };
      console.log(projectobj,'projectobj');

      const ProjectApiRequestDetails = {
        email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "project_details",
        saving_data: projectobj
      }
      this.loadingService.setLoading(true)
    this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(ProjectApiRequestDetails).subscribe((data: any)=> {
      this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Project details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS);
      });
    }
        else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.loadingService.setLoading(false)
      this.glovbal_validators.validateAllFields(this.projectForm);
    }
    console.log(this.projectForm,'projectForm');

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
