import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

import { MatAccordion } from '@angular/material/expansion';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import * as moment from 'moment';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
// import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import { SharedServiceService } from 'src/app/service/shared-service.service';
import { SkillexService } from 'src/app/service/skillex.service';
// import { Timer } from 'ag-grid-community';

import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry  } from 'ngx-file-drop';



export const MY_FORMATS = {
  // onFileSelecteded(event) {
  //   this.file = event.target.files[0];
  //   if (this.file) {
  //     this.fileName = this.file.name;
  //     this.IsToFeildEnable = false;
  //   }
  // }
};

@Component({
  selector: 'app-joining-upload',
  templateUrl: './joining-upload.component.html',
  styleUrls: ['./joining-upload.component.scss'],
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
export class GeneralJoiningUploadComponent
  implements OnInit, AfterViewInit, OnDestroy{
  blobToken = environment.blobToken;
  productionUrl = environment.SKILLEX_BASE_URL == "https://skilledge.lntedutech.com"?true:false;
  public files: NgxFileDropEntry[] = [];
  change: any;
  favoriteComment: any;
  pdfdoc: any;
  Pre_written_phrase: any;
  form_pre_written = new FormControl(null);
  pdfFormControl = new FormControl(null, [Validators.required]);
  pdfFileName: any;
  pdfFileSize: any;
  pdfFileType: any;
  selectedContentIndex: any;
  textOpacity: any;
  selectedElement: Element;
  deselectedElement: Element;







fileDropped(files: NgxFileDropEntry[]): void {
  this.files = files;
    for (const droppedFile of files)
    if (droppedFile.fileEntry.isFile){
    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {}
    )
  }
throw new Error('Method not implemented.');
}
  @ViewChild('matDialog', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('noDocs', { static: false }) matNoDocs: TemplateRef<any>;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild('inputField', { static: false }) inputField: ElementRef;
  timerval: any;
  step = 0;
  showDialog: any;
  isSpanChanged: any;
  content: any;
  selectedFlag: boolean = false;
  selectedFlagtwo: boolean = true;
  isFavorite: any;

  // index: number;
  // selected: any;

  // files: any = [];
  IsToFeildEnable: boolean;
  documentfileName: any;
  file: any;
  elementRef: any;
  data: any[];

   contents :any;
  fileName: any;
  allFiles: any;
  searchkey: any;
  // selectedFile: File;
  // DRAG AND DROP //
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.files = event.dataTransfer.files;
  }


  toggleButtonSelection() {
    this.selectedFlag = !this.selectedFlag;
  }


  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  //  //

  getEducationDocuments: any[];
  educationNotUploadedDocs: any[];
  getResumeDocuments: any[];
  resumeNotUploadedDocs: any[];
  getTransferDocuments: any[];
  transferNotUploadedDocs: any[];
  getOtherCertificationDocuments: any[];
  getbankDocuments: any[];
  bankNotUploadedDocs: any[];
  IsreasonAvailable: any;
  isReasonDate: any;
  selectedPost: any;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  semesterList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  uploadForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  conditionJoining = 'joining';
  conditionEducation = 'education';
  conditionTransfer = 'transfer';
  conditionResume = 'resume';
  conditionOther = 'others';
  conditionCert = 'cert';
  conditionBank = 'bank';
  //Joining Variables
  form_joiningArray = 'joining_details';
  form_file_id = 'file_id';
  form_id = 'id';
  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_name = 'name';
  form_label = 'label';
  form_description = 'description';
  form_Not_Submitted_Description = 'not_submitted_description';
  form_expectedDate = 'expected_date';

  // Education variables
  form_educationArray = 'education_documents';
  form_semesterArray = 'sub_documents';
  form_noofSemester = 'no_of_semester';
  form_education_level = 'education_level';
  form_eourse_Completion = 'course_completion_certificate';
  form_degree_Completion = 'degree_completion_certificate';

  // Resume Variables
  form_resumeArray = 'resume';

  // Transfer certificate Variables
  form_transferCertArray = 'transfer_certificate';

  // Other certificate Variables
  form_otherCertArray = 'other_certifications';

  // Certifications array
  form_CertificationArray = 'certifications';
  getCertificationDocuments: any;
  // Banking
  form_bankArray = 'banking_details';
  form_acc_no = 'account_no';
  form_ifsc_code = 'ifsc_code';
  form_branch = 'branch';

  dependedentDetails: any;
  downloadabledocs: any;
  pdfsrc: any;
  selectedImage: any;
  hoverHide: any;
  getJoiningDocuments: any;
  expectedDate = new FormControl(null, [Validators.required]);
  reason = new FormControl(null, [
    RemoveWhitespace.whitespace(),
    Validators.required,
    this.glovbal_validators.alphaNum255(),
  ]);
  joiningNotUploadedDocs: any[];
  isRoute: any;

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private loadingService: LoaderService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private skillexService: SkillexService,
    // private ngxFileDrop: NgxFileDropEntry,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private dialog: MatDialog
  ) {
    this.dateValidation();
    this.joiningFormDataFromJoiningFormComponentRxjs();
  }

  ngOnInit() {
    // this.isSpanChanged = false;
    this.showDialog = false;
    this.formInitialize();
    this.getDocuments();
    this.getDownloadableDocs();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
    this.getDatadescription();
  }




  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  public fileOver(event:any){
    console.log(event);
  }

  public fileLeave(event:any){
    console.log(event);
  }

  downloadFiledata() {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(this.pdfdoc);
    console.log(downloadLink.href, 'test');

    downloadLink.download = this.getResumeDocuments[0].file_path;
    downloadLink.click();
  }

  downloadFile(path: any, type?: any) {
    this.appConfig.downloadFile(path);
  }





  onFileSelected(event: any) {
    const fd = new FormData();
    if (event.target.files && event.target.files[0].type.includes('pdf')) {
      if (event.target.files[0].size < 2000000){
        if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
          let doc = event.target.files[0];
          // this.pdfFileName = doc.name;

          console.log(doc,'doc');

          fd.append('userEmail', this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '');
          fd.append('uploadFile', doc);
           fd.append('uploadType',"pdf");
          this.uploadPdf(fd);
    }
     } else {
     this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
      }
     } else {
      return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PNG/JPEG files only');
    }
  }
  async uploadPdf(file) {
    try {
      this.loadingService.setLoading(true);
      this.skillexService.pdfFileUpload(file).subscribe((data:any) => {
        console.log(data,'data');

        this.loadingService.setLoading(false);
        if (data) {
          console.log(data,'datadata');
          console.log(data.data,'datadsdata');
          this.pdfdoc = data.data;
          this.pdfFormControl.setValue(this.pdfdoc);
        }
        this.appConfig.nzNotification('success', 'Uploaded', 'Resume uploaded successfully');
      });
    } catch (e) {
      console.log("error while profile pic"+e)
      this.pdfdoc ? this.pdfFormControl.markAsTouched() : this.pdfFormControl.markAsUntouched();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    }
  }

  // downloadTemplate() {
  //   const excel = `assets/templates/joblist upload.csv`;
  //   window.open(excel, '_blank');
  // }

  // drag and drop/
  // onFileSelected(event: any) {
  //   console.log(event);
  //   this.file = event.target.files[0];
  //   if (this.file) {
  //     this.fileName = this.file.name;
  //   }
  // }
       formSubmit(routeValue?: any){
        if(this.uploadForm.valid){
          const apiData = {
            preWritten_phrase: this.Pre_written_phrase,
            resume:[{
              file_path:this.pdfdoc
            }],
          }
          console.log(apiData,'apiData');
        const DocumentApiRequestDetails = {
          email: this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',
          section_name: "document_details",
          saving_data: apiData
        }
        this.newSaveProfileDataSubscription = this.skillexService.saveCandidateProfile(DocumentApiRequestDetails).subscribe((data: any)=> {
          setTimeout(() => {
            this.loadingService.setLoading(false)

          }, 2000);
          if(data && data.success)
            {
            this.candidateService.saveFormtoLocalDetails(data.data.section_name, data.data.saved_data);
            this.candidateService.saveFormtoLocalDetails('section_flags', data.data.section_flags);
            this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Personal details is updated');
            this.sharedService.joiningFormStepperStatus.next();
            return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
          }else{
            this.appConfig.nzNotification('error', 'Not Saved', data && data.message ? data.message : 'Personal details not updated');
            return false
          }
          });
        }
          else{
          this.ngAfterViewInit();
          this.pdfFormControl.markAsTouched();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please upload the resume to proceed further');
          this.loadingService.setLoading(false)
          this.glovbal_validators.validateAllFields(this.uploadForm);
        }
    }
  trimFilename(fileName: any) {
    if (fileName = this.pdfdoc) {
      let replaceFilename = '';
      let pdfname =fileName.split('/').pop().split('.')[0];
      replaceFilename =
      pdfname.length > 25 ? pdfname.slice(0, 25) + '...' : pdfname;
      return replaceFilename;
    }
    return '';
  }

  appendText() {
    alert('click works');
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
    this.joiningFormDataPassingSubscription =
      this.sharedService.joiningFormDataPassing.subscribe((data: any) => {
        this.getDocuments();
      });
  }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('upload');
  }
  onClickicon(content) {
    this.selectedFlag = true;

    // this.isFavorite = i;
    // this.change.emit({ newValue: this.favoriteComment });
  }


  appendPara(content, i) {
    const textToAppend = content.description;
    const selectedElement = document.querySelectorAll('.rem')[i];

    if (this.Pre_written_phrase !== textToAppend) {
      // New element selected
      this.Pre_written_phrase = textToAppend;
      this.selectedFlag = true;
      this.selectedContentIndex = i;

      // Reset opacity of previously selected element
      if (this.selectedElement) {
        this.selectedElement.setAttribute('style', 'opacity: 1;');
      }

      // Apply opacity to newly selected element
      if (selectedElement instanceof HTMLElement) {
        selectedElement.style.opacity = '0.2';
      }

      // Set the newly selected element as the currently selected element
      this.selectedElement = selectedElement;
    } else {
      // Same element deselected
      this.Pre_written_phrase = '';
      this.selectedFlag = false;
      this.selectedContentIndex = null;

      // Reset opacity of previously selected element
      if (this.selectedElement) {
        this.selectedElement.setAttribute('style', 'opacity: 1;');
        this.selectedElement = null;
      }
    }
  }


  formInitialize() {
    this.uploadForm = this.fb.group({
      sampleinput: new FormControl('',Validators.required)
    });
  }

  getDocuments() {
    if (this.candidateService.getLocalProfileData()) {
      this.selectedPost = this.candidateService.getLocaleducation_details()
        .selected_post
        ? this.candidateService.getLocaleducation_details().selected_post
        : null;
      let apiDocumentDetails = this.candidateService.getLocaldocument_details();
      this.formInitialize();
      this.ifDocumentDetails(apiDocumentDetails);
    } else {
      let apiData = {
        form_name: 'joining',
        section_name: ''
      }
      this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
        this.candidateService.saveAllProfileToLocal(data);
        let apiDocumentDetails = this.candidateService.getLocaldocument_details();
        this.ifDocumentDetails(apiDocumentDetails);
      });
    }
  }

  ifDocumentDetails(data) {
    console.log(data,'ifDocumentDetails');

    // this.getJoiningDocuments =
    //   data && data['joining_details'] ? data['joining_details'] : [];
    // this.getEducationDocuments =
    //   data && data['education_documents'] ? data['education_documents'] : [];
    this.getResumeDocuments = data && data['resume'] ? data['resume'] : [];
    console.log(this.getResumeDocuments,'getResumeDocuments');
    console.log(this.getResumeDocuments[0].file_path,'ifDocumentDetails');

    // this.getTransferDocuments =
    //   data && data['transfer_certificate'] ? data['transfer_certificate'] : [];
    // this.getbankDocuments =
    //   data && data['banking_details'] ? data['banking_details'] : [];
    // this.getCertificationDocuments =
    //   data && data['certifications'] ? data['certifications'] : [];
    // this.getOtherCertificationDocuments =
    //   data && data['other_certifications'] ? data['other_certifications'] : [];
    // this.checkJoiningArrayinitalize();
  }

  ifNotDocumentDetails() {}


  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 2, 1, 0);
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

  // downloadFile(path: any, type?: any) {
  //   this.appConfig.downloadFile(path);
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

  applyFilter(data:any){

    clearTimeout(this.timerval)

    this.timerval = setTimeout(() => {
      this.contents.filter=data.trim().toLowerCase()
      console.log (data);
    }, 200);
    let searchdata={
      "searchDescription":data
    }
    this.skillexService.getdescription(searchdata).subscribe((data: any) => {
      console.log('data',data.data);
      this.contents=data.data
    });
  }


