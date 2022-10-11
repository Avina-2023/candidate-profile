import { Component, OnInit } from '@angular/core';
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
    private appConfig: AppConfigService
  ) {


  }

  ngOnInit() {
  }

}
