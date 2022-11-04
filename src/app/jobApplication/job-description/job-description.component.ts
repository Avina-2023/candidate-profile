import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog,  } from '@angular/material/dialog';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SkillexService } from 'src/app/service/skillex.service';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {
  jobDescription: any;
  @ViewChild('incompleteProfile',{static: false}) matDialogRef: TemplateRef<any>;
  @ViewChild('successApply',{static: false}) applySuccess: TemplateRef<any>;
  dialogData: any;


  constructor(
    private skillexService:SkillexService,
    private appConfig: AppConfigService,
    private mdDialog: MatDialog
  ) { }

  ngOnInit() {
    this.getpageData();
  }

  openDialog(verify){
   this.dialogData =  this.mdDialog.open((verify=='success'?this.applySuccess:this.matDialogRef), {
      width: '500px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForMessage'
    });
  }

  gotopage(navpoint){
    if(navpoint == 'apply'){
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.JOB.JOBDESCRIPTION);
    }else{
      this.appConfig.routeNavigation('/profile/candidate/');
    }
    this.dialogData.close();
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
        this.openDialog('success')
      }else{
        if(jobdata.message =="Profile not filled"){
          this.openDialog('fail')
        }else{
          this.appConfig.error(jobdata.message);
        }
      }
    });

    }


}
