import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { JobRoutingModule } from './job.routing';
import { SharedModule } from '../shared/shared.module';
import { JobComponent } from './job/job.component';
import { MaterialModule } from '../material.module';
import { TimeAgoPipe } from '../pipes/day-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    JobRoutingModule,
    MaterialModule
  ],
  declarations: [JobDescriptionComponent,JobComponent,TimeAgoPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class JobModule { }
