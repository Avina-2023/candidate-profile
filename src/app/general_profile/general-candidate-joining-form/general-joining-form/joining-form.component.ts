import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { delay } from 'rxjs/operators';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { SharedServiceService } from 'src/app/service/shared-service.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from 'src/app/service/loader-service.service';
import { SkillexService } from 'src/app/service/skillex.service';
import {MatIconModule} from '@angular/material/icon';
import { ImageCroppedEvent,Dimensions,ImageTransform, base64ToFile } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-joining-form',
  templateUrl: './joining-form.component.html',
  styleUrls: ['./joining-form.component.scss']
})
export class GeneralJoiningFormComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  expand =false;
  currentlyOpenedItemIndex = -1;
  imageChangedEvent: any = '';
    croppedImage: any = '';
    // candidateProfileimage= localStorage.profileData.personal_details.profileImage;
  @ViewChild('matDialog', {static: false}) matDialogRef: TemplateRef<any>;
  @ViewChild('matDialog1', {static: false}) matDialogRef1: TemplateRef<any>;
  allPresentCityList: any;
  allPermanentCityList: any;
  getAllStates: any;
  updatedCitySubscription1: Subscription;

  openJoiningRoutePopUpSubscribe: Subscription;
  joiningFormStepperStatusSubscribe: Subscription;
  joiningFormActiveSelectorSubscribe: Subscription;
  activeStep: any = 'personal';
  showJoiningForm: boolean;
  profilePictureFormControl = new FormControl(null, [Validators.required]);
  showSizeError = {
    image: false,
    size: false,
    maxsize: '',
    minsize: ''
  };
  showCropper = false;

  profilePicture = {
    file_path: null,
  };
  role = this.appConfig.getLocalData('roles');
  valid = {
    personal: true,
    contact: false,
    dependent: false,
    education: false,
    work: false,
    project: false,
    accomplishments: false,
    upload: false,
    disciplinary: false,
    preview: false,
    submit: false,
    tillPersonal() {
      this.personal = true;
      this.contact = false;
      this.dependent = false;
      this.education = false;
      this.work = false;
      this.project = false;
      this.accomplishments = false;
      this.upload = false;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
      },
      tillContact() {
        this.personal = true;
        this.contact = true;
        this.dependent = false;
        this.education = false;
        this.work = false;
        this.project = false;
      this.accomplishments = false;
        this.upload = false;
        this.disciplinary = false;
        this.preview = false;
        this.submit = false;
        },
      tilldependent() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = false;
      this.work = false;
      this.project = false;
      this.accomplishments = false;
      this.upload = false;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
    },
    tilleducation() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = false;
      this.project = false;
      this.accomplishments = false;
      this.upload = false;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
    },
    tillwork() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = false;
      this.accomplishments = false;
      this.upload = false;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
    },
    tillproject(){
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = true;
      this.accomplishments = false;
      this.upload = false;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
    },
    tillaccomplishments(){
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = true;
      this.accomplishments = true;
      this.upload = false;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
    },
    tillupload() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = true;
      this.accomplishments = true;
      this.upload = true;
      this.disciplinary = false;
      this.preview = false;
      this.submit = false;
    },
    tilldisciplinary() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = true;
      this.accomplishments = true;
      this.upload = true;
      this.disciplinary = true;
      this.preview = false;
      this.submit = false;
    },
    tillpreview() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = true;
      this.accomplishments = true;
      this.upload = true;
      this.disciplinary = true;
      this.preview = true;
      this.submit = false;
    },
    tillsbmit() {
      this.personal = true;
      this.contact = true;
      this.dependent = true;
      this.education = true;
      this.work = true;
      this.project = true;
      this.accomplishments = true;
      this.upload = true;
      this.disciplinary = true;
      this.preview = true;
      this.submit = true;
    }
  }
  public email: any;
  public name: any;
  public gender: any ;
  public addressCity: any ;
  public addressState: any ;
  public addressCountry: any ;
  public updatedOn: any;
  form_permanent_city = 'permanent_city';
  form_permanent_state = 'permanent_state';
  routingSelection: any;
  requestnavigationRoute: any;
  noSave: boolean;
  hideStepper: boolean = false;
  redirectToPreview: boolean;
  toggoleShowHide: boolean;
  validimage: boolean = true;
  disableLoginButton:boolean = true;
  profileimage: any;
  cadidatefinalimage: any;
  contactDetails: any;
  contactDetailsMap: any;
  constructor(
    private skillexService: SkillexService,
    private loadingService: LoaderService,
    private appConfig: AppConfigService,
    public candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private dialog: MatDialog,
    public matDialog: MatDialog,
    private toastr: ToastrService
  ) {
    const subWrapperMenus = null;
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.toggoleShowHide = true;
  }


  ngOnInit() {
    this.statusOfForms();
    this.openPopupRequest();
    this.activeSelectorRxJs();
    this.stepperStatus();
    this.checkJoiningComponentNeeded();
    this.email = localStorage.getItem('userEmail');
    this.name = localStorage.getItem('username');
// this.getAllPermanentCities(id, cityId, callback);
    this.getprofileimageFromLocal();
// console.log(this.profilePicture.file_path)
this.getStateAPI()
  }



  activeSelectorRxJs() {
    this.joiningFormActiveSelectorSubscribe = this.sharedService.joiningFormActiveSelector.pipe(delay(0)).subscribe((data: any)=> {
      // this.hideStepper = this.appConfig.getLocalData('isEditAllowed') == 'true' ? false : true;
      let datas = this.candidateService.getLocalsection_flags();
        this.routingSelection = null;
        this.routingSelection = data ? data : this.routingSelection;
    });
  }
  itemClicked(){
    this.toggoleShowHide = !this.toggoleShowHide;
  }
  expansion() {
    this.expand = !this.expand;
 }
 //profile img
 open(){
  const dialogRef = this.matDialog.open(this.matDialogRef1, {
    width: '400px',
    height: '450px',
    panelClass: 'matDialog',
    autoFocus: false,
    closeOnNavigation: true,
    disableClose: true,
  });
  // this.fileChangeEvent(this.imageChangedEvent)
    this.profilePicture.file_path=null;
// console.log(this.profilePicture.file_path);

}

 fileChangeEvent(event: any): void {

  this.imageChangedEvent = event;
  // this.imageChangedEvent = this.profilePicture.file_path;

  // console.log(this.imageChangedEvent,'event');

}
getAllPermanentCities(id, cityId, callback) {
  const ApiData = {
    state_id: id
  };
  let city;
 this.updatedCitySubscription1 = this.skillexService.districtList(ApiData).subscribe((datas: any) => {
    // this.hideCityDropDown = false;

    this.allPermanentCityList = datas.data;
    // console.log(this.allPermanentCityList,'this.allPermanentCityList');

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

getStateAPI() {

  const datas = {
    country_id: '101'
  };
  let candidateProfileimage = JSON.parse(localStorage.getItem("profileData"))  ;
  // console.log(candidateProfileimage,'this.candidateProfileimage');

//   candidateProfileimage.contactDetails.permanent_state = this.addressState ;
//   candidateProfileimage.contactDetails.permanent_city = this.addressCountry ;
//   candidateProfileimage.contactDetails.permanent_country = this.addressCity ;
// console.log(this.addressCity,'this.addressCity');

  this.candidateService.updatedState(datas).subscribe((data: any) => {
    console.log(data,'datas');

    this.getAllStates = data[0];
    this.getAllStates.forEach(element => {
      if (element.id == this.addressState) {
        this.addressState = element.name;
        console.log(this.addressState);

        this.getAllPermanentCities(element.id, this.addressCity, (callback) => {
          this.addressCity = callback ? callback : 'NA';
        });
      }
    });
  }, (err) => {

  });
}

setprofileimageToLocal(){
  let candidateProfileimage = JSON.parse(localStorage.getItem("profileData"))  ;
  candidateProfileimage.personal_details.profileImage = this.profilePicture.file_path ;
localStorage.setItem("profileData",JSON.stringify(candidateProfileimage));
}

getprofileimageFromLocal(){
  let candyprofileimage = JSON.parse(localStorage.getItem("profileData")) ;
  console.log(candyprofileimage,'candyprofileimage');
  // localStorage.setItem("profileData",JSON.stringify(candidateProfileimage));
  this.cadidatefinalimage = candyprofileimage.personal_details.profileImage;
  this.gender = candyprofileimage.personal_details.gender;
  this.addressCity = candyprofileimage.contact_details.permanent_city;
  this.addressState = candyprofileimage.contact_details.present_state;
  this.addressCountry = candyprofileimage.contact_details.present_country;
 this.updatedOn = candyprofileimage.updatedAt;
  console.log(this.cadidatefinalimage,'this.cadidatefinalimage')
}

imageCropped(event: ImageCroppedEvent) {
  // console.log(event,'crop');

  this.croppedImage = event.base64;
}

base64ToBinary(base64Data: string): Uint8Array {
    const binaryData = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));
    return binaryData;
  }

imageLoaded() {
  this.showCropper = true;
  // show cropper
}
cropperReady(sourceImageDimensions: Dimensions) {
  // cropper ready
}
loadImageFailed() {
  // show message
}

  public delete(event) {
    const fd = new FormData();
    // this.loadingService.setLoading(true);
      fd.append('userEmail', this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '');
      fd.append('type',"profileDelete");
      this.uploadImage(fd);
      this.profilePictureFormControl.setValue(null);
      this.profilePictureFormControl.markAsTouched();
      // this.setprofileimageToLocal();
      // let candidateProfileimage = JSON.parse(localStorage.getItem("profileData"))  ;
      // candidateProfileimage.personal_details.profileImage = this.profilePicture.file_path ;
      //  localStorage.setItem("profileData",JSON.stringify(candidateProfileimage));
  }

  onSelectFile(event) {
    // console.log(this.profilePicture.file_path,'yyy');
    // this.validimage = true;

    const fd = new FormData();
    this.profilePictureFormControl.markAsTouched();
    if (this.imageChangedEvent.target.files && (this.imageChangedEvent.target.files[0].type.includes('image/png') || this.imageChangedEvent.target.files[0].type.includes('image/jpeg')) && !this.imageChangedEvent.target.files[0].type.includes('svg')) {
      if (this.imageChangedEvent.target.files[0].size < 2000000) {
        if (this.appConfig.minImageSizeValidation(this.imageChangedEvent.target.files[0].size)) {
        // let image = this.croppedImage target.files[0].name;
        // let image = Buffer.from(this.croppedImage, "base64");
        fd.append('userEmail', this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '');
        fd.append('uploadFile',new File([base64ToFile(this.croppedImage)],this.imageChangedEvent.target.files[0].name, { lastModified: this.imageChangedEvent.target.files[0].lastModified,type: this.imageChangedEvent.target.files[0].type, }));
        fd.append('type',"profile");
        this.uploadImage(fd);
// console.log(this.profilePicture.file_path,'onsave.files');

      }
     } else {
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
     }
    } else {
      return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PNG/JPEG files only');
    }
  }

  async uploadImage(file) {
// console.log(file,'ooo');
    try {
      this.profilePictureFormControl.markAsUntouched();
      this.loadingService.setLoading(true);
      this.skillexService.uploadfile(file).subscribe((data:any) => {
        // if (data && !data.succes) {
        //   this.loadingService.setLoading(false);
        //   return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
        // }
        this.loadingService.setLoading(false);
        // console.log(data,'iii');
        this.profilePicture = {

          file_path: data?.data.length? data.data : null,

        };
        // if (data && data.data && data.data.length) {

        // }else{
        //   this.profilePicture = {

        //     file_path: null,

        //   };
        // }
        this.profilePictureFormControl.setValue(this.profilePicture.file_path);
        this.dialog.closeAll()
        this.toastr.success(data.message);
        this.setprofileimageToLocal();
        this.getprofileimageFromLocal();
        this.croppedImage

      });
    } catch (e) {
      // console.log("error while profile pic"+e)
      this.profilePicture.file_path ? this.profilePictureFormControl.markAsTouched() : this.profilePictureFormControl.markAsUntouched();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    }
  }

  stepperStatus() {
   this.joiningFormStepperStatusSubscribe = this.sharedService.joiningFormStepperStatus.subscribe((data: any)=> {
      if (data == 'dataFromMasterDashboard') {
        this.statusOfForms();
      } else {
        this.statusOfForms('data');
      }
    });
  }
  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if(this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
  checkFormSubmitted() {
    // this.hideStepper = this.appConfig.getLocalData('isEditAllowed') == 'true' ? false : true;
    if (this.appConfig.getLocalData('joiningFormAccess') == 'true') {
      return this.redirectToPreview = false;
    }
    if (this.appConfig.getLocalData('joiningFormAccess') != 'true' && this.appConfig.getLocalData('isEditAllowed') == 'true') {
      return this.redirectToPreview = false;
    }
     else {
      this.redirectToPreview = false;
    }
  }

  statusOfForms(param?: any) {
    if (this.candidateService.getLocalProfileData()) {
      let data = this.candidateService.getLocalsection_flags();
      this.checkFormSubmitted();
      if ((data && data.submitted) || this.redirectToPreview) {
        this.valid.tillsbmit();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
        return this.activeStep = 'preview';
      }

      if (data && data.previewed) {
        this.valid.tillpreview();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT);
        return this.activeStep = 'submit';
      }
      if (data && data.personal_details == false) {
        this.valid.tillPersonal();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL);
        return this.activeStep = 'personal';//, this.routingSelection = param ? param : 'contact';
      }
      if (data && data.contact_details == false) {
        this.valid.tillContact();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
        return this.activeStep = 'contact';
      }
      if (data && data.dependent_details == false) {
        this.valid.tilldependent();
       param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT);
       return this.activeStep = 'dependent';//, this.routingSelection = param ? param : 'education';
      }
      if (data && data.education_details == false) {
        this.valid.tilleducation();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
        return this.activeStep = 'education';
      }
      if (data && data.experience_details == false) {
          this.valid.tillwork();
          param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK);
          return this.activeStep = 'work';
      }
      if (data && data.project_details == false) {
        this.valid.tillproject();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT);
        return this.activeStep = 'project';
      }
      if (data && data.accomplishment_details == false) {
        this.valid.tillaccomplishments();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS);
        return this.activeStep = 'accomplishments';
      }
      if (data && data.document_details == false) {
        this.valid.tillupload();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD);
        return this.activeStep = 'upload';
      }
      if (data && data.disciplinary_details == false) {
        this.valid.tilldisciplinary();
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DISCIPLINARY_DETAILS);
        return this.activeStep = 'disciplinary';
      }
      else {
        param ? null : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW);
        return this.activeStep = 'preview';//, this.routingSelection = param ? param : 'personal';
      }
    } else {
      let apiData = {
        form_name: 'joining',
        section_name: ''
      }
      // this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
      //   this.candidateService.saveAllProfileToLocal(data);
      //   this.sharedService.joiningFormDataPassing.next();
      //   this.statusOfForms();
      // });
    }
  }

  validCheck(clickedStep) {

    if (clickedStep == 'personal') {
      if (this.routingSelection != 'personal') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL}
        this.sharedService.StepperNavigationCheck.next(data);
      }
    //  this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL);
    }
    if (clickedStep == 'contact') {
      if (this.routingSelection != 'contact') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
    }
    if (clickedStep == 'dependent') {
      if (this.routingSelection != 'dependent') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT);
    }
    if (clickedStep == 'education') {
      if (this.routingSelection != 'education') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'work') {
      if (this.routingSelection != 'work') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'project') {
      if (this.routingSelection != 'project') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'accomplishments') {
      if (this.routingSelection != 'accomplishments') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS}
        this.sharedService.StepperNavigationCheck.next(data);
      }
    }
    if (clickedStep == 'upload') {
      if (this.routingSelection != 'upload') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'disciplinary') {
      if (this.routingSelection != 'disciplinary') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_DISCIPLINARY_DETAILS}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'preview') {
      if (this.routingSelection != 'preview') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
    if (clickedStep == 'submit') {
      if (this.routingSelection != 'submit') {
        let data = {current: this.routingSelection, goto: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT}
        this.sharedService.StepperNavigationCheck.next(data);
      }
      // this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
  }

  openMatDialog() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForForms'
    });
  }

  closeDialog(e) {
    this.dialog.closeAll();
    this.sendPopUpResultTo(e);
  }

  sendPopUpResultTo(result) {
    if (result == 'save' || result == 'cancel') {
      let data = {
        result,
        route: this.requestnavigationRoute
      }

     return this.sharedService.sendPopupResult.next(data);
    } else {
      return this.appConfig.routeNavigation(this.requestnavigationRoute);
    }
  }

  openPopupRequest() {
    this.openJoiningRoutePopUpSubscribe = this.sharedService.openJoiningRoutePopUp.subscribe((route: any)=> {
      this.noSave = false;
      this.requestnavigationRoute = route;
      this.noSave = this.checkSaveOption(route) == true ? true : false;
      this.openMatDialog();
    });
  }

  checkSaveOption(route) {
    if (this.activeStep == 'personal') {
      if (route.includes('contact')) {
        return true;
      }
    }
    if (this.activeStep == 'contact') {
      if (route.includes('dependent')) {
        return true;
      }
    }
    if (this.activeStep == 'dependent') {
      if (route.includes('education')) {
        return true;
      }
    }
    if (this.activeStep == 'education') {
      if (route.includes('work')) {
        return true;
      }
    }
    if (this.activeStep == 'work') {
      if (route.includes('project')) {
        return true;
      }
    }
    if (this.activeStep == 'project') {
      if (route.includes('accomplishments')) {
        return true;
      }
    }
    if (this.activeStep == 'accomplishments') {
      if (route.includes('upload')) {
        return true;
      }
    }
    if (this.activeStep == 'upload') {
      if (route.includes('disciplinary')) {
        return true;
      }
    }
    if (this.activeStep == 'disciplinary') {
      if (route.includes('preview')) {
        return true;
      }
    }
    if (this.activeStep == 'preview') {
      if (route.includes('submit')) {
        return true;
      }
    }
  }

  // Configuration for candidate role
  checkJoiningComponentNeeded() {
  if (this.appConfig.getLocalData('joiningFormAccess') && this.appConfig.getLocalData('joiningFormAccess') === 'true') {
    this.showJoiningForm = true;

  }
  }

  isPermissionGranted() {
    let selectedDrivePermissions = this.appConfig.getSelectedDriveDetails();
    return selectedDrivePermissions && selectedDrivePermissions.candidateStatus && selectedDrivePermissions.candidateStatus.interviewSchedule == '1' ? true : false;
    return true;
  }

  ngOnDestroy() {
    this.openJoiningRoutePopUpSubscribe ? this.openJoiningRoutePopUpSubscribe.unsubscribe() : '';
    this.joiningFormStepperStatusSubscribe ? this.joiningFormStepperStatusSubscribe.unsubscribe() : '';
    this.joiningFormActiveSelectorSubscribe ? this.joiningFormActiveSelectorSubscribe.unsubscribe() : '';
  }
}
