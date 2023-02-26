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
      [this.form_periodFrom]: [data[this.form_periodFrom], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_periodTo]: [data[this.form_periodTo], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
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
      [this.form_periodFrom]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_periodTo]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
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
