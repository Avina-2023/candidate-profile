import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit, AfterViewInit, OnDestroy,ViewChild, TemplateRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
// import { AdminServiceService } from 'src/app/services/admin-service.service';
import * as moment from 'moment'; //in your component
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { SharedServiceService } from 'src/app/service/shared-service.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { SkillexService } from 'src/app/service/skillex.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { InterComponentMessenger } from 'src/app/service/interComponentMessenger.service';


export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'MMM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const MY_FORMATS_Month = {
  parse: {
    dateInput: 'MMM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'MMM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-joining-education',
  templateUrl: './joining-education.component.html',
  styleUrls: ['./joining-education.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS || MY_FORMATS_Month },
  ],
})
export class GeneralJoiningEducationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('confirmDialog', { static: false }) matDialogRef: TemplateRef<any>;

  // day = new FormControl(moment());

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value!;
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.day.setValue(ctrlValue);
  //   datepicker.close();
  // }

  showWorkExp: any = '0';
  mastersList: any;
  educationForm: FormGroup;
  minDate: Date;
  currentDeleteIndex:number  ;
  maxDate: Date;
  public selection: string;
  boardsList = DropdownListForKYC['boards'];
  HSCDiscipline = DropdownListForKYC['HSCDiscipline'];

  CAgroupList = [
    {
      label: 'Group 1',
      value: 'Group 1'
    },
    {
      label: 'Group 2',
      value: 'Group 2'
    }
  ]
  CAQualificationList = [
    {
      label: 'Foundation',
      value: 'Foundation'
    },
    {
      label: 'Inter',
      value: 'Inter'
    },
    {
      label: 'Final',
      value: 'Final'
    }
  ];
  ICWAQualificationList = [
    {
      label: 'Foundation',
      value: 'Foundation'
    },
    {
      label: 'Inter',
      value: 'Inter'
    },
    {
      label: 'Final',
      value: 'Final'
    }
  ];
  CSQualificationList = [
    {
      label: 'Foundation',
      value: 'Foundation'
    },
    {
      label: 'Inter',
      value: 'Inter'
    },
    {
      label: 'Final',
      value: 'Final'
    }
  ];

  // diplamoSpecialization = [
  //   {
  //     label: 'Diploma Engineering',
  //     value: 'Diploma Engineering'
  //   }
  // ]

  modesList = [
    {
      label: 'Full time',
      value: 'fulltime'
    },
    {
      label: 'Part-time',
      value: 'parttime'
    }
  ]
  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: 'yes'
    },
    {
      label: 'No',
      value: 'no'
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: 'active'
    },
    {
      label: 'Inactive',
      value: 'inactive'
    }
  ];
  allSpecializationOptions: any[] = [];
  specializationOptions: any[][] = [];
  //form Variables
  form_educationArray = 'educationArray';
  form_qualification_type = 'level';
  form_qualification = 'specification';
  form_specialization = 'discipline';
  form_collegeName = 'institute';
  form_othercollegeName = 'other_collegename';
  form_othercollegeState = 'other_collegestate';
  form_boardUniversity = 'board_university';
  form_startDate = 'start_date';
  form_endDate = 'end_date';
  form_yearpassing = 'year_of_passing';
  // form_backlog = 'backlogs';
  form_historyOfbacklog = 'historyOfbacklog';
  form_reasonForbacklog = 'reasonForbacklog';
  form_noActivebacklog = 'noActivebacklog';
  form_mode = 'mode';
  form_cgpa = 'percentage';
  form_cgpercentage = 'cg_percentage'
  form_Finalcgpa = 'final_percentage';
  form_CARanks = 'rank';
  form_gap_reason = 'gap_reason';
  form_gap = 'gap';
  eduGap: boolean = false;

  ca_bothgroup_status = new FormControl(null);
  isHighLevelEdu = 'is_highLevelEdu';
  TopEducation = false;
  educationLevels: any;
  diplamoSpecialization: any;
  pgSpecializationList: any;
  ugSpecializationList: any;
  diplomaDisciplineList: any;
  pgDisciplineList: any;
  ugDisciplineList: any;
  diplomaInstitutesList: any;
  pgInstitutesList: any;
  ugInstitutesList: any;
  initialvalue:any;
  initialIndex:any;

  educationDetails: any;
  selectedPost: any;
  selectedPostLabel: any;
  educationLength: any;
  maxDateStartField: any;
  isKYCNotExempted = this.appConfig.getLocalData('isKYCNotExempted') == 'false' ? false : true;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  getEducationListSubscription: Subscription;
  getAllEducationFormDropdownListSubscription: Subscription;
  withoutCAeducationLevels: any;
  withCAeducationLevels: any;
  check: any;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  minPassDate: Date;
  maxPassDate: Date | null;
  clgList: any;
  allStatesList: any;

  errortext:any=false;

 constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    // private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private skillexService:SkillexService,
    private fb: FormBuilder,
    private loadingService:LoaderService,
    private glovbal_validators: GlobalValidatorService,
    private matDialog: MatDialog,
    public dialog: MatDialog,
    private msgData:InterComponentMessenger

  )

  {
    this.minFromDate = new Date(1900, 0, 1);
    this.maxFromDate = new Date();

    this.minToDate = new Date(1900, 0, 1);
    this.maxToDate = new Date();

    this.minPassDate = new Date(1900, 0, 1);
    this.maxPassDate = new Date();
  }

  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>,i:number) {
    this.minToDate[i] = event.value;

    if (event.value != null) {
      this.maxToDate[i] = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() + 30
      );
    }
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>,i:number) {
    //this.minPassDate[i] = event.value;
    this.maxFromDate[i] = event.value;

    if (event.value != null) {
      this.minFromDate[i] = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() + 30
      );

      // this.maxPassDate[i] = new Date(
      //   event!.value.getFullYear(),
      //   event!.value.getMonth(),
      //   event!.value.getDate() - 30
      // );
    }
  }


  passDateChange(type: string, event: MatDatepickerInputEvent<Date>,i:number) {
    // this.maxToDate[i] = event.value;

    // if (event.value != null) {
    //   this.minToDate[i] = new Date(
    //     event!.value.getFullYear(),
    //     event!.value.getMonth(),
    //     event!.value.getDate() - 30
    //   );
    // }
  }


  //  {
  //   this.dateValidation();
  //   let mastersList = this.appConfig.getLocalData('masters') ? JSON.parse(this.appConfig.getLocalData('masters')) : [];
  //   // Filter education details baised on customer code
  //   this.mastersList = mastersList.lenght ? mastersList.education_master : [];
  //   let positive_array = this.mastersList.filter(value => value.customer_code == '#LTTS');
  //   this.mastersList = mastersList ? positive_array : [];
  // }

  ngOnInit() {
    this.degreeList();
    this.formInitialize();
    // Getting required datas for dropdowns
    this.getEducationLevels();
    this.loadingService.setLoading(true);
    this.skillexService.getDisciplineList().subscribe((result:any) => {
      this.allSpecializationOptions = result.data;
      this.getEducationApiDetails();
      this.check = this.getEducationArr.controls[this.getEducationArr.controls.length - 1].value.is_highLevelEdu;
      // console.log(this.getEducationArr.controls[this.getEducationArr.controls.length - 1].value.is_highLevelEdu);

      this.loadingService.setLoading(false);
   });
    this.educationDropdownValues();
    // End of Getting required datas for dropdowns
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
    this.getAllStates();

//  this.check = this.getEducationArr.controls[this.getEducationArr.controls.length-1].value.is_highLevelEdu
//  console.log(this.getEducationArr.controls[this.getEducationArr.controls.length-1].value.is_highLevelEdu,'j');

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

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getEducationApiDetails();
     });
   }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('education');
  }

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_yearpassing];
    if (ctrlValue) {
      ctrlValue.year(normalizedYear.year());
      this.getEducationArr.at(i).patchValue({
        [this.form_yearpassing]: ctrlValue,
      });
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_yearpassing];
    if (this.dateConvertion(normalizedMonth['_d'])) {
    this.getEducationArr.at(i).patchValue({
      [this.form_yearpassing]: this.dateConvertionMonth(normalizedMonth['_d']),
    });
  }
    datepicker.close();
  }

  chosenYearHandlerpicker(normalizedYear: Moment, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_startDate];
    if (ctrlValue) {
      ctrlValue.year(normalizedYear.year());
      this.getEducationArr.at(i).patchValue({
        [this.form_startDate]: ctrlValue,
      });
    }
  }

  chosenMonthHandlerpicker(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_startDate];
    if (this.dateConvertion(normalizedMonth['_d'])) {
    this.getEducationArr.at(i).patchValue({
      [this.form_startDate]: this.dateConvertionMonth(normalizedMonth['_d']),
    });
  }
    datepicker.close();
  }


  chosenYearHandlerpicker1(normalizedYear: Moment, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_startDate];
    if (ctrlValue) {
      ctrlValue.year(normalizedYear.year());
      this.getEducationArr.at(i).patchValue({
        [this.form_startDate]: ctrlValue,
      });
    }
  }

  chosenMonthHandlerpicker1(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_endDate];
    if (this.dateConvertion(normalizedMonth['_d'])) {
    this.getEducationArr.at(i).patchValue({
      [this.form_endDate]: this.dateConvertionMonth(normalizedMonth['_d']),
    });
  }
    datepicker.close();
  }


  getSelectedPost() {
    if (this.mastersList) {
    this.mastersList.forEach(element => {
      if (element.value == this.selectedPost) {
        this.selectedPostLabel = element.value;
      }
    });
  }
  }

  profileChanged() {
    this.educationLevels = this.withoutCAeducationLevels;
    if (this.selectedPost == 'det') {
      this.initalPatchWithValidations(2);
    }
    if (this.selectedPost == 'get' || this.selectedPost == 'gct') {
      this.initalPatchWithValidations(3);
    }
    if (this.selectedPost == 'pget' || this.selectedPost == 'pgct' || this.selectedPost == 'pgt') {
      this.initalPatchWithValidations(4);
    }
    if (this.selectedPost == 'ca') {
      this.educationLevels = this.withCAeducationLevels;
      this.initalPatchWithValidations(1);
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
        this.getEducationArr.removeAt(this.currentDeleteIndex );
        this.specializationOptions.splice(this.currentDeleteIndex, 1);
        // alert()
        // this.check = false
      if (this.getEducationArr.controls[this.getEducationArr.controls.length - 1]['controls'][this.isHighLevelEdu].value)
    { this.check = true }
    else
     {this.check = false}
      }
    });
  }
  removeData(i) {
    this.currentDeleteIndex=i
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

  getEducationApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.educationDetails = this.candidateService.getLocaleducation_details().educations;
      // this.selectedPost = this.candidateService.getLocaleducation_details().selected_post ? this.candidateService.getLocaleducation_details().selected_post : null;
      this.candidateService.getLocaleducation_details().ca_bothgroup_status ? this.ca_bothgroup_status.setValue(true) : this.ca_bothgroup_status.setValue(false);
      this.getSelectedPost();
      this.educationDetails && this.educationDetails.length > 0 ? this.ifEducationDetails() : this.ifNotEducationDetails();
    } else {
    //   let apiData = {
    //     form_name: 'joining',
    //     section_name: ''
    //   }
    //   this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
    //     this.candidateService.saveAllProfileToLocal(data);
    //     this.educationDetails = this.candidateService.getLocaleducation_details().educations;
    //     this.selectedPost = this.candidateService.getLocaleducation_details().selected_post ? this.candidateService.getLocaleducation_details().selected_post : null;
    //     this.getSelectedPost();
    //     this.educationDetails && this.educationDetails.length > 0 ? this.ifEducationDetails() : this.ifNotEducationDetails();
    //   });
    }
  }

  ifEducationDetails() {
    this.getEducationLength(this.educationDetails);
    this.patchEducationForm();
  }
  ifNotEducationDetails() {
    this.educationLength = 1;
    this.educationDetails = [];
    this.initalPatchWithValidations(1);
  }

  getEducationLength(education) {
    let sp = this.selectedPost;
    let label = sp == 'det' ? 'Diploma' : (sp == 'get' || sp == 'gct') ? 'UG' : (sp == 'pget' || sp == 'pgct' || sp == 'pgt') ? 'PG' : '';
    const findIndex = education.findIndex(data => data.level == label);
    this.educationLength = findIndex != -1 ? findIndex + 1 : 1;
  }

  initalPatchWithValidations(loopCount) {
   let currentCount = this.getEducationArr.length && this.getEducationArr.length > 0 ? this.getEducationArr.length : 0;
   if (currentCount > loopCount) {
    for (let index = currentCount; index >= loopCount; index--) {
      this.getEducationArr.removeAt(index);
      }
   } else {
    for (let index = currentCount; index < loopCount; index++) {
      this.getEducationArr.push(this.initEducationArray(index));
      if (index == 0) {
        this.getEducationArr.at(0).patchValue({
          [this.form_qualification_type]: 'SSLC',
        });
      }
      this.setValidations();
      this.edugapValidation();
    }
  }
}


    educationLevelChange(i) {
        this.getEducationArr.at(i).patchValue({
          [this.form_qualification]: null,
          [this.form_specialization]: null,
          [this.form_collegeName]: null,
          [this.form_othercollegeName]:null,
          [this.form_othercollegeState]:null,
          [this.form_boardUniversity]: null,
          [this.form_startDate]: null,
          [this.form_endDate]: null,
          [this.form_yearpassing]: null,
          // [this.isHighLevelEdu]:false,
          // [this.form_backlog]: null,
          [this.form_historyOfbacklog]:null,
          [this.form_reasonForbacklog]: null,
          [this.form_noActivebacklog]: null,
          // [this.form_mode]: null,
          [this.form_cgpa]: null,
          [this.form_Finalcgpa]: null,
          [this.form_cgpercentage]: null,
          [this.form_CARanks]: null,
          [this.form_gap]:'false',
          // [this.form_isGap]: [null],
          });
     return this.setValidations();
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

momentFormMonth(date) {
  if (date) {
    const split = moment(date).format('MMM YYYY');
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

dateConvertionMonth(date) {
  if (date) {
    const split = moment(date).format();
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format();
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}


validSelectedPost() {
  let valid;
    let value = {
      hscDiploma: false,
      ug: false,
      pg: false,
      ca: false,
      label: ''
    };
    if (this.selectedPost == 'det') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
      });
      valid = value.hscDiploma ? true : false;
      value.label = 'det';
      return {
        valid,
        value
      }
    }

    if (this.selectedPost == 'ca') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'CA' || element['controls'][this.form_qualification_type]['value'] == 'ICWA' || element['controls'][this.form_qualification_type]['value'] == 'CS') {
          value.ca = true;
        }
      });
      valid = value.ca ? true : false;
      value.label = 'ca';
      return {
        valid,
        value
      }
    }

    if (this.selectedPost == 'gct' || this.selectedPost == 'get') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'HSC' || element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
          value.ug = true;
        }
      });
      valid = value.hscDiploma && value.ug ? true : false;
      value.label = 'gct';
      return {
        valid,
        value
      }
    }
    if (this.selectedPost == 'pgct' || this.selectedPost == 'pget' || this.selectedPost == 'pgt') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'HSC' || element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
          value.ug = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'PG') {
          value.pg = true;
        }
      });
      valid = value.hscDiploma && value.ug && value.pg ? true : false;
      value.label = 'pgct';
      return {
        valid,
        value
      }
    }

}
  formSubmit(routeValue?: any) {
    if(this.check == true && this.educationForm.valid){
      this.errortext = false
      this.loadingService.setLoading(true)
    // if (this.candidateService.checkKycOrJoiningForm()) {
    this.getEducationArr.controls.forEach((element: any, j) => {
      if (element['controls'][this.form_qualification_type]['value'] == 'CA' || element['controls'][this.form_qualification_type]['value'] == 'ICWA' || element['controls'][this.form_qualification_type]['value'] == 'CS') {
        this.getEducationArr.at(j).patchValue({
          [this.form_Finalcgpa]: element['controls'][this.form_Finalcgpa]['value'],
          [this.form_cgpa]: element['controls'][this.form_cgpa]['value'],
          [this.form_cgpercentage]: element['controls'][this.form_cgpercentage]['value'],
          [this.form_noActivebacklog]: element['controls'][this.form_noActivebacklog]['value'],
          [this.form_historyOfbacklog]: element['controls'][this.form_historyOfbacklog]['value']

        })
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'SSLC') {
        this.getEducationArr.at(j).patchValue({
          [this.form_Finalcgpa]: element['controls'][this.form_Finalcgpa]['value'],
          [this.form_cgpa]: element['controls'][this.form_cgpa]['value'],
          [this.form_cgpercentage]: element['controls'][this.form_cgpercentage]['value'],
          [this.form_noActivebacklog]: element['controls'][this.form_noActivebacklog]['value'],
          [this.form_historyOfbacklog]: element['controls'][this.form_historyOfbacklog]['value']

        })
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'HSC') {
        this.getEducationArr.at(j).patchValue({
          [this.form_Finalcgpa]: element['controls'][this.form_Finalcgpa]['value'],
          [this.form_cgpa]: element['controls'][this.form_cgpa]['value'],
          [this.form_cgpercentage]: element['controls'][this.form_cgpercentage]['value'],
          [this.form_noActivebacklog]: element['controls'][this.form_noActivebacklog]['value'],
          [this.form_historyOfbacklog]: element['controls'][this.form_historyOfbacklog]['value']

        })
      }
    });
  // }
  // debugger
      // let entryValid = this.validSelectedPost();
      // if (entryValid.valid) {
        let formArray = this.educationForm.getRawValue()[this.form_educationArray];
        const EducationApiRequestDetails = {
          email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
          section_name: "education_details",
          saving_data: {
            // selected_post: this.selectedPost,
            // ca_bothgroup_status: this.checkLastIndexOfCA() ? (this.ca_bothgroup_status.value ? 1 : 0) : null,
                      educations: formArray
          }
        };
       this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(EducationApiRequestDetails).subscribe((data: any)=> {
        this.loadingService.setLoading(false)
        this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Education details is updated');
        this.msgData.sendMessage("saved",true)
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
      });

      // } else {
      //   this.appConfig.nzNotification('error', 'Not Submitted', entryValid?.value?.label == 'gct' ? '12th or Diploma and Undergraduate are mandatory' : entryValid?.value?.label == 'pgct' ? '12th or Diploma, Undergraduate and Postgraduate are mandatory' : entryValid?.value?.label == 'det' ? 'Diploma is mandatory' : 'CA or IGWA or CS is mandatory');
      // }

  }
  if(this.check == true && this.educationForm.invalid){
    this.errortext = false;
    this.ngAfterViewInit();
    this.loadingService.setLoading(false);
    this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
  }
  if ((this.check == false && this.educationForm.valid) || (this.check == false && this.educationForm.invalid)){
    this.errortext = true;
    this.ngAfterViewInit();
    this.loadingService.setLoading(false);
    this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
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
      if(data.current == 'education') {
        if (!this.educationForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
    debugger
    if (this.educationForm.valid) {
      if (route == 'dependent') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT);
      } else {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'dependent' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
    }
  }

  patchEducationForm() {
    this.getEducationArr.clear();
    this.educationDetails.forEach((element, i) => {
      this.getEducationArr.push(this.patching(element, i));
    });
    this.setValidations( );
    this.edugapValidation();
    this.otherclgnameValidation(this.initialvalue,this.initialIndex);
  }

  patching(data, i) {
    this.specializationOptions[i] = this.allSpecializationOptions
      .filter(option => option.degree === data[this.form_qualification])
      .reduce((acc, option) => acc.concat(option.department), []);
    return this.fb.group({
      [this.form_qualification_type]: [{ value: data[this.form_qualification_type], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [Validators.required]],
      [this.form_qualification]: [{ value: data[this.form_qualification], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [Validators.required]],
      [this.form_specialization]: [{ value: data[this.form_specialization], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [Validators.required]],
      [this.form_collegeName]: [{ value: data[this.form_collegeName], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [Validators.required]],
      [this.form_othercollegeName]: [{ value: data[this.form_othercollegeName], disabled: false },[Validators.required] ],
      [this.form_othercollegeState]: [{ value: data[this.form_othercollegeState], disabled: false },[Validators.required] ],
      [this.form_boardUniversity]: [{ value: data[this.form_boardUniversity], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [Validators.required]],
      [this.form_startDate]: [this.dateConvertion(data[this.form_startDate]), [Validators.required, this.startTrue(false)] ],
      [this.form_endDate]: [this.dateConvertion(data[this.form_endDate]), [Validators.required, this.startTrue(false)] ],
      [this.form_yearpassing]: [{ value: this.dateConvertionMonth(data[this.form_yearpassing]), disabled: false }, [Validators.required, this.startTrue(true)]],
      //  [this.form_backlog]: [{ value: data[this.form_backlog], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? (data[this.form_qualification_type] == 'SSLC' || data[this.form_qualification_type] == 'HSC' ? true : false) : false}, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.backlog()]],
      // [this.form_reasonForbacklog]: [data[this.form_reasonForbacklog],( data[this.form_reasonForbacklog] && (data[this.form_gap] == 'true'))  ? [Validators.required] : data[this.form_reasonForbacklog],(data[this.form_reasonForbacklog] && (data[this.form_gap] == 'false'))  ? [] : [] ],
      // [this.isHighLevelEdu]:[data[this.isHighLevelEdu] ? data[this.isHighLevelEdu]:false],
      [this.isHighLevelEdu]: [data[this.isHighLevelEdu] ? data[this.isHighLevelEdu] : false],
      [this.form_reasonForbacklog]: [{ value: data[this.form_reasonForbacklog], disabled: false },[Validators.required] ],
      // [this.form_historyOfbacklog]: [ data[this.form_historyOfbacklog], [Validators.required]],
     // [this.form_noActivebacklog]: [{ value: data[this.form_noActivebacklog], disabled: false },[Validators.required]],
     // [this.form_mode]: [{ value: data[this.form_mode], disabled: false }, this.candidateService.checkKycOrJoiningForm() ? [Validators.required] : []],
      [this.form_noActivebacklog]: [{ value: data[this.form_noActivebacklog], disabled : false  },[Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2) ]],
      [this.form_historyOfbacklog]: [{ value: data[this.form_historyOfbacklog], disabled : false  },[Validators.required, this.glovbal_validators.numberOnly(),Validators.maxLength(2)]],
      [this.form_cgpa]: [{ value: data[this.form_cgpa], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.percentageNew(), this.glovbal_validators.percentage(), Validators.maxLength(3)]],

      [this.form_Finalcgpa]: [{ value: data[this.form_Finalcgpa], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.percentageNew(), this.glovbal_validators.percentage(), Validators.maxLength(3)]],
      [this.form_cgpercentage]: [{ value: data[this.form_cgpercentage], disabled: (this.candidateService.checkKycOrJoiningForm() && this.isKYCNotExempted) ? true : false }, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.percentageNew(), this.glovbal_validators.percentage(), Validators.maxLength(3)]],
      [this.form_CARanks] : [data[this.form_CARanks], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_gap]:[ (data[this.form_gap] && data[this.form_gap] == 'true')  ? 'true' : 'false' ],
      //[this.isHighLevelEdu]:[data[this.isHighLevelEdu] ],


    })
  }

  initEducationArray(index: number) {
    const educationFormGroup = this.fb.group({
      [this.form_qualification_type]: [null, [Validators.required]],
      [this.form_qualification]: [null, [Validators.required]],
      [this.form_specialization]: [null, [Validators.required]],
      [this.form_collegeName]: [null, [Validators.required]],
      [this.form_othercollegeName]: [null],
      [this.form_othercollegeState]: [null],
      [this.form_boardUniversity]: [null, [Validators.required]],
      [this.form_startDate]: [null,  [Validators.required, this.startTrue(true)] ],
      [this.form_gap]:['false'],
      [this.isHighLevelEdu]:[false],
      [this.form_endDate]: [null,  [Validators.required, this.startTrue(true)] ],
      [this.form_yearpassing]: [null, [Validators.required, this.startTrue(true)]],
      //  [this.form_backlog]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.backlog()]],
      // [this.form_historyOfbacklog]: [null ],

      [this.form_reasonForbacklog]: [null],
      // [this.form_noActivebacklog]: [null],
      [this.form_noActivebacklog] : [null, [RemoveWhitespace.whitespace(), Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2)]],
      [this.form_historyOfbacklog] : [null, [RemoveWhitespace.whitespace(), Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2)]],
      // [this.form_mode]: [null, this.candidateService.checkKycOrJoiningForm() ? [Validators.required] : []],
      [this.form_cgpa]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.percentageNew(), this.glovbal_validators.percentage(), Validators.maxLength(3)]],
      [this.form_Finalcgpa]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.percentageNew(), this.glovbal_validators.percentage(), Validators.maxLength(3)]],
      [this.form_cgpercentage]: [null,  [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.percentageNew(), this.glovbal_validators.percentage(), Validators.maxLength(3)]],

      [this.form_CARanks] : [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]]
    })

    const qualificationControl = educationFormGroup.get(this.form_qualification);
    if (qualificationControl) {
      qualificationControl.valueChanges.subscribe((value) => {
        this.editSpecilization(index);
      });
    }

    return educationFormGroup;
  }


  eduLevel(e, i: number) {
    console.log(this.getEducationArr.controls[this.getEducationArr.controls.length-1]['controls'][this.isHighLevelEdu].value);
    if (e.checked) {
      // this.check = true
      // this.errortext = false;
      this.getEducationArr.controls[this.getEducationArr.controls.length-1]['controls'][this.isHighLevelEdu].setValue(true);
      this.getEducationArr.controls[this.getEducationArr.controls.length-1]['controls'][this.isHighLevelEdu].clearValidators();
      this.getEducationArr.controls[this.getEducationArr.controls.length-1]['controls'][this.isHighLevelEdu].updateValueAndValidity();

    } else {
      // this.check = false;
     // this.errortext = true;
      this.getEducationArr.controls[this.getEducationArr.controls.length-1]['controls'][this.isHighLevelEdu].setValidators([Validators.required, this.startTrue(true) ],{ emitEvent: false });
      this.getEducationArr.controls[this.getEducationArr.controls.length-1]['controls'][this.isHighLevelEdu].updateValueAndValidity();
    }
    if (this.getEducationArr.controls[this.getEducationArr.controls.length - 1]['controls'][this.isHighLevelEdu].value) {
      this.check = true
    }
    else {
      this.check = false
    }
  }


  anyGap(event,i){
    if(event.value == 'true'){
  //this.getEducationArr.controls[i]['controls'][this.form_historyOfbacklog].setValidators([Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2)],{ emitEvent: false });
  //this.getEducationArr.controls[i]['controls'][this.form_noActivebacklog].setValidators([Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2)],{ emitEvent: false });
  this.getEducationArr.controls[i]['controls'][this.form_reasonForbacklog].setValidators([Validators.required,this.glovbal_validators.alphaNum255() ],{ emitEvent: false });
    }if(event.value == 'false'){
        //this.getEducationArr.controls[i]['controls'][this.form_historyOfbacklog].setValue(null);
        //this.getEducationArr.controls[i]['controls'][this.form_noActivebacklog].setValue(null);
        this.getEducationArr.controls[i]['controls'][this.form_reasonForbacklog].setValue(null);

        //this.getEducationArr.controls[i]['controls'][this.form_historyOfbacklog].clearValidators();
       // this.getEducationArr.controls[i]['controls'][this.form_noActivebacklog].clearValidators();
        this.getEducationArr.controls[i]['controls'][this.form_reasonForbacklog].clearValidators();

        //this.getEducationArr.controls[i]['controls'][this.form_historyOfbacklog].updateValueAndValidity();
        //this.getEducationArr.controls[i]['controls'][this.form_noActivebacklog].updateValueAndValidity();
        this.getEducationArr.controls[i]['controls'][this.form_reasonForbacklog].updateValueAndValidity();
      }
  }


