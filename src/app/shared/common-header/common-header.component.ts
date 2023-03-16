import { Component, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from '../modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';
import {MatIconModule} from '@angular/material/icon';
import { InterComponentMessenger } from 'src/app/service/interComponentMessenger.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @ViewChild('confirmDialog', { static: false }) matDialogRef: TemplateRef<any>;
  productionUrl = environment.SKILLEX_BASE_URL == "https://skilledge.lntedutech.com"?true:false;
  dropdownVisible = false;
  candidateName = localStorage.getItem('name')
  profileimge: any ="";

  username: any;
  logoURL: any;
  isExternal: boolean = false;
  router: any;
  cadidatefinalimage: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private matDialog: MatDialog,
    public dialog: MatDialog,
    private msgData:InterComponentMessenger
  ) { }

  ngOnInit() {
    this.msgData.getMessage().subscribe((data)=>{
      console.log(data,'data');
      if(data.head == 'profileImage' && data.value == true){
        if (data.value == true && this.productionUrl == true) {
          this.cadidatefinalimage = '';
        } else if (data.value == true && this.productionUrl == false) {
          this.cadidatefinalimage = '';
        }
      }else
      if(data.head=='profileImageChange'&& data.value !="" && data.value != undefined){
        if (data.value && this.productionUrl == true) {
          this.cadidatefinalimage=data.value + environment.blobToken
        } else if (data.value && this.productionUrl == false) {
          this.cadidatefinalimage=data.value
        }
      }
    })
    this.getprofileimageFromLocal();
    this.username = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'NA';
    this.logoURL = "../../../assets/images/EduTech_Logo.svg";//this.appConfig.logoBasedOnCustomer();
    this.isExternal = this.appConfig.getLocalData('externalLogin');

  }
  getprofileimageFromLocal(){
    let candyprofileimage = JSON.parse(localStorage.getItem("profileData")) ;
    this.cadidatefinalimage = candyprofileimage.personal_details.profileImage;
    if (this.cadidatefinalimage && this.productionUrl == true) {
      this.cadidatefinalimage = this.cadidatefinalimage + environment.blobToken
    } else if (this.cadidatefinalimage && this.productionUrl == false) {
      this.cadidatefinalimage = this.cadidatefinalimage
    }
  }
 dropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  logout(){
    this.dialog.open(this.matDialogRef, {
      disableClose: true
			// panelClass: 'spec_desk_dialog'
		});
  }
  confirm(value){
    if(value){
    this.dialog.closeAll()
    localStorage.clear();
    this.router.navigate(['/login']);
    }else{
    this.dialog.closeAll()
    }
  }


  goToHome() {
    // this.logOut();
  }

  gotopage(navpoint){
    if(navpoint == 'apply'){
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.JOB.JOBDESCRIPTION);
    }else{
      this.appConfig.routeNavigation('/profile/candidate/');
    }
  }

  extRedir(){
    this.appConfig.clearLocalData();
    // window.open(environment.register_Redirect.replace('/register',''),'skillexchange');
    window.location.replace(environment.register_Redirect.replace('/register','/candidateview/dashboard'));
  }


  logOut() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to logout?',
        componentData: '',
        type: 'delete',
        identity: 'logout'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.openDialog(ModalBoxComponent, data);
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
        console.log(result,'result');

          this.appConfig.clearLocalData();
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);

      }
      console.log(result,'result');

    });
  }

}
