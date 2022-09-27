import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { ModalBoxComponent } from './modal-box/modal-box.component';
import { MaterialModule } from '../material.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GeneralSharedKycProfileViewComponent } from './general-shared-kyc-profile-view/general-shared-kyc-profile-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NzSelectModule,
    PdfViewerModule,
    FormsModule,ReactiveFormsModule
    
  ],
  declarations: [CommonHeaderComponent,ModalBoxComponent,GeneralSharedKycProfileViewComponent],
  exports:[
    CommonHeaderComponent,
    ModalBoxComponent,
    NzSelectModule,
    PdfViewerModule,
    GeneralSharedKycProfileViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class SharedModule { }
