import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
// import { AdminServiceService } from 'src/app/services/admin-service.service';
// import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from '../../../service/shared-service.service';
import * as moment from 'moment'; //in your component
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { SkillexService } from 'src/app/service/skillex.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';

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
  selector: 'app-joining-dependent',
  templateUrl: './joining-dependent.component.html',
  styleUrls: ['./joining-dependent.component.scss'],
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
export class GeneralJoiningDependentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('confirmDialog', { static: false }) matDialogRef: TemplateRef<any>;

  dependentForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  relationshipList = [
    {
      label: 'Father',
      value: 'Father'
    },
    {
      label: 'Mother',
      value: 'Mother'
    },
    {
      label: 'Spouse',
      value: 'Spouse'
    },
    {
      label: 'Child',
      value: 'Child'
    },
    {
      label: 'Others',
      value: 'Others'
    }

  ]

  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: 1
    },
    {
      label: 'No',
      value: 0
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: 1
    },
    {
      label: 'Inactive',
      value: 0
    }
  ];
  //form Variables
  form_dependentArray = 'dependentArray';
  form_dependent_name = 'name_of_your_family';
  form_dependent_dob = 'family_date_of_birth';
  form_dependent_other = 'dependent_other'
  form_dependent_occupation = 'occupation';
  form_dependent_differently_abled = 'differently_abled';
  form_dependent_status = 'status';
  form_dependent_relationship = 'relationship'
 currentDeleteIndex: number ;
  dependedentDetails: any;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    // private adminService: AdminServiceService,
    private loadingService:LoaderService,
    private skillexService:SkillexService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private matDialog: MatDialog,
    public dialog: MatDialog,

  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.formInitialize();
    this.getDependentApiDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
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
        this.getDependentArr.removeAt(this.currentDeleteIndex );
      }
    });
  }
  removeData(i) {
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

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getDependentApiDetails();
     });
   }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('dependent');
  }

  getDependentApiDetails() {

    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.dependedentDetails = this.candidateService.getLocaldependent_details();
      this.dependedentDetails && this.dependedentDetails.length > 0 ? this.ifDependentDetails() : this.ifNotDependentDetails();
    } else {
      // let apiData = {
      //   form_name: 'joining',
      //   section_name: ''
      // }
      // this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
      //   this.candidateService.saveAllProfileToLocal(data);
      //   this.dependedentDetails = this.candidateService.getLocaldependent_details();
      //   this.dependedentDetails && this.dependedentDetails.length > 0 ? this.ifDependentDetails() : this.ifNotDependentDetails();
      // });
    }

  }

  ifDependentDetails() {
    this.patchDependentForm();
  }
  ifNotDependentDetails() {
    this.dependedentDetails = [];
      this.getDependentArr.push(this.initDependentArray());
    }


  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 90, 0, 1);
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

  formSubmit(routeValue?: any) {
    this.loadingService.setLoading(true)
    if(this.dependentForm.valid) {
      let dependentobj:any = {};
      let formArray = this.dependentForm.getRawValue()[this.form_dependentArray];
      formArray.forEach(element => {
        if (element[this.form_dependent_dob]) {
          element[this.form_dependent_dob] = element[this.form_dependent_dob];
        }
      });
      dependentobj.dependent_details = formArray
      const DependentApiRequestDetails = {
        email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "dependent_details",
        saving_data: dependentobj
      }
     this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(DependentApiRequestDetails).subscribe((data: any)=> {
      this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data.dependent_details);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Dependent details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
      });
    } else {
      this.ngAfterViewInit();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
    }
  }

  saveRequestRxJs() {
    this.sendPopupResultSubscription =  this.sharedService.sendPopupResult.subscribe((result: any)=> {

      if (result.result == 'save') {
      this.formSubmit(result.route);
      }
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'dependent') {
        if (!this.dependentForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
    if (!this.dependentForm.dirty) {
      if (route == 'contact') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
      } else {
        if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().dependent_details) {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
        } else {
         if (this.dependentForm.valid) {
          return this.sharedService.openJoiningRoutePopUp.next(route == 'contact' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
          }
          this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'contact' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
  }

  patchDependentForm() {
    this.getDependentArr.clear();
    this.dependedentDetails.forEach((element, i) => {
      this.getDependentArr.push(this.patching(element));
    });
    this.setValidations()

    // this.getDependentArr.at(0).patchValue({
    //   [this.form_isDependent]: 'Father',

    // });
    // this.getDependentArr.at(1).patchValue({
    //   [this.form_isDependent]: 'Mother',
    // });
    // this.getDependentArr.controls[0]['controls'][this.form_isDependent].disable({ emitEvent: false });
    // this.getDependentArr.controls[1]['controls'][this.form_isDependent].disable({ emitEvent: false });

  }

  patching(data) {
    return this.fb.group({
      [this.form_dependent_name]: [data[this.form_dependent_name], [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_dob]: [this.dateConvertion(data[this.form_dependent_dob]), [Validators.required]],
      [this.form_dependent_occupation]: [data[this.form_dependent_occupation], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_other]: [data[this.form_dependent_other]],
         [this.form_dependent_differently_abled]: [data[this.form_dependent_differently_abled], this.candidateService.checkKycOrJoiningForm() ? [Validators.required] : []],
      [this.form_dependent_status]: [data[this.form_dependent_status], this.candidateService.checkKycOrJoiningForm() ? [Validators.required] : []],
      [this.form_dependent_relationship]: [data[this.form_dependent_relationship], [Validators.required]],
    })
  }

  initDependentArray() {
    return this.fb.group({
      [this.form_dependent_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_dob]: [null, [Validators.required]],
      [this.form_dependent_occupation]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_relationship]: [null, [ Validators.required]],
      [this.form_dependent_other]: [null],
      [this.form_dependent_differently_abled]: [null, this.candidateService.checkKycOrJoiningForm() ? [Validators.required] : []],
      [this.form_dependent_status]: [null, this.candidateService.checkKycOrJoiningForm() ? [Validators.required] : []],
      // [this.form_isDependent]: [null]
    })
  }

  formInitialize() {
    this.dependentForm = this.fb.group({
      [this.form_dependentArray]: this.fb.array([this.initDependentArray()])
    })
  }
  setValidations() {
    this.getDependentArr.controls.forEach((data,index) => {
    if (this.getDependentArr.controls[index]['controls'][this.form_dependent_relationship].value == 'Others') {
      this.getDependentArr.controls[index]['controls'][this.form_dependent_other].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
    this.getDependentArr['controls'][index]['controls'][this.form_dependent_other].updateValueAndValidity();
    }else{
      this.getDependentArr.controls[index]['controls'][this.form_dependent_other].setValue(null);
      this.getDependentArr.controls[index]['controls'][this.form_dependent_other].clearValidators();
      this.getDependentArr['controls'][index]['controls'][this.form_dependent_other].updateValueAndValidity();
    }
  })
}
  addToDependentArray() {
    if (this.dependentForm.valid) {
     return this.getDependentArr.push(this.initDependentArray());
    }
    this.setValidations()
    // this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
  }

  removeDependentArray(i) {
    this.getDependentArr.removeAt(i);
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getDependentArr() { return this.dependentForm.get([this.form_dependentArray]) as FormArray; }

  get dependent_name() {
  return this.dependentForm.get(this.form_dependent_name);
  }
  get dependent_dob() {
  return this.dependentForm.get(this.form_dependent_dob);
  }

  get dependent_other() {
    return this.dependentForm.get(this.form_dependent_other);
    }

  get dependent_differently_abled() {
  return this.dependentForm.get(this.form_dependent_differently_abled);
  }
  get dependent_status() {
  return this.dependentForm.get(this.form_dependent_status);
  }
  get relationship() {
    return this.dependentForm.get(this.form_dependent_relationship);
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
    }

}
