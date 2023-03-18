import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { AfterViewInit, Component, OnDestroy, OnInit , ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as  moment from 'moment';
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
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
// import { AdminServiceService } from 'src/app/services/admin-service.service';


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
  selector: 'app-joining-work-details',
  templateUrl: './joining-work-details.component.html',
  styleUrls: ['./joining-work-details.component.scss'],
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
export class GeneralJoiningWorkDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('confirmDialog', { static: false }) matDialogRef: TemplateRef<any>;
  currentDeleteIndex:number  ;
  currentIndex=0;
  public selection: string;
  removeArr1: boolean = false;
  removeArr2: boolean = false;
  removeArr3: boolean = false;


  // getSkillSelection='noviceselected';
  panelOpenState = false;
  workDetailsForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  selected:String='Novice';
  backgroundColor: string = 'white';
  // form_anyWorkExp = 'anyWorkExp';
  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: '1'
    },
    {
      label: 'No',
      value: '0'
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: '1'
    },
    {
      label: 'Inactive',
      value: '0'
    }
  ];
  //form Variables
  form_workDetails = "workDetails";
  form_total_exp_years = "total_exp_years";
  form_total_exp_months = "total_exp_months";
  form_break_in_emp = "break_in_emp";
  form_employed_us = "employed_us";
  form_oc = "oc";
  form_isWorkingHere = "is_working_here";
  form_payslip = "payslip";
  form_interviewed_by_us = "interviewed_by_us";
  form_post = "post";
  // form_when_interview = "when_interview"
  form_employment_name_address = "employment_name_address";
  form_duration_from = "duration_from";
  form_duration_to = "duration_to";
  form_achievement = "achievement"
  form_postion_field = "postion_field";
  form_name_designation_supervisor = "name_designation_supervisor";
  form_nature_work = "nature_work";
  form_gross_emploment = "gross_emploment";
  form_reason_leaving = "reason_leaving";
  form_hr_name = 'hr_name';
  form_hr_contact_no = 'hr_contact_no';
  form_hr_email = 'hr_email';
  // form_bgvDetails = "bgvDetails";
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

  form_Employment_Array = "employment";
  form_Skills_Array = "skills";
  form_Skill = "skill";
  form_skilllevel_selected = "skilllevel_selected"
  form_Relatives_Array = "relatives_in_company";
  form_relatives_name = "name";
  form_relatives_position = "position";
  form_relatives_relationship = "relationship";
  form_relatives_company = "company";
  // form_faculty_reference = "faculty_reference";
  // form_faculty_reference_1 = "faculty_reference1";

  form_is_training_status = "is_intern_status";
  form_training_Array = "intern";
  form_training_employer_name = "employer_name";
  form_training_from_date = "from_date";
  form_training_to_date = "to_date";
  form_training_work_responsiability = "work_responsiability";

  // form_training_is_articleship_status = "is_articleship_status";
  // form_ca_dateofcompletion = "ca_dateofcompletion";
  form_ca_achivement = "ca_achivement";
  form_is_ca_resaon_suitable = "ca_resaon_suitable";

  workDetails: any;
  form_isWorkExp = "is_anywork_exp";
 currentindexEmp = 0;
  form_anyWorkExp = new FormControl(null);
  isRelatives = new FormControl(null);
  workDetailsAllData: any;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  customerName: any;
  skillandLevel: string;
