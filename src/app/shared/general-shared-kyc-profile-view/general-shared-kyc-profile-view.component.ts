import { RemoveWhitespace } from '../../custom-form-validators/removewhitespace';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import * as moment from 'moment'; //in your component
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import { SharedServiceService } from 'src/app/service/shared-service.service';
import { SkillexService } from 'src/app/service/skillex.service';
// import { Console } from 'console';

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
  selector: 'app-general-shared-kyc-profile-view',
  templateUrl: './general-shared-kyc-profile-view.component.html',
  styleUrls: ['./general-shared-kyc-profile-view.component.scss'],
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

export class GeneralSharedKycProfileViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('matDialog', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('matDialogSuccess', { static: false }) matDialogRefSuccess: TemplateRef<any>;
  @ViewChild('matDialogTerms', { static: false }) matDialogRefTerms: TemplateRef<any>;
  @ViewChild('matDialogBGV', { static: false }) matDialogRefBGV: TemplateRef<any>;
  @ViewChild('matDialogCaste', { static: false }) matDialogRefCaste: TemplateRef<any>;
  @ViewChild('matDialogCoc', { static: false }) matDialogRefCoc: TemplateRef<any>;
  @ViewChild('matDialogJoin', { static: false }) matDialogRefJoin: TemplateRef<any>;
  @ViewChild('matDialogDocViewer', { static: false }) matDialogRefDocViewer: TemplateRef<any>;

  @Input() nonCandidate: any;
  role = this.appConfig.getLocalData('roles');
  category = [
    {
      name: 'Scheduled Caste',
      caste: 'SC'
    },
    {
      name: 'Scheduled Tribe',
      caste: 'ST'
    },
    {
      name: 'De-notified Tribe',
      caste: 'DenotifiedTribe'
    },
    {
      name: 'Nomadic Tribe',
      caste: 'NomadicTribe'
    },
    {
      name: 'Special Backward Category',
      caste: 'SBC'
    },
    {
      name: 'Other Backward Classes',
      caste: 'OBC'
    },
    {
      name: 'General / Open Category',
      caste: 'GEN'
    },
    {
      name: 'Other',
      caste: 'Other'
    },
  ];
  productionUrl = environment.SKILLEX_BASE_URL == "https://skilledge.lntedutech.com"?true:false;
  checkFormValidRequest: Subscription;
  minDate: Date;
  maxDate: Date;
  getResumeDocuments: any[];

  showSizeError = {
    image: false,
    size: false,
    maxsize: '',
    minsize: ''
  };
  signature:any;
  isDisabled: boolean = false;
  selectedImage: any;
  // Title Dropdown list
  bloodGroupDropdownList: any;

  // Gender DropDown List
  genderDropdownList = [
    {
      label: 'Male',
      value: 'Male'
    },
    {
      label: 'Female',
      value: 'Female'
    }
  ]
  // Form control name declaration Start
  form_candidate_id = 'candidate_id';
  form_title = 'title';
  form_name = 'name';
  form_dob = 'dob';
  form_gender = 'gender';
  form_place_of_birth = 'place_of_birth';
  form_state_of_birth = 'state_of_birth';
  form_nationality = 'nationality';
  form_mother_tongue = 'mother_tongue';
  form_religion = 'religion';
  form_caste = 'caste';
  form_category = 'category';
  form_blood_group = 'blood_group';
  form_father_name = 'father_name';
  form_emergency_contact = 'emergency_contact_no';
  form_mobile = 'mobile';
  form_email = 'email';
  form_aadhar = 'aadharno';
  form_pan = 'pan_no';
  form_offer_reference = 'offer_reference';
  form_offer_date = 'offer_date';
  form_height = 'height';
  form_weight = 'weight';
  form_identification_mark1 = 'identification_mark1';
  form_identification_mark2 = 'identification_mark2';
  form_emergency_contact_name = 'emergency_contact_name';
  form_emergency_contact_relation = 'emergency_contact_relation';
  form_personal_email = 'personal_email';
  form_marital_status = 'marital_status';
  form_domicile_state = 'domicile_state';
  form_no_of_children = 'no_of_children';
  form_hobbies_intrest = 'hobbies_intrest';
  form_language_array = 'languages_known';
  form_language_name = 'language';
  form_language_is_read = 'is_read';
  form_language_is_write = 'is_write';
  form_language_is_speak = 'is_speak';

  form_passport_number = 'passport_number';
  form_name_as_in_passport = 'name_as_in_passport';
  form_profession_as_in_passport = 'profession_as_in_passport';
  form_date_of_issue = 'date_of_issue';
  form_valid_upto = 'valid_upto';
  form_place_of_issue = 'place_of_issue';
  form_country_valid_for = 'country_valid_for';

  //accomplishment

  form_certificationsArray = 'certifications';
  form_certification_name = 'certificationName';
form_certification_issuedFrom = 'certificationIssuedFrom';
form_certification_description = 'certificationDescription';
form_certification_validityFrom = 'certificationValidityFrom';
form_certification_validityUpto = 'certificationValidityUpto';
form_isexpire = 'isexpire'

form_awardsArray = 'awards';
form_award_date = 'awardDate';
form_award_title = 'awardTitle';

form_assesmentArray = 'assesments';
form_assesment_date = 'assesmentDate';
form_assesment_title = 'assesmentTitle';

form_CoursesArray = 'courses';
form_course_name = 'coursesName';
form_course_description = 'coursesdescription'

form_journalEntryArray = 'journals';
form_journalEntity_title = 'journalEntityTitle';
form_journalEntity_url = 'journalEntityUrl';
form_journalEntity_publishedOn = 'journalEntityPublishedOn';
form_journalEntity_description = 'journalEntityDescription';
  // Health

  form_serious_illness = 'serious_illness';
  form_no_of_days = 'no_of_days';
  form_nature_of_illness = 'nature_of_illness';
  form_physical_disability = 'physical_disability';
  form_left_eyepower_glass = 'left_eyepower_glass';
  form_right_eye_power_glass = 'right_eye_power_glass';
  form_physical_disability_rsn = 'physical_disability_rsn';
  // Form control name declaration end

  form_present_address_1 = 'present_line_street_addres';
  form_present_address_2 = 'present_line2_street_addre';
  form_present_address_3 = 'present_address_line_3';
  form_present_city = 'preset_city';
  form_present_state = 'present_state';
  form_present_zip_code = 'present_zip';
  form_present_region = 'present_country';
  form_same_as_checkbox = 'form_same_as_checkbox';
  form_permanent_address_1 = 'permanent_line1_street_add';
  form_permanent_address_2 = 'permanent_line2_street_add';
  form_permanent_address_3 = 'permanent_address_line_3';
  form_permanent_city = 'permanent_city';
  form_permanent_state = 'permanent_state';
  form_permanent_zip_code = 'permanent_zip';
  form_permanent_region = 'permanent_country';

  // Dependent
  form_dependent_name = 'name_of_your_family';
  form_dependent_dob = 'family_date_of_birth';
  form_dependent_relationship = 'relationship';
  form_dependent_occupation = 'occupation';
  form_dependent_differently_abled = 'differently_abled';
  form_dependent_status = 'status';
  form_isDependent = 'dependent';
  form_dependent_other = 'dependent_other';

  // Education
  form_qualification_type = 'level';
  form_qualification = 'specification';
  form_specialization = 'discipline';
  form_collegeName = 'institute';
  form_boardUniversity = 'board_university';
  form_startDate = 'start_date';
  form_endDate = 'end_date';
  form_yearpassing = 'year_of_passing';
  form_backlog = 'backlogs';
  form_mode = 'mode';
  form_cgpa = 'percentage';
  isHighLevelEdu = 'is_highLevelEdu';
  form_historyOfbacklog = 'historyOfbacklog';
  form_reasonForbacklog = 'reasonForbacklog';
  form_noActivebacklog = 'noActivebacklog';s
  form_gap = 'gap'
  form_finalcgpa = 'final_percentage';
  form_CARanks = 'rank';
  ca_bothgroup_status = 'ca_bothgroup_status';
// project
form_projectTitle = 'projectTitle';
form_typeList = 'typeList';
form_teamSize = 'teamSize';
form_projectOrganization = 'projectOrganization';
form_periodFrom = 'periodFrom';
form_periodTo = 'periodTo';
form_projectDescription = 'projectDescription';

  // Upload
  form_file_id = 'file_id';
  form_id = 'id';
  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_name_document = 'name';
  form_label = 'label';
  form_description = 'description';
  form_Not_Submitted_Description = 'not_submitted_description';
  form_expectedDate = 'expected_date';
  form_semesterArray = 'sub_documents';
  form_noofSemester = 'no_of_semester';
  form_education_level = 'education_level';
  form_bankArray = 'bank';
  form_acc_no = 'account_no';
  form_ifsc_code = 'ifsc_code';
  form_branch = 'branch';

  pdfsrc: any;

  // Acknowledgements
  acknowledgmentForm: FormGroup;
  form_bgv = 'bgv';
  form_caste_preview = 'caste';
  form_coc = 'coc';
  form_joining = 'joining';
  form_terms_conditions = 'terms_conditions';
  form_ack_place = 'ack_place';
  form_ack_date = 'ack_date';

  // Work details

  //form Variables
  form_workDetails = "workDetails";
  form_total_exp_years = "total_exp_years";
  form_total_exp_months = "total_exp_months";
  form_break_in_emp = "break_in_emp";
  form_employed_us = "employed_us";
  form_oc = "oc";
  form_payslip = "payslip";
  form_interviewed_by_us = "interviewed_by_us";
  form_post = "post";
  form_when_interview = "when_interview"
  form_employment_name_address = "employment_name_address";
  form_isWorkingHere = "is_working_here";
  form_duration_from = "duration_from";
  form_achievement = "achievement";
  form_duration_to = "duration_to";
  form_duration_year = "duration_year";
  form_duration_month = "duration_month";
  form_postion_field = "postion_field";
  form_name_designation_supervisor = "name_designation_supervisor";
  form_nature_work = "nature_work";
  form_gross_emploment = "gross_emploment";
  form_reason_leaving = "reason_leaving";
  form_hr_name = 'hr_name';
  form_hr_contact_no = 'hr_contact_no';
  form_hr_email = 'hr_email';
  //discip
  form_disciplinaryDetails='disciplinaryDetails'
  form_bgvDetails = "bgvDetails";
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

  form_Employment_Array = "Employment"

  form_Skills_Array = "skills";
  form_Skill = "skill";
  form_skilllevel_selected = "skilllevel_selected";
  form_Relatives_Array = "relatives_in_company";
  form_relatives_name = "name";
  form_relatives_position = "position";
  form_relatives_relationship = "relationship";
  form_relatives_company = "company";
  form_faculty_reference = "faculty_reference";
  form_faculty_reference_1 = "faculty_reference1";

  form_is_training_status = "is_intern_status";
  form_training_Array = "intern";
  form_training_employer_name = "employer_name";
  form_training_from_date = "from_date";
  form_training_to_date = "to_date";
  form_training_work_responsiability = "work_responsiability";

  form_training_is_articleship_status = "is_articleship_status";
  form_ca_dateofcompletion = "ca_dateofcompletion";
  form_ca_achivement = "ca_achivement";
  form_is_ca_resaon_suitable = "ca_resaon_suitable";


  personalDetails: any;
  personalDetailsMap: any;
  contactDetails: any;
  contactDetailsMap: any;
  dependentDetails: any;
  dependentDetailsMap: any;
  projectDetails: any;
  projectDetailsMap: any;
  accomplishmentDetails: any;
  accomplishmentsMap: any;
  educationDetails: any;
  educationDetailsMap: any;
  disciplinarydetails: any;
  workDetails: any;
  workDetailsMap: any;

  getAllStates: any;
  url: any;
  nonMergedPersonalDetails: any;
  allPresentCityList: any;
  allPermanentCityList: any;
  formSubmitted: boolean;
  documentDetails: any;
  actualDate: any;
  noShowWork: boolean;
  selectedPost: any;
  currentForm: boolean;
  joiningFormDataPassingSubscription: Subscription;
  newGetProfileDataSubscription: Subscription;
  getBloodGroupsSubscription: Subscription;
  updatedCitySubscription: Subscription;
  updatedCitySubscription1: Subscription;
  newSaveProfileDataSubscription: Subscription;
  workDetailsAlldata: any;
  educationDetailsAllData: any;
  projectDetailsAllData: any;
  matDialogRefDocViewerPopUpRef: any;
  termsAndCondtionsPopRef: any;
  customerName: any;
  customerCode: any;
  lttsCustomerCode = '#LTTS';
  useremail: string = "";
  disciplinaryDetails: any;
  disciplinaryDetailsAlldata: any;
  // BASE_URL = environment.API_BASE_URL;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private loadingService: LoaderService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private skillexService:SkillexService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private glovbal_validators: GlobalValidatorService,

    // private adminService: AdminServiceService,
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialization();
    this.getPreviewData();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
    this.customerCode = this.appConfig.getSelectedCustomerCode();
    this.useremail = localStorage.getItem("userEmail")
  }

  downloadAsPDF(){
    let uid = this.nonCandidate.candidate_user_id;
    this.appConfig.warning('No Documents Available');
    //  this.adminService.getprofileDoc(uid).subscribe((data: any) => {
    //    if (data) {
    //      const documents = `${this.BASE_URL}/${data}`;
    //      this.appConfig.downloadPDF(documents,'')
    //    } else {
    //      this.appConfig.warning('No Documents Available');
    //    }
    //  }, (err) => {
    //  });;
   }

  joiningFormDataFromJoiningFormComponentRxjs() {
   this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
      this.getPreviewData();
    });
  }
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  ifPreviewDetails(data) {
    this.personalDetails = data && data.personal_details ? data.personal_details : null;
    this.patchPersonalForm();
    this.contactDetails = data && data.contact_details ? data.contact_details : null;
    this.patchContactForm();
    this.accomplishmentDetails = data && data.accomplishment_details  ? data.accomplishment_details : null;
    this.patchAccomplishments();
    // console.log(data,'this.data.accomplishment_details ');

    this.dependentDetails = data && data.dependent_details && data.dependent_details.length > 0 ? data.dependent_details : [];
    if (this.dependentDetails.length > 0) {
      this.patchDependent();
    } else {
      this.dependentDetailsMap = [];
    }

    this.educationDetails = data && data.education_details && data.education_details.educations && data.education_details.educations.length > 0 ? data.education_details.educations : [];
    this.educationDetailsAllData = data.education_details ? data.education_details : null;

    this.selectedPost = data && data.education_details && data.education_details.selected_post ? data.education_details.selected_post : '';
    if (this.educationDetails.length > 0) {
      this.patchEducation();
    } else {
      this.educationDetailsMap = [];
    }



    this.projectDetails = data && data.project_details && data.project_details.projects && data.project_details.projects.length > 0 ? data.project_details.projects : [];
    // this.projectDetailsAllData = data.project_details ? data.project_details : null;
    // this.projectDetailsAllData = data.project_details && data.project_details.projects ? data.project_details.projects : null;
    // console.log( this.projectDetails,'length');
    if (this.projectDetails.length > 0) {
      this.patchProject();
    } else {
      this.projectDetailsMap = [];
    }
    // Documents mapping
    this.documentDetails = data && data.document_details ? data.document_details : null;
    if (this.documentDetails) {
      let joinCheck = [];
      let Banking_Details = [];
      let Resume = [];
      let Transfer_Certificate = [];
      let Education_Documents = [];
      if (this.documentDetails.joining_details) {
        this.documentDetails.joining_details.forEach(element => {
          if (element) {
            joinCheck.push(element);
          }
        });
      }
      if (this.documentDetails.banking_details) {
        this.documentDetails.banking_details.forEach(element => {
          if (element) {
            Banking_Details.push(element);
          }
        });
      }
      if (this.documentDetails.resume) {
        this.documentDetails.resume.forEach(element => {
          if (element) {
            Resume.push(element);
          }
        });
      }
      if (this.documentDetails.transfer_certificate) {
        this.documentDetails.transfer_certificate.forEach(element => {
          if (element) {
            Transfer_Certificate.push(element);
          }
        });
      }
      if (this.documentDetails.education_documents) {
        this.documentDetails.education_documents.forEach(element => {
          if (element && element.sub_documents) {
            Education_Documents.push(element);
          }
        });
      }
      this.documentDetails.joining_details = joinCheck;
      this.documentDetails.banking_details = Banking_Details;
      this.documentDetails.resume = Resume;
      this.pdfsrc = this.documentDetails.resume[0]?.file_path;
      if (this.pdfsrc && this.productionUrl == true) {
        this.pdfsrc = this.pdfsrc + environment.blobToken
      } else if (this.pdfsrc && this.productionUrl == false) {
        this.pdfsrc = this.pdfsrc
      }
      this.documentDetails.transfer_certificate = Transfer_Certificate;
      this.documentDetails.education_documents = Education_Documents;
      if ((joinCheck && joinCheck.length > 0) || (Banking_Details && Banking_Details.length > 0) || (Resume && Resume.length > 0) || (Transfer_Certificate && Transfer_Certificate.length > 0) || (Education_Documents && Education_Documents.length > 0) || (this.documentDetails && this.documentDetails.certifications && this.documentDetails.certifications.length > 0) || (this.documentDetails && this.documentDetails.other_certifications && this.documentDetails.other_certifications.length > 0)) {

      } else {
        this.documentDetails = null;
      }
    }
    // this.patchingCriminal();

    // Work Experience
    this.getWorkApiDetails(data);
    //disciplinary
    this.disciplinarydetails = data && data.disciplinary_details && data.disciplinary_details.bgv_details ;
    this.patchDisciplinary();
    // Acknowledgements section show, When form is not submitted
    this.ifFormNotSubmitted(data);
    this.getStateAPI();
  }
  ifFormNotSubmitted(data) {
    if (data && data.acknowledgement) {
      let ackData = data.acknowledgement.acknowledgement;
      let ack = {
        // [this.form_bgv]: ackData.bgv && (ackData.bgv == '1' || ackData.bgv == true) ? false : false,
        // [this.form_caste]: ackData.caste && (ackData.caste == '1' || ackData.caste == true) ? false : false,
        // [this.form_coc]: ackData.coc && (ackData.coc == '1' || ackData.coc == true) ? false : false,
        // [this.form_joining]: ackData.joining && (ackData.joining == '1' || ackData.joining == true) ? false : false,
        [this.form_terms_conditions]: null,
        [this.form_ack_place]: ackData?.ack_place ? ackData?.ack_place : null,
        [this.form_ack_date]: ackData?.ack_date ? this.dateConvertionForm(new Date()) : this.dateConvertionForm(new Date()),
      }
      this.actualDate = ackData?.ack_date;
      this.patchAcknowledgementForm(ack);
    }
    if (data && data.acknowledgement && data.acknowledgement.signature_image) {
      let sign = data.acknowledgement.signature_image;
      this.signature = {
        name: 'Signature',
        label: 'Signature',
        // file_id: sign.file_id,
        file_path: sign.file_path,
        // file_size: sign.file_size,
        // filename: sign.filename,
        // filetype: sign.filetype,
      }
    }
  }
  getPreviewData() {

      if (this.candidateService.getLocalProfileData()) {
        // this.checkFormSubmitted();
        let apiPreviewDetails = this.candidateService.getLocalProfileData();
        this.ifPreviewDetails(apiPreviewDetails);
      }

  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, 0, 1);
    this.maxDate = new Date(currentYear + 1, 0, 0);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      return split;
    }
  }

  dateConvertionForm(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

//   checkFormSubmitted() {
//     if (this.nonCandidate) {
//       return this.formSubmitted = true;
//     }
//     if (this.appConfig.getLocalData('joiningFormAccess') == 'true') {
//      return this.formSubmitted = this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().submitted == '1' ? true : false;
//     }
//     if (this.appConfig.getLocalData('isEditAllowed') == 'false') {
//      return this.formSubmitted = true;
//     } else {
//       return this.formSubmitted = false;
//     }
// }

  getStateAPI() {

    const datas = {
      country_id: '101'
    };
    this.candidateService.updatedState(datas).subscribe((data: any) => {
      this.getAllStates = data[0];
      this.getAllStates.forEach(element => {
        if (element.id == this.personalDetails[this.form_state_of_birth]) {
          this.personalDetailsMap[this.form_state_of_birth] = element.name;
        }
        if (element.id == this.personalDetails[this.form_domicile_state]) {
          this.personalDetailsMap[this.form_domicile_state] = element.name;
        }
        if (element.id == this.contactDetails[this.form_present_state]) {
          this.contactDetailsMap[this.form_present_state] = element.name;
          this.getAllPresentCities(element.id, this.contactDetails[this.form_present_city], (callback) => {
            this.contactDetailsMap[this.form_present_city] = callback ? callback : 'NIL';
        });
        }
        if (element.id == this.contactDetails[this.form_permanent_state]) {
          this.contactDetailsMap[this.form_permanent_state] = element.name;
          this.getAllPermanentCities(element.id, this.contactDetails[this.form_permanent_city], (callback) => {
            this.contactDetailsMap[this.form_permanent_city] = callback ? callback : 'NIL';
          });
        }
      });
      this.getBloodGroup();
    }, (err) => {

    });
  }

  patchBloodGroup() {
      this.bloodGroupDropdownList.forEach(element => {
        if (element.bloodgroup_id == this.personalDetails[this.form_blood_group]) {
          this.personalDetailsMap[this.form_blood_group] = element.bloodgroup_name;
        }
      });
  }

  getBloodGroup() {
    if (this.appConfig.getLocalData('bloodgroup')) {
      this.bloodGroupDropdownList = JSON.parse(this.appConfig.getLocalData('bloodgroup'));
      this.patchBloodGroup();
    } else {
     this.getBloodGroupsSubscription = this.candidateService.getBloodGroups().subscribe((data: any) => {
        this.bloodGroupDropdownList = data;
        this.bloodGroupDropdownList && this.bloodGroupDropdownList.length > 0 ? this.appConfig.setLocalData('bloodgroup', JSON.stringify(this.bloodGroupDropdownList)) : '';
        this.patchBloodGroup();
      }, (err) => {

      });
    }
  }

  dateConvertion(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  dateConvertionMonth(date) {
    if (date) {
      const split = moment(date).format('MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  formInitialization() {
    this.acknowledgmentForm = this.fb.group({
      // [this.form_bgv]: [null, [Validators.required ]],
      // [this.form_caste_preview]: [null, [Validators.required ]],
      // [this.form_coc]: [null, [Validators.required ]],
      // [this.form_joining]: [null,[Validators.required ]],

      [this.form_terms_conditions]: [null, [Validators.requiredTrue, Validators.nullValidator]],
      [this.form_ack_place]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      [this.form_ack_date]: [{ value: this.dateConvertionForm(new Date()), disabled: true }, [Validators.required]]
    });

  }

  patchAcknowledgementForm(data) {
    this.acknowledgmentForm.patchValue(data);
  }


  patchWorkDetails() {
    if (this.workDetails.Employment && this.workDetails.Employment.length > 0) {
      let experience = [];
      this.workDetails.Employment.forEach(element => {
        if (element && element[this.form_employment_name_address]) {
          experience.push(element);
        }
      });
      this.workDetails.Employment = experience;
    }

    if (this.workDetails && this.workDetails.intern && this.workDetails.intern.length > 0) {
      let training = [];
// console.log(this.workDetails.intern,'this.workDetails.intern');

      this.workDetails.intern.forEach((element) => {
        element[this.form_training_employer_name] = element?.[this.form_training_employer_name] ? element?.[this.form_training_employer_name] : 'NIL';
        element[this.form_training_from_date] = element?.[this.form_training_from_date] ? element?.[this.form_training_from_date] : 'NIL';
        element[this.form_training_to_date] = element?.[this.form_training_to_date] ? element?.[this.form_training_to_date] : 'NIL';
        element[this.form_training_work_responsiability] = element?.[this.form_training_work_responsiability] ? element?.[this.form_training_work_responsiability] : 'NIL';
      });
      this.workDetails.intern = training;
    }

    if (this.workDetails.workDetails) {
      let work = this.workDetails.workDetails;
      work[this.form_break_in_emp] = work[this.form_break_in_emp] ? work[this.form_break_in_emp] : null;
      work[this.form_employed_us] = work[this.form_employed_us] == '1' ? true : false;
      work[this.form_interviewed_by_us] = work[this.form_interviewed_by_us] == '1' ? true : false;
      work[this.form_total_exp_months] = work[this.form_total_exp_months] ? Number(work[this.form_total_exp_months]) : 0;
      work[this.form_total_exp_years] = work[this.form_total_exp_years] ? Number(work[this.form_total_exp_years]) : 0;
      this.workDetails.workDetails = work;
    }
  }

  getWorkApiDetails(datas) {
    if (datas && datas['experience_details']) {
      let data = datas['experience_details'];
      this.workDetailsAlldata = data ? data : null;
      let work = {
        workDetails: data && data.work_details ? data.work_details : null,
        Employment: data && data.employments ? data.employments : [],
        intern: data && data.intern ? data.intern : [],
        // bgvDetails: data && data.bgv_details ? data.bgv_details : null,
        relatives: data && data[this.form_Relatives_Array] && data[this.form_Relatives_Array].length > 0 ? data[this.form_Relatives_Array] : null,
        // skills: data && data[this.form_Skills_Array] && data[this.form_Skills_Array].length > 0 ? data[this.form_Skills_Array] : null,
        skills:null,
        faculty: data && data['faculty_references'] && data['faculty_references'].length > 0 ? data['faculty_references'] : null,
      }
      if((data && data[this.form_Skills_Array]?.length)){
        if( data[this.form_Skills_Array][0].skill){
          work.skills = data[this.form_Skills_Array]
        }else{
          work.skills =  data[this.form_Skills_Array];
        }
    }
      this.workDetails = work;
      this.patchWorkDetails();
      // this.patchingCriminal();
      // if ((work.workDetails && (work.workDetails.break_in_emp || work.workDetails.employed_us == '1' || work.workDetails.interviewed_by_us == '1' || work.workDetails.total_exp_months || work.workDetails.total_exp_years)) || (this.workDetails.bgvDetails && this.workDetails.bgvDetails.show) || (work.Employment && work.Employment.length > 0 && work.Employment[0] && work.Employment[0][this.form_employment_name_address] ) || this.workDetails.relatives || this.workDetails.skills || this.workDetails.faculty || (this.workDetailsAlldata && (this.workDetailsAlldata[this.form_training_is_articleship_status] || this.workDetailsAlldata[this.form_ca_achivement] || this.workDetailsAlldata[this.form_is_ca_resaon_suitable]))) {
      //   this.noShowWork = false;
      // } else {
      //   this.noShowWork = true;
      // }
    } else {
      this.workDetails = null;
    }
}

  customEducationLabel(label) {
    if (label == 'SSLC') {
      return 'SSLC/10th';
    }
    if (label == 'HSC') {
      return 'HSC/12th';
    }
    if (label == 'UG') {
      return 'Undergraduate';
    }
    if (label == 'PG') {
      return 'Postgraduate';
    }
    return label;
  }

  patchEducation() {
    this.educationDetailsMap = [];
    this.educationDetails.forEach(element => {
      if (element) {
        if (element[this.form_qualification_type] == 'SSLC') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'SSLC/10th' : 'NIL';
        }
        if (element[this.form_qualification_type] == 'HSC') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'HSC/12th' : 'NIL';
        }
        if (element[this.form_qualification_type] == 'UG') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'Undergraduate' : 'NIL';
        }
        if (element[this.form_qualification_type] == 'PG') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'Postgraduate' : 'NIL';
        }
        element[this.form_qualification_type] = element?.[this.form_qualification_type] ? element?.[this.form_qualification_type] : 'NIL';
        element[this.form_qualification] = element?.[this.form_qualification] ? element?.[this.form_qualification] : '';
        element[this.form_boardUniversity] = element?.[this.form_boardUniversity] ? element?.[this.form_boardUniversity] : '';
        element[this.form_collegeName] = element?.[this.form_collegeName] ? element?.[this.form_collegeName] : '';
        element[this.form_specialization] = element?.[this.form_specialization] ? element?.[this.form_specialization] : '';
        element[this.isHighLevelEdu] = element && element[this.isHighLevelEdu]!= undefined && element[this.isHighLevelEdu]? true : false;
       // console.log("element[this.isHighLevelEdu]",element)
        element[this.form_cgpa] = element?.[this.form_cgpa] ? element?.[this.form_cgpa] : 'NIL';
        element[this.form_gap] = element?.[this.form_gap] && (element[this.form_gap] == 'true')? 'Yes' : 'No';
        element[this.form_finalcgpa] = element?.[this.form_finalcgpa] ? element?.[this.form_finalcgpa] : 'NIL';
        element[this.form_backlog] = element?.[this.form_backlog] ? element?.[this.form_backlog] : 0;
        element[this.form_startDate] = element[this.form_startDate] ? this.dateConvertion(element[this.form_startDate]) : '';
        element[this.form_endDate] = element[this.form_endDate] ? this.dateConvertion(element[this.form_endDate]) : '';
        element[this.form_yearpassing] = element[this.form_yearpassing] ? this.dateConvertionMonth(element[this.form_yearpassing]) : '';
        element[this.form_mode] = element[this.form_mode] == 'fulltime' ? 'Full time' : element[this.form_mode] == 'parttime' ? 'Part-time' : 'NIL';
        this.educationDetailsMap.push(element);

      }
    });
    // console.log(this.educationDetailsMap[this.educationDetailsMap.length-1],'educationDetailsMap');

  }

  patchDependent() {
    this.dependentDetailsMap = [];
    this.dependentDetails.forEach(element => {
      if (element) {
        element[this.form_dependent_dob] = element?.[this.form_dependent_dob] ? this.dateConvertion(element[this.form_dependent_dob]) : 'NIL';
        element[this.form_dependent_differently_abled] = element?.[this.form_dependent_differently_abled] == '1' ? 'Yes' : element[this.form_dependent_differently_abled] == '0' ? 'No' : 'NIL';
        element[this.form_dependent_status] = element?.[this.form_dependent_status] == '1' ? 'Active' : element[this.form_dependent_status] == '0' ? 'Inactive' : 'NIL';
        element[this.form_isDependent] = element?.[this.form_isDependent] == '1' ? 'Yes' : element[this.form_isDependent] == '0' ? 'No' : 'NIL';
        element[this.form_dependent_occupation] = element?.[this.form_dependent_occupation] ? element[this.form_dependent_occupation] : 'NIL';
        element[this.form_dependent_relationship] = element?.[this.form_dependent_relationship] ? element[this.form_dependent_relationship] : 'NIL';
        element[this.form_dependent_other] = element?.[this.form_dependent_other] ? element[this.form_dependent_other] : 'NIL';
        this.dependentDetailsMap.push(element);
      }
    });
  }

  patchProject() {
    this.projectDetailsMap = [];
    // console.log(this.projectDetails,'this.projectDetailspatch');
    this.projectDetails.forEach(element => {
      if (element) {
        element[this.form_typeList] = element?.[this.form_typeList] ? element[this.form_typeList] : 'NIL';
        element[this.form_teamSize] = element?.[this.form_teamSize] ? element[this.form_teamSize] : 'NIL';
        element[this.form_projectTitle] = element?.[this.form_projectTitle] ? element[this.form_projectTitle]  : 'NIL';
        element[this.form_periodFrom] = element?.[this.form_periodFrom] ? this.dateConvertion(element[this.form_periodFrom])  : 'NIL';
        element[this.form_periodTo] = element?.[this.form_periodTo] ? this.dateConvertion(element[this.form_periodTo])  : 'NIL';
        element[this.form_projectDescription] = element?.[this.form_projectDescription] ? element[this.form_projectDescription] : 'NIL';
        element[this.form_projectOrganization] = element?.[this.form_projectOrganization] ? element[this.form_projectOrganization] : 'NIL';
        // element[this.form_periodTo] = element?.[this.form_dependent_occupation] ? element[this.form_dependent_occupation] : 'NA';
        this.projectDetailsMap.push(element);
        // console.log(this.projectDetailsMap,'this.projectDetailsMap');
      }
    });

  }
  trimFilename(fileName: any) {
    if (fileName = this.documentDetails.resume[0].file_path) {
      let replaceFilename = '';
      let pdfname =fileName.split('/').pop().split('.')[0];
      replaceFilename =
      pdfname.length > 25 ? pdfname.slice(0, 25) + '...' : pdfname;
      return replaceFilename;
    }
    return '';
  }

  getAllPresentCities(id, cityId, callback) {
    const ApiData = {
      state_id: id
    };
    let city;
   this.updatedCitySubscription = this.skillexService.districtList(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;

      this.allPresentCityList = datas.data;
      this.allPresentCityList.forEach(element => {
        if (element.id == cityId) {
          city = element.name;
        }
      });
      callback(city);
    }, (err) => {
      callback(null);
    });
  }

  getAllPermanentCities(id, cityId, callback) {
    const ApiData = {
      state_id: id
    };
    let city;
   this.updatedCitySubscription1 = this.skillexService.districtList(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;

      this.allPermanentCityList = datas.data;
      this.allPermanentCityList.forEach(element => {
        if (element.id == cityId) {
          city = element.name;
        }
      });
      callback(city);
    }, (err) => {
      callback(null);
    });
  }

  patchDisciplinary(){
    if (this.disciplinarydetails) {
            this.patchingCriminal();
    }
  }
  patchingCriminal() {
    let bgv;
    if (this.disciplinarydetails) {
      let data = this.disciplinarydetails;
      bgv = {
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
      }
    } else {
      bgv = {
        [this.form_convicted_by_Court]: null,
        [this.form_arrested]: null,
        [this.form_prosecuted]: null,
        [this.form_detention]: null,
        [this.form_fined_by_court]: null,
        [this.form_debarred_exam_university]: null,
        [this.form_debarred_psc_company]: null,
        [this.form_court_case_pending]: null,
        [this.form_university_case_pending]: null,
        [this.form_disciplinary_proceedings]: null,
        [this.form_full_particulars]: null
      }
    }
    if (
      bgv[this.form_convicted_by_Court] ||
      bgv[this.form_arrested] ||
      bgv[this.form_prosecuted] ||
      bgv[this.form_detention] ||
      bgv[this.form_fined_by_court] ||
      bgv[this.form_debarred_exam_university] ||
      bgv[this.form_debarred_psc_company] ||
      bgv[this.form_court_case_pending] ||
      bgv[this.form_university_case_pending] ||
      bgv[this.form_disciplinary_proceedings]) {
      bgv.show = true;
    } else {
      bgv.show = false;
    }
    this.disciplinarydetails = bgv;
  }
  patchContactForm() {
    let presentState: any;
    let permanentState: any;
    let presentCity: any;
    let permanentCity: any;
    // console.log(this.contactDetails)
    const data = {
      [this.form_present_address_1]: this.contactDetails?.[this.form_present_address_1] ? this.contactDetails[this.form_present_address_1] : null,
      [this.form_present_address_2]: this.contactDetails?.[this.form_present_address_2] ? this.contactDetails[this.form_present_address_2] : null,
      [this.form_present_address_3]: this.contactDetails?.[this.form_present_address_3] ? this.contactDetails[this.form_present_address_3] : null,
      // [this.form_present_city]: presentCity ? presentCity : 'NA',
      // [this.form_present_state]: presentState ? presentState : 'NA',
      [this.form_present_region]: this.contactDetails?.[this.form_present_region] ? 'India' : 'NIL',
      [this.form_present_zip_code]: this.contactDetails?.[this.form_present_zip_code] ? this.contactDetails[this.form_present_zip_code] : 'NIL',
      [this.form_same_as_checkbox]: this.contactDetails?.[this.form_same_as_checkbox] ? this.contactDetails[this.form_same_as_checkbox] : false,
      [this.form_permanent_address_1]: this.contactDetails?.[this.form_permanent_address_1] ? this.contactDetails[this.form_permanent_address_1] : null,
      [this.form_permanent_address_2]: this.contactDetails?.[this.form_permanent_address_2] ? this.contactDetails[this.form_permanent_address_2] : null,
      [this.form_permanent_address_3]: this.contactDetails?.[this.form_permanent_address_3] ? this.contactDetails[this.form_permanent_address_3] : null,
      // [this.form_permanent_city]: permanentCity ? permanentCity : 'NA',
      // [this.form_permanent_state]: permanentState ? permanentState : 'NA',
      [this.form_permanent_region]: this.contactDetails?.[this.form_permanent_region] ? 'India' : 'NIL',
      [this.form_permanent_zip_code]: this.contactDetails?.[this.form_permanent_zip_code] ? this.contactDetails[this.form_permanent_zip_code] : 'NIL'
    };
    this.contactDetailsMap = data;
    // console.log(this.contactDetailsMap)
    this.contactDetailsMap.presentAddress =  this.getPresentAddress(this.contactDetails?.[this.form_present_address_1], this.contactDetails?.[this.form_present_address_2], this.contactDetails?.[this.form_present_address_3]);
    this.contactDetailsMap.permanentAddress = this.getPermanentAddress(this.contactDetails?.[this.form_permanent_address_1], this.contactDetails?.[this.form_permanent_address_2], this.contactDetails?.[this.form_permanent_address_3]);
  }

  getPresentAddress(p1,p2,p3) {
    if (p1 || p2 || p3) {
      let present = '';
      present = p1 ? p1 : '';
      present = p2 ? present + ', ' + p2 : present;
      present = p3 ? present + ', ' + p3 : present;
      return `${present}`;
    }
    return 'NIL';
  }

  getPermanentAddress(p1,p2,p3) {
    if (p1 || p2 || p3) {
      let present = '';
      present = p1 ? p1 : '';
      present = p2 ? present + ', ' + p2 : present;
      present = p3 ? present + ', ' + p3 : present;
      return `${present}`;
    }
    return 'NIL';
  }

  patchAccomplishments(){
    // this.accomplishmentsMap = [];
    // this.accomplishmentDetails.forEach(element => {
    //   if (element) {

    //   }
    // });
    const data = {
      [this.form_certificationsArray]: this.accomplishmentDetails?.[this.form_certificationsArray] && this.accomplishmentDetails?.[this.form_certificationsArray].length > 0 ? this.accomplishmentDetails[this.form_certificationsArray] : [],
      [this.form_journalEntryArray]: this.accomplishmentDetails?.[this.form_journalEntryArray] && this.accomplishmentDetails?.[this.form_journalEntryArray].length > 0 ? this.accomplishmentDetails[this.form_journalEntryArray] : [],
      [this.form_awardsArray]: this.accomplishmentDetails?.[this.form_awardsArray] && this.accomplishmentDetails?.[this.form_awardsArray].length > 0 ? this.accomplishmentDetails[this.form_awardsArray] : [],
      [this.form_assesmentArray]: this.accomplishmentDetails?.[this.form_assesmentArray] && this.accomplishmentDetails?.[this.form_assesmentArray].length > 0 ? this.accomplishmentDetails[this.form_assesmentArray] : [],

    };
    this.accomplishmentsMap = data;
  }

  patchPersonalForm() {
    let stateOfBirth: any;
    let bloodGroup: any;
    let category: any;
    let domicile: any;
    if (this.category && this.personalDetails[this.form_category]) {
      this.category.forEach(element => {
        if (element.caste == this.personalDetails[this.form_category]) {
          category = element.name;
        }
      });
    }
    const data = {
      // if(this.personalDetails[this.form_hobbies_intrest].length) {
      //   this.hobbies = this.personalDetails[this.form_hobbies_intrest];
      // }
      // [this.form_title]: this.personalDetails[this.form_title],
      [this.form_name]: this.personalDetails?.[this.form_name] ? this.personalDetails[this.form_name] : 'NIL',
      [this.form_dob]: this.personalDetails?.[this.form_dob] ? this.dateConvertion(this.personalDetails[this.form_dob]) : 'NIL',
      [this.form_gender]: this.personalDetails?.[this.form_gender] ? this.personalDetails[this.form_gender] : 'NIL',
      [this.form_place_of_birth]: this.personalDetails?.[this.form_place_of_birth] ? this.personalDetails[this.form_place_of_birth] : 'NIL',
      // [this.form_state_of_birth]: stateOfBirth ? stateOfBirth : 'NA',
      [this.form_nationality]: this.personalDetails?.[this.form_nationality] ? this.personalDetails[this.form_nationality] : 'NIL',
      [this.form_mother_tongue]: this.personalDetails?.[this.form_mother_tongue] ? this.personalDetails[this.form_mother_tongue] : 'NIL',
      [this.form_religion]: this.personalDetails?.[this.form_religion] ? this.personalDetails[this.form_religion] : 'NIL',
      [this.form_caste]: this.personalDetails?.[this.form_caste] ? this.personalDetails[this.form_caste] : 'NIL',
      [this.form_category]: category ? category : 'NIL',
      // [this.form_blood_group]: bloodGroup ? bloodGroup : 'NA',
      [this.form_father_name]: this.personalDetails?.[this.form_father_name] ? this.personalDetails[this.form_father_name] : 'NIL',
      [this.form_emergency_contact]: this.personalDetails?.[this.form_emergency_contact] ? this.personalDetails[this.form_emergency_contact] : 'NIL',
      [this.form_mobile]: this.personalDetails?.[this.form_mobile] ? this.personalDetails[this.form_mobile] : 'NIL',
      [this.form_email]: this.personalDetails?.[this.form_email] ? this.personalDetails[this.form_email] : 'NIL',
      [this.form_aadhar]: this.personalDetails?.[this.form_aadhar] ? this.personalDetails[this.form_aadhar] : 'NIL',
      [this.form_pan]: this.personalDetails?.[this.form_pan] ? this.personalDetails[this.form_pan] : 'NIL',
      [this.form_offer_reference]: this.personalDetails?.[this.form_offer_reference] ? this.personalDetails[this.form_offer_reference] : 'NIL',
      [this.form_offer_date]: this.personalDetails?.[this.form_offer_date] ? this.dateConvertion(this.personalDetails[this.form_offer_date]) : 'NIL',
      [this.form_height]: this.personalDetails?.[this.form_height] ? this.personalDetails[this.form_height] : 'NIL',
      [this.form_weight]: this.personalDetails?.[this.form_weight] ? this.personalDetails[this.form_weight] : 'NIL',
      [this.form_emergency_contact_name]: this.personalDetails?.[this.form_emergency_contact_name] ? this.personalDetails[this.form_emergency_contact_name] : 'NIL',
      [this.form_emergency_contact_relation]: this.personalDetails?.[this.form_emergency_contact_relation] ? this.personalDetails[this.form_emergency_contact_relation] : 'NIL',
      [this.form_personal_email]: this.personalDetails?.[this.form_personal_email] ? this.personalDetails[this.form_personal_email] : 'NIL',
      [this.form_marital_status]: this.personalDetails?.[this.form_marital_status] ? this.personalDetails[this.form_marital_status] : 'NIL',
      [this.form_no_of_children]: this.personalDetails?.[this.form_no_of_children] ? this.personalDetails[this.form_no_of_children] : 'NIL',
      // [this.form_domicile_state]: domicile ? domicile : 'NA',
      [this.form_identification_mark1]: this.personalDetails?.[this.form_identification_mark1] ? this.personalDetails[this.form_identification_mark1] : 'NIL',
      [this.form_identification_mark2]: this.personalDetails?.[this.form_identification_mark2] ? this.personalDetails[this.form_identification_mark2] : 'NIL',
      [this.form_hobbies_intrest]: this.personalDetails?.[this.form_hobbies_intrest] && this.personalDetails?.[this.form_hobbies_intrest].length > 0 ? this.personalDetails?.[this.form_hobbies_intrest] : [],
      [this.form_language_array]: this.personalDetails?.[this.form_language_array] && this.personalDetails?.[this.form_language_array].length > 0 ? this.personalDetails[this.form_language_array] : [],
      [this.form_passport_number]: this.personalDetails?.[this.form_passport_number] ? this.personalDetails[this.form_passport_number] : 'NIL',
      [this.form_name_as_in_passport]: this.personalDetails?.[this.form_name_as_in_passport] ? this.personalDetails[this.form_name_as_in_passport] : 'NIL',
      [this.form_profession_as_in_passport]: this.personalDetails?.[this.form_profession_as_in_passport] ? this.personalDetails[this.form_profession_as_in_passport] : 'NIL',
      [this.form_date_of_issue]: this.personalDetails?.[this.form_date_of_issue] ? this.dateConvertion(this.personalDetails[this.form_date_of_issue]) : 'NIL',
      [this.form_valid_upto]: this.personalDetails?.[this.form_valid_upto] ? this.dateConvertion(this.personalDetails[this.form_valid_upto]) : 'NIL',
      [this.form_place_of_issue]: this.personalDetails?.[this.form_place_of_issue] ? this.personalDetails[this.form_place_of_issue] : 'NIL',
      [this.form_country_valid_for]: this.personalDetails?.[this.form_country_valid_for] ? this.personalDetails[this.form_country_valid_for] : 'NIL',
      [this.form_serious_illness]: this.personalDetails?.[this.form_serious_illness] ? this.personalDetails[this.form_serious_illness] : 'NIL',
      [this.form_no_of_days]: this.personalDetails?.[this.form_no_of_days] ? this.personalDetails[this.form_no_of_days] : 'NIL',
      [this.form_nature_of_illness]: this.personalDetails?.[this.form_nature_of_illness] ? this.personalDetails[this.form_nature_of_illness] : 'NIL',
      [this.form_physical_disability]: this.personalDetails[this.form_physical_disability] && (this.personalDetails[this.form_physical_disability] == 'true') ? 'Yes': 'No',
      [this.form_physical_disability_rsn]: this.personalDetails?.[this.form_physical_disability_rsn] ? this.personalDetails[this.form_physical_disability_rsn] : 'NIL',
      [this.form_left_eyepower_glass]: this.personalDetails?.[this.form_left_eyepower_glass] ? this.personalDetails[this.form_left_eyepower_glass] : 'NIL',
      [this.form_right_eye_power_glass]: this.personalDetails?.[this.form_right_eye_power_glass] ? this.personalDetails[this.form_right_eye_power_glass] : 'NIL',
      [this.form_isWorkingHere]: this.personalDetails?.[this.form_isWorkingHere] ? this.personalDetails[this.form_isWorkingHere] : 'false',
      // [this.form_employment_name_address]: this.personalDetails?.[this.form_employment_name_address] ? this.personalDetails[this.form_employment_name_address] : 'NA'

    };
    this.url = this.personalDetails?.profileImage;
    this.personalDetailsMap = data;
  }


  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
      if (data.current == 'preview') {
        return this.appConfig.routeNavigation(data.goto);
      }
    });
  }

  formSubmitFinal() {
    if (this.acknowledgmentForm.valid) {
      // console.log(this.signature,'');
      if (this.signature && this.signature?.file_path && this.checkAllFormsValid()) {
        return this.matDialogOpen();
      }
      this.signature && this.signature.file_path ? '' : this.appConfig.nzNotification('error', 'Not Submitted', 'Please upload your Signature to submit the form');
    } else {
      this.glovbal_validators.validateAllFields(this.acknowledgmentForm);
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields in Acknowledgements and Declarations');
    }
  }

  checkAllFormsValid() {
    let formSections = this.candidateService.getLocalsection_flags();
    if (
      formSections['contact_details'] == '1' &&
      formSections['dependent_details'] == '1' &&
      formSections['document_details'] == '1' &&
      formSections['education_details'] == '1' &&
      formSections['experience_details'] == '1' &&
      formSections['personal_details'] == '1' &&
      formSections['project_details'] == '1' &&
      formSections['accomplishment_details'] == '1' &&
      formSections['disciplinary_details'] == '1'
      // formSections['project_details'] == '1' &&
      ) {
      return true;
    } else {
     formSections['personal_details'] != '1' ? this.appConfig.nzNotification('error', 'Personal Details', 'Go back and submit the personal details form again') : formSections['contact_details'] != '1' ? this.appConfig.nzNotification('error', 'Contact Details', 'Go back and submit the contact details form again') : formSections['dependent_details'] != '1' ? this.appConfig.nzNotification('error', 'Dependent Details', 'Go back and submit the dependent details form again') : formSections['document_details'] != '1' ? this.appConfig.nzNotification('error', 'Upload documents', 'Go back and submit the upload documents form again') : formSections['education_details'] != '1' ? this.appConfig.nzNotification('error', 'Education Details', 'Go back and submit the education details form again') : formSections['experience_details'] != '1' ? this.appConfig.nzNotification('error', 'Work Experience Details', 'Go back and submit the work experience details form again') : formSections['project_details'] != '1' ? this.appConfig.nzNotification('error', 'project Details', 'Go back and submit the project details form again') : formSections['accomplishment_details'] != '1' ? this.appConfig.nzNotification('error', 'accomplishments', 'Go back and submit the accomplishments form again') : formSections['disciplinary_details'] != '1' ? this.appConfig.nzNotification('error', 'discipilinary Details', 'Go back and submit the discipilinary details form again'): '';
     return false;
    }
  }
  matDialogOpen() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForForms'
    });
  }
  matSuccessMsgOpen(){
    const dialogRef = this.dialog.open(this.matDialogRefSuccess, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'popupModalContainerForForms'
    });
     this.formSubmit();

  }
  closeDialog(e) {
    if (e == 'save') {
      this.dialog.closeAll();
      this.isDisabled = true;
 return this.matSuccessMsgOpen()
      // this.formSubmit();
    } else {
      this.dialog.closeAll();
    }
  }

  matDialogOpenTerms(type) {
    let name;
    if (type == 'terms') {
      name = this.matDialogRefTerms;
    }
    if (type == 'bgv') {
      name = this.matDialogRefBGV;
    }
    if (type == 'coc') {
      name = this.matDialogRefCoc;
    }
    if (type == 'caste') {
      name = this.matDialogRefCaste;
    }
    if (type == 'join') {
      name = this.matDialogRefJoin;
    }

    this.termsAndCondtionsPopRef = this.dialog.open(name, {
      width: '890px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'wrapper-kyc-terms'
    });
  }

  kycTerms() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Bulk Upload helper video',
        componentData: '',
        type: 'kyc-terms',
        identity: 'kyc-terms'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.appConfig.terms(ModalBoxComponent, data);
  }

  openMatDialog(src, type) {
    if (!type.includes('application/pdf')) {
      return window.open(src, '_blank');
    }
    this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    this.matDialogRefDocViewerPopUpRef = this.dialog.open(this.matDialogRefDocViewer, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForPDFViewer'
    });
  }
  closeBox() {
    this.matDialogRefDocViewerPopUpRef ? this.matDialogRefDocViewerPopUpRef.close() : '';
    this.termsAndCondtionsPopRef ? this.termsAndCondtionsPopRef.close() : '';
  }

  formSubmit(routeValue?: any) {
    let ackForm = this.acknowledgmentForm.getRawValue();
    // ackForm[this.form_bgv] = ackForm[this.form_bgv] && (ackForm[this.form_bgv] == '1' || ackForm[this.form_bgv] == true) ? '1' : '0';
    // ackForm[this.form_coc] = ackForm[this.form_coc] && (ackForm[this.form_coc] == '1' || ackForm[this.form_coc] == true) ? '1' : '0';
    // ackForm[this.form_joining] = ackForm[this.form_joining] && (ackForm[this.form_joining] == '1' || ackForm[this.form_joining] == true) ? '1' : '0';
    // ackForm[this.form_caste_preview] = ackForm[this.form_caste_preview] && (ackForm[this.form_caste_preview] == '1' || ackForm[this.form_caste_preview] == true) ? '1' : '0';
    ackForm[this.form_terms_conditions] = ackForm[this.form_terms_conditions]?ackForm[this.form_terms_conditions]:null;
    let apiData = {
      // selected_post: this.selectedPost,
      acknowledgement: ackForm,
      signature_image: this.signature
    }
    const ProfileSubmitApiRequestDetails = {
      email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
      section_name: "acknowledgement",
      saving_data: apiData
    }
   this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(ProfileSubmitApiRequestDetails).subscribe((data: any) => {
    this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
    this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
    //this.appConfig.nzNotification('success', 'Saved','Profile form submitted successfully');
    // this.sharedService.joiningFormStepperStatus.next();
    // return this.appConfig.routeNavigation(routeValue ? routeValue : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT);
    });
  }

  editRoute(route) {
    if (route == 'personal') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL);
    }
    if (route == 'contact') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
    }
    if (route == 'dependent') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT);
    }
    if (route == 'education') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (route == 'work') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
    }
    if (route == 'project') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT);
    }
    if (route == 'accomplishments') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS);
    }
    if (route == 'upload') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
    }
    if (route == 'disciplinary') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DISCIPLINARY_DETAILS);
    }
  }

  routeNext(route) {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
  }

  //Form Getter
  get bgv() {
    return this.acknowledgmentForm.get(this.form_bgv);
  }
  get caste_preview() {
    return this.acknowledgmentForm.get(this.form_caste_preview);
  }
  get coc() {
    return this.acknowledgmentForm.get(this.form_coc);
  }
  get joining() {
    return this.acknowledgmentForm.get(this.form_joining);
  }
  get terms_conditions() {
    return this.acknowledgmentForm.get(this.form_terms_conditions);
  }
  get ack_place() {
    return this.acknowledgmentForm.get(this.form_ack_place);
  }
  get ack_date() {
    return this.acknowledgmentForm.get(this.form_ack_date);
  }


  async uploadImage(file) {
     try {

      this.loadingService.setLoading(true);
      const data = await (await this.skillexService.uploadfile(file)).subscribe((data:any)=>{


        if (data && !data.success) {
                this.loadingService.setLoading(false);
              return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
              }
              this.loadingService.setLoading(false);
              if (data && data.data && data.success==true) {
                this.signature = {
                  email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
                  name: 'Signature',
                  label: 'Signature',
                  // file_id: data.file_id,
                  file_path: data.data,
                  // file_size: data.data.file_size,
                  // filename: data.data.file_name,
                  // filetype: data.data.type,
                };
              }

              this.appConfig.nzNotification('success', 'Uploaded', 'Signature uploaded successfully');
      })

     }
    catch (e) {
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');

    }
  }

  public delete() {
    this.signature = {
      name: null,
      // file_id: null,
      file_path: null,
      file_size: null,
      filename: null,
      filetype: null,
      label: null
    };
  }
  onSelectFile(event) {
    const fd = new FormData();
    if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      if (event.target.files[0].size < 2000000) {
      if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
          let image = event.target.files[0];

        fd.append('userEmail',this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '');
        fd.append('description', 'signature');
        // fd.append('label', 'signature');
        // fd.append('level', 'signature');
        fd.append('uploadFile', image);
        fd.append('uploadType', "signature");
        this.uploadImage(fd);


       }
      } else {
        this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
      }
    } else {
      return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PNG/JPEG files only');
    }
  }

  checkLastIndexOfCA() {
    let ca = null;
    if (this.educationDetailsMap && this.educationDetailsMap.length > 0) {
    let array = this.educationDetailsMap && this.educationDetailsMap.length > 0 ? this.educationDetailsMap : [];
    array.forEach((element, i) => {
      if (element && element[this.form_qualification_type] == 'CA') {
        ca = i;
      }
    });
    }
    return ca;
  }

  downloadFile(path: any, type?: any) {
    this.appConfig.downloadFile(path);
  }

  ngOnDestroy() {
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.newGetProfileDataSubscription ? this.newGetProfileDataSubscription.unsubscribe() : '';
    this.getBloodGroupsSubscription ? this.getBloodGroupsSubscription.unsubscribe() : '';
    this.updatedCitySubscription ? this.updatedCitySubscription.unsubscribe() : '';
    this.updatedCitySubscription1 ? this.updatedCitySubscription1.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
  }
}

