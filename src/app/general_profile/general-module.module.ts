import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GeneralMasterComponent } from './general-master/general-master.component';
import { GeneralJoiningFormComponent } from './general-candidate-joining-form/general-joining-form/joining-form.component';
import { GeneralJoiningPersonalComponent } from './general-candidate-joining-form/general-joining-personal/joining-personal.component';
import { GeneralJoiningContactComponent } from './general-candidate-joining-form/general-joining-contact/joining-contact.component';
import { GeneralJoiningDependentComponent } from './general-candidate-joining-form/general-joining-dependent/joining-dependent.component';
import { GeneralJoiningEducationComponent } from './general-candidate-joining-form/general-joining-education/joining-education.component';
import { GeneralJoiningWorkDetailsComponent } from './general-candidate-joining-form/general-joining-work-details/joining-work-details.component';
import { GeneralJoiningUploadComponent } from './general-candidate-joining-form/general-joining-upload/joining-upload.component';
import { GeneralJoiningPreviewComponent } from './general-candidate-joining-form/general-joining-preview/joining-preview.component';
import { GeneralJoiningSubmitComponent } from './general-candidate-joining-form/general-joining-submit/joining-submit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module"
import { MaterialModule } from '../material.module';
import {MatIconModule} from '@angular/material/icon';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GeneralJoiningDisciplinaryDetailsComponent } from './general-candidate-joining-form/general-joining-disciplinary-details/general-joining-disciplinary-details.component';
import { GeneralJoiningProjectDetailsComponent } from './general-candidate-joining-form/general-joining-project-details/general-joining-project-details.component';
import { GeneralJoiningAccomplishmentsComponent } from './general-candidate-joining-form/general-joining-accomplishments/general-joining-accomplishments.component';


// import { MatDatepicker, MatDateRangePicker } from '@angular/material/datepicker';


const path = {
  CANDIDATE_DASHBOARD: {
    HOME: 'candidate',
    DASHBOARD: 'dashboard',
    GENERAL_CANDIDATE: 'general',
    GENERAL_JOINING: 'candidate',
    GENERAL_JOINING_PERSONAL: 'personal',
    GENERAL_JOINING_CONTACT: 'contact',
    GENERAL_JOINING_DEPENDENT: 'dependent',
    GENERAL_JOINING_EDUCATION: 'education',
    GENERAL_JOINING_WORK: 'work',
    GENERAL_JOINING_PROJECT: 'project',
    GENERAL_JOINING_ACCOMPLISHMENTS: 'accomplishments',
    GENERAL_JOINING_UPLOAD: 'upload',
    GENERAL_JOINING_DISCIPLINARY_DETAILS: 'disciplinary',
    GENERAL_JOINING_PREVIEW: 'preview',
    GENERAL_JOINING_SUBMIT: 'submit',

  },
};
const routes: Routes = [
  {
    path: '',
    component: GeneralMasterComponent,
    children: [
      {
        path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING}`,
        component: GeneralJoiningFormComponent,
        data: {
          breadcrumb: 'Joining Form'
        },
        children: [
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL}`,
            component: GeneralJoiningPersonalComponent,
            data: {
              breadcrumb: 'Personal Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT}`,
            component: GeneralJoiningContactComponent,
            data: {
              breadcrumb: 'Contact Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT}`,
            component: GeneralJoiningDependentComponent,
            data: {
              breadcrumb: 'Dependent Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION}`,
            component: GeneralJoiningEducationComponent,
            data: {
              breadcrumb: 'Education Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK}`,
            component: GeneralJoiningWorkDetailsComponent,
            data: {
              breadcrumb: 'Work Experience Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_PROJECT}`,
            component: GeneralJoiningProjectDetailsComponent,
            data: {
              breadcrumb: 'Project Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_ACCOMPLISHMENTS}`,
            component: GeneralJoiningAccomplishmentsComponent,
            data: {
              breadcrumb: 'Accomplishments'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD}`,
            component: GeneralJoiningUploadComponent,
            data: {
              breadcrumb: 'Upload Documents'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_DISCIPLINARY_DETAILS}`,
            component: GeneralJoiningDisciplinaryDetailsComponent,
            data: {
              breadcrumb: 'Disciplinary Details'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW}`,
            component: GeneralJoiningPreviewComponent,
            data: {
              breadcrumb: 'Preview'
            }
          },
          {
            path: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT}`,
            component: GeneralJoiningSubmitComponent,
            data: {
              breadcrumb: 'Submit'
            }
          },
          {
            path: '',
            redirectTo: `${path.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL}`,
            pathMatch: 'full',
          }
        ]
      },

    ]
  }
]

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [GeneralJoiningContactComponent,GeneralJoiningDependentComponent,GeneralJoiningEducationComponent,GeneralJoiningFormComponent,GeneralJoiningPersonalComponent,GeneralJoiningPreviewComponent,GeneralJoiningSubmitComponent,GeneralJoiningUploadComponent,GeneralJoiningWorkDetailsComponent,GeneralMasterComponent, GeneralJoiningDisciplinaryDetailsComponent, GeneralJoiningProjectDetailsComponent, GeneralJoiningAccomplishmentsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    MatIconModule,
    ImageCropperModule
  ],
})
export class GeneralModuleModule { }