timeout(callback, ms) {

  var timer ;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(callback.bind(this, ...args), ms || 0)
  };
}

  getDatadescription() {
    console.log('enter');
    let data={
      "searchDescription":""
    }
    this.skillexService.getdescription(data).subscribe((data: any) => {
      console.log('data',data.data);
      this.contents=data.data
    });
  }





   getDownloadableDocs() {
    this.downloadabledocs = [];
    this.pdfsrc = this.pdfdoc;
      if (this.pdfsrc && this.productionUrl == true) {
          this.pdfsrc = this.pdfsrc + environment.blobToken
        } else if (this.pdfsrc && this.productionUrl == false) {
          this.pdfsrc = this.pdfsrc
        }
    // this.candidateService.joiningFormDownloadableDocuments().subscribe((data: any)=> {
    //
    // this.downloadabledocs = data ? data : [];
    // });
  }

  saveRequestRxJs() {
    this.sendPopupResultSubscription =
      this.sharedService.sendPopupResult.subscribe((result: any) => {
        if (result.result == 'save') {
          this.formSubmit(result.route);
        }
      });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest =
      this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
        if (data.current == 'upload') {
          if (!this.uploadForm.dirty) {
            return this.appConfig.routeNavigation(data.goto);
          } else {
            return this.sharedService.openJoiningRoutePopUp.next(data.goto);
          }
        }
      });
  }

  routeNext(route) {
    if (!this.uploadForm.dirty) {
      if (route == 'work') {
        return this.appConfig.routeNavigation(
          CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK
        );
      } else {
        if (
          this.candidateService.getLocalsection_flags() &&
          this.candidateService.getLocalsection_flags().document_details
        ) {
          return this.appConfig.routeNavigation(
            CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW
          );
        } else {
          if (this.uploadForm.valid) {
            return this.sharedService.openJoiningRoutePopUp.next(
              route == 'work'
                ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK
                : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW
            );
          }
          this.formSubmit();
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(
        route == 'work'
          ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK
          : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW
      );
    }
  }
  downloadPDF(src, documentfileName) {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = src;
    link.download = src;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }



  // checkNotSubmittedReasonAndDate(element) {
  //   if (!this.IsreasonAvailable) {
  //     this.IsreasonAvailable = element[this.form_Not_Submitted_Description]
  //       ? element[this.form_Not_Submitted_Description]
  //       : null;
  //     this.isReasonDate = element[this.form_expectedDate]
  //       ? element[this.form_expectedDate]
  //       : null;
  //   }
  // }
  // checkJoiningArrayinitalize() {
  //   if (this.candidateService.checkKycOrJoiningForm()) {
  //     // Joining
  //     let arr = [];
  //     this.getJoiningDocuments.forEach((element) => {
  //       if (element) {
  //         arr.push(element);
  //       }
  //     });
  //     this.getJoiningDocuments = arr;
  //     if (this.getJoiningDocuments && this.getJoiningDocuments.length > 0) {
  //       this.getJoiningDocuments.forEach((element) => {
  //         this.checkNotSubmittedReasonAndDate(element);
  //         this.getJoiningArr.push(this.patchJoiningArray(element));
  //       });
  //     } else {
  //       this.getJoiningArr.push(this.initJoiningArray());
  //     }

  //     // Education
  //     if (this.getEducationDocuments && this.getEducationDocuments.length > 0) {
  //       this.getEducationDocuments.forEach((element) => {
  //         if (!element[this.form_semesterArray]) {
  //           element[this.form_semesterArray] = [];
  //         }
  //         this.getEducationArr.push(this.patchEducationArray(element));
  //       });
  //     } else {
  //       this.getEducationArr.push(this.initEducationArray());
  //     }

  //     // Trans
  //     if (this.getTransferDocuments && this.getTransferDocuments.length > 0) {
  //       this.getTransferDocuments.forEach((element) => {
  //         this.checkNotSubmittedReasonAndDate(element);
  //         this.getTransferArr.push(this.patchJoiningArray(element));
  //       });
  //     } else {
  //       this.getTransferArr.push(this.initTransferArray());
  //     }

  //     // Banking Details
  //     if (this.getbankDocuments && this.getbankDocuments.length > 0) {
  //       this.getbankDocuments.forEach((element) => {
  //         this.checkNotSubmittedReasonAndDate(element);
  //         this.getBankArr.push(this.patchBankingArray(element));
  //       });
  //     } else {
  //       this.getBankArr.push(this.initBankingArray());
  //     }

  //     // Other Certifications
  //     if (
  //       this.getOtherCertificationDocuments &&
  //       this.getOtherCertificationDocuments.length > 0
  //     ) {
  //       this.getOtherCertificationDocuments.forEach((element) => {
  //         this.getOtherCertArr.push(
  //           this.patchJoiningArray(element, 'otherCert')
  //         );
  //       });
  //     } else {
  //       // this.getOtherCertArr.push(this.initJoiningArray());
  //     }

  //     // Certifications
  //     if (
  //       this.getCertificationDocuments &&
  //       this.getCertificationDocuments.length > 0
  //     ) {
  //       this.getCertificationDocuments.forEach((element) => {
  //         this.selectedPost == 'ca'
  //           ? this.getCertificationsArr.push(
  //               this.patchCAArray(element, 'otherCert')
  //             )
  //           : this.getCertificationsArr.push(
  //               this.patchJoiningArray(element, 'otherCert')
  //             );
  //       });
  //     } else {
  //       this.selectedPost == 'ca'
  //         ? this.getCertificationsArr.push(this.CAinitArray('otherCert'))
  //         : '';
  //     }

  //     this.patchNotSubmittedReason();
  //   }
  //   // Resume
  //   if (
  //     this.getResumeDocuments &&
  //     this.getResumeDocuments.length > 0 &&
  //     this.getResumeDocuments[0] &&
  //     this.getResumeDocuments[0][this.form_name]
  //   ) {
  //     this.getResumeDocuments.forEach((element) => {
  //       this.checkNotSubmittedReasonAndDate(element);
  //       this.getResumeArr.push(this.patchResumeArray(element));
  //     });
  //   } else {
  //     this.getResumeArr.push(this.initResumeArray());
  //   }
  // }

  // patchNotSubmittedReason() {
  //   if (this.IsreasonAvailable) {
  //     this.reason.patchValue(this.IsreasonAvailable);
  //     this.isReasonDate
  //       ? this.expectedDate.patchValue(this.dateConvertion(this.isReasonDate))
  //       : '';
  //   }
  // }

  // patchJoiningArray(data, otherCert?) {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       data[this.form_name],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: [
  //       data[this.form_label],
  //       otherCert == 'otherCert'
  //         ? [Validators.required, this.glovbal_validators.alphaNum255()]
  //         : [Validators.nullValidator],
  //     ],
  //     // [this.form_id]: [data[this.form_id]],
  //     [this.form_file_size]: [data[this.form_file_size]],
  //     [this.form_file_path]: [data[this.form_file_path]],
  //     [this.form_file_name]: [data[this.form_file_name]],
  //     [this.form_file_type]: [data[this.form_file_type]],
  //     [this.form_file_id]: [data[this.form_file_id]],
  //     [this.form_description]: [
  //       data[this.form_description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       data[this.form_Not_Submitted_Description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [data[this.form_expectedDate]],
  //   });
  // }

  // patchResumeArray(data, otherCert?) {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       data[this.form_name],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: [
  //       data[this.form_label],
  //       otherCert == 'otherCert'
  //         ? [Validators.required, this.glovbal_validators.alphaNum255()]
  //         : [Validators.nullValidator],
  //     ],
  //     // [this.form_id]: [data[this.form_id]],
  //     [this.form_file_size]: [data[this.form_file_size]],
  //     [this.form_file_path]: [data[this.form_file_path], [Validators.required]],
  //     [this.form_file_name]: [data[this.form_file_name]],
  //     [this.form_file_type]: [data[this.form_file_type]],
  //     [this.form_file_id]: [data[this.form_file_id]],
  //     [this.form_description]: [
  //       data[this.form_description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       data[this.form_Not_Submitted_Description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [data[this.form_expectedDate]],
  //   });
  // }

 // patchEducationArray(data) {
  //   return this.fb.group({
  //     [this.form_education_level]: [data[this.form_education_level]],
  //     [this.form_noofSemester]: [
  //       data[this.form_noofSemester],
  //       data[this.form_education_level] != 'SSLC' &&
  //       data[this.form_education_level] != 'HSC'
  //         ? [Validators.required]
  //         : null,
  //     ],
  //     [this.form_semesterArray]:
  //       data[this.form_semesterArray] &&
  //       data[this.form_semesterArray].length > 0
  //         ? this.patchSubArray(
  //             data[this.form_noofSemester],
  //             data[this.form_education_level],
  //             data
  //           )
  //         : this.patchSubInitArray(data[this.form_education_level], data),
  //   });
  // }

  // patchSemesterArray(data, level) {
  //   return this.fb.group({
  //     [this.form_name]:
  //       level == 'SSLC' || level == 'HSC' ? level : [data[this.form_name]],
  //     [this.form_label]:
  //       level == 'SSLC' || level == 'HSC'
  //         ? level + ' Certificate'
  //         : [data[this.form_label]],
  //     [this.form_file_size]: [data[this.form_file_size]],
  //     [this.form_file_path]: [data[this.form_file_path]],
  //     [this.form_file_name]: [data[this.form_file_name]],
  //     [this.form_file_type]: [data[this.form_file_type]],
  //     [this.form_file_id]: [data[this.form_file_id]],
  //     [this.form_description]: [
  //       data[this.form_description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       data[this.form_Not_Submitted_Description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [
  //       data[this.form_expectedDate]
  //         ? this.dateConvertion(data[this.form_expectedDate])
  //         : null,
  //     ],
  //   });
  // }

  // patchSubArray(semestercount, level, form) {
  //   let subSem = [];
  //   if (form[this.form_semesterArray].length > 0) {
  //     form[this.form_semesterArray].forEach((element) => {
  //       this.checkNotSubmittedReasonAndDate(element);
  //       subSem.push(this.patchSemesterArray(element, level));
  //     });
  //     return this.fb.array(subSem);
  //   }
  // }
  // patchSubInitArray(level, form) {
  //   if (level == 'SSLC' || level == 'HSC') {
  //     let data = {
  //       label: level == 'SSLC' ? 'SSLC Certificate' : 'HSC Certificate',
  //       name: level,
  //     };
  //     return this.fb.array([this.initSemesterArray(data)]);
  //   } else {
  //     return this.fb.array([]);
  //   }
  // }

  // initJoiningArray(otherCert?) {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: [
  //       null,
  //       otherCert == 'otherCert'
  //         ? [
  //             RemoveWhitespace.whitespace(),
  //             Validators.required,
  //             this.glovbal_validators.alphaNum255(),
  //           ]
  //         : [Validators.nullValidator],
  //     ],
  //     // [this.form_id]: [null],
  //     [this.form_file_size]: [null],
  //     [this.form_file_path]: [null],
  //     [this.form_file_name]: [null],
  //     [this.form_file_type]: [null],
  //     [this.form_file_id]: [null],
  //     [this.form_description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [null],
  //   });
  // }

  // CAinitArray(otherCert?) {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: [
  //       null,
  //       otherCert == 'otherCert'
  //         ? [
  //             RemoveWhitespace.whitespace(),
  //             Validators.required,
  //             this.glovbal_validators.alphaNum255(),
  //           ]
  //         : [Validators.nullValidator],
  //     ],
  //     // [this.form_id]: [null],
  //     [this.form_file_size]: [null],
  //     [this.form_file_path]: [null, [Validators.required]],
  //     [this.form_file_name]: [null],
  //     [this.form_file_type]: [null],
  //     [this.form_file_id]: [null],
  //     [this.form_description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [null],
  //   });
  // }
  // patchCAArray(data, otherCert?) {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       data[this.form_name],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: [
  //       data[this.form_label],
  //       otherCert == 'otherCert'
  //         ? [Validators.required, this.glovbal_validators.alphaNum255()]
  //         : [Validators.nullValidator],
  //     ],
  //     // [this.form_id]: [data[this.form_id]],
  //     [this.form_file_size]: [data[this.form_file_size]],
  //     [this.form_file_path]: [data[this.form_file_path], [Validators.required]],
  //     [this.form_file_name]: [data[this.form_file_name]],
  //     [this.form_file_type]: [data[this.form_file_type]],
  //     [this.form_file_id]: [data[this.form_file_id]],
  //     [this.form_description]: [
  //       data[this.form_description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       data[this.form_Not_Submitted_Description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [data[this.form_expectedDate]],
  //   });
  // }

  // initTransferArray() {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       'Transfer Certificate',
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: ['Transfer Certificate'],
  //     // [this.form_id]: [null],
  //     [this.form_file_size]: [null],
  //     [this.form_file_path]: [null],
  //     [this.form_file_name]: [null],
  //     [this.form_file_type]: [null],
  //     [this.form_file_id]: [null],
  //     [this.form_description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [null],
  //   });
  // }

  // initResumeArray() {
  //   return this.fb.group({
  //     [this.form_name]: [
  //       'Resume',
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_label]: ['Resume'],
  //     // [this.form_id]: [null],
  //     [this.form_file_size]: [null],
  //     [this.form_file_path]: [null, [Validators.required]],
  //     [this.form_file_name]: [null],
  //     [this.form_file_type]: [null],
  //     [this.form_file_id]: [null],
  //     [this.form_description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [null],
  //   });
  // }

  // patchBankingArray(data) {
  //   return this.fb.group({
  //     [this.form_name]: [data[this.form_name]],
  //     [this.form_label]: [
  //       data[this.form_label],
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.alphaNum255(),
  //       ],
  //     ], // Bank name
  //     [this.form_acc_no]: [
  //       data[this.form_acc_no],
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.numberOnly(),
  //         Validators.maxLength(50),
  //       ],
  //     ],
  //     [this.form_ifsc_code]: [
  //       data[this.form_ifsc_code],
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.alphaNum255(),
  //       ],
  //     ],
  //     [this.form_branch]: [
  //       data[this.form_branch],
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.alphaNum255(),
  //       ],
  //     ],
  //     // [this.form_id]: [data[this.form_id]],
  //     [this.form_file_size]: [data[this.form_file_size]],
  //     [this.form_file_path]: [data[this.form_file_path]],
  //     [this.form_file_name]: [data[this.form_file_name]],
  //     [this.form_file_type]: [data[this.form_file_type]],
  //     [this.form_file_id]: [data[this.form_file_id]],
  //     [this.form_description]: [
  //       data[this.form_description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       data[this.form_Not_Submitted_Description],
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [data[this.form_expectedDate]],
  //   });
  // }

  // initBankingArray() {
  //   return this.fb.group({
  //     [this.form_name]: ['Banking'],
  //     [this.form_label]: [
  //       'Banking',
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.alphaNum255(),
  //       ],
  //     ], // Bank name
  //     [this.form_acc_no]: [
  //       null,
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.numberOnly(),
  //         Validators.maxLength(50),
  //       ],
  //     ],
  //     [this.form_ifsc_code]: [
  //       null,
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.alphaNum255(),
  //       ],
  //     ],
  //     [this.form_branch]: [
  //       null,
  //       [
  //         RemoveWhitespace.whitespace(),
  //         Validators.required,
  //         this.glovbal_validators.alphaNum255(),
  //       ],
  //     ],
  //     // [this.form_id]: [null],
  //     [this.form_file_size]: [null],
  //     [this.form_file_path]: [null],
  //     [this.form_file_name]: [null],
  //     [this.form_file_type]: [null],
  //     [this.form_file_id]: [null],
  //     [this.form_description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [null],
  //   });
  // }

  // initSemesterArray(data?) {
  //   return this.fb.group({
  //     [this.form_name]: [data ? data.name : null],
  //     [this.form_label]: [data ? data.label : null],
  //     [this.form_file_size]: [null],
  //     [this.form_file_path]: [null],
  //     [this.form_file_name]: [null],
  //     [this.form_file_type]: [null],
  //     [this.form_file_id]: [null],
  //     [this.form_description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_Not_Submitted_Description]: [
  //       null,
  //       [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()],
  //     ],
  //     [this.form_expectedDate]: [null],
  //   });
  // }
  // initEducationArray() {
  //   return this.fb.group({
  //     [this.form_education_level]: [null],
  //     [this.form_noofSemester]: [null, [Validators.required]],
  //     [this.form_semesterArray]: this.fb.array([this.initSemesterArray()]),
  //   });
  // }

  // removeInOtherArray(i) {
  //   this.getOtherCertArr.removeAt(i);
  // }
  // addToOtherArray(i?: any) {
  //   if (this.getOtherCertArr.valid) {
  //     return this.getOtherCertArr.push(this.initJoiningArray('otherCert'));
  //   }
  //   this.glovbal_validators.validateAllFormArrays(
  //     this.uploadForm.get([this.form_otherCertArray]) as FormArray
  //   );
  // }

  // removeInCertificationsArray(i) {
  //   this.getCertificationsArr.removeAt(i);
  // }
  // addToCertificationsArray(i?: any) {
  //   if (this.getCertificationsArr.valid) {
  //     return this.selectedPost == 'ca'
  //       ? this.getCertificationsArr.push(this.CAinitArray('otherCert'))
  //       : this.getCertificationsArr.push(this.initJoiningArray('otherCert'));
  //   }
  //   this.glovbal_validators.validateAllFormArrays(
  //     this.uploadForm.get([this.form_CertificationArray]) as FormArray
  //   );
  // }

  // addToSemesterArray(i?: any) {
  //   return this.getSemesterArr(i).push(this.initSemesterArray());
  // }

  // removeInSemesterArray(i, j) {
  //   this.getSemesterArr(i).removeAt(j);
  // }

  // changeSemesterCount(form, formIndex) {
  //   form['controls'][this.form_noofSemester].markAsTouched({ onlySelf: true });

  //   let nosemCount = form.value[this.form_noofSemester]
  //     ? form.value[this.form_noofSemester]
  //     : 0;
  //   let NoOfSemcount = Number(nosemCount) + 1;
  //   let level = form.value[this.form_education_level];
  //   let existingSemCount = form.value[this.form_semesterArray].length;
  //   this.addOrRemoveArray(
  //     level,
  //     NoOfSemcount,
  //     existingSemCount,
  //     form,
  //     formIndex
  //   );
  // }

  // addOrRemoveArray(level, NoOfSemcount, existingSemCount, form, formIndex) {
  //   level = level == 'Diploma' ? 'Diploma' : 'Degree';
  //   let data: any;
  //   if (existingSemCount == 0) {
  //     for (let i = 0; i < NoOfSemcount; i++) {
  //       if (i == 0) {
  //         data = {
  //           label: `${level} or Provisional Certificate`,
  //           name: 'degreeOrProvision',
  //         };
  //         this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
  //       }
  //       if (i > 0) {
  //         data = {
  //           label: `Semester ${i}`,
  //           name: `sem${i}`,
  //         };
  //         this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
  //       }
  //     }
  //   } else if (existingSemCount != 0 && NoOfSemcount > existingSemCount) {
  //     let i = existingSemCount;
  //     for (i; i < NoOfSemcount; i++) {
  //       if (i == 0) {
  //         data = {
  //           label:
  //             level == 'Diploma'
  //               ? `${level} Certificate or Provisional Certificate`
  //               : `${level} or Provisional Certificate`,
  //           name: 'degreeOrProvision',
  //         };
  //         this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
  //       }
  //       if (i > 0) {
  //         data = {
  //           label: `Semester ${i}`,
  //           name: `sem${i}`,
  //         };
  //         this.getSemesterArr(formIndex).push(this.initSemesterArray(data));
  //       }
  //     }
  //   } else {
  //     let i = existingSemCount;
  //     for (i; i >= NoOfSemcount; i--) {
  //       this.getSemesterArr(formIndex).removeAt(i);
  //     }
  //   }
  // }

  // validateNotUploaded() {
  //   if (this.reason.valid && this.expectedDate.valid) {
  //     this.dialog.closeAll();
  //     // Joining Mapping of reason and expected value
  //     let joiningArray = this.getJoiningArr.getRawValue();
  //     joiningArray.forEach((element, i) => {
  //       // Nulling the not sub and exp date
  //       this.getJoiningArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //       // If file path not found, patching the not sub desc and exp date
  //       if (!element[this.form_file_path]) {
  //         this.getJoiningArr.at(i).patchValue({
  //           [this.form_file_name]: null,
  //           [this.form_file_id]: null,
  //           [this.form_file_path]: null,
  //           [this.form_file_size]: null,
  //           [this.form_file_type]: null,
  //           [this.form_Not_Submitted_Description]: this.reason.value,
  //           [this.form_expectedDate]: this.momentForm(this.expectedDate.value),
  //         });
  //       }
  //     });

  //     // Transfer Mapping of reason and expected value
  //     let transferArray = this.getTransferArr.getRawValue();
  //     transferArray.forEach((element, i) => {
  //       // Nulling the not sub and exp date
  //       this.getTransferArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //       // If file path not found, patching the not sub desc and exp date
  //       if (!element[this.form_file_path]) {
  //         this.getTransferArr.at(i).patchValue({
  //           [this.form_file_name]: null,
  //           [this.form_file_id]: null,
  //           [this.form_file_path]: null,
  //           [this.form_file_size]: null,
  //           [this.form_file_type]: null,
  //           [this.form_Not_Submitted_Description]: this.reason.value,
  //           [this.form_expectedDate]: this.momentForm(this.expectedDate.value),
  //         });
  //       }
  //     });

  //     // Resume Mapping of reason and expected value
  //     let resumeArray = this.getResumeArr.getRawValue();
  //     resumeArray.forEach((element, i) => {
  //       // Nulling the not sub and exp date
  //       this.getResumeArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //       // If file path not found, patching the not sub desc and exp date
  //       if (!element[this.form_file_path]) {
  //         this.getResumeArr.at(i).patchValue({
  //           [this.form_file_name]: null,
  //           [this.form_file_id]: null,
  //           [this.form_file_path]: null,
  //           [this.form_file_size]: null,
  //           [this.form_file_type]: null,
  //           [this.form_Not_Submitted_Description]: this.reason.value,
  //           [this.form_expectedDate]: this.momentForm(this.expectedDate.value),
  //         });
  //       }
  //     });

  //     // Bank Mapping of reason and expected value
  //     let bankArray = this.getBankArr.getRawValue();
  //     bankArray.forEach((element, i) => {
  //       // Nulling the not sub and exp date
  //       this.getBankArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //       // If file path not found, patching the not sub desc and exp date
  //       if (!element[this.form_file_path]) {
  //         this.getBankArr.at(i).patchValue({
  //           [this.form_file_name]: null,
  //           [this.form_file_id]: null,
  //           [this.form_file_path]: null,
  //           [this.form_file_size]: null,
  //           [this.form_file_type]: null,
  //           [this.form_Not_Submitted_Description]: this.reason.value,
  //           [this.form_expectedDate]: this.momentForm(this.expectedDate.value),
  //         });
  //       }
  //     });

  //     // Education Mapping of reason and expected value
  //     let educationArray = this.getEducationArr.getRawValue();
  //     educationArray.forEach((ele, i) => {
  //       ele[this.form_semesterArray].forEach((element, subIndex) => {
  //         // Nulling the not sub and exp date
  //         this.getSemesterArr(i)
  //           .at(subIndex)
  //           .patchValue({
  //             [this.form_Not_Submitted_Description]: null,
  //             [this.form_expectedDate]: null,
  //           });
  //         // If file path not found, patching the not sub desc and exp date
  //         if (!element[this.form_file_path]) {
  //           this.getSemesterArr(i)
  //             .at(subIndex)
  //             .patchValue({
  //               [this.form_file_name]: null,
  //               [this.form_file_id]: null,
  //               [this.form_file_path]: null,
  //               [this.form_file_size]: null,
  //               [this.form_file_type]: null,
  //               [this.form_Not_Submitted_Description]: this.reason.value,
  //               [this.form_expectedDate]: this.momentForm(
  //                 this.expectedDate.value
  //               ),
  //             });
  //         }
  //       });
  //     });

  //     // other
  //     let otherCertArray = this.getOtherCertArr.getRawValue();
  //     otherCertArray.forEach((element, i) => {
  //       if (!element[this.form_file_path]) {
  //         this.getOtherCertArr.removeAt(i);
  //       }
  //       if (element[this.form_file_path]) {
  //         this.getOtherCertArr.at(i).patchValue({
  //           [this.form_name]: this.form_label,
  //         });
  //       }
  //     });

  //     // Certifications
  //     let certificationsArray = this.getCertificationsArr.getRawValue();
  //     certificationsArray.forEach((element, i) => {
  //       if (!element[this.form_file_path]) {
  //         this.getCertificationsArr.removeAt(i);
  //       }
  //       if (element[this.form_file_path]) {
  //         this.getCertificationsArr.at(i).patchValue({
  //           [this.form_name]: this.form_label,
  //         });
  //       }
  //     });

  //     this.finalSubmit(this.isRoute ? this.isRoute : '');
  //   } else {
  //     this.reason.markAllAsTouched();
  //     this.expectedDate.markAllAsTouched();
  //   }
  // }

  // formSubmit(routeValue?: any) {
  //   // if (this.uploadForm.valid) {
  //   // if (this.checkJoiningNotUploaded() && this.candidateService.checkKycOrJoiningForm()) {
  //   //   this.openNodocs(routeValue ? routeValue : '');
  //   // } else {
  //   if (this.getResumeArr.invalid) {
  //     this.loadingService.setLoading(false);
  //     return this.appConfig.nzNotification(
  //       'error',
  //       'Resume Uploads',
  //       'Please fill all the red highlighted fields in resume Uploads to proceed further'
  //     );
  //   } else {
  //     this.beforeSubmit(routeValue ? routeValue : '');
  //   }
  //   // }
  //   // } else {
  //   //   this.ngAfterViewInit();
  //   //   this.accordion.openAll();
  //   //   this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_resumeArray]) as FormArray);
  //   //   // this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_educationArray]) as FormArray);
  //   //   // this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_bankArray]) as FormArray);
  //   //   // this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_CertificationArray]) as FormArray);
  //   //   // this.glovbal_validators.validateAllFormArrays(this.uploadForm.get([this.form_otherCertArray]) as FormArray);
  //   //   // if (this.getEducationArr.invalid) {
  //   //   //   return this.appConfig.nzNotification('error', 'Education Uploads', 'Please fill all the red highlighted fields in Education Uploads to proceed further');
  //   //   // }
  //   //   // if (this.getBankArr.invalid) {
  //   //   //   return this.appConfig.nzNotification('error', 'Banking Details', 'Please fill all the red highlighted fields in Banking Details to proceed further');
  //   //   // }
  //   //   // if (this.getCertificationsArr.invalid) {
  //   //   //   return this.selectedPost == 'ca' ? this.appConfig.nzNotification('error', 'CA Certification Uploads', 'Please fill all the red highlighted fields in CA Certifications Uploads to proceed further') : this.appConfig.nzNotification('error', 'Certification Uploads', 'Please fill all the red highlighted fields in Certifications Uploads to proceed further');
  //   //   // }
  //   //   // if (this.getOtherCertArr.invalid) {
  //   //   //   return this.appConfig.nzNotification('error', 'Other Certifications', 'Please fill all the red highlighted fields in Other Certifications to proceed further');
  //   //   // }
  //   //   if (this.getResumeArr.invalid) {
  //   //     return this.appConfig.nzNotification('error', 'Resume Uploads', 'Please fill all the red highlighted fields in Education Uploads to proceed further');
  //   //   }else {
  //   //     this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
  //   //   }
  //   // }
  // }

  // checkJoiningNotUploaded() {
  //   let isValid = {
  //     joining: true,
  //     education: true,
  //     transfer: true,
  //     resume: true,
  //     bank: true,
  //     other: true,
  //   };
  //   // Joining
  //   let joiningArray = this.uploadForm.getRawValue()[this.form_joiningArray];
  //   this.joiningNotUploadedDocs = [];
  //   joiningArray.forEach((element) => {
  //     if (!element[this.form_file_path]) {
  //       let ele = {
  //         label: element[this.form_label],
  //       };
  //       this.joiningNotUploadedDocs.push(ele);
  //     }
  //   });

  //   if (this.joiningNotUploadedDocs && this.joiningNotUploadedDocs.length > 0) {
  //     isValid.joining = false;
  //   }

  //   // Transfer
  //   let transferArray =
  //     this.uploadForm.getRawValue()[this.form_transferCertArray];
  //   this.transferNotUploadedDocs = [];
  //   transferArray.forEach((element) => {
  //     if (!element[this.form_file_path]) {
  //       let ele = {
  //         label: element[this.form_label],
  //       };
  //       this.transferNotUploadedDocs.push(ele);
  //     }
  //   });

  //   if (
  //     this.transferNotUploadedDocs &&
  //     this.transferNotUploadedDocs.length > 0
  //   ) {
  //     isValid.transfer = false;
  //   }

  //   // Resume
  //   let resumeArray = this.uploadForm.getRawValue()[this.form_resumeArray];
  //   this.resumeNotUploadedDocs = [];
  //   resumeArray.forEach((element) => {
  //     if (!element[this.form_file_path]) {
  //       let ele = {
  //         label: element[this.form_label],
  //       };
  //       this.resumeNotUploadedDocs.push(ele);
  //     }
  //   });

  //   if (this.resumeNotUploadedDocs && this.resumeNotUploadedDocs.length > 0) {
  //     isValid.resume = false;
  //   }

  //   // Banking
  //   let bankArray = this.uploadForm.getRawValue()[this.form_bankArray];
  //   this.bankNotUploadedDocs = [];
  //   bankArray.forEach((element) => {
  //     if (!element[this.form_file_path]) {
  //       let ele = {
  //         label: 'Bank Passbook Front Page or Bank Cheque Leaf',
  //       };
  //       this.bankNotUploadedDocs.push(ele);
  //     }
  //   });

  //   if (this.bankNotUploadedDocs && this.bankNotUploadedDocs.length > 0) {
  //     isValid.bank = false;
  //   }

  //   // Education
  //   let educationArray =
  //     this.uploadForm.getRawValue()[this.form_educationArray];
  //   this.educationNotUploadedDocs = [];
  //   educationArray.forEach((element) => {
  //     let subData = {
  //       label: element[this.form_education_level],
  //       subDocs: [],
  //     };
  //     element[this.form_semesterArray].forEach((sub) => {
  //       if (!sub[this.form_file_path]) {
  //         subData.subDocs.push({ label: sub[this.form_label] });
  //       }
  //     });
  //     subData.subDocs.length > 0
  //       ? this.educationNotUploadedDocs.push(subData)
  //       : '';
  //   });
  //   if (
  //     this.educationNotUploadedDocs &&
  //     this.educationNotUploadedDocs.length > 0
  //   ) {
  //     isValid.education = false;
  //   }

  //   let finalValidCheck = JSON.stringify(isValid);
  //   return finalValidCheck.includes('false') ? true : false;
  // }

  // beforeSubmit(routeValue?: any) {
  //   // Joining Nulling the not sub desc and exp date.
  //   let joiningArray = this.getJoiningArr.getRawValue();
  //   joiningArray.forEach((element, i) => {
  //     if (element[this.form_file_path]) {
  //       this.getJoiningArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //     }
  //   });

  //   // Transfer Nulling the not sub desc and exp date.
  //   let transferArray = this.getTransferArr.getRawValue();
  //   transferArray.forEach((element, i) => {
  //     if (element[this.form_file_path]) {
  //       this.getTransferArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //     }
  //   });

  //   // Resume Nulling the not sub desc and exp date.
  //   let resumeArray = this.getResumeArr.getRawValue();
  //   resumeArray.forEach((element, i) => {
  //     if (element[this.form_file_path]) {
  //       this.getResumeArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //     }
  //   });

  //   // Banking Nulling the not sub desc and exp date.
  //   let bankingArray = this.getBankArr.getRawValue();
  //   bankingArray.forEach((element, i) => {
  //     if (element[this.form_file_path]) {
  //       this.getBankArr.at(i).patchValue({
  //         [this.form_Not_Submitted_Description]: null,
  //         [this.form_expectedDate]: null,
  //       });
  //     }
  //   });

  //   // Education Nulling the not sub desc and exp date.
  //   let educationArray = this.getEducationArr.getRawValue();
  //   educationArray.forEach((ele, i) => {
  //     ele[this.form_semesterArray].forEach((element, subIndex) => {
  //       if (element[this.form_file_path]) {
  //         this.getSemesterArr(i)
  //           .at(subIndex)
  //           .patchValue({
  //             [this.form_Not_Submitted_Description]: null,
  //             [this.form_expectedDate]: null,
  //           });
  //       }
  //     });
  //   });

  //   // Other
  //   let otherCertArray = this.getOtherCertArr.getRawValue();
  //   otherCertArray.forEach((element, i) => {
  //     if (!element[this.form_file_path]) {
  //       this.getOtherCertArr.removeAt(i);
  //     }
  //     if (element[this.form_file_path]) {
  //       this.getOtherCertArr.at(i).patchValue({
  //         [this.form_name]: this.form_label,
  //       });
  //     }
  //   });

  //   // Certificatopms
  //   let certificationsArray = this.getCertificationsArr.getRawValue();
  //   certificationsArray.forEach((element, i) => {
  //     if (!element[this.form_file_path]) {
  //       this.getCertificationsArr.removeAt(i);
  //     }
  //     if (element[this.form_file_path]) {
  //       this.getCertificationsArr.at(i).patchValue({
  //         [this.form_name]: this.form_label,
  //       });
  //     }
  //   });

  //   this.finalSubmit(routeValue ? routeValue : '');
  // }

  // finalSubmit(routeValue?: any) {
  //   console.log('final submit');
  //   this.loadingService.setLoading(true);
  //   let joiningArray = this.getJoiningArr.getRawValue();
  //   let educationArray = this.getEducationArr.getRawValue();
  //   let transferArray = this.getTransferArr.getRawValue();
  //   let resumeArray = this.getResumeArr.getRawValue();
  //   let bankArray = this.getBankArr.getRawValue();
  //   let certArray = this.getCertificationsArr.getRawValue();
  //   let otherArray = this.getOtherCertArr.getRawValue();
  //   const apiData = {
  //     // joining_details: joiningArray,
  //     // education_documents: educationArray,
  //     resume: resumeArray,
  //     // certifications: certArray,
  //     // other_certifications: otherArray,
  //     // transfer_certificate: transferArray,
  //     // banking_details: bankArray
  //   };
  //   const UploadApiRequestDetails = {
  //     email: this.appConfig.getLocalData('userEmail')
  //       ? this.appConfig.getLocalData('userEmail')
  //       : '',
  //     section_name: 'document_details',
  //     saving_data: apiData,
  //   };

  //   // if(this.dependentForm.valid) {
  //   this.newSaveProfileDataSubscription = this.skillexService
  //     .saveCandidateProfile(UploadApiRequestDetails)
  //     .subscribe((data: any) => {
  //       this.loadingService.setLoading(false);
  //       this.candidateService.saveFormtoLocalDetails(
  //         data.data.section_name,
  //         data.data.saved_data
  //       );
  //       this.candidateService.saveFormtoLocalDetails(
  //         'section_flags',
  //         data.data.section_flags
  //       );
  //       this.appConfig.nzNotification(
  //         'success',
  //         'Saved',
  //         data && data.message ? data.message : 'Upload details is updated'
  //       );
  //       this.sharedService.joiningFormStepperStatus.next();
  //       return routeValue
  //         ? this.appConfig.routeNavigation(routeValue)
  //         : this.appConfig.routeNavigation(
  //             CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW
  //           );
  //     });
  // }

  // async uploadImage(file, i, form) {
  //   try {
  //     this.loadingService.setLoading(true);
  //     const data = await (
  //       await this.skillexService.uploadfile(file)
  //     ).subscribe((data: any) => {
  //       if (data && !data.success) {
  //         this.loadingService.setLoading(false);
  //         return this.appConfig.nzNotification(
  //           'error',
  //           'Not Uploaded',
  //           'Please try again'
  //         );
  //       }
  //       this.loadingService.setLoading(false);
  //       if (data && data.data.file_path) {
  //         if (form == this.conditionResume) {
  //           this.getResumeArr.at(i).patchValue({
  //             [this.form_file_name]: data.data.file_name,
  //             [this.form_file_id]: data.data.file_id,
  //             [this.form_file_path]: data.data.file_path,
  //             [this.form_file_size]: data.data.file_size,
  //             [this.form_file_type]: data.data.type,
  //           });
  //         }
  //       }

  //       this.appConfig.nzNotification(
  //         'success',
  //         'Uploaded',
  //         'Document uploaded successfully'
  //       );
  //     });
  //   } catch (e) {
  //     this.loadingService.setLoading(false);
  //     this.appConfig.nzNotification(
  //       'error',
  //       'Not Uploaded',
  //       'Please try again'
  //     );
  //   }
  //   // }, (err) => {

  //   // });
  // }

  // removeFile(i, form) {
  //   if (form == this.conditionJoining) {
  //     this.getJoiningArr.at(i).patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   }
  //   if (form == this.conditionTransfer) {
  //     this.getTransferArr.at(i).patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   }
  //   if (form == this.conditionResume) {
  //     this.getResumeArr.at(i).patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   }
  //   if (form == this.conditionBank) {
  //     this.getBankArr.at(i).patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   }
  //   if (form == this.conditionCert) {
  //     this.getCertificationsArr.at(i).patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   }
  //   if (form == this.conditionOther) {
  //     this.getOtherCertArr.at(i).patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   }

  //   this.selectedImage = null;
  // }

  // onSelectFile(event, i, form) {
  //   if (
  //     form == this.conditionJoining &&
  //     this.getJoiningArr.at(i).value[this.form_name] == 'PhotoID'
  //   ) {
  //     return this.onPhotoUpload(event, i, form);
  //   }
  //   if (
  //     (form == this.conditionBank &&
  //       this.getBankArr.at(i).value[this.form_name] == 'Banking') ||
  //     (form == this.conditionJoining &&
  //       this.getJoiningArr.at(i).value[this.form_name] == 'Aadhar') ||
  //     (form == this.conditionJoining &&
  //       this.getJoiningArr.at(i).value[this.form_name] == 'PAN') ||
  //     (form == this.conditionJoining &&
  //       this.getJoiningArr.at(i).value[this.form_name] == 'CasteDeclaration') ||
  //     (form == this.conditionTransfer &&
  //       this.getTransferArr.at(i).value[this.form_name] ==
  //         'TransferCertificate')
  //   ) {
  //     if (
  //       event.target.files &&
  //       event.target.files[0].type.includes('application/pdf')
  //     ) {
  //     } else {
  //       return this.onPhotoUpload(event, i, form);
  //     }
  //   }
  //   const fd = new FormData();
  //   if (
  //     event.target.files &&
  //     event.target.files[0].type.includes('application/pdf')
  //   ) {
  //     if (event.target.files[0].size < 2000000) {
  //       if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
  //         this.selectedImage = event.target.files[0];

  //         // if (form == this.conditionJoining) {
  //         //   fd.append('email', this.appConfig.getLocalData('userEmail')? this.appConfig.getLocalData('userEmail') : '',);
  //         //   fd.append('description', this.getJoiningArr.at(i).value[this.form_description]);
  //         //   fd.append('label', form);
  //         //   fd.append('level', this.getJoiningArr.at(i).value[this.form_name]);
  //         //   fd.append('product_image', this.selectedImage);
  //         //   this.uploadImage(fd, i, form);
  //         // }
  //         // if (form == this.conditionTransfer) {
  //         //   fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
  //         //   fd.append('description', this.getTransferArr.at(i).value[this.form_description]);
  //         //   fd.append('label', form);
  //         //   fd.append('level', this.getTransferArr.at(i).value[this.form_name]);
  //         //   fd.append('product_image', this.selectedImage);
  //         //   this.uploadImage(fd, i, form);
  //         // }
  //         if (form == this.conditionResume) {
  //           fd.append(
  //             'email',
  //             this.appConfig.getLocalData('userEmail')
  //               ? this.appConfig.getLocalData('userEmail')
  //               : ''
  //           );
  //           fd.append(
  //             'description',
  //             this.getResumeArr.at(i).value[this.form_description]
  //           );
  //           // fd.append('label', form);
  //           // fd.append('level', this.getResumeArr.at(i).value[this.form_name]);
  //           fd.append('uploadType', 'document');
  //           fd.append('uploadFile', this.selectedImage);
  //           this.uploadImage(fd, i, form);
  //         }
  //         // if (form == this.conditionBank) {
  //         //   fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
  //         //   fd.append('description', this.getBankArr.at(i).value[this.form_description]);
  //         //   fd.append('label', form);
  //         //   fd.append('level', this.getBankArr.at(i).value[this.form_name]);
  //         //   fd.append('product_image', this.selectedImage);
  //         //   this.uploadImage(fd, i, form);
  //         // }
  //         // if (form == this.conditionCert) {
  //         //   fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
  //         //   fd.append('description', this.getCertificationsArr.at(i).value[this.form_description]);
  //         //   fd.append('label', form);
  //         //   fd.append('level', this.getCertificationsArr.at(i).value[this.form_label]);
  //         //   fd.append('product_image', this.selectedImage);
  //         //   this.uploadImage(fd, i, form);
  //         // }
  //         // if (form == this.conditionOther) {
  //         //   fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
  //         //   fd.append('description', this.getOtherCertArr.at(i).value[this.form_description]);
  //         //   fd.append('label', form);
  //         //   fd.append('level', this.getOtherCertArr.at(i).value[this.form_label]);
  //         //   fd.append('product_image', this.selectedImage);
  //         //   this.uploadImage(fd, i, form);
  //         // }
  //       }
  //     } else {
  //       // this.showResumeImgSizeError = true;
  //       this.appConfig.nzNotification(
  //         'error',
  //         'Not Uploaded',
  //         'Maximum file size is 2 MB'
  //       );
  //     }
  //   } else {
  //     if (
  //       (form == this.conditionBank &&
  //         this.getBankArr.at(i).value[this.form_name] == 'Banking') ||
  //       (form == this.conditionJoining &&
  //         this.getJoiningArr.at(i).value[this.form_name] == 'Aadhar') ||
  //       (form == this.conditionJoining &&
  //         this.getJoiningArr.at(i).value[this.form_name] == 'PAN') ||
  //       (form == this.conditionJoining &&
  //         this.getJoiningArr.at(i).value[this.form_name] ==
  //           'CasteDeclaration') ||
  //       (form == this.conditionTransfer &&
  //         this.getTransferArr.at(i).value[this.form_name] ==
  //           'TransferCertificate')
  //     ) {
  //       return this.appConfig.nzNotification(
  //         'error',
  //         'Invalid Format',
  //         'Please upload PDF or PNG/JPEG files only'
  //       );
  //     } else {
  //       this.appConfig.nzNotification(
  //         'error',
  //         'Invalid Format',
  //         'Please upload PDF files only'
  //       );
  //     }
  //     // this.showResumeImgError = true;
  //   }
  // }

  // onPhotoUpload(event, i, form) {
  //   const fd = new FormData();
  //   if (
  //     event.target.files &&
  //     (event.target.files[0].type.includes('image/png') ||
  //       event.target.files[0].type.includes('image/jp')) &&
  //     !event.target.files[0].type.includes('svg')
  //   ) {
  //     if (event.target.files[0].size < 2000000) {
  //       if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
  //         this.selectedImage = event.target.files[0];

  //         if (form == this.conditionJoining) {
  //           fd.append(
  //             'user_id',
  //             this.appConfig.getLocalData('userId')
  //               ? this.appConfig.getLocalData('userId')
  //               : ''
  //           );
  //           fd.append(
  //             'description',
  //             this.getJoiningArr.at(i).value[this.form_description]
  //           );
  //           fd.append('label', form);
  //           fd.append('level', this.getJoiningArr.at(i).value[this.form_name]);
  //           fd.append('product_image', this.selectedImage);
  //           this.uploadImage(fd, i, form);
  //         }
  //         if (form == this.conditionBank) {
  //           fd.append(
  //             'user_id',
  //             this.appConfig.getLocalData('userId')
  //               ? this.appConfig.getLocalData('userId')
  //               : ''
  //           );
  //           fd.append(
  //             'description',
  //             this.getBankArr.at(i).value[this.form_description]
  //           );
  //           fd.append('label', form);
  //           fd.append('level', this.getBankArr.at(i).value[this.form_name]);
  //           fd.append('product_image', this.selectedImage);
  //           this.uploadImage(fd, i, form);
  //         }
  //         if (form == this.conditionTransfer) {
  //           fd.append(
  //             'user_id',
  //             this.appConfig.getLocalData('userId')
  //               ? this.appConfig.getLocalData('userId')
  //               : ''
  //           );
  //           fd.append(
  //             'description',
  //             this.getTransferArr.at(i).value[this.form_description]
  //           );
  //           fd.append('label', form);
  //           fd.append('level', this.getTransferArr.at(i).value[this.form_name]);
  //           fd.append('product_image', this.selectedImage);
  //           this.uploadImage(fd, i, form);
  //         }
  //       }
  //     } else {
  //       // this.showResumeImgSizeError = true;
  //       this.appConfig.nzNotification(
  //         'error',
  //         'Not Uploaded',
  //         'Maximum file size is 2 MB'
  //       );
  //     }
  //   } else {
  //     if (
  //       form == this.conditionBank &&
  //       this.getBankArr.at(i).value[this.form_name] == 'PhotoID'
  //     ) {
  //       return this.appConfig.nzNotification(
  //         'error',
  //         'Invalid Format',
  //         'Please upload PNG/JPEG files only'
  //       );
  //     } else {
  //       return this.appConfig.nzNotification(
  //         'error',
  //         'Invalid Format',
  //         'Please upload PDF or PNG/JPEG files only'
  //       );
  //     }
  //     // this.showResumeImgError = true;
  //   }
  // }

  // async uploadEducationImage(file, mainIndex, subIndex, form) {
  //   try {
  //     this.loadingService.setLoading(true);
  //     const data = await (
  //       await this.candidateService.uploadJoiningDocs(file)
  //     ).json();
  //     if (data && data.error_code) {
  //       this.loadingService.setLoading(false);
  //       return this.appConfig.nzNotification(
  //         'error',
  //         'Not Uploaded',
  //         'Please try again'
  //       );
  //     }
  //     this.loadingService.setLoading(false);
  //     if (data && data.file_id) {
  //       this.getSemesterArr(mainIndex)
  //         .at(subIndex)
  //         .patchValue({
  //           [this.form_file_name]: data.file_name,
  //           [this.form_file_id]: data.file_id,
  //           [this.form_file_path]: data.file_path,
  //           [this.form_file_size]: data.file_size,
  //           [this.form_file_type]: data.type,
  //         });
  //     }

  //     this.appConfig.nzNotification(
  //       'success',
  //       'Uploaded',
  //       'Document uploaded successfully'
  //     );
  //   } catch (e) {
  //     this.loadingService.setLoading(false);
  //     this.appConfig.nzNotification(
  //       'error',
  //       'Not Uploaded',
  //       'Please try again'
  //     );
  //   }
  //   // }, (err) => {

  //   // });
  // }

  // removeEducationFile(mainIndex, subIndex, form) {
  //   this.getSemesterArr(mainIndex)
  //     .at(subIndex)
  //     .patchValue({
  //       [this.form_file_name]: null,
  //       [this.form_file_id]: null,
  //       [this.form_file_path]: null,
  //       [this.form_file_size]: null,
  //       [this.form_file_type]: null,
  //     });
  //   this.selectedImage = null;
  // }

  // onEducationFileUpload(event, mainIndex, subIndex, form) {
  //   const fd = new FormData();
  //   if (
  //     event.target.files &&
  //     event.target.files[0].type.includes('application/pdf')
  //   ) {
  //     if (event.target.files[0].size < 2000000) {
  //       if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
  //         this.selectedImage = event.target.files[0];

  //         fd.append(
  //           'user_id',
  //           this.appConfig.getLocalData('userId')
  //             ? this.appConfig.getLocalData('userId')
  //             : ''
  //         );
  //         fd.append(
  //           'description',
  //           this.getSemesterArr(mainIndex).at(subIndex).value[
  //             this.form_description
  //           ]
  //         );
  //         fd.append(
  //           'label',
  //           this.getEducationArr.at(mainIndex).value[this.form_education_level]
  //         );
  //         fd.append(
  //           'level',
  //           this.getSemesterArr(mainIndex).at(subIndex).value[this.form_name]
  //         );
  //         fd.append('product_image', this.selectedImage);
  //         this.uploadEducationImage(fd, mainIndex, subIndex, form);
  //       }
  //     } else {
  //       // this.showResumeImgSizeError = true;
  //       this.appConfig.nzNotification(
  //         'error',
  //         'Not Uploaded',
  //         'Maximum file size is 2 MB'
  //       );
  //     }
  //   } else {
  //     this.appConfig.nzNotification(
  //       'error',
  //       'Invalid Format',
  //       'Please upload PDF files only'
  //     );
  //     // this.showResumeImgError = true;
  //   }
  // }


  // openNodocs(routeValue?: any) {
  //   this.isRoute = routeValue ? routeValue : '';
  //   // this.pdfsrc = src;
  //   // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
  //   const dialogRef = this.dialog.open(this.matNoDocs, {
  //     width: '850px',
  //     height: 'auto',
  //     autoFocus: false,
  //     closeOnNavigation: true,
  //     disableClose: false,
  //     panelClass: 'popupModalContainerForNoDoc',
  //   });
  // }

  // openMatDialog(src, type?) {
  //   if (!type.includes('application/pdf')) {
  //     return window.open(src, '_blank');
  //   }
  //   this.pdfsrc = src;
  //   // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
  //   const dialogRef = this.dialog.open(this.matDialogRef, {
  //     width: '600px',
  //     height: 'auto',
  //     autoFocus: false,
  //     closeOnNavigation: true,
  //     disableClose: false,
  //     panelClass: 'popupModalContainerForPDFViewer',
  //   });
  // }
  // closeBox() {
  //   this.dialog.closeAll();
  // }



  // Form getters
  // convenience getters for easy access to form fields
  // get getJoiningArr() {
  //   return this.uploadForm.get([this.form_joiningArray]) as FormArray;
  // }
  // get getResumeArr() {
  //   return this.uploadForm.get([this.form_resumeArray]) as FormArray;
  // }
  // get getTransferArr() {
  //   return this.uploadForm.get([this.form_transferCertArray]) as FormArray;
  // }
  // get getBankArr() {
  //   return this.uploadForm.get([this.form_bankArray]) as FormArray;
  // }
  // get getOtherCertArr() {
  //   return this.uploadForm.get([this.form_otherCertArray]) as FormArray;
  // }
  // get getCertificationsArr() {
  //   return this.uploadForm.get([this.form_CertificationArray]) as FormArray;
  // }
  // get getEducationArr() {
  //   return this.uploadForm.get([this.form_educationArray]) as FormArray;
  // }
  // getSemesterArr(i: any): FormArray {
  //   return this.getEducationArr
  //     .at(i)
  //     .get([this.form_semesterArray]) as FormArray;
  // }



}
function toggleButtonSelection() {
  throw new Error('Function not implemented.');
}

