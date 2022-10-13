import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { AppConfigService } from '../../config/app-config.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  getCurrentYear = this.appConfig.getCurrentYear();
  isloginPG = true;
  constructor(
    private appConfig: AppConfigService,
    private router: Router
  ) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event:any) =>
     {
        if(event.url=='/login'){
          this.isloginPG = true
        }else{
          this.isloginPG = false
        }
        console.log(event.url);
     });

  }

  ngOnInit() {
  }

}
