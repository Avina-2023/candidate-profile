import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SkillexService } from 'src/app/service/skillex.service';
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { InterComponentMessenger } from 'src/app/service/interComponentMessenger.service';


@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.scss']
})
export class GeneralMasterComponent implements OnInit {
  productionUrl = environment.SKILLEX_BASE_URL == "https://skilledge.lntedutech.com"?true:false;

  public email: any;
   public objDetails: any;
   public Details: any;
   public profilepercentage: any;
  profilePictureFormControl = new FormControl(null, [Validators.required]);
  profilePicture = {
    file_path: null,
  };
  isExternal: boolean = false;
  percentage: number;
  username:any;
  profileCompletion:any;
  profileImage: any;
  constructor(private appConfig: AppConfigService,
    private loadingService: LoaderService,
    private skillexService: SkillexService,
    private apiService: ApiServiceService,
    private msgData:InterComponentMessenger
    ) {
  }

  ngOnInit() {
    // this.profilepercentage = Math.ceil(this.Details.profilePercentage);
    this.isExternal = this.appConfig.getLocalData('externalLogin')
    // this.setprofileimageToLocal()
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('userEmail');
    this.CandidateDetails();
    this.msgData.getMessage().subscribe((data)=>{
      console.log(data,'data');
      if(data.head=='saved'&& data.value !="" && data.value != undefined){
        if (data.value == true) {
          this.CandidateDetails()
        }
      }
  })
  }


  CandidateDetails() {
    var obj = {};
    obj = {
      email: this.skillexService.encryptnew(
        this.email,
        environment.cryptoEncryptionKey
      ),
    };
    // console.log(obj,'obj');
    this.skillexService.candidateDetails(obj).subscribe((res: any) => {
      if (res.success) {
        this.Details = res.data;
        // this.profileImage = this.Details.personal_details.profileImage;
        // this.msgData.sendMessage("profileImage",this.profileImage)
        // if (this.profileImage && this.productionUrl == true) {
        //   this.appConfig.setLocalData('profileImage',this.profileImage + environment.blobToken);
        //   this.profileImage = this.profileImage + environment.blobToken
        // } else if (this.profileImage && this.productionUrl == false) {
        //   this.appConfig.setLocalData('profileImage',this.profileImage);
        //   this.profileImage = this.profileImage
        // }
        // this.appConfig.setLocalStorage('candidateProfile',JSON.stringify(this.Details));
        this.profilepercentage = Math.ceil(this.Details.profilePercentage);
        localStorage.setItem("profilePercentage",(this.profilepercentage));
          let ProfileUpdated = JSON.parse(localStorage.getItem("profileData"))  ;
          ProfileUpdated.updatedAt = this.Details.updatedAt ;
          ProfileUpdated.createdAt = this.Details.createdAt ;
          localStorage.setItem("createdAt",ProfileUpdated.createdAt); // on init load member since date
          localStorage.setItem("profileData",JSON.stringify(ProfileUpdated));

      }
    });

  }
  gotoProfile(){
    let emailval = localStorage.getItem('email')
    let enc_email = encodeURIComponent(this.skillexService.encryptnew(emailval,environment.cryptoEncryptionKey))
    // window.open(environment.SKILL_PROFILE_URL+'/externallogin?extId='+enc_email, 'profile_redir');
    window.location.assign(environment.SKILLEX_BASE_URL+'/externallogin?extId='+enc_email);
  }

  // CandidateDetails() {
  //   var obj = {};
  //   obj = {
  //     email: this.skillexService.encryptnew(
  //       localStorage.getItem('email'),
  //       environment.cryptoEncryptionKey
  //     ),
  //   };
  //   this.skillexService.candidateprogress(obj).subscribe((res: any) => {
  //     if (res.success) {
  //       this.Details = res.data;

  //       // this.profileImage = this.Details.personal_details.profileImage;
  //       // this.msgData.sendMessage("profileImage",this.profileImage)
  //       // if (this.profileImage && this.productionUrl == true) {
  //       //   this.appConfig.setLocalStorage('profileImage',this.profileImage + environment.blobToken);
  //       //   this.profileImage = this.profileImage + environment.blobToken
  //       // } else if (this.profileImage && this.productionUrl == false) {
  //       //   this.appConfig.setLocalStorage('profileImage',this.profileImage);
  //       //   this.profileImage = this.profileImage

  //       // }
  //       this.appConfig.setLocalData('candidateProfile',JSON.stringify(this.Details));
  //       this.profilepercentage = Math.ceil(this.Details.profilePercentage);
  //       this.appConfig.setLocalData('profilePercentage', this.profilepercentage);

  //     }
  //   });
  // }
  async uploadImage(file) {
    try {
      this.profilePictureFormControl.markAsUntouched();
      this.loadingService.setLoading(true);
      this.skillexService.uploadfile(file).subscribe((data:any) => {
        // if (data && !data.succes) {
        //   this.loadingService.setLoading(false);
        //   return this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
        // }
        this.loadingService.setLoading(false);
        if (data ) {
          this.profilePicture = {

            file_path: data.data.file_path,

          };
          this.profilePictureFormControl.setValue(this.profilePicture.file_path);
        }
        this.appConfig.nzNotification('success', 'Uploaded', 'Profile Picture uploaded successfully');

      });


    } catch (e) {
      this.profilePicture.file_path ? this.profilePictureFormControl.markAsTouched() : this.profilePictureFormControl.markAsUntouched();
      this.loadingService.setLoading(false);
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Please try again');
    }
  }
  public delete() {
    this.profilePicture = {
      file_path: null,
    };
    this.profilePictureFormControl.setValue(null);
    this.profilePictureFormControl.markAsTouched();
  }
  extRedir(){
    this.appConfig.clearLocalData();
    // window.open(environment.register_Redirect.replace('/register',''),'skillexchange');
    window.location.replace(environment.register_Redirect.replace('/register','/candidateview/dashboard'));
  }

  onSelectFile(event) {
    const fd = new FormData();
    this.profilePictureFormControl.markAsTouched();
    if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      if (event.target.files[0].size < 2000000) {
        if (this.appConfig.minImageSizeValidation(event.target.files[0].size)) {
        let image = event.target.files[0];

        fd.append('email', this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : '');
        fd.append('uploadFile', image);
        fd.append('uploadType',"profileImage");
        this.uploadImage(fd);
      }
     } else {
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Maximum file size is 2 MB');
     }
    } else {
      return this.appConfig.nzNotification('error', 'Invalid Format', 'Please upload PNG/JPEG files only');
    }
  }
}
