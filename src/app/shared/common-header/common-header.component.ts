import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalBoxComponent } from '../modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {

  username: any;
  logoURL: any;
  isExternal: boolean = false;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.username = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'NA';
    this.logoURL = "../../../assets/images/EduTech_Logo.svg";//this.appConfig.logoBasedOnCustomer();
    this.isExternal = this.appConfig.getLocalData('externalLogin')
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
    this.appConfig.routeNavigation('/login')
    window.open(environment.register_Redirect.replace('/register',''),'skillexchange');
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
          this.appConfig.clearLocalData();
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);

      }
    });
  }

}
