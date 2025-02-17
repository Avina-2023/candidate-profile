import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from '../service/api-service.service';

@Injectable()
export class CandidateCanloadGuard implements CanLoad, CanActivate {
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService
  ) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appConfig.getLocalData('csrf-login')) {

    return true;
    } else {
      // if (this.appConfig.getLocalData('logout-token')) {
      //   this.apiService.logout(this.appConfig.getLocalData('logout-token')).subscribe((data: any) => {
      //     this.appConfig.clearLocalData();

      //     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      //     return false;
      //   }, (err) => {
      //     this.appConfig.clearLocalData();

      //     this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      //     return false;
      //   });
      // } else {
      //   this.appConfig.clearLocalData();
      //   this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      //   return false;
      // }
    }

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.appConfig.getLocalData('csrf-login')) {

      return true;
    } else {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      return false
    }
  }

}
