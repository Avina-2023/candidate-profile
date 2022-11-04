import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SkillexService } from 'src/app/service/skillex.service';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {
  jobDescription: any;

  constructor(
    private skillexService:SkillexService,
    private appConfig: AppConfigService,
  ) { }

  ngOnInit() {
    this.getpageData();
  }

  getpageData(){
    this.skillexService.getJobDetail({"jobId":"34567"}).subscribe((jobdata:any) => {
      if(jobdata.success){
        this.jobDescription = jobdata.data
      }else{
        this.appConfig.error(jobdata.message);
      }
    });
  }
  applyJob(){
    let param =
    {
      "email":this.appConfig.getLocalData('userEmail'),
      "jobId":"34567"
    }
    this.skillexService.submitJobForm(param).subscribe((jobdata:any) => {

      if(jobdata.success){
        this.appConfig.success(jobdata.message);
      }else{
        this.appConfig.error(jobdata.message);
      }
    });

    }


}
