import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Injectable()
export class IsLoggedinGuard implements CanActivate {
  constructor(
    private appConfig: AppConfigService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.appConfig.getLocalData('csrf-login')) {
      return true;
    } else {
      if (this.appConfig.getLocalData('csrf-login')) {
        this.appConfig.routeNavigation("/profile/candidate/personal");
        return false;
      }
    }
  }

}
