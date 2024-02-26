import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
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
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { InterComponentMessenger } from 'src/app/service/interComponentMessenger.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import { HttpClient } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
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
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GeneralJoiningAccomplishmentsComponent implements OnInit {
  @ViewChild('confirmDialog', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('awardsscroll') awardsscroll: ElementRef;
  removeArr1: boolean = false;
  removeArr2: boolean = false;
  removeArr3: boolean = false;
  removeArr4: boolean = false;
  // removeArr5: boolean = false;
  currentDeleteIndex: number;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  accomplishmentDetailsAllData: any;
  accomplishmentDetails: any;
  accomplishmentsForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  certificationValue: string = '';
  isIssuedFromDisabled: boolean = false;

  formGroup: FormGroup;
  selectedCertification: string;
  selectedOption: string;
  checkboxevent: any;
  eduTechCourses: any[];
  certifications: string[] = [];

  @ViewChild('selectElement') selectElement!: ElementRef;
  //form variable
  form_certificationsArray = 'certifications';
  form_journalEntryArray = 'journals';
  form_awardsArray = 'awards';
  form_assesmentArray = 'assessments';
  form_CoursesArray = 'courses';
  form_certification_name = 'certificationName';
  form_certification_issuedFrom = 'certificationIssuedFrom';
  form_certification_issuedFrom_Edutech = 'certificationIssuedFromedutech';
  form_certification_description = 'certificationDescription';
  form_certification_validityFrom = 'certificationValidityFrom';
  form_certification_validityUpto = 'certificationValidityUpto';
  form_isexpire = 'isexpire';
  form_isjourney = 'isJourney';
  form_isaward = 'isAward';
  form_iscourse = 'isCourse';
  form_award_date = 'awardDate';
  form_award_title = 'awardTitle';
  form_isassesment = 'isAssesment';
  form_assesment_date = 'assesmentDate';
  form_assesment_title = 'test_name';
  gettingAssessmentvalue:any
  form_assesment_type = 'type';
  form_journalEntity_title = 'journalEntityTitle';
  form_journalEntity_url = 'journalEntityUrl';
  form_journalEntity_publishedOn = 'journalEntityPublishedOn';
  form_journalEntity_description = 'journalEntityDescription';
  form_course_name = 'coursesName';
  // form_course_From = 'coursesFrom';
  // form_course_Upto = 'coursesTo';
  form_course_description = 'coursesdescription';
  check: any;
  assessmentChecked: boolean[] = [];
  certificationFormGroups: FormGroup[] = [];

  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  minAwardDate: Date | null;
  maxAwardDate: Date;

  minJournalDate: Date | null;
  maxJournalDate: Date;
  getCourselist: any;
  getListofcourses: any;
  formCertification: FormGroup;
  checked: boolean;
  assesmentData: any;
  assesmentList: any;
  gettingassementvalues:any;

  // removeArr5: number;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    // private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private loadingService: LoaderService,
    private skillexService: SkillexService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private matDialog: MatDialog,
    public dialog: MatDialog,
    private msgData: InterComponentMessenger,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private elementRef: ElementRef
  ) {
    // this.formGroup = this.formBuilder.group({
    //   form_certification_name: ['', Validators.required],
    //   form_certification_issuedFrom: ['', Validators.required]
    // });

    this.dateValidation();
    this.minFromDate = new Date(1900, 0, 1);
    this.maxFromDate = new Date();

    this.minToDate = new Date(1900, 0, 1);
    this.maxToDate = new Date();

    this.minAwardDate = new Date(1900, 0, 1);
    this.maxAwardDate = new Date();

    this.minJournalDate = new Date(1900, 0, 1);
    this.maxJournalDate = new Date();
  }

  fromDateChange(
    type: string,
    event: MatDatepickerInputEvent<Date>,
    i: number
  ) {
    this.minToDate[i] = event.value;

    if (event.value != null) {
      this.maxToDate[i] = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() + 30
      );
    }
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>, i: number) {
    this.maxFromDate[i] = event.value;

    if (event.value != null) {
      this.minFromDate[i] = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() - 30
      );
    }
  }

  ngOnInit(): void {
    // this.customerName = this.appConfig.getSelectedCustomerName();
    this.getassessmentData();
    this.formInitialize();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
    this.getAccomplishmentsApiDetails();
    this.check =
      this.getCertificationsArr?.controls[
        this.getCertificationsArr.controls.length - 1
      ]?.value?.isexpire;
    this.selectedCertification = '1';
    this.getCertificationsArr
      .get('form_certification_issuedFrom')
      ?.setValue('LnTeduTech');

    const getCourseToken = 'Bearer 104150f8e66cae68b40203e1dbba7b4529231970';
    this.fetchCertifications(getCourseToken);
  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription =
      this.sharedService.joiningFormDataPassing.subscribe((data: any) => {
        this.getAccomplishmentsApiDetails();
      });
  }

  getAccomplishmentsApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.accomplishmentDetails =
        this.candidateService.getLocalaccomplishments_details();
      // this.accomplishmentsDetailsAllData = this.candidateService.getLocalAccomplishment_details();
      
      this.gettingassementvalues =this.accomplishmentDetails;
     
    

    const formIsAssesmentControlName = this.form_isassesment; 

