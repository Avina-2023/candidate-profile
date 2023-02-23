import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { LoaderService } from 'src/app/service/loader-service.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SkillexService } from 'src/app/service/skillex.service';
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/service/api-service.service';


@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.scss']
})
export class GeneralMasterComponent implements OnInit {
  //  profilepercentage: number =  0;
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
  constructor(private appConfig: AppConfigService,
    private loadingService: LoaderService,
    private skillexService: SkillexService,
    private apiService: ApiServiceService,
    ) {
  }

  ngOnInit() {
    this.profilepercentage = Math.ceil(this.Details.profilePercentage);
    this.isExternal = this.appConfig.getLocalData('externalLogin')
    // this.setprofileimageToLocal()
    this.username = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
    this.CandidateDetails()
  }

//   setprofileimageToLocal(){
//     // this.profilepercentage = 30;
//     this.profilepercentage = Math.ceil(this.profilepercentage);
//     this.profilepercentage = JSON.parse(localStorage.getItem("profileData"))  ;
//     console.log(this.profilepercentage ,'hgvjhb');
//     if(this.profilepercentage){
//       let size = 9 ;
//  this.percentage =  size / 10 * 100;
//     }
//   //   candidateProfileimage.personal_details.profileImage = this.profilePicture.file_path ;
//   //   console.log(candidateProfileimage.personal_details.profileImage,'dj');
//   // localStorage.setItem("profileData",JSON.stringify(candidateProfileimage));
//   // console.log(JSON.stringify(candidateProfileimage),'--------');
//   // // localStorage.setItem("profileData",JSON.stringify(candidateProfileimage));
//   //   // this.appConfig.setLocalData("profileData",JSON.stringify(candidateProfileimage));
//   // let candyprofileimage = JSON.parse(localStorage.getItem("profileData")) ;
//   // // localStorage.setItem("profileData",JSON.stringify(candidateProfileimage));
//   // this.cadidatefinalimage = candyprofileimage.personal_details.profileImage;
//   // console.log(this.cadidatefinalimage,'hbsdjhBcj');
//   }

//   saveData(data) {
//     const form_size = 1024; // chunk size in bytes
//     const progressbar = []; // array to hold data chunks

//     for (let i = 0; i < this.data.length; i += form_size) {
//       progressbar.push(this.data.slice(i, i + form_size));
//     }

//     // const progress = this.progressRef.ref(); // reference to the progress bar component
//     // progress.start(); // start the progress bar animation

//     for (let i = 0; i < progressbar.length; i++) {
//       localStorage.setItem('data-' + i, progressbar[i]);
//       const percent = (i + 1) / progressbar.length * 100; // calculate progress percentage
//       // progress.set(percent); // update the progress bar value
//     }

//     // progress.complete(); // stop the progress bar animation
//   }
// }



  // getprofileCompletionPercentage(){
  //   window.addEventListener('storage', (event: StorageEvent) => {
  //     if (event.key === 'profileData') {
  //       // Update the progress value
  //       profilepercentage = Math.round((event.newValue.length / 1024) * 100);
  //       localStorage.setItem('profileData', myValue);
  //     }
  //   });


  // }

  // getEmployerDetails() {
  //   var obj = {
  //     userId: this.skillexService.encryptnew(
  //       localStorage.getItem('email'),
  //       environment.cryptoEncryptionKey
  //     ),
  //   };
  //   this.skillexService.candidateprogress(obj).subscribe((result: any) => {
  //     if (result.success) {
  //       console.log(result)
  //       this.username = result.data.firstName;
  //       this.profileCompletion = result.data.profileCompletion;
  //       localStorage.setItem('companyId', result.data.userId);
  //     } else {
  //       console.log("failed to load employer details")
  //     }
  //   })
  // }
  CandidateDetails() {
    var obj = {};
    obj = {
      email: this.skillexService.encryptnew(
        localStorage.getItem('email'),
        environment.cryptoEncryptionKey
      ),
    };
    this.skillexService.candidateprogress(obj).subscribe((res: any) => {
      if (res.success) {
        this.Details = res.data;
        // this.profileImage = this.Details.personal_details.profileImage;
        // this.msgData.sendMessage("profileImage",this.profileImage)
        // if (this.profileImage && this.productionUrl == true) {
        //   this.appConfig.setLocalStorage('profileImage',this.profileImage + environment.blobToken);
        //   this.profileImage = this.profileImage + environment.blobToken
        // } else if (this.profileImage && this.productionUrl == false) {
        //   this.appConfig.setLocalStorage('profileImage',this.profileImage);
        //   this.profileImage = this.profileImage

        // }
        this.appConfig.setLocalData('candidateProfile',JSON.stringify(this.Details));
        this.profilepercentage = Math.ceil(this.Details.profilePercentage);
        this.appConfig.setLocalData('profilePercentage', this.profilepercentage);

      }
    });
  }
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
      console.log("error while profile pic"+e)
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
