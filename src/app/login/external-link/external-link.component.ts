import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/service/candidate-mappers.service';
import { SkillexService } from 'src/app/service/skillex.service';
import { ApiServiceService } from '../../service/api-service.service';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss']
})
export class ExternalLinkComponent implements OnInit {
  codec = new HttpUrlEncodingCodec;
  constructor(private route: ActivatedRoute, private ApiService: ApiServiceService, private skillexService: SkillexService, private appConfig: AppConfigService, private candidateService: CandidateMappersService, public toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getRoute();
  }

  getRoute() {
    this.route.queryParams.subscribe((param: any) => {
      let extId = param.extId;
      if (extId && extId != undefined && extId != "") {
        this.skillexService.externalLogin({ extId: decodeURIComponent(extId) }).subscribe((data: any) => {
          if (data.success) {
            this.appConfig.setLocalData('userId', data && data.data.userId ? data.data.userId : '');
            this.appConfig.setLocalData('externalLogin', true);
            this.appConfig.setLocalData('userEmail', data && data.data.email ? data.data.email : '');
            this.appConfig.setLocalData('csrf-login', data && data.token ? data.token : '');
            this.candidateService.saveAllProfileToLocal(data.data);
            this.appConfig.setLocalData('username', this.candidateService.getLocalpersonal_details().name);
            this.loginRedirection(data);
          } else {
            this.toast.warning(data.message)
            //this.appConfig.warning(data.message)
            this.appConfig.routeNavigation('/login');
          }
        }, (error) => {
          console.log(error)
        });
      } else {
        this.appConfig.routeNavigation('/login');
      }
    });
  }

  loginRedirection(data: any) {
    let customersList = data['customers'] && data['customers'] ? data['customers'] : [];
    if (customersList.length > 1 && (data.current_user && data.current_user.roles && data.current_user.roles[1] != 'candidate')) {
      this.appConfig.setLocalData('multiCustomer', 'true');
    }

    this.appConfig.routeNavigation('/profile/candidate/personal');

  }

}