check: any;
  workSkill: any;
  expChange: boolean;

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

  ngOnInit() {
    this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialize();
    this.getWorkApiDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
    this.check = this.getEmploymentArr.controls[this.getEmploymentArr.controls.length-1].value.is_working_here

  }


  changeInTrainingExp(event,index){
    if(event.value == 'true'){
      // this.getEducationArr['controls'][index]['controls'][this.form_gap_reason].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      // this.getEducationArr['controls'][index]['controls'][this.form_gap_reason].updateValueAndValidity();
    }else{
      // this.getEducationArr['controls'][index]['controls'][this.form_gap_reason].setValue(null)
      // this.getEducationArr['controls'][index]['controls'][this.form_gap_reason].setValidators([this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      // this.getEducationArr['controls'][index]['controls'][this.form_gap_reason].updateValueAndValidity();
    }
  }
  // changeInTrainingExp(e) {
  //   if (e.value == '1') {
  //     // this.workDetailsForm['controls'][this.form_ca_dateofcompletion].clearValidators();
  //     // this.workDetailsForm['controls'][this.form_ca_dateofcompletion].updateValueAndValidity();
  //   }
  //   if (e.value == '0') {
  //     // this.workDetailsForm['controls'][this.form_ca_dateofcompletion].setValidators([Validators.required]);
  //     // this.workDetailsForm['controls'][this.form_ca_dateofcompletion].updateValueAndValidity();
  //   }
  // }

  ngAfterViewInit() {
    this.showStepper();
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getWorkApiDetails();
     });
   }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('work');
  }

  getWorkApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.workDetails = this.candidateService.getLocalexperience_details();
      this.workDetailsAllData = this.candidateService.getLocalexperience_details();
      this.workDetails ? this.ifworkDetails() : this.ifNotworkDetails();
    } else {
      // let apiData = {
      //   form_name: 'joining',
      //   section_name: ''
      // }
      // this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
      //   this.candidateService.saveAllProfileToLocal(data);
      //   this.workDetails = this.candidateService.getLocalexperience_details();
      //   this.workDetailsAllData = this.candidateService.getLocalexperience_details();
      //   this.workDetails ? this.ifworkDetails() : this.ifNotworkDetails();
      // });
    }
  }

  ifworkDetails() {
    let work = {
      workDetails: this.workDetails && this.workDetails.work_details ? this.workDetails.work_details : null,
      employment: this.workDetails && this.workDetails.employments ? this.workDetails.employments : [],
      intern: this.workDetails && this.workDetails.intern ? this.workDetails.intern : [],
      // bgvDetails: this.workDetails && this.workDetails.bgv_details ? this.workDetails.bgv_details : null,
    }

          // this.workDetailsForm['controls'][this.form_training_is_articleship_status].setValue('1');
    // console.log(this.workDetails['is_anywork_exp'] ,'this.workDetail,,,,,,,,,')
    // this.workDetailsForm['controls'][this.form_isWorkExp].setValue(this.workDetails && this.workDetails['is_anywork_exp'] && this.workDetails['is_anywork_exp'] == 'true' ? 'true' : 'false');
    this.workDetails = work;
    this.patchWorkForm();
  }
  ifNotworkDetails() {
    this.workDetails = null;
    this.getEmploymentArr.push(this.initEmploymentArray());
    this.getTrainingArr.push(this.initTrainingArray());
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

  patchWorkForm() {
    // if (this.workDetails && this.workDetails.bgvDetails) {
    //   this.OtherConditionsPatch(this.workDetails.bgvDetails);
    // }

    if (this.workDetails && this.workDetails.workDetails) {
      this.OtherDetailsPatch(this.workDetails.workDetails);
    }
    //workdetails
    if (this.workDetails && this.workDetails.employment && this.workDetails.employment.length > 0) {
      this.getEmploymentArr.clear();
      this.workDetails.employment.forEach((element) => {
        this.getEmploymentArr.push(this.EmploymentArrayPatch(element));
      });
    } else {
      this.getEmploymentArr.push(this.initEmploymentArray());
    }
    //training
    // let internArray = this.workDetailsAllData[this.form_training_Array] ? this.workDetailsAllData[this.form_training_Array] : [];
    if (this.workDetails && this.workDetails.intern && this.workDetails.intern.length > 0) {
      this.getTrainingArr.clear();
      this.workDetails.intern.forEach((element) => {
        this.getTrainingArr.push(this.TrainingArrayPatch(element));
      });
    }else {
        this.getTrainingArr.push(this.initTrainingArray());
      }

    //skillarray
    if (this.workDetailsAllData && this.workDetailsAllData[this.form_Skills_Array] && this.workDetailsAllData[this.form_Skills_Array].length > 0) {
      this.getSkillsArr.clear();
      this.workDetailsAllData[this.form_Skills_Array].forEach((element, i) => {
        // console.log(this.getSkillsArr,'element');
        element ? this.getSkillsArr.push(this.SkillsArrayPatch(element,i,)) : '';
      });
    }

    // if (this.workDetailsAllData && this.workDetailsAllData.relatives_in_company && this.workDetailsAllData.relatives_in_company.length > 0) {
    //   this.getRelativesArr.clear();
    //   this.isRelatives.setValue(true);
    //   this.workDetailsAllData.relatives_in_company.forEach(element => {
    //     element ? this.getRelativesArr.push(this.RelativesArrayPatch(element)) : '';
    //   });
    // }

    this.workDetailsForm.patchValue({
      // [this.form_faculty_reference]: this.workDetailsAllData['faculty_references'] && this.workDetailsAllData['faculty_references'][0] ? this.workDetailsAllData['faculty_references'][0] : null,
      // [this.form_faculty_reference_1]: this.workDetailsAllData['faculty_references'] && this.workDetailsAllData['faculty_references'][1] ? this.workDetailsAllData['faculty_references'][1] : null,
      // [this.form_training_is_articleship_status]: this.workDetailsAllData[this.form_training_is_articleship_status] == 0 ? '0' : '1',
      // [this.form_ca_dateofcompletion]: this.workDetailsAllData[this.form_ca_dateofcompletion] ? this.dateConvertion(this.workDetailsAllData[this.form_ca_dateofcompletion]) : null,
      // [this.form_ca_achivement]: this.workDetailsAllData[this.form_ca_achivement],
      // [this.form_is_ca_resaon_suitable]: this.workDetailsAllData[this.form_is_ca_resaon_suitable],
      [this.form_is_training_status]:( this.workDetailsAllData[this.form_is_training_status] && this.workDetailsAllData[this.form_is_training_status] == true)  ? 'true' : 'false' ,
      [this.form_isWorkExp]:( this.workDetailsAllData[this.form_isWorkExp] && this.workDetailsAllData[this.form_isWorkExp] == true)  ? 'true' : 'false' ,
    });
    this.setArticleshipArrValidation();
    this.setEmploymentArrValidation();
  }

  // OtherConditionsPatch(data) {
  //   this.workDetailsForm.patchValue({
  //     [this.form_convicted_by_Court]: data[this.form_convicted_by_Court] && data[this.form_convicted_by_Court] == '1' ? true : false,
  //     [this.form_arrested]: data[this.form_arrested] && data[this.form_arrested] == '1' ? true : false,
  //     [this.form_prosecuted]: data[this.form_prosecuted] && data[this.form_prosecuted] == '1' ? true : false,
  //     [this.form_detention]: data[this.form_detention] && data[this.form_detention] == '1' ? true : false,
  //     [this.form_fined_by_court]: data[this.form_fined_by_court] && data[this.form_fined_by_court] == '1' ? true : false,
  //     [this.form_debarred_exam_university]: data[this.form_debarred_exam_university] && data[this.form_debarred_exam_university] == '1' ? true : false,
  //     [this.form_debarred_psc_company]: data[this.form_debarred_psc_company] && data[this.form_debarred_psc_company] == '1' ? true : false,
  //     [this.form_court_case_pending]: data[this.form_court_case_pending] && data[this.form_court_case_pending] == '1' ? true : false,
  //     [this.form_university_case_pending]: data[this.form_university_case_pending] && data[this.form_university_case_pending] == '1' ? true : false,
  //     [this.form_disciplinary_proceedings]: data[this.form_disciplinary_proceedings] && data[this.form_disciplinary_proceedings] == '1' ? true : false,
  //     [this.form_full_particulars]: data[this.form_full_particulars],

  //   });
  //   this.requiredDesc();
  // }

  OtherDetailsPatch(data) {
    this.workDetailsForm.patchValue({
      [this.form_total_exp_years]: data[this.form_total_exp_years],
      [this.form_total_exp_months]: data[this.form_total_exp_months],
      // [this.form_name_designation_supervisor]:  data[this.form_name_designation_supervisor],
      // [this.form_nature_work]: data[this.form_nature_work],
      // [this.form_gross_emploment]:  data[this.form_gross_emploment],
      // [this.form_reason_leaving]:  data[this.form_reason_leaving],
      // [this.form_isWorkExp]: [(data[this.form_isWorkExp] && data[this.form_isWorkExp] == 'true')  ? 'true' : 'false' ],
      // [this.form_break_in_emp]: data[this.form_break_in_emp],
      // [this.form_employed_us]: data[this.form_employed_us] && data[this.form_employed_us] == '1' ? '1' : '0',
      // [this.form_oc]: data[this.form_oc],
      // [this.form_payslip]: data[this.form_payslip],
      // [this.form_interviewed_by_us]: data[this.form_interviewed_by_us] && data[this.form_interviewed_by_us] == '1' ? '1' : '0',
      // [this.form_post]: data[this.form_post],
      // [this.form_when_interview]: this.dateConvertion(data[this.form_when_interview])
    });
    // this.requiredValidator(data[this.form_employed_us] && data[this.form_employed_us] == '1' ? '1' : '0', this.form_oc, this.form_payslip);
    // this.requiredValidator(data[this.form_interviewed_by_us] && data[this.form_interviewed_by_us] == '1' ? '1' : '0', this.form_post, this.form_when_interview);
    }
    TrainingArrayPatch(data) {
      return this.fb.group({
        [this.form_training_employer_name]: [data[this.form_training_employer_name],[Validators.required]],
        [this.form_training_from_date]: [data[this.form_training_from_date],[Validators.required] ],
        [this.form_training_to_date]: [data[this.form_training_to_date],[Validators.required]],
        [this.form_training_work_responsiability]: [data[this.form_training_work_responsiability],[Validators.required] ],
      })
    }
  EmploymentArrayPatch(data) {
    return this.fb.group({
      [this.form_employment_name_address]: [data[this.form_employment_name_address],[Validators.required]],
      [this.form_duration_from]: [this.dateConvertion(data[this.form_duration_from]) , [Validators.required]],
      [this.form_duration_to]: [data[this.form_duration_to],(data[this.form_duration_to] && (data[this.form_isWorkingHere] == false))  ? [Validators.required] : data[this.form_duration_to],(data[this.form_duration_to] && (data[this.form_isWorkingHere] == true))  ? [] : []],

      // [this.form_duration_to]: [this.dateConvertion(data[this.form_duration_to]) , [Validators.required]],setValue(null)
      [this.form_achievement]: [data[this.form_achievement], [Validators.required]],
      [this.form_isWorkingHere]: [data[this.form_isWorkingHere]],
      [this.form_postion_field]: [data[this.form_postion_field], [Validators.required]],
      [this.form_hr_contact_no]: [data[this.form_hr_contact_no], [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_hr_email]: [data[this.form_hr_email], [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      [this.form_hr_name]: [data[this.form_hr_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      // [this.form_duration_year]: [data[this.form_duration_year]],
      // [this.form_duration_month]: [data[this.form_duration_month]],
      // [this.form_name_designation_supervisor]: [data[this.form_name_designation_supervisor], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_nature_work]: [data[this.form_nature_work], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_gross_emploment]: [data[this.form_gross_emploment], [RemoveWhitespace.whitespace(), this.glovbal_validators.address50()]],
      // [this.form_reason_leaving]: [data[this.form_reason_leaving], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.isWorkExp]:[ (data[this.isWorkExp] && data[this.isWorkExp] == true)  ? true : false ],
      // [this.form_isWorkExp]:[ (data[this.form_isWorkExp] && data[this.form_isWorkExp] == 'true')  ? 'true' : 'false' ],
    },
      // { validator: FormCustomValidators.WorkanyOneSelectedInJoiningForm }
    )
  }

  initTrainingArray() {
    return this.fb.group({
      [this.form_training_employer_name]: [null, [ RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_training_from_date]: [null],
      [this.form_training_to_date]: [null],
      [this.form_training_work_responsiability]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]]
    })
  }

  initEmploymentArray() {
    return this.fb.group({
      [this.form_employment_name_address]: [null,[Validators.required]],
      [this.form_duration_from]: [null,[Validators.required]],
      [this.form_duration_to]:[null,[Validators.required]],
      [this.form_hr_contact_no]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_hr_email]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      [this.form_hr_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_postion_field]: [null,[Validators.required]],
      [this.form_achievement]: [null,[Validators.required]],
      [this.form_isWorkingHere]:[false],
      // [this.form_duration_year]: [null],
      // [this.form_duration_month]: [null],
      // [this.form_name_designation_supervisor]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_nature_work]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_reason_leaving]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_anyWorkExp]:[null],
    },
      // { validator: FormCustomValidators.WorkanyOneSelectedInJoiningForm }
    )

  }

  initSkillsArray() {
    return this.fb.group({
      [this.form_Skill]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.skills255()]],
      [this.form_skilllevel_selected]: ['Novice', [RemoveWhitespace.whitespace()]]
    })
  }


  SkillsArrayPatch(data,i) {
    // this.workSkill = this.getSkillsArr.controls[0].value.skill
    if(data && data.skill){
      return this.fb.group({
        [this.form_Skill]: [data [this.form_Skill], [RemoveWhitespace.whitespace(), this.glovbal_validators.skills255()]],
        [this.form_skilllevel_selected]: [data[this.form_skilllevel_selected], [RemoveWhitespace.whitespace(), this.glovbal_validators.skills255()]],
      })
    }else {
      return this.fb.group({
        [this.form_Skill]: [data [this.form_Skill], [RemoveWhitespace.whitespace(), this.glovbal_validators.skills255()]],
      })
    }
  }

  // initRelativesArray() {
  //   return this.fb.group({
  //     [this.form_relatives_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //     [this.form_relatives_relationship]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //     [this.form_relatives_position]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //     [this.form_relatives_company]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //   })
  // }

  // RelativesArrayPatch(data) {
  //   return this.fb.group({
  //     [this.form_relatives_name]: [data[this.form_relatives_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //     [this.form_relatives_relationship]: [data[this.form_relatives_relationship], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //     [this.form_relatives_position]: [data[this.form_relatives_position], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //     [this.form_relatives_company]: [data[this.form_relatives_company], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
  //   })
  // }

  workExperienceChange(event){
    if(event.value == 'true'){
      this.expChange = true
      if(this.getEmploymentArr.length == 0){
        this.workDetailsForm.controls[this.form_total_exp_years].setValidators([Validators.required, Validators.maxLength(2), this.glovbal_validators.numberOnly()]);
      this.workDetailsForm.controls[this.form_total_exp_months].setValidators([Validators.required, Validators.maxLength(2), this.glovbal_validators.numberOnly()]);
        this.getEmploymentArr.controls[0]['controls'][this.form_employment_name_address].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
        this.getEmploymentArr.controls[0]['controls'][this.form_postion_field].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
        this.getEmploymentArr.controls[0]['controls'][this.form_achievement].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
        this.getEmploymentArr.controls[0]['controls'][this.form_duration_from].setValidators([Validators.required],{ emitEvent: false });
        this.getEmploymentArr.controls[0]['controls'][this.form_duration_to].setValidators([Validators.required],{ emitEvent: false });
      }
      this.setEmploymentArrValidation()

      // this.getEmploymentArr.clear();
      // this.getEmploymentArr.push(this.initEmploymentArray());
    }
    if(event.value == 'false'){
      this.expChange = false

      if(this.getEmploymentArr.length > 0){
        this.setEmploymentArrValidation()
        this.workDetailsForm.controls[this.form_total_exp_years].setValue(null);
      this.workDetailsForm.controls[this.form_total_exp_months].setValue(null);
        this.workDetailsForm.controls[this.form_total_exp_years].clearValidators();
        this.workDetailsForm.controls[this.form_total_exp_months].clearValidators();
           this.workDetailsForm['controls'][this.form_total_exp_years].updateValueAndValidity();
        this.workDetailsForm['controls'][this.form_total_exp_months].updateValueAndValidity();
        }
    }
  }

  setEmploymentArrValidation(){
    this.getEmploymentArr.controls.forEach((data, i) => {

    if(this.workDetailsForm.controls[this.form_isWorkExp].value == 'true' && this.expChange == true){
      // this.workDetailsForm.controls[this.form_total_exp_years].setValidators([Validators.required,this.glovbal_validators.alphaNum255()]);
      // this.workDetailsForm.controls[this.form_total_exp_months].setValidators([Validators.required,this.glovbal_validators.alphaNum255()]);
      this.getEmploymentArr.controls[i]['controls'][this.form_employment_name_address].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getEmploymentArr.controls[i]['controls'][this.form_postion_field].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getEmploymentArr.controls[i]['controls'][this.form_achievement].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
      this.getEmploymentArr.controls[i]['controls'][this.form_duration_from].setValidators([Validators.required],{ emitEvent: false });
      this.getEmploymentArr.controls[i]['controls'][this.form_duration_to].setValidators([Validators.required],{ emitEvent: false });


      // this.workDetailsForm.controls[this.form_total_exp_years].updateValueAndValidity();
      // this.workDetailsForm.controls[this.form_total_exp_months].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_employment_name_address].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_postion_field].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_achievement].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_duration_from].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_duration_to].updateValueAndValidity();

    }
    if(this.workDetailsForm.controls[this.form_isWorkExp].value == 'false' ){

      // this.workDetailsForm.controls[this.form_total_exp_years].setValue(null);
      // this.workDetailsForm.controls[this.form_total_exp_months].setValue(null);
      this.getEmploymentArr.controls[i]['controls'][this.form_employment_name_address].setValue(null);
      this.getEmploymentArr.controls[i]['controls'][this.form_postion_field].setValue(null);
      this.getEmploymentArr.controls[i]['controls'][this.form_achievement].setValue(null);
      this.getEmploymentArr.controls[i]['controls'][this.form_duration_from].setValue(null);
      this.getEmploymentArr.controls[i]['controls'][this.form_duration_to].setValue(null);

      // this.workDetailsForm.controls[this.form_total_exp_years].clearValidators();
      // this.workDetailsForm.controls[this.form_total_exp_months].clearValidators();
      this.getEmploymentArr.controls[i]['controls'][this.form_employment_name_address].clearValidators();
      this.getEmploymentArr.controls[i]['controls'][this.form_postion_field].clearValidators();
      this.getEmploymentArr.controls[i]['controls'][this.form_achievement].clearValidators();
      this.getEmploymentArr.controls[i]['controls'][this.form_duration_from].clearValidators();
      this.getEmploymentArr.controls[i]['controls'][this.form_duration_to].clearValidators();

      // this.workDetailsForm['controls'][this.form_total_exp_years].updateValueAndValidity();
      // this.workDetailsForm['controls'][this.form_total_exp_months].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_employment_name_address].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_postion_field].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_achievement].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_duration_from].updateValueAndValidity();
      this.getEmploymentArr['controls'][i]['controls'][this.form_duration_to].updateValueAndValidity();

    }
    })
    }

    setArticleshipArrValidation(){
      this.getTrainingArr.controls.forEach((data, i) => {
      if(this.workDetailsForm.controls[this.form_is_training_status].value == 'true' && this.getTrainingArr.length){
        this.getTrainingArr.controls[i]['controls'][this.form_training_employer_name].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
        this.getTrainingArr.controls[i]['controls'][this.form_training_from_date].setValidators([Validators.required],{ emitEvent: false });
        this.getTrainingArr.controls[i]['controls'][this.form_training_to_date].setValidators([Validators.required],{ emitEvent: false });
        this.getTrainingArr.controls[i]['controls'][this.form_training_work_responsiability].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });

        this.getTrainingArr['controls'][i]['controls'][this.form_training_employer_name].updateValueAndValidity();
        this.getTrainingArr['controls'][i]['controls'][this.form_training_from_date].updateValueAndValidity();
        this.getTrainingArr['controls'][i]['controls'][this.form_training_to_date].updateValueAndValidity();
        this.getTrainingArr['controls'][i]['controls'][this.form_training_work_responsiability].updateValueAndValidity();
      }
      if(this.workDetailsForm.controls[this.form_is_training_status].value == 'false' && this.getTrainingArr.length){

        this.getTrainingArr.controls[i]['controls'][this.form_training_employer_name].setValue(null);
        this.getTrainingArr.controls[i]['controls'][this.form_training_from_date].setValue(null);
        this.getTrainingArr.controls[i]['controls'][this.form_training_to_date].setValue(null);
        this.getTrainingArr.controls[i]['controls'][this.form_training_work_responsiability].setValue(null);

        this.getTrainingArr.controls[i]['controls'][this.form_training_employer_name].clearValidators();
        this.getTrainingArr.controls[i]['controls'][this.form_training_from_date].clearValidators();
        this.getTrainingArr.controls[i]['controls'][this.form_training_to_date].clearValidators();
        this.getTrainingArr.controls[i]['controls'][this.form_training_work_responsiability].clearValidators();

        this.getTrainingArr['controls'][i]['controls'][this.form_training_employer_name].updateValueAndValidity();
        this.getTrainingArr['controls'][i]['controls'][this.form_training_from_date].updateValueAndValidity();
        this.getTrainingArr['controls'][i]['controls'][this.form_training_to_date].updateValueAndValidity();
        this.getTrainingArr['controls'][i]['controls'][this.form_training_work_responsiability].updateValueAndValidity();
      }
      })
      }
      currentWrk(e, i:number) {
        if (e.checked) {
            this.check = true
            this.getEmploymentArr.controls[this.getEmploymentArr.controls.length-1]['controls'][this.form_duration_to].setValue(null);
            this.getEmploymentArr.controls[this.getEmploymentArr.controls.length-1]['controls'][this.form_duration_to].clearValidators();
            this.getEmploymentArr.controls[this.getEmploymentArr.controls.length-1]['controls'][this.form_duration_to].updateValueAndValidity();
          }  else {

              this.check = false
              this.getEmploymentArr.controls[this.getEmploymentArr.controls.length-1]['controls'][this.form_duration_to].setValidators([Validators.required],{ emitEvent: false });
              this.getEmploymentArr.controls[this.getEmploymentArr.controls.length-1]['controls'][this.form_duration_to].updateValueAndValidity();
              // console.log(this.getEmploymentArr.controls[i]['controls'][this.form_duration_to]);
            }
          // this.check = false


        }

    addToEmploymentArray(i) {
      if (this.getEmploymentArr.valid) {
       return this.getEmploymentArr.push(this.initEmploymentArray());
      }
      this.setEmploymentArrValidation()
      this.appConfig.nzNotification('error', 'Not added', 'Please fill all the red highlighted fields to proceed further');
      // this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
    }

    addToTrainingArray() {
      if (this.getTrainingArr.valid) {
          return this.getTrainingArr.push(this.initTrainingArray());
      }
      this.setArticleshipArrValidation()
        this.appConfig.nzNotification('error', 'Not Saved', 'Please evaluate the red highlighted fields in the Training Details');
        this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_training_Array]) as FormArray);
    }

