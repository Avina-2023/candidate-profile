import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { environment } from 'src/environments/environment';
// import { ApiServiceService } from 'src/app/services/api-service.service';
// import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
  username: any;
  getCurrentYear = this.appConfig.getCurrentYear();
  supportEmail: any;
  year = new Date().getFullYear();

  constructor(
    private appConfig: AppConfigService,
    // private apiService: ApiServiceService
  ) { }

  ngOnInit() {
    this.username = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'NA';
    this.supportEmail = environment.supportEmail;
  }

  // logOut() {
  //   const token = this.appConfig.getLocalData('logout-token');
  //   this.apiService.logout(token).subscribe((data: any) => {

  //     this.appConfig.clearLocalData();
  //     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
  //   }, (err) => {
  //   });
  // }

}