//   radioChange(event) {
//     console.log(event, 'event');
// if(event.value == 'true'){
//   this.eduGap = true;

// }else{
//   this.eduGap = false;
// }
// }
    // Custom regex validator
    regexValidator(error: ValidationErrors, param): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        if (!control.value) {
          return null;
        }
        let check;
        let yearofPassing = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_yearpassing]['value'] ? control['_parent']['controls'][this.form_yearpassing]['value'] : null;
        let startDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_startDate]['value'] ? control['_parent']['controls'][this.form_startDate]['value'] : null;
        let endDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_endDate]['value'] ? control['_parent']['controls'][this.form_endDate]['value'] : null;
        if (yearofPassing) {
          let start = moment(control.value).format('MMM-YYYY');
          let yearofPassing1 = moment(yearofPassing).format('MMM-YYYY');
          error.notValid = this.momentFormMonth(yearofPassing);
          check = moment(start).isSameOrBefore(yearofPassing1, 'month');
          check = !check;
        }
        if (!param) {
          return check ? error : null;
        } else {
          this.detectStartDateCalc(yearofPassing, startDate, endDate, control);
          return null;
        }
      };
    }

    detectStartDateCalc(yearofPassing, startDate, endDate, control) {
      let startCheck;
      let endCheck;
      if (yearofPassing && startDate) {
        let start = moment(startDate).format('MMM-YYYY');
        let yearofPassing1 = moment(yearofPassing).format('MMM-YYYY');
        // error.notValid = this.momentFormMonth(yearofPassing);
        startCheck = moment(start).isSameOrBefore(yearofPassing1, 'month');
        startCheck = !startCheck;
        startCheck ? control['_parent']['controls'][this.form_startDate].setErrors({notValid: this.momentFormMonth(yearofPassing)}) : control['_parent']['controls'][this.form_startDate].setErrors(null);
      }
      if (yearofPassing && endDate) {
        let end = moment(endDate).format('MMM-YYYY');
        let yearofPassing1 = moment(yearofPassing).format('MMM-YYYY');
        // error.notValid = this.momentFormMonth(yearofPassing);
        endCheck = moment(end).isSameOrBefore(yearofPassing1, 'month');
        endCheck = !endCheck;
        endCheck ? control['_parent']['controls'][this.form_endDate].setErrors({notValid: this.momentFormMonth(yearofPassing)}) : control['_parent']['controls'][this.form_endDate].setErrors(null);
      }

    }

    startTrue(param) {
      return this.regexValidator({notValid: true}, param);
    }

  formInitialize() {
    this.educationForm = this.fb.group({
      [this.form_educationArray]: this.fb.array([])
    }
    )

   // Get the input values
// const startDateInput = document.querySelector('[formControlName="form_startDate"]') as HTMLInputElement;
// const endDateInput = document.querySelector('[formControlName="form_endDate"]') as HTMLInputElement;

// const startDateValue = startDateInput.textContent;
// const endDateValue = endDateInput.textContent;
// console.log(startDateValue, 'startdateinput');
// console.log(endDateValue, 'enddateinput');

// Convert the input values to Date objectsk
// const startDate = new Date(`01-${startDateInput}`);
// const endDate = new Date(`01-${endDateInput}`);

// // Compare the dates
// if (startDate.getTime() < endDate.getTime()) {
//   console.log('Start date is earlier than end date');
// } else if (startDate.getTime() > endDate.getTime()) {
//   console.log('End date is earlier than start date');
// } else {
//   console.log('Start date and end date are the same');
// }
  }
  addToEducationArray() {
    if (this.educationForm.valid) {
     const newIndex = this.getEducationArr.length;
     return this.getEducationArr.push(this.initEducationArray(newIndex));
    }
    this.appConfig.nzNotification('error', 'Not added', 'Please fill all the red highlighted fields to proceed further');
    this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
  }

  editSpecilization(index: number): void {
    const qualification = this.getEducationArr.at(index).get(this.form_qualification).value;

    this.getEducationArr.at(index).patchValue({
      [this.form_specialization]: null
    });

    if (qualification) {
      this.specializationOptions[index] = this.allSpecializationOptions
        .filter(option => option.degree === qualification)
        .reduce((acc, option) => acc.concat(option.department), []);
    }
  }

  removeEducationArray(i) {
    this.getEducationArr.removeAt(i);
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getEducationArr() { return this.educationForm.get([this.form_educationArray]) as FormArray; }
  edugapValidation(){
    this.getEducationArr.controls.forEach((element: any, j) => {

    if(element['controls'][this.form_gap]['value'] == 'true'){
      //element['controls'][this.form_historyOfbacklog].clearValidators({ emitEvent: false });
      //element['controls'][this.form_noActivebacklog].clearValidators({ emitEvent: false });
      element['controls'][this.form_reasonForbacklog].clearValidators({ emitEvent: false });

      element['controls'][this.form_historyOfbacklog].setValidators([RemoveWhitespace.whitespace(), Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2)],{ emitEvent: false });
      element['controls'][this.form_noActivebacklog].setValidators([RemoveWhitespace.whitespace(), Validators.required,this.glovbal_validators.numberOnly(),Validators.maxLength(2)],{ emitEvent: false });
      element['controls'][this.form_reasonForbacklog].setValidators([RemoveWhitespace.whitespace(), Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });

    }
    if(element['controls'][this.form_gap]['value'] == 'false'){

      //element['controls'][this.form_historyOfbacklog].setValue(null);
      //element['controls'][this.form_noActivebacklog].setValue(null);
      element['controls'][this.form_reasonForbacklog].setValue(null);

      //element['controls'][this.form_historyOfbacklog].clearValidators({ emitEvent: false });
      //element['controls'][this.form_noActivebacklog].clearValidators({ emitEvent: false });
      element['controls'][this.form_reasonForbacklog].clearValidators({ emitEvent: false });

      //element['controls'][this.form_historyOfbacklog].updateValueAndValidity({ emitEvent: false });
      //element['controls'][this.form_noActivebacklog].updateValueAndValidity({ emitEvent: false });
      element['controls'][this.form_reasonForbacklog].updateValueAndValidity({ emitEvent: false });

    }
  });
}
dependentChange(i) {
  // console.log('coming inside2')
  this.getEducationArr.at(i).patchValue({
    [this.form_othercollegeName]: [null],
    [this.form_othercollegeState]: [null]
    });
// return this.otherclgnameValidation(selectedValue: any,index);
}

  setValidations() {
      this.getEducationArr.controls.forEach((element: any, j) => {
      if (element['controls'][this.form_qualification_type]['value'] == 'SSLC') {
        // Disable
        element['controls'][this.form_qualification_type].disable({ emitEvent: false });
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

         element['controls'][this.form_collegeName].setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.descr255()],{ emitEvent: false });
        //element['controls'][this.form_collegeName].setValidators([RemoveWhitespace.whitespace(), Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
        }
      if (element['controls'][this.form_qualification_type]['value'] == 'HSC') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_qualification].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.descr255()],{ emitEvent: false });
        //element['controls'][this.form_collegeName].setValidators([RemoveWhitespace.whitespace(), Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([Validators.required],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'PG') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }

      if (element['controls'][this.form_qualification_type]['value'] == 'CA' || element['controls'][this.form_qualification_type]['value'] == 'ICWA' || element['controls'][this.form_qualification_type]['value'] == 'CS') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_qualification_type]['value'] == 'CA' ? element['controls'][this.form_boardUniversity].setValidators([Validators.required],{ emitEvent: false }) : element['controls'][this.form_boardUniversity].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }

      });
    }


  getEducationLevels() {
   this.getEducationListSubscription = this.candidateService.getEducationList().subscribe((data: any) => {
      const list = data && data[0] ? data[0] : [];
      list.forEach((element, i) => {
        if (element['id'] === '1') {
          element['label'] = 'SSLC / 10th'
        }
        if (element['id'] === '2') {
          element['label'] = 'HSC / 12th'
        }
        if (element['id'] === '3') {
          element['label'] = 'Diploma'
        }
        if (element['id'] === '4') {
          element['label'] = 'Undergraduate'
        }
        if (element['id'] === '5') {
          element['label'] = 'Postgraduate'
        }
        if (element['id'] === '6') {
          element['label'] = element['education'];
        }
        if (element['id'] === '7') {
          element['label'] = element['education'];
        }
        if (element['id'] === '8') {
          element['label'] = element['education'];
        }

      });
      const withoutCA = list.filter(data => (data['id'] != '6' && data['id'] != '7' && data['id'] != '8') );
      this.withCAeducationLevels = list;
      this.withoutCAeducationLevels = withoutCA;
      this.educationLevels = this.selectedPost && this.selectedPost == 'ca' ? this.withCAeducationLevels : this.withoutCAeducationLevels;
      // this.educationLevels = this.withoutCAeducationLevels;
    }, (err) => {

    });
  }

  educationDropdownValues() {
    this.loadingService.setLoading(true)
   this.getAllEducationFormDropdownListSubscription = this.skillexService.collegeList().subscribe((data: any) => {
    this.loadingService.setLoading(false)
      // this.ugSpecializationList = data && data.data.ug_specifications ? data.data.ug_specifications : [];
      // this.pgSpecializationList = data && data.data.pg_specifications ? data.data.pg_specifications : [];
      // this.diplomaDisciplineList = data && data.data.diploma_disciplines ? data.data.diploma_disciplines : [];
      // this.ugDisciplineList = data && data.data.ug_disciplines ? data.data.ug_disciplines : [];
      // this.pgDisciplineList = data && data.data.pg_disciplines ? data.data.pg_disciplines : [];
      this.diplomaInstitutesList = data && data.data.diploma_colleges ? data.data.diploma_colleges : [];
      this.clgList = data && data.data.ug_pg_colleges ? data.data.ug_pg_colleges : [];
      // this.clgList.push({ id: 0, college_name: "Others" });
      // this.clgList.push({ id: 0, college_name: "Others" });
      // this.ugInstitutesList = list;
      // // const exceptOthers = list.filter((data: any) => data.college_name !== 'Others');
      // this.pgInstitutesList =  list;
      //  this.diplomaInstitutesList = list;
    }, (err) => {

    });
  }
  list(list: any) {
    throw new Error('Method not implemented.');
  }

  checkLastIndexOfCA() {
    let ca = null;
    let array = this.getEducationArr.getRawValue();
    array.forEach((element, i) => {
      if (element && element[this.form_qualification_type] == 'CA') {
        ca = i;
      }
    });
    return ca;
  }

  getAllStates() {
    const datas = {
      country_id: '101'
    };
    this.candidateService.updatedState(datas).subscribe((data: any) => {
      this.allStatesList = data[0];
      // console.log(this.allStatesList,'AllState LIST');

    }, (err) => {

    });
  }



  otherclgnameValidation(selectedValue: any,index:number) {

    this.getEducationArr.controls.forEach((data,index) => {
   // console.log('Selected value:', selectedValue);
   if (this.getEducationArr?.controls[index]['controls'][this.form_collegeName].value == 'Others') {
    // console.log('true');

    this.getEducationArr.controls[index]['controls'][this.form_othercollegeName].setValidators([Validators.required,this.glovbal_validators.descr255()],{ emitEvent: false });
    this.getEducationArr.controls[index]['controls'][this.form_othercollegeState].setValidators([Validators.required,this.glovbal_validators.alphaNum255()],{ emitEvent: false });
    this.getEducationArr['controls'][index]['controls'][this.form_othercollegeName].updateValueAndValidity();
    this.getEducationArr['controls'][index]['controls'][this.form_othercollegeState].updateValueAndValidity();

  }else{
    // console.log('false');

    this.getEducationArr.controls[index]['controls'][this.form_othercollegeName].setValue(null);
    this.getEducationArr.controls[index]['controls'][this.form_othercollegeState].setValue(null);
    this.getEducationArr.controls[index]['controls'][this.form_othercollegeName].clearValidators();
    this.getEducationArr.controls[index]['controls'][this.form_othercollegeState].clearValidators();
    this.getEducationArr['controls'][index]['controls'][this.form_othercollegeName].updateValueAndValidity();
    this.getEducationArr['controls'][index]['controls'][this.form_othercollegeState].updateValueAndValidity();

  }
    })
  }

  degreeList() {
    this.skillexService.getDegreeList().subscribe((data: any) => {
      if (data.success) {
        if (data.data.length) {
          let degreeList = data.data;
          degreeList.filter((row: any) => {

            if (row.qualification == "Diploma") {
              this.diplamoSpecialization = row.degree;
              this.diplamoSpecialization.shift();
            }
            if (row.qualification == "UG") {
              this.ugSpecializationList = row.degree;
              this.ugSpecializationList.shift();
            }
            if (row.qualification == "PG") {
              this.pgSpecializationList = row.degree;
              this.pgSpecializationList.shift();
            }
          })
        }
      }
    })
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
    this.getEducationListSubscription ? this.getEducationListSubscription.unsubscribe() : '';
    this.getAllEducationFormDropdownListSubscription ? this.getAllEducationFormDropdownListSubscription.unsubscribe() : '';

  }

}