changeInIsArticleship(event){
  // console.log(this.getTrainingArr.controls[this.form_training_employer_name]);
  if(event.value == 'true'){
    this.getTrainingArr.controls[0]['controls'][this.form_training_employer_name].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
    this.getTrainingArr.controls[0]['controls'][this.form_training_from_date].setValidators([Validators.required],{ emitEvent: false });
    this.getTrainingArr.controls[0]['controls'][this.form_training_to_date].setValidators([Validators.required],{ emitEvent: false });
    this.getTrainingArr.controls[0]['controls'][this.form_training_work_responsiability].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
  }if(event.value == 'false'){
    this.getTrainingArr.clear();
    return this.getTrainingArr.push(this.initTrainingArray());
    // this.getTrainingArr['controls'][this.form_training_employer_name].setValue(null)
    // this.getTrainingArr['controls'][this.form_training_from_date].setValue(null)
    // this.getTrainingArr['controls'][this.form_training_to_date].setValue(null)
    // this.getTrainingArr['controls'][this.form_training_work_responsiability].setValue(null)

    // this.getTrainingArr['controls'][this.form_training_employer_name].setValidators([this.glovbal_validators.alphaNum255()],{ emitEvent: false });
    // this.getTrainingArr['controls'][this.form_training_from_date].setValidators([this.glovbal_validators.alphaNum255()],{ emitEvent: false });
    // this.getTrainingArr['controls'][this.form_training_to_date].setValidators([this.glovbal_validators.alphaNum255()],{ emitEvent: false });
    // this.getTrainingArr['controls'][this.form_training_work_responsiability].setValidators([this.glovbal_validators.alphaNum255()],{ emitEvent: false });

    // this.getTrainingArr['controls'][this.form_training_employer_name].updateValueAndValidity();
    // this.getTrainingArr['controls'][this.form_training_from_date].updateValueAndValidity();
    // this.getTrainingArr['controls'][this.form_training_to_date].updateValueAndValidity();
    // this.getTrainingArr['controls'][this.form_training_work_responsiability].updateValueAndValidity();
  }
}


  formInitialize() {
    this.workDetailsForm = this.fb.group({
      [this.form_Employment_Array]: this.fb.array([]),
      [this.form_Skills_Array]: this.fb.array([]),
      [this.form_training_Array]: this.fb.array([]),
      [this.form_is_training_status]: ['false'],
      [this.form_total_exp_years]: [null,[Validators.required, Validators.maxLength(2), this.glovbal_validators.numberOnly()]],
      [this.form_total_exp_months]: [null,[Validators.required, Validators.maxLength(2), this.glovbal_validators.numberOnly()]],
      [this.form_isWorkExp]: ['false'],
      // [this.form_convicted_by_Court]: [null],
      // [this.form_arrested]: [null],
      // [this.form_prosecuted]: [null],
      // [this.form_detention]: [null],
      // [this.form_fined_by_court]: [null],
      // [this.form_debarred_exam_university]: [null],
      // [this.form_debarred_psc_company]: [null],
      // [this.form_court_case_pending]: [null],
      // [this.form_university_case_pending]: [null],
      // [this.form_disciplinary_proceedings]: [null],
      // [this.form_full_particulars]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_break_in_emp]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_employed_us]: ['0'],
      // [this.form_oc]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_payslip]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_interviewed_by_us]: ['0'],
      // [this.form_post]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_when_interview]: [null],
      // [this.form_faculty_reference]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_faculty_reference_1]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_Relatives_Array]: this.fb.array([this.initRelativesArray()]),
      // [this.form_employment_name_address]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_duration_from]: [null],
      // [this.form_hr_contact_no]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      // [this.form_hr_email]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      // [this.form_hr_name]: [null, [RemoveWhitespace.whitespace(),Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_postion_field]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_achievement]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address50()]],
      // [this.isWorkExp]: new FormControl('', [Validators.required]),

      // [this.form_training_is_articleship_status]: ['1'],
      // [this.form_ca_dateofcompletion]: [null],
      // [this.form_ca_achivement]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_is_ca_resaon_suitable]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]]
    })

  }