if (this.gettingassementvalues.assessments?.length > 0) {
  this.accomplishmentsForm.controls[formIsAssesmentControlName].setValue(true);
} else {
  this.accomplishmentsForm.controls[formIsAssesmentControlName].setValue(false);
}

    
      this.patchaccomplishmentsForm();
    } 
  }
  patchaccomplishmentsForm() {
    if (
      this.accomplishmentDetails &&
      this.accomplishmentDetails[this.form_certificationsArray] &&
      this.accomplishmentDetails[this.form_certificationsArray].length > 0
    ) {
      this.getCertificationsArr.clear();
      this.accomplishmentDetails[this.form_certificationsArray].forEach(
        (element, i) => {
          this.getCertificationsArr.push(
            this.patchingCertifications(element, i)
          );
        }
      );
    }
    if (
      this.accomplishmentDetails &&
      this.accomplishmentDetails[this.form_awardsArray] &&
      this.accomplishmentDetails[this.form_awardsArray].length > 0
    ) {
      this.getawardsArr.clear();
      this.accomplishmentDetails[this.form_awardsArray].forEach(
        (element, i) => {
          this.getawardsArr.push(this.patchingAwards(element, i));
        }
      );
    }
    if (
      this.accomplishmentDetails &&
      this.accomplishmentDetails[this.form_assesmentArray] &&
      this.accomplishmentDetails[this.form_assesmentArray].length > 0
    ) {
      this.getassesmentArr.clear();
      // this.accomplishmentsForm.controls[this.form_isassesment].setValue(
      //   this.accomplishmentDetails[this.form_assesmentArray][0].assementvalue
      // );
      console.log(this.accomplishmentDetails,'this.accomplishmentDetails')
      this.gettingassementvalues.assessments.forEach((element, i) => {
        this.getassesmentArr.push(this.patchingAssesments(element, i));
        
      });
      this.accomplishmentsForm.controls[this.form_isassesment].setValue(true);
    }
    if (
      this.accomplishmentDetails &&
      this.accomplishmentDetails[this.form_journalEntryArray] &&
      this.accomplishmentDetails[this.form_journalEntryArray].length > 0
    ) {
      this.getJournalEntryArr.clear();
      this.accomplishmentDetails[this.form_journalEntryArray].forEach(
        (element, i) => {
          this.getJournalEntryArr.push(this.patchingjournalentry(element, i));
        }
      );
    }
    // if(this.accomplishmentDetails && this.accomplishmentDetails[this.form_CoursesArray] && this.accomplishmentDetails[this.form_CoursesArray].length > 0 ){
    //   this.getCoursesArr.clear();
    //   this.accomplishmentDetails[this.form_CoursesArray].forEach((element, i) => {
    //     this.getCoursesArr.push(this.patchingjournalentry(element, i));
    //   });
    // }
    this.setCertificationArrValidation();
    this.setjournalArrValidation();
    this.setAwardArrValidation();
    //this.setAssesmentArrValidation();
    // this.setCoursesArrValidation();
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
    this.sendPopupResultSubscription =
      this.sharedService.sendPopupResult.subscribe((result: any) => {
        if (result.result == 'save') {
          this.formSubmit(result.route);
        }
      });
  }

  formSubmit(routeValue?: any) {
    // let rawaccomplishmentsFormValue = this.accomplishmentsForm.getRawValue();
    if (this.accomplishmentsForm.valid) {
      // const accomplishmentsobj = {
      //   [this.form_certificationsArray]: rawaccomplishmentsFormValue[this.form_certificationsArray],
      //   [this.form_awardsArray]: rawaccomplishmentsFormValue[this.form_awardsArray],
      //   [this.form_assesmentArray]: rawaccomplishmentsFormValue[this.form_assesmentArray],
      //   [this.form_journalEntryArray]: rawaccomplishmentsFormValue[this.form_journalEntryArray],
      // };
      const certifications =
        this.accomplishmentsForm.getRawValue()[this.form_certificationsArray];
      let awards =
        this.accomplishmentsForm.getRawValue()[this.form_awardsArray];

      let assessmentDetail = {
        assesments:
          this.accomplishmentsForm.getRawValue()[this.form_assesmentArray],
      
      };

      let assesments = assessmentDetail;

      //   let assesments:any  = this.accomplishmentsForm.getRawValue()[this.form_assesmentArray];
      // assesments.assementvalue = this.accomplishmentsForm.getRawValue()[this.form_isassesment];
      //   console.log(assesments,'assesmentsassesments')
      // let assementvalue = this.accomplishmentsForm.getRawValue()[this.form_isassesment];

      // console.log(assementvalue,'assementvalue')
      let journals =
        this.accomplishmentsForm.getRawValue()[this.form_journalEntryArray];
      // let courses =
      //   this.accomplishmentsForm.getRawValue()[this.form_CoursesArray];

      let apiData = {
        certifications,
        awards,
        assessments:this.accomplishmentsForm.getRawValue()[this.form_assesmentArray],
        journals,
        // assementvalue
        // courses,
      };
      const AccomplishmentsApiRequestDetails = {
        email: this.appConfig.getLocalData('userEmail')
          ? this.appConfig.getLocalData('userEmail')
          : '',
        section_name: 'accomplishment_details',
        saving_data: apiData,
      };
      this.loadingService.setLoading(true);
      this.newSaveProfileDataSubscription = this.skillexService
        .saveCandidateProfile(AccomplishmentsApiRequestDetails)
        .subscribe((data: any) => {
          this.loadingService.setLoading(false);
          this.candidateService.saveFormtoLocalDetails(
            data.data.section_name,
            data.data.saved_data
          );
          this.candidateService.saveFormtoLocalDetails(
            'section_flags',
            data.data.section_flags
          );
          this.appConfig.nzNotification(
            'success',
            'Saved',
            data && data.message ? data.message : 'Accomplishments is updated'
          );
          this.msgData.sendMessage('saved', true);
          this.sharedService.joiningFormStepperStatus.next();
          return routeValue
            ? this.appConfig.routeNavigation(routeValue)
            : this.appConfig.routeNavigation(
                CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD
              );
        });
    } else {
      this.ngAfterViewInit();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification(
        'error',
        'Not Saved',
        'Please fill all the mandatory fields to proceed further'
      );
      // this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray);
      this.glovbal_validators.validateAllFields(this.accomplishmentsForm);
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([
          this.form_certificationsArray,
        ]) as FormArray
      );
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray
      );
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([this.form_assesmentArray]) as FormArray
      );
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray
      );
    }
  }

  patchingCertifications(data, i) {
    return this.fb.group({
      // lntCertificationFlag: ['1'],
      lntCertificationFlag: [data.lntCertificationFlag],
      [this.form_certification_name]: [
        data[this.form_certification_name],

        [
          RemoveWhitespace.whitespace(),
          Validators.required,
          // this.glovbal_validators.alphaNum255(),
        ],
      ],

      [this.form_certification_issuedFrom]: [
        data[this.form_certification_issuedFrom],
        [Validators.required],
      ],
      // [this.form_certification_issuedFrom_Edutech]: [data[this.form_certification_issuedFrom_Edutech], [Validators.required]],
      [this.form_certification_description]: [
        data[this.form_certification_description],
        [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
      ],
      [this.form_certification_validityFrom]: [
        this.dateConvertion(data[this.form_certification_validityFrom]),
        [Validators.required, this.startTrue(true)],
      ],
      [this.form_certification_validityUpto]: [
        this.dateConvertion(data[this.form_certification_validityUpto]),
        [this.startTrue(true)],
      ],

      [this.form_certification_validityFrom]: [
        this.dateConvertion(data[this.form_certification_validityFrom]),
      ],
      [this.form_certification_validityUpto]: [
        this.dateConvertion(data[this.form_certification_validityUpto]),
      ],

      [this.form_isexpire]: [
        data[this.form_isexpire] ? data[this.form_isexpire] : false,
      ],
    });
  }
  patchingAwards(data, i) {
    return this.fb.group({
      [this.form_award_title]: [
        data[this.form_award_title],
        [
          RemoveWhitespace.whitespace(),
          Validators.required,
          this.glovbal_validators.alphaNum255(),
        ],
      ],
      // [this.form_award_date]: [this.dateConvertion(data[this.form_award_date]), [RemoveWhitespace.whitespace(), Validators.required,, this.startTrue(true)]],
      [this.form_award_date]: [this.dateConvertion(data[this.form_award_date])],
    });
  }

  patchingAssesments(data, i) {
    return this.fb.group({
      [this.form_assesment_title]: [
        data[this.form_assesment_title],
        [
          RemoveWhitespace.whitespace(),
          Validators.required,
          this.glovbal_validators.alphaNum255(),
        ],
      ],
      [this.form_assesment_type]: [data[this.form_assesment_type].toLowerCase(), ],
      // [this.form_assesment_date]: [this.dateConvertion(data[this.form_assesment_date]), [RemoveWhitespace.whitespace(), Validators.required,, this.startTrue(true)]],
      // [this.form_isassesment]: [data[this.form_isassesment]],
      [this.form_assesment_date]: [
        this.dateConvertion(data[this.form_assesment_date]),
      ],
    });
  }

  patchingjournalentry(data, i) {
    return this.fb.group({
      [this.form_journalEntity_title]: [
        data[this.form_journalEntity_title],
        [
          RemoveWhitespace.whitespace(),
          Validators.required,
          this.glovbal_validators.alphaNum255(),
        ],
      ],
      [this.form_journalEntity_url]: [
        data[this.form_journalEntity_url],
        [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
      ],
      [this.form_journalEntity_publishedOn]: [
        this.dateConvertion(data[this.form_journalEntity_publishedOn]),
      ],
      [this.form_journalEntity_description]: [
        data[this.form_journalEntity_description],
        [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
      ],
    });
  }

  // regexValidator(error: ValidationErrors, param): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} => {
  //     if (!control.value) {
  //       return null;
  //     }
  //     let check;
  //     let yearofPassing = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_yearpassing]['value'] ? control['_parent']['controls'][this.form_yearpassing]['value'] : null;
  //     let startDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_certification_validityFrom]['value'] ? control['_parent']['controls'][this.form_certification_validityFrom]['value'] : null;
  //     let endDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_certification_validityUpto]['value'] ? control['_parent']['controls'][this.form_certification_validityUpto]['value'] : null;
  //     // if (yearofPassing) {
  //       let start = moment(control.value).format('YYYY-MM-DD');
  //       // let yearofPassing1 = moment(yearofPassing).format('YYYY-MM-DD');
  //       // error.notValid = this.momentFormMonth(yearofPassing);
  //       // check = moment(start).isSameOrBefore(yearofPassing1, 'month');
  //       // check = !check;
  //     // }
  //     if (!param) {
  //       return check ? error : null;
  //     } else {
  //       // this.detectStartDateCalc(startDate, endDate, control);
  //       return null;
  //     }
  //   };
  // }
  startTrue(param) {
    // return this.regexValidator({notValid: true}, param);
  }
  formInitialize() {
    // let getcheckboxvalue = localStorage.getItem('checkboxvalue');
    this.accomplishmentsForm = this.fb.group({
      [this.form_certificationsArray]: this.fb.array([]),
      [this.form_awardsArray]: this.fb.array([]),
      [this.form_assesmentArray]: this.fb.array([]),
      [this.form_journalEntryArray]: this.fb.array([]),
      // [this.form_isassesment]: [getcheckboxvalue],
      [this.form_isassesment]: [false],
      [this.form_CoursesArray]: this.fb.array([]),
    });
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
    this.checkFormValidRequest =
      this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
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
        return this.appConfig.routeNavigation(
          CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT
        );
      } else {
        if (
          this.candidateService.getLocalsection_flags() &&
          this.candidateService.getLocalsection_flags().experience_details ==
            '1'
        ) {
          return this.appConfig.routeNavigation(
            CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD
          );
        } else {
          if (this.accomplishmentsForm.valid) {
            return this.sharedService.openJoiningRoutePopUp.next(
              route == 'project'
                ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT
                : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD
            );
          }
          this.glovbal_validators.validateAllFields(this.accomplishmentsForm);
          this.ngAfterViewInit();
          this.appConfig.nzNotification(
            'error',
            'Not Saved',
            'Please fill all the red highlighted fields to proceed further'
          );
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(
        route == 'project'
          ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT
          : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD
      );
    }
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getCertificationsArr() {
    return this.accomplishmentsForm.get([
      this.form_certificationsArray,
    ]) as FormArray;
  }
  get getawardsArr() {
    return this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray;
  }
  get getassesmentArr() {
    return this.accomplishmentsForm.get([
      this.form_assesmentArray,
    ]) as FormArray;
  }
  get getJournalEntryArr() {
    return this.accomplishmentsForm.get([
      this.form_journalEntryArray,
    ]) as FormArray;
  }
  get getCoursesArr() {
    return this.accomplishmentsForm.get([this.form_CoursesArray]) as FormArray;
  }

  get certificationName() {
    return this.accomplishmentsForm.get(this.form_certification_name);
  }
  get certificationIssuedFrom() {
    return this.accomplishmentsForm.get(this.form_certification_issuedFrom);
  }
  get certificationIssuedFromedutech() {
    return this.accomplishmentsForm.get(
      this.form_certification_issuedFrom_Edutech
    );
  }

  get certificationDescription() {
    return this.accomplishmentsForm.get(this.form_certification_description);
  }
  get certificationValidityFrom() {
    return this.accomplishmentsForm.get(this.form_certification_validityFrom);
  }
  get isexpire() {
    return this.accomplishmentsForm.get(this.form_isexpire);
  }
  get certificationValidityUpto() {
    return this.accomplishmentsForm.get(this.form_certification_validityUpto);
  }
  get awardTitle() {
    return this.accomplishmentsForm.get(this.form_award_title);
  }
  get awardDate() {
    return this.accomplishmentsForm.get(this.form_award_date);
  }
  get isAssesment() {
    return this.accomplishmentsForm.get(this.form_isassesment);
  }
  get assesmentTitle() {
    return this.accomplishmentsForm.get(this.form_assesment_title);
  }
  get assesmentDate() {
    return this.accomplishmentsForm.get(this.form_assesment_date);
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
  get coursesName() {
    return this.accomplishmentsForm.get(this.form_course_name);
  }
  // get coursesFrom() {
  //   return this.accomplishmentsForm.get(this.form_course_From);
  //   }
  //   get coursesTo() {
  //     return this.accomplishmentsForm.get(this.form_course_Upto);
  //     }
  get coursesdescription() {
    return this.accomplishmentsForm.get(this.form_course_description);
  }
  initCertificationsArray() {
    return this.fb.group({
      lntCertificationFlag: ['1'],
      [this.form_certification_name]: [null, [Validators.required]],
      [this.form_certification_issuedFrom]: [
        'L&T EduTech',
        [Validators.required],
      ],

      [this.form_certification_description]: [
        null,
        [this.glovbal_validators.alphaNum255()],
      ],
      [this.form_certification_validityFrom]: [null, [Validators.required]],
      [this.form_certification_validityUpto]: [null, [Validators.required]],
      [this.form_isexpire]: [false],
    });
  }

  setCertificationArrValidation() {
    this.getCertificationsArr.controls.forEach((data, index) => {
      if (
        this.getCertificationsArr?.length &&
        this.getCertificationsArr.controls[index]['controls'][
          this.form_isexpire
        ]?.value == false
      ) {
        this.getCertificationsArr.controls[index]['controls'][
          this.form_certification_name
        ].setValidators([Validators.required], { emitEvent: false });
        this.getCertificationsArr.controls[index]['controls'][
          this.form_certification_issuedFrom
        ].setValidators([Validators.required], { emitEvent: false });
        this.getCertificationsArr.controls[index]['controls'][
          this.form_certification_validityFrom
        ].setValidators([Validators.required], { emitEvent: false });
        this.getCertificationsArr.controls[index]['controls'][
          this.form_certification_validityUpto
        ].setValidators([Validators.required], { emitEvent: false });

        this.getCertificationsArr['controls'][index]['controls'][
          this.form_certification_name
        ].updateValueAndValidity();
        this.getCertificationsArr['controls'][index]['controls'][
          this.form_certification_issuedFrom
        ].updateValueAndValidity();
        this.getCertificationsArr['controls'][index]['controls'][
          this.form_certification_validityFrom
        ].updateValueAndValidity();
        this.getCertificationsArr['controls'][index]['controls'][
          this.form_certification_validityUpto
        ].updateValueAndValidity();
      }
      if (
        this.getCertificationsArr?.length &&
        this.getCertificationsArr.controls[index]['controls'][
          this.form_isexpire
        ]?.value == true
      ) {
        this.getCertificationsArr.controls[index]['controls'][
          this.form_certification_validityUpto
        ].setValue(null);
        this.getCertificationsArr.controls[index]['controls'][
          this.form_certification_validityUpto
        ].clearValidators();
        this.getCertificationsArr['controls'][index]['controls'][
          this.form_certification_validityUpto
        ].updateValueAndValidity();
      }
    });
  }

  isCertificateExpire(e, i: number) {
    if (e.checked) {
      this.check = true;
      this.getCertificationsArr.controls[
        this.getCertificationsArr.controls.length - 1
      ]['controls'][this.form_certification_validityUpto].setValue(null);
      this.getCertificationsArr.controls[
        this.getCertificationsArr.controls.length - 1
      ]['controls'][this.form_certification_validityUpto].clearValidators();
      this.getCertificationsArr.controls[
        this.getCertificationsArr.controls.length - 1
      ]['controls'][
        this.form_certification_validityUpto
      ].updateValueAndValidity();
    } else {
      this.check = false;
      this.getCertificationsArr.controls[
        this.getCertificationsArr.controls.length - 1
      ]['controls'][this.form_certification_validityUpto].setValidators(
        [Validators.required],
        { emitEvent: false }
      );
      //this.getCertificationsArr.controls[this.getCertificationsArr.controls.length-1]['controls'][this.form_certification_validityUpto].setValidators([Validators.required, this.startTrue(true) ],{ emitEvent: false });
      this.getCertificationsArr.controls[
        this.getCertificationsArr.controls.length - 1
      ]['controls'][
        this.form_certification_validityUpto
      ].updateValueAndValidity();
    }
  }

  initawardsArray() {
    return this.fb.group({
      [this.form_award_title]: [
        null,
        [Validators.required, this.glovbal_validators.alphaNum255()],
      ],
      [this.form_award_date]: [null, [Validators.required]],
      [this.form_isaward]: [false],
    });
  }
  setAwardArrValidation() {
    this.getawardsArr.controls.forEach((data, index) => {
      // if(this.getawardsArr.length){
      if (
        this.getawardsArr?.length &&
        this.getawardsArr.controls[index]['controls'][this.form_isaward]
          ?.value == false
      ) {
        this.getawardsArr.controls[index]['controls'][
          this.form_award_title
        ].setValidators(
          [Validators.required, this.glovbal_validators.alphaNum255()],
          { emitEvent: false }
        );
        this.getawardsArr.controls[index]['controls'][
          this.form_award_date
        ].setValidators([Validators.required], { emitEvent: false });
        this.getawardsArr['controls'][index]['controls'][
          this.form_award_title
        ].updateValueAndValidity();
        this.getawardsArr['controls'][index]['controls'][
          this.form_award_date
        ].updateValueAndValidity();
      }
      if (
        this.getawardsArr?.length &&
        this.getawardsArr.controls[index]['controls'][this.form_isaward]
          ?.value == true
      ) {
        this.getawardsArr.controls[index]['controls'][
          this.form_award_title
        ].setValue(null);
        this.getawardsArr.controls[index]['controls'][
          this.form_award_date
        ].setValue(null);
        //this.getawardsArr.controls[index]['controls'][this.form_award_title].clearValidators();
        //this.getawardsArr.controls[index]['controls'][this.form_award_date].clearValidators();
        this.getawardsArr['controls'][index]['controls'][
          this.form_award_title
        ].updateValueAndValidity();
        this.getawardsArr['controls'][index]['controls'][
          this.form_award_date
        ].updateValueAndValidity();
      } else {
        this.getawardsArr.controls[index]['controls'][
          this.form_award_title
        ].setValidators(
          [Validators.required, this.glovbal_validators.alphaNum255()],
          { emitEvent: false }
        );
        this.getawardsArr.controls[index]['controls'][
          this.form_award_date
        ].setValidators([Validators.required], { emitEvent: false });
      }
    });
  }


  initassesmentArray() {
    return this.fb.group({
      [this.form_assesment_title]: [
        null,
        [Validators.required, this.glovbal_validators.alphaNum255()],
      ],
      [this.form_assesment_type]:[''],
     
      [this.form_assesment_date]: [null, [Validators.required]],
      //[this.form_isassesment]:[false]
      
    });
    
  }

  setAssesmentType(i ,item){
    console.log('fun calling');
    // var asses_name =  this.getassesmentArr['controls'][i]['controls'][
    //   this.form_assesment_title
    // ]?.value()
    // console.log(asses_name,'nameeeeee');
    // console.log(this.fb.group,'fbgroup');
    var asses_name = item.controls['test_name'].value.toLowerCase()
    item.controls[this.form_assesment_type].setValue(asses_name);
    console.log(asses_name,'asses_nameasses_name');  
    // console.log(item.controls['test_name'].value);
  }

  // convertToLowercase() {
  //   return (control: AbstractControl) => {
  //     const value = control.value;
  //     if (value && typeof value === 'string') {
  //       control.setValue(value.toLowerCase(), { emitEvent: false });
  //     }
  //     return null;
  //   };
  // }


  setAssesmentArrValidation() {
    this.getassesmentArr.controls.forEach((data, index) => {
      // if(this.getassesmentArr.length){
      if (
        this.getassesmentArr?.length &&
        this.getassesmentArr.controls[index]['controls'][this.form_isassesment]
          ?.value == false
      ) {
        this.getassesmentArr.controls[index]['controls'][
          this.form_assesment_title
        ].setValidators(
          [Validators.required, this.glovbal_validators.alphaNum255()],
          { emitEvent: false }
        );
        this.getassesmentArr.controls[index]['controls'][
          this.form_assesment_date
        ].setValidators([Validators.required], { emitEvent: false });
        this.getassesmentArr['controls'][index]['controls'][
          this.form_assesment_title
        ].updateValueAndValidity();
        this.getassesmentArr['controls'][index]['controls'][
          this.form_assesment_date
        ].updateValueAndValidity();
      }
      if (
        this.getassesmentArr?.length &&
        this.getassesmentArr.controls[index]['controls'][this.form_isassesment]
          ?.value == true
      ) {
        this.getassesmentArr.controls[index]['controls'][
          this.form_assesment_title
        ].setValue(null);
        this.getassesmentArr.controls[index]['controls'][
          this.form_assesment_date
        ].setValue(null);
        //this.getassesmentArr.controls[index]['controls'][this.form_assesment_title].clearValidators();
        //this.getassesmentArr.controls[index]['controls'][this.form_assesment_date].clearValidators();
        this.getassesmentArr['controls'][index]['controls'][
          this.form_assesment_title
        ].updateValueAndValidity();
        this.getassesmentArr['controls'][index]['controls'][
          this.form_assesment_date
        ].updateValueAndValidity();
      } else {
        this.getassesmentArr.controls[index]['controls'][
          this.form_assesment_title
        ].setValidators(
          [Validators.required, this.glovbal_validators.alphaNum255()],
          { emitEvent: false }
        );
        this.getassesmentArr.controls[index]['controls'][
          this.form_assesment_date
        ].setValidators([Validators.required], { emitEvent: false });
      }
    });
  }

  isAssesmentbox(e, i: number) {
    if (e.checked) {
      this.check = true;
      //  this.getassesmentArr.controls[this.getassesmentArr.controls.length-1]['controls'][this.form_certification_validityUpto].setValue(null);
      //   this.getassesmentArr.controls[this.getassesmentArr.controls.length-1]['controls'][this.form_certification_validityUpto].clearValidators();
      //   this.getassesmentArr.controls[this.getassesmentArr.controls.length-1]['controls'][this.form_certification_validityUpto].updateValueAndValidity();
    } else {
      // this.check = false
      // this.getassesmentArr.controls[this.getassesmentArr.controls.length-1]['controls'][this.form_certification_validityUpto].setValidators([Validators.required],{ emitEvent: false });
      // //this.getassesmentArr.controls[this.getassesmentArr.controls.length-1]['controls'][this.form_certification_validityUpto].setValidators([Validators.required, this.startTrue(true) ],{ emitEvent: false });
      // this.getassesmentArr.controls[this.getassesmentArr.controls.length-1]['controls'][this.form_certification_validityUpto].updateValueAndValidity();
    }
  }

  initJournalEntryArray() {
    return this.fb.group({
      [this.form_journalEntity_title]: [
        null,
        [Validators.required, this.glovbal_validators.alphaNum255()],
      ],
      [this.form_journalEntity_url]: [
        null,
        [Validators.required, this.glovbal_validators.urlRegex()],
      ],
      [this.form_journalEntity_publishedOn]: [null, [Validators.required]],
      [this.form_journalEntity_description]: [
        null,
        [this.glovbal_validators.alphaNum255()],
      ],
      [this.form_isjourney]: [false],
    });
  }
  setjournalArrValidation() {
    this.getJournalEntryArr.controls.forEach((data, index) => {
      //if(this.getJournalEntryArr.length){
      if (
        this.getJournalEntryArr?.length &&
        this.getJournalEntryArr.controls[index]['controls'][this.form_isjourney]
          ?.value == false
      ) {
        this.getJournalEntryArr.controls[index]['controls'][
          this.form_journalEntity_title
        ].setValidators(
          [Validators.required, this.glovbal_validators.alphaNum255()],
          { emitEvent: false }
        );
        this.getJournalEntryArr.controls[index]['controls'][
          this.form_journalEntity_url
        ].setValidators(
          [Validators.required, this.glovbal_validators.urlRegex()],
          { emitEvent: false }
        );
        this.getJournalEntryArr['controls'][index]['controls'][
          this.form_journalEntity_title
        ].updateValueAndValidity();
        this.getJournalEntryArr['controls'][index]['controls'][
          this.form_journalEntity_url
        ].updateValueAndValidity();
      }
      if (
        this.getJournalEntryArr?.length &&
        this.getJournalEntryArr.controls[index]['controls'][this.form_isjourney]
          ?.value == true
      ) {
        this.getJournalEntryArr.controls[index]['controls'][
          this.form_journalEntity_title
        ].setValue(null);
        this.getJournalEntryArr.controls[index]['controls'][
          this.form_journalEntity_url
        ].setValue(null);

        //this.getJournalEntryArr['controls'][index]['controls'][this.form_certification_name].updateValueAndValidity();
        this.getJournalEntryArr['controls'][index]['controls'][
          this.form_journalEntity_title
        ].updateValueAndValidity();
        this.getJournalEntryArr['controls'][index]['controls'][
          this.form_journalEntity_url
        ].updateValueAndValidity();
      } else {
        // this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_title].clearValidators();
        // this.getJournalEntryArr.controls[index]['controls'][this.form_journalEntity_url].clearValidators();
        this.getJournalEntryArr.controls[index]['controls'][
          this.form_journalEntity_title
        ].setValidators(
          [Validators.required, this.glovbal_validators.alphaNum255()],
          { emitEvent: false }
        );
        this.getJournalEntryArr.controls[index]['controls'][
          this.form_journalEntity_url
        ].setValidators(
          [Validators.required, this.glovbal_validators.urlRegex()],
          { emitEvent: false }
        );
      }
    });
  }
  //     initCourseArray(){
  //       return this.fb.group({
  //         [this.form_course_name]: [null,[Validators.required,this.glovbal_validators.alphaNum255()]],

  //         [this.form_course_description]:[null,[this.glovbal_validators.alphaNum255()]],

  //         [this.form_iscourse]:[false]
  //        })
  //     }
  //     setCoursesArrValidation(){
  //       this.getCoursesArr.controls.forEach((data, index) => {
  // if(this.getCoursesArr?.length && this.getCoursesArr.controls[index]['controls'][this.form_iscourse]?.value == false){
  //   this.getCoursesArr.controls[index]['controls'][this.form_course_name].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
  //   this.getCoursesArr.controls[index]['controls'][this.form_course_description].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });

  //   this.getCoursesArr['controls'][index]['controls'][this.form_course_name].updateValueAndValidity();
  //   this.getCoursesArr['controls'][index]['controls'][this.form_course_description].updateValueAndValidity();
  // }

  // if(this.getCoursesArr?.length && this.getCoursesArr.controls[index]['controls'][this.form_iscourse]?.value == true){
  //   this.getCoursesArr.controls[index]['controls'][this.form_course_name].setValue(null);
  //   this.getCoursesArr.controls[index]['controls'][this.form_course_description].setValue(null);

  //   this.getCoursesArr['controls'][index]['controls'][this.form_course_name].updateValueAndValidity();
  //   this.getCoursesArr['controls'][index]['controls'][this.form_course_description].updateValueAndValidity();
  // }
  // else{
  //   this.getCoursesArr.controls[index]['controls'][this.form_course_name]?.setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
  //   this.getCoursesArr.controls[index]['controls'][this.form_course_description]?.setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
  // }

  // })
  // }
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
      data: dialogDetails,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.getCertificationsArr.length && this.removeArr1) {
          this.getCertificationsArr.removeAt(this.currentDeleteIndex);
        }
        if (this.getawardsArr.length && this.removeArr2) {
          this.getawardsArr.removeAt(this.currentDeleteIndex);
        }
        if (this.getJournalEntryArr.length && this.removeArr3) {
          this.getJournalEntryArr.removeAt(this.currentDeleteIndex);
        }
        if (this.getassesmentArr.length && this.removeArr4) {
          this.getassesmentArr.removeAt(this.currentDeleteIndex);
          if (this.getassesmentArr.length == 0) {
            this.accomplishmentsForm.controls[this.form_isassesment].setValue(
              false
            );
            // localStorage.setItem('checkboxvalue', 'false');
          }
        }
        // if(this.getCoursesArr.length && this.removeArr5){
        //   this.getCoursesArr.removeAt(this.currentDeleteIndex );
        // }
      }
    });
  }
  removeData(i, removeArr) {
    if (removeArr == 'certification') {
      this.removeArr1 = true;
      this.currentDeleteIndex = i;
    }
    if (removeArr == 'awards') {
      this.removeArr2 = true;
      this.currentDeleteIndex = i;
    }
    if (removeArr == 'journalEntry') {
      this.removeArr3 = true;
      this.currentDeleteIndex = i;
    }

    if (removeArr == 'assessments') {
      this.removeArr4 = true;
      this.currentDeleteIndex = i;
    }

    // if(removeArr == "courses"){
    //   this.removeArr5=true;
    //   this.currentDeleteIndex = i

    // }
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to delete?',
        componentData: '',
        type: 'delete',
        identity: 'logout',
      },
      showConfirm: 'Ok',
      showCancel: 'Cancel',
      showOk: '',
    };
    this.openDialog(ModalBoxComponent, data);
  }

  // removeCertificationsArray(i) {
  //   this.getCertificationsArr.removeAt(i);
  // }

  // addToCertifications() {
  // if(this.getCertificationsArr.length == 0){
  //   if (this.accomplishmentsForm) {
  //     return this.getCertificationsArr.push(this.initCertificationsArray());
  //    }
  //    this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray);
  // }

  // }

  addToCertifications() {
    if (this.getCertificationsArr.length === 0) {
      if (this.accomplishmentsForm) {
        this.getCertificationsArr.push(this.initCertificationsArray());
      }
    } else {
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([
          this.form_certificationsArray,
        ]) as FormArray
      );
    }

    // Scroll to the last added container after a slight delay
    setTimeout(() => {
      const containerId =
        'certificationContainer' +
        (this.getCertificationsArr.controls.length - 1);
      const element = document.getElementById(containerId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  addMoreCertifications() {
    if (
      this.getCertificationsArr.valid &&
      this.getCertificationsArr.length > 0
    ) {
      this.setCertificationArrValidation();

      return this.getCertificationsArr.push(this.initCertificationsArray());
    }
    this.glovbal_validators.validateAllFormArrays(
      this.accomplishmentsForm.get([this.form_certificationsArray]) as FormArray
    );
  }

  addToawards() {
    if (this.getawardsArr.length === 0) {
      this.getawardsArr.push(this.initawardsArray());
    } else {
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray
      );
    }

    // Scroll to the last added container after a slight delay
    setTimeout(() => {
      const containerId =
        'awardsContainer' + (this.getawardsArr.controls.length - 1);
      const element = document.getElementById(containerId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  addMoreAwards() {
    if (this.getawardsArr.valid) {
      this.setAwardArrValidation();
      return this.getawardsArr.push(this.initawardsArray());
    }
    this.glovbal_validators.validateAllFormArrays(
      this.accomplishmentsForm.get([this.form_awardsArray]) as FormArray
    );
  }

  addToassesment(event: any) {
    this.checkboxevent = event.checked;
    // localStorage.setItem('checkboxvalue', this.checkboxevent);
    if (event.checked) {
      if (this.getassesmentArr.length === 0) {
        this.getassesmentArr.push(this.initassesmentArray());
        this.assessmentChecked.push(true); // Push the initial checked state as true
        console.log('length'); 
      }
      // this.glovbal_validators.validateAllFormArrays(
      //   this.accomplishmentsForm.get([this.form_assesmentArray]) as FormArray
      // );
    } else {
      if (this.getassesmentArr.length > 0) {
        // this.getassesmentArr.removeAt(this.getassesmentArr.length - 1);
        // this.assessmentChecked.pop(); // Remove the last checked state

        this.getassesmentArr.clear();
        this.assessmentChecked = []; // Reset the assessmentChecked array
        console.log('no length');
        
      }
    }
  }

  addMoreAssesments() {
    if (this.getassesmentArr.valid) {
      //this.setAssesmentArrValidation();
      return this.getassesmentArr.push(this.initassesmentArray());
    }
    this.glovbal_validators.validateAllFormArrays(
      this.accomplishmentsForm.get([this.form_assesmentArray]) as FormArray
    );
  }

  // removeawardsArray(i) {
  //   this.getawardsArr.removeAt(i);
  // }

  // addToJournalEntry() {
  //   if (this.getJournalEntryArr.length == 0) {
  //    return this.getJournalEntryArr.push(this.initJournalEntryArray());
  //   }
  //   this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray);
  // }

  addToJournalEntry() {
    if (this.getJournalEntryArr.length === 0) {
      this.getJournalEntryArr.push(this.initJournalEntryArray());
    } else {
      this.glovbal_validators.validateAllFormArrays(
        this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray
      );
    }

    // Scroll to the last added container after a slight delay
    setTimeout(() => {
      const containerId =
        'journalEntryContainer' + (this.getJournalEntryArr.controls.length - 1);
      const element = document.getElementById(containerId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  addMoreJournalEntry() {
    if (this.getJournalEntryArr.valid && this.getJournalEntryArr.length > 0) {
      this.setjournalArrValidation();
      return this.getJournalEntryArr.push(this.initJournalEntryArray());
    }
    this.glovbal_validators.validateAllFormArrays(
      this.accomplishmentsForm.get([this.form_journalEntryArray]) as FormArray
    );
  }
  // addToCourses(){
  //   if (this.getCoursesArr.length == 0) {
  //     return this.getCoursesArr.push(this.initCourseArray());
  //    }
  //    this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_CoursesArray]) as FormArray);
  // }

  // addMoreCourses(){
  //   if (this.getCoursesArr.valid  && this.getCoursesArr.length > 0 ) {
  //     this.setCoursesArrValidation();
  //     return this.getCoursesArr.push(this.initCourseArray());
  //    }
  //    this.glovbal_validators.validateAllFormArrays(this.accomplishmentsForm.get([this.form_CoursesArray]) as FormArray);
  // }
  ngOnDestroy() {
    this.sendPopupResultSubscription
      ? this.sendPopupResultSubscription.unsubscribe()
      : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription
      ? this.joiningFormDataPassingSubscription.unsubscribe()
      : '';
    this.newSaveProfileDataSubscription
      ? this.newSaveProfileDataSubscription.unsubscribe()
      : '';
  }

  onCertificationChange(event: any, i: number) {
    // const flag = event.value;
    // localStorage.setItem(`lntCertificationFlag_${i}`, flag);

    if (event.value === '1') {
      this.getCertificationsArr.controls[i]['controls'][
        this.form_certification_issuedFrom
      ].setValue('L&T EduTech');
      this.isIssuedFromDisabled = true;
    }
    this.onchangeCert(i, event.value);
  }

  getCertificationFlag(i: number): string {
    const storedFlag = localStorage.getItem(`lntCertificationFlag_${i}`);
    return storedFlag !== null ? storedFlag : '1';
  }

  hasStoredFlag(i: number): boolean {
    return localStorage.getItem(`lntCertificationFlag_${i}`) !== null;
  }

  onchangeCert(i, type) {
    this.getCertificationsArr.controls[i]['controls'][
      this.form_certification_name
    ].setValue(null);
    this.getCertificationsArr.controls[i]['controls'][
      this.form_certification_issuedFrom
    ].setValue(type == '1' ? 'L&T Edutech' : null);
    this.getCertificationsArr.controls[i]['controls'][
      this.form_certification_description
    ].setValue(null);
    this.getCertificationsArr.controls[i]['controls'][
      this.form_certification_validityFrom
    ].setValue(null);
    this.getCertificationsArr.controls[i]['controls'][
      this.form_certification_validityUpto
    ].setValue(null);
    this.getCertificationsArr.controls[i]['controls'][
      this.form_isexpire
    ].setValue(null);
  }
  createCertificationFormGroup(): FormGroup {
    return this.formBuilder.group({
      // selectedCertification: ['1'],
      certificationName: ['', Validators.required],
      issuedFrom: ['LnTeduTech', Validators.required],
      // Add other form controls for the section
    });
  }

  fetchCertifications(getCourseToken: any) {
    this.skillexService.geteduTechCourses().subscribe(
      (response: any) => {
        this.certifications = response && response.data ? response.data : [];
      },
      (error) => {}
    );
  }
  getassessmentData() {
    this.skillexService.getassesment({}).subscribe((assessdata: any) => {
      if (assessdata.success) {
        this.assesmentList =
          assessdata && assessdata.data ? assessdata.data : [];
      } else {
        this.appConfig.error(assessdata.message);
      }
    });
  }

  // clearSelection(certificationSelect: MatSelect): void {
  //   certificationSelect.value = null;
  // }

  // getCourseName(courseId: string): string {
  //   const course = this.certifications.find((c) => c.courseId === courseId);
  //   return course ? course.courseName : '';
  // }

  // clearCertification(i: number) {
  //   this.getCertificationsArr.controls[i]
  //     .get(this.form_certification_name)
  //     .setValue(null);
  // }
}
