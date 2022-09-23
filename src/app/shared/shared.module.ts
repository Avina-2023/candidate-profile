import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { ModalBoxComponent } from './modal-box/modal-box.component';
import { MaterialModule } from '../material.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedKycProfileViewComponent } from './shared-kyc-profile-view/shared-kyc-profile-view.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NzSelectModule
    
  ],
  declarations: [CommonHeaderComponent,ModalBoxComponent,SharedKycProfileViewComponent],
  exports:[
    CommonHeaderComponent,
    ModalBoxComponent,
    NzSelectModule,
    SharedKycProfileViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class SharedModule { }