//   addToEmploymentArray() {

//     let i = this.getEmploymentArr['controls'].length - 1;

//     if (this.getEmploymentArr.valid) {
//       if (this.getEmploymentArr && this.getEmploymentArr['controls'] && this.getEmploymentArr['controls'][i] && this.getEmploymentArr['controls'][i]['value'] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_employment_name_address] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_duration_from] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_postion_field] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_hr_contact_no] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_hr_email] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_hr_name] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_achievement]&&
//       this.getEmploymentArr['controls'][i]['value'][this.form_duration_month] &&
//       this.getEmploymentArr['controls'][i]['value'][this.form_duration_year]
//        )
//       {
//         return this.getEmploymentArr.push(this.initEmploymentArray());
//       } else {

//         this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the fields in the Employment Details');
//         this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
//       }
//     } else {
//       this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the fields in the Employment Details');
//       this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
//     }
// }



  addSkills() {
    let i = this.getSkillsArr['controls'].length - 1;
    if (this.getSkillsArr.valid && this.getSkillsArr['controls'].length < 10) {
      if (this.getSkillsArr && this.getSkillsArr['controls'] && this.getSkillsArr['controls'][i] && this.getSkillsArr['controls'][i]['value'] && this.getSkillsArr['controls'][i]['value'][this.form_Skill]) {
         this.getSkillsArr.push(this.initSkillsArray());
        this.choosen('Novice', this.getSkillsArr.length -1)
      }
    } else {
      this.appConfig.nzNotification('error', 'Not Added', 'Please fix all the red highlighted fields in the Skill Section');
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
    }
  }

  removeTrainingArray(i) {
    this.getTrainingArr.removeAt(i);
  }

  // removeEmploymentArray(i) {
  //   this.getEmploymentArr.removeAt(i);
  // }

  // removeSkillsArray(i) {
  //   this.getSkillsArr.removeAt(i);
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

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if(this.getSkillsArr.length && this.removeArr1){
            this.getSkillsArr.removeAt(this.currentDeleteIndex);
          }
          if(this.getEmploymentArr.length && this.removeArr2 ){
            this.getEmploymentArr.removeAt(this.currentDeleteIndex);
          }
          if(this.getTrainingArr.length && this.removeArr3){
            this.getSkillsArr.removeAt(this.currentDeleteIndex);
          }
        }
      });
    }
    removeData(i,removeArr) {
      if(removeArr == "skill"){
        this.removeArr1=true;
        this.currentDeleteIndex = i
      }
      if(removeArr == "employment"){
        this.removeArr2=true;
        this.currentDeleteIndex = i
      }
      if(removeArr == "training"){
        this.removeArr3=true;
        this.currentDeleteIndex = i
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

  // addRelatives() {
  //   let i = this.getRelativesArr['controls'].length - 1;
  //   if (this.getRelativesArr.valid && this.getRelativesArr['controls'].length < 3) {
  //     if (this.getRelativesArr && this.getRelativesArr['controls'] && this.getRelativesArr['controls'][i] && this.getRelativesArr['controls'][i]['value'] && this.getRelativesArr['controls'][i]['value'][this.form_relatives_name]) {
  //       return this.getRelativesArr.push(this.initRelativesArray());
  //     } else {
  //       this.appConfig.nzNotification('error', 'Not Added', 'Please fill the existing Relatives / Acquaintances section');
  //       this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
  //     }
  //   } else {
  //     this.appConfig.nzNotification('error', 'Not Added', 'Please fix all the red highlighted fields in the Relatives / Acquaintances Section');
  //     this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
  //   }
  // }

  removeRelatives(i) {
    this.getRelativesArr.removeAt(i);
  }


  // radioChange(e, form) {
  //   if (form == 1) {
  //     this.requiredValidator(e.value, this.form_oc, this.form_payslip);
  //   } else {
  //     this.requiredValidator(e.value, this.form_post, this.form_when_interview);
  //   }
  // }

  requiredValidator(value, form, form1) {
    if (value == '1') {
      this.workDetailsForm.get(form).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
      // if (form1 == this.form_when_interview) {
      //   this.workDetailsForm.get(form1).setValidators([Validators.required]), { emitEvent: false };
      // } else {
      //   this.workDetailsForm.get(form1).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
      // }
    } else {
      this.workDetailsForm.patchValue({
        [form]: null,
        [form1]: null
      });
      this.workDetailsForm.get(form).clearValidators(), { emitEvent: false };
      this.workDetailsForm.get(form1).clearValidators(), { emitEvent: false };
    }
    this.workDetailsForm.get(form).updateValueAndValidity(), { emitEvent: false };
    this.workDetailsForm.get(form1).updateValueAndValidity(), { emitEvent: false };
  }

  requiredDesc() {
    let formValues = this.workDetailsForm.getRawValue();
    // const bgvDetails = {
    //   [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
    //   [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
    //   [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
    //   [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
    //   [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
    //   [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
    //   [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
    //   [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
    //   [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
    //   [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
    //   [this.form_full_particulars]: formValues[this.form_full_particulars]
    // }
  //   if (bgvDetails[this.form_convicted_by_Court] == '1' || bgvDetails[this.form_arrested] == '1' || bgvDetails[this.form_prosecuted] == '1' || bgvDetails[this.form_detention] == '1' || bgvDetails[this.form_fined_by_court] == '1' || bgvDetails[this.form_debarred_exam_university] == '1' || bgvDetails[this.form_debarred_psc_company] == '1' || bgvDetails[this.form_court_case_pending] == '1' || bgvDetails[this.form_university_case_pending] == '1' || bgvDetails[this.form_disciplinary_proceedings] == '1') {
  //     this.workDetailsForm.get(this.form_full_particulars).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
  //   } else {
  //     this.workDetailsForm.get(this.form_full_particulars).setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]), { emitEvent: false };
  //   }
  //   this.workDetailsForm.get(this.form_full_particulars).updateValueAndValidity(), { emitEvent: false };
  }


  formSubmit(routeValue?: any) {
    // this.requiredDesc();
    // let some =  this.workDetailsForm.getRawValue()[this.form_Employment_Array];
    if (this.workDetailsForm.valid) {
      let formValues = this.workDetailsForm.getRawValue();
      const work_details = {
        [this.form_total_exp_years]: formValues[this.form_total_exp_years] ,
        [this.form_total_exp_months]:  formValues[this.form_total_exp_months] ,
        // [this.form_reason_leaving]: this.showWorkExp == '1' ? formValues[this.form_reason_leaving] : null,
        // [this.form_gross_emploment]: this.showWorkExp == '1'  ? formValues[this.form_gross_emploment] : null,
        // [this.form_nature_work]: this.showWorkExp == '1' ? formValues[this.form_nature_work] : null,
        // [this.form_name_designation_supervisor]: this.showWorkExp == '1' ? formValues[this.form_name_designation_supervisor] : null,
        // [this.form_break_in_emp]: this.showWorkExp == '1' ? formValues[this.form_break_in_emp] : null,
        // [this.form_employed_us]: formValues[this.form_employed_us] && (formValues[this.form_employed_us] == '1' || formValues[this.form_employed_us] == true) ? '1' : '0',
        // [this.form_oc]: formValues[this.form_oc],
        // [this.form_payslip]: formValues[this.form_payslip],
        // [this.form_interviewed_by_us]: formValues[this.form_interviewed_by_us] && (formValues[this.form_interviewed_by_us] == '1' || formValues[this.form_interviewed_by_us] == true) ? '1' : '0',
        // [this.form_post]: formValues[this.form_post],
        // [this.form_when_interview]: formValues[this.form_when_interview]
      };
      // const bgv_details = {
      //   [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
      //   [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
      //   [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
      //   [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
      //   [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
      //   [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
      //   [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
      //   [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
      //   [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
      //   [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
      //   [this.form_full_particulars]: formValues[this.form_full_particulars]
      // }
      const employments =  this.workDetailsForm.getRawValue()[this.form_Employment_Array];
      let intern =  this.workDetailsForm.getRawValue()[this.form_training_Array];
      let skills = this.workDetailsForm.value.skills;
      // this.workDetailsForm.getRawValue()[this.form_Skills_Array].forEach(element => {
      //   if (element && element[this.form_Skill]) {
      //     skills.push(element[this.form_Skill]);
      //   }
      // });
      // let intern = [];
    //   if (this.workDetailsForm.getRawValue()[this.form_is_training_status] || this.workDetailsForm.getRawValue()[this.form_is_training_status] == true) {
    //   this.workDetailsForm.getRawValue()[this.form_training_Array].forEach(element => {
    //     if (element && (element[this.form_training_employer_name] || element[this.form_training_from_date] || element[this.form_training_to_date] || element[this.form_training_work_responsiability])) {
    //       element[this.form_training_from_date] = element[this.form_training_from_date] ? this.momentForm(element[this.form_training_from_date]) : null;
    //       element[this.form_training_to_date] = element[this.form_training_to_date] ? this.momentForm(element[this.form_training_to_date]) : null;
    //       intern.push(element);
    //     }
    //   });
    // }
      // let faculty_reference1 = this.workDetailsForm.getRawValue()[this.form_faculty_reference];
      // let faculty_references2 = this.workDetailsForm.getRawValue()[this.form_faculty_reference_1];
      // let faculty_references = [];
      // faculty_reference1 ? faculty_references.push(faculty_reference1) : '';
      // faculty_references2 ? faculty_references.push(faculty_references2) : '';
      let apiData = {
        work_details,
        // bgv_details,
        employments,
        is_anywork_exp:this.workDetailsForm['controls'][this.form_isWorkExp].value == 'true' ? 'true' : 'false',
        is_intern_status:this.workDetailsForm['controls'][this.form_is_training_status].value == 'true' ? 'true' : 'false',
        intern,
        // [this.form_training_is_articleship_status]: this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] && this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] == '0' ? 0 : 1,
        // [this.form_ca_dateofcompletion]: (this.workDetailsForm.getRawValue()[this.form_ca_dateofcompletion] && this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] && this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] == '0') ? this.momentForm(this.workDetailsForm.getRawValue()[this.form_ca_dateofcompletion]) : null,
        // [this.form_ca_achivement]: this.workDetailsForm.getRawValue()[this.form_ca_achivement],
        // [this.form_is_ca_resaon_suitable]: this.workDetailsForm.getRawValue()[this.form_is_ca_resaon_suitable],
        skills,
        // relatives_in_company: this.workDetailsForm.getRawValue()[this.form_Relatives_Array],
        // faculty_references
      };
      const WorkExperienceApiRequestDetails = {
        email:  this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
        section_name: "experience_details",
        saving_data: apiData
      }
      this.loadingService.setLoading(true)
     this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(WorkExperienceApiRequestDetails).subscribe((data: any) => {
      this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Work Experience details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT);
      });
    } else {
      this.ngAfterViewInit();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.workDetailsForm);
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
    }
  }


  saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any) => {

      if (result.result == 'save') {
        this.formSubmit(result.route);
      }
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
      if (data.current == 'work') {
        if (!this.workDetailsForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
      if (!this.workDetailsForm.dirty) {
        if (route == 'education') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
        } else {
          if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().experience_details == '1') {
            return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT );
          } else {
            if (this.workDetailsForm.valid) {
              return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT);
            }
            this.glovbal_validators.validateAllFields(this.workDetailsForm);
            this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
            this.ngAfterViewInit();
            this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
          }
        }
      } else {
        return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT);
      }
  }



  // detectDateCalc(form, i) {
  //     let yearCount = 0;
  //     let monthCount = 0;
  //     let element = form.value;
  //     if (element[this.form_duration_from] && element[this.form_duration_to]) {
  //       let eventStartTime = new Date(`${this.momentForm1(element[this.form_duration_from])}`);
  //       let eventEndTime = new Date(`${this.momentForm1(element[this.form_duration_to])}`);
  //       let m = moment(eventEndTime);
  //       let years = m.diff(eventStartTime, 'years');
  //       m.add(-years, 'years');
  //       let months = m.diff(eventStartTime, 'months');
  //       m.add(-months, 'months');
  //       let days = m.diff(eventStartTime, 'days');

  //       // this.getEmploymentArr.at(i).patchValue({
  //       //     [this.form_duration_month]: months,
  //       //     [this.form_duration_year]: years
  //       // });

  //       //   this.getEmploymentArr.getRawValue().forEach(ele => {
  //       //   monthCount += Number(ele[this.form_duration_month] ? ele[this.form_duration_month] : 0);
  //       //   yearCount += Number(ele[this.form_duration_year] ? ele[this.form_duration_year] : 0);
  //       //   if (monthCount > 12) {
  //       //     let y; let m;
  //       //     y = Math.floor(monthCount / 12);
  //       //     m = monthCount % 12;
  //       //     this.workDetailsForm.patchValue({
  //       //       [this.form_total_exp_years]: yearCount + y,
  //       //       [this.form_total_exp_months]: m
  //       //     })
  //       //   } else {
  //       //     this.workDetailsForm.patchValue({
  //       //       [this.form_total_exp_years]: yearCount,
  //       //       [this.form_total_exp_months]: monthCount
  //       //     })
  //       //   }
  //       // });

  //     }
  // }

  // Form getters
  // convenience getters for easy access to form fields
  get getRelativesArr() { return this.workDetailsForm.get([this.form_Relatives_Array]) as FormArray; }

  get getSkillsArr() { return this.workDetailsForm.get([this.form_Skills_Array]) as FormArray; }

   getSkillSelection(i) { return this.getSkillsArr.controls[i].value[this.form_skilllevel_selected]}

  get getEmploymentArr() { return this.workDetailsForm.get([this.form_Employment_Array]) as FormArray; }

  get getTrainingArr() { return this.workDetailsForm.get([this.form_training_Array]) as FormArray; }

  // get faculty_reference_1() {
  //   return this.workDetailsForm.get(this.form_faculty_reference_1);
  // }

  // get convicted_by_Court() {
  //   return this.workDetailsForm.get(this.form_convicted_by_Court);
  // }
  // get arrested() {
  //   return this.workDetailsForm.get(this.form_arrested);
  // }
  // get prosecuted() {
  //   return this.workDetailsForm.get(this.form_prosecuted);
  // }
  // get detention() {
  //   return this.workDetailsForm.get(this.form_detention);
  // }
  // get fined_by_court() {
  //   return this.workDetailsForm.get(this.form_fined_by_court);
  // }
  // get debarred_exam_university() {
  //   return this.workDetailsForm.get(this.form_debarred_exam_university);
  // }
  // get debarred_psc_company() {
  //   return this.workDetailsForm.get(this.form_debarred_psc_company);
  // }
  // get court_case_pending() {
  //   return this.workDetailsForm.get(this.form_court_case_pending);
  // }
  // get university_case_pending() {
  //   return this.workDetailsForm.get(this.form_university_case_pending);
  // }
  // get disciplinary_proceedings() {
  //   return this.workDetailsForm.get(this.form_disciplinary_proceedings);
  // }
  // get full_particulars() {
  //   return this.workDetailsForm.get(this.form_full_particulars);
  // }
  get total_exp_years() {
    return this.workDetailsForm.get(this.form_total_exp_years);
  }
  get total_exp_months() {
    return this.workDetailsForm.get(this.form_total_exp_months);
  }
  get employment_name_address() {
    return this.workDetailsForm.get(this.form_employment_name_address);
  }

  get duration_from() {
    return this.workDetailsForm.get(this.form_duration_from);
  }get duration_to() {
    return this.workDetailsForm.get(this.form_duration_to);
  }

  get postion_field() {
    return this.workDetailsForm.get(this.form_postion_field);
  }get achievement() {
    return this.workDetailsForm.get(this.form_achievement);
  }get nature_work() {
    return this.workDetailsForm.get(this.form_nature_work);
  }
  get is_anywork_exp() {
    return this.workDetailsForm.get(this.form_isWorkExp);
  }
  get gross_emploment() {
    return this.workDetailsForm.get(this.form_gross_emploment);
  }get reason_leaving() {
    return this.workDetailsForm.get(this.form_reason_leaving);
  }get hr_contact_no() {
    return this.workDetailsForm.get(this.form_hr_contact_no);
  }get hr_email() {
    return this.workDetailsForm.get(this.form_hr_email);
  }get hr_name() {
    return this.workDetailsForm.get(this.form_hr_name);
  }
  // get employed_us() {
  //   return this.workDetailsForm.get(this.form_employed_us);
  // }
  // get oc() {
  //   return this.workDetailsForm.get(this.form_oc);
  // }
  // get payslip() {
  //   return this.workDetailsForm.get(this.form_payslip);
  // }
  // get interviewed_by_us() {
  //   return this.workDetailsForm.get(this.form_interviewed_by_us);
  // }
  // get post() {
  //   return this.workDetailsForm.get(this.form_post);
  // }
  // get when_interview() {
  //   return this.workDetailsForm.get(this.form_when_interview);
  // }

  get is_intern_status() {
    return this.workDetailsForm.get(this.form_is_training_status);
  }
  // get training_is_articleship_status() {
  //   return this.workDetailsForm.get(this.form_training_is_articleship_status);
  // }
  // get ca_dateofcompletion() {
  //   return this.workDetailsForm.get(this.form_ca_dateofcompletion);
  // }
  get ca_achivement() {
    return this.workDetailsForm.get(this.form_ca_achivement);
  }
  get ca_resaon_suitable() {
    return this.workDetailsForm.get(this.form_is_ca_resaon_suitable);
  }
  get skilllevel_selected() {
    return this.workDetailsForm.get(this.form_skilllevel_selected);
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
    }
    choosen(selecteddata:any,i){
      this.getSkillsArr.controls[i].value[this.form_skilllevel_selected]=selecteddata;
      this.currentIndex = i;
     this.skillandLevel =  this.getSkillSelection(i)
    }
choosenBorder(i):String{
  let choosenborder = 'noviceborder';
  switch(this.getSkillSelection(i)) {
    case "Novice":
      choosenborder = 'noviceborder';
      break;
      case "Beginner":
        choosenborder = 'beginnerborder';
        break;
        case "Skillfull":
          choosenborder = 'skillfullborder';
          break;
          case "Experienced":
            choosenborder = 'experiencedborder';
            break;
            case "Expert":
      choosenborder = 'expertborder';
      break;
    default:
     choosenborder = 'selectedborder';
      break;
  }
  return choosenborder;
}
}
