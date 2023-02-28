import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateMappersService {
  BASE_URL = environment.MASTER_BASE_URL;

  httpOptions: { headers: HttpHeaders };

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }


  getAfterCustomHeadersWithBasicAuth(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*.lntedutech.com'
    })
      .set('Content-Type', 'application/json')
      .set('custCode', '15691')
      .set('driveId', '2')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      //.aset('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(`${CONSTANT.DRUPAL_ADMIN_USERNAME}:${CONSTANT.DRUPAL_ADMIN_PASSWORD}`));
    return headers;
  }

  getCustomHeadersWithBasicAuthWithHalContentType(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*.lntedutech.com'
    })
      .set('Content-Type', 'application/hal+json')
      .set('custCode', '15691')
      .set('driveId', '2')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      //.aset('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(`${CONSTANT.DRUPAL_ADMIN_USERNAME}:${CONSTANT.DRUPAL_ADMIN_PASSWORD}`));
    return headers;
  }


  getAfterCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*.lntedutech.com',
      "Access-Control-Allow-Credentials": 'true'
    })
      .set('Content-Type', 'application/json')
      .set('custCode', '15691')
      .set('driveId', '2')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      //.aset('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  getAfterCustomHeadersWithMultiPart(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*.lntedutech.com*',
      "Access-Control-Allow-Credentials": 'true',
    })
      .set('Content-Type', 'multipart/form-data')
      .set('custCode', '15691')
      .set('driveId', '2')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      //.aset('Access-Control-Allow-Origin', '*');
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  forImage(uniqueName): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*.lntedutech.com',
      "Access-Control-Allow-Credentials": "true"
    })
      .set('Content-Type', 'application/octet-stream')
      .set('custCode', '15691')
      .set('driveId', '2')
      .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      .set('X-CSRF-Token', this.appConfig.getLocalData('csrf-login'))
      // tslint:disable-next-line: quotemark
      .set('Content-Disposition', `filename="${uniqueName}"`)
      //.aset('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(`${CONSTANT.DRUPAL_ADMIN_USERNAME}:${CONSTANT.DRUPAL_ADMIN_PASSWORD}`));
    return headers;
  }

  withoutTokens(): HttpHeaders {
    const headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin': '*',
    })
    .set('custCode', '15691')
    .set('driveId', '2')
    .set('userId', "15691")
    .set('Content-Type', 'application/json')
    // .set('Access-Control-Allow-Origin', '*')
    .set('Referer','http://localhost:4300/')
    // .set('Authorization', 'Basic ' + btoa('admin' + ':' + 'Cint@na@321'));
    return headers;
  }

  getUserId() {
    return this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
  }

  getDriveId() {
    return '2';
  }

  forFetchCustomHeaders() {
    return {
      userId: this.getUserId(),
      driveId: this.getDriveId()
    }
  }

  // Edit User Profile
  editUser(formdata) {
    // return this.http.post(`${this.BASE_URL}/entity/profile?_format=json`, formdata,
    return this.http.post(`${this.BASE_URL}/profile/updateprofile`, formdata,
      {
        // headers: this.getAfterCustomHeadersWithBasicAuth(),
        headers: this.withoutTokens(),
        withCredentials: true
      });
  }

  // Get user Prifule
  getUserProfile() {
    return this.http.get(`${this.BASE_URL}/candidate-page?_format=json`,
      {
        headers: this.getAfterCustomHeaders(),
        withCredentials: true
      });
  }



  // Forgot Password
  // forgotPassword(email) {
  //   // this.datas is api body data
  //   return this.http.post(`${this.BASE_URL}/user/lost-password?_format=json`, email,
  //     { headers: this.withoutTokens(), withCredentials: true });
  // }

  // For Image
  imageUpload(file, uniqueName) {

    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/file/upload/profile/candidate/field_profile_image?_format=json`, file,
      { headers: this.forImage(uniqueName), withCredentials: true });
  }

  // For Signature
  signatureUpload(file, uniqueName) {

    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/file/upload/profile/candidate/field_signature?_format=json`, file,
      { headers: this.forImage(uniqueName), withCredentials: true });
  }

  // Logout
  logout(logoutToken) {
    // this.datas is api body data
    return this.http.post(`${this.BASE_URL}/user/logout?_format=json&token=${logoutToken}`, logoutToken,
      { headers: this.withoutTokens(), withCredentials: true });
  }

  updatedState(Id) {
    // return this.http.post(`${this.BASE_URL}/api/state_api`, Id, { headers: this.withoutTokens(), withCredentials: true });
    return this.http.get(`../assets/files/state.json`, { headers: this.withoutTokens(), withCredentials: true });
  }

  // updatedCity(Id) {
  //   return this.http.post(`${this.BASE_URL}/profile/get-district-by-state`, Id, { headers: this.withoutTokens()});
  // }

  assessmentList(user) {
    return this.http.post(`${this.BASE_URL}/profile/hallticket`, user,
      {
        headers: this.getAfterCustomHeaders(),
        withCredentials: true
      });
  }

  getListofDocs(data) {
    return this.http.post(`${this.BASE_URL}/profile/fileslist`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  //get dropdown value
  getEducationDropDown(userId) {
    return this.http.post(`${this.BASE_URL}/profile/candidate_education_level`, userId, { headers: this.withoutTokens(), withCredentials: true });
  }

  //save or submit uploaded file
  saveUploadDocument(data) {
    return this.http.post(`${this.BASE_URL}/profile/upload_certificates_id`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  //save or submit update file
  updateUploadDocument(data) {
    return this.http.post(`${this.BASE_URL}/profile/update_certificates_id`, data, { headers: this.withoutTokens(), withCredentials: true });
  }

  // getUploaded document
  getUploadedDocument(userId) {
    return this.http.post(`${this.BASE_URL}/profile/get_certificate`, userId, { headers: this.withoutTokens(), withCredentials: true });
  }

  // education
  getEducationList() {
    return this.http.get(`../assets/files/educationLevel.json`, { headers: this.withoutTokens() });
  }


  // education
  // getAllEducationFormDropdownList(param) {
  //   return this.http.get(`../assets/files/colleges.json`, { headers: this.withoutTokens()});
  // }

  // education
  // getDiplomaList(param) {
  //   return this.http.get(`../assets/files/colleges.json`, { headers: this.withoutTokens()});
  // }

  // education
  getoverallInstitute() {
    return this.http.get(`${this.BASE_URL}/api/college_list`, { headers: this.withoutTokens(), withCredentials: true });
  }

  // education
  getoverallDiscipline() {
    return this.http.get(`${this.BASE_URL}/api/discipline_list`, { headers: this.withoutTokens(), withCredentials: true });
  }


  // education
  getoverallSpecialization() {
    return this.http.get(`${this.BASE_URL}/api/specification_list`, { headers: this.withoutTokens(), withCredentials: true });
  }

  removeCeritficate(data) {
    return this.http.post(`${this.BASE_URL}/profile/remove_certiticate`, data, { headers: this.withoutTokens(), withCredentials: true });
  }


    // Joining Form
    getBloodGroups() {
      return this.http.get(`../assets/files/bloodgroup.json`, { headers: this.withoutTokens(), withCredentials: true });
    }

    checkKycOrJoiningForm() {
      return false
    }

    newGetProfileData(data) {
      // if ((data && data.candidate_user_id) || (data && data.form_name == 'documents_upload')) {
      // } else {
      //   data.form_name = this.checkKycOrJoiningForm() ? 'joining' : 'kyc';
      // }
      return this.http.post(`${this.BASE_URL}/profile/get_candidate_form_details`, data,
        { headers: this.getAfterCustomHeaders(), withCredentials: true});
    }

    newSaveProfileData(data) {
      if ((data && data.candidate_user_id) || (data && data.form_name == 'documents_upload')) {
      } else {
        data.form_name = this.checkKycOrJoiningForm() ? 'joining' : 'kyc';
      }
      return this.http.post(`${this.BASE_URL}/profile/save_candidate_form_details`, data,
        { headers: this.getAfterCustomHeaders(), withCredentials: true});
    }


    saveAllProfileToLocal(profileData) {
      let saveasJson = JSON.stringify(profileData);
      this.appConfig.setLocalData('profileData', saveasJson);
    }

    getLocalProfileData() {
      let profile = this.appConfig.getLocalData('profileData') ? this.appConfig.getLocalData('profileData') : null;
      if (profile) {
        return JSON.parse(profile);
      }
      return null;
    }

    saveFormtoLocalDetails(formName, data) {
      let profile = this.getLocalProfileData()?this.getLocalProfileData():{};
      profile[formName] = data;
      let saveasJson = JSON.stringify(profile);
      this.appConfig.setLocalData('profileData', saveasJson);
    }

    getLocalpersonal_details() {
      let profile = this.getLocalProfileData();
      return profile.personal_details?.name? profile.personal_details : null;
    }
    getLocalcontact_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.contact_details : null;
    }
    getLocaldependent_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.dependent_details : null;
    }
    getLocalproject_details() {
      let profile = this.getLocalProfileData();
      return profile ? profile.project_details : null;
      }
    getLocaldisciplinary_details() {
      let profile = this.getLocalProfileData();
      return profile ? profile.disciplinary_details : null;
      }
      getLocalaccomplishments_details() {
        let profile = this.getLocalProfileData();
        return profile ? profile.accomplishment_details : null;
      }
    getLocaleducation_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.education_details : null;
    }
    getLocaldocument_details() {
    let profile = this.getLocalProfileData();
    return profile ? profile.document_details : null;
    }
    getLocalexperience_details() {
      let profile = this.getLocalProfileData();
      return profile ? profile.experience_details : null;
    }
    getLocalsection_flags() {
      let profile = this.getLocalProfileData();
      return profile ? profile.section_flags : null;
    }
    getLocalform_name() {
      let profile = this.getLocalProfileData();
      return profile ? profile.form_name : null;
    }



    FormStatus() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/saved_details?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

    joiningFormGetPersonalDetails() {
     let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
      return this.http.get(`${this.BASE_URL}/profile/personal_pageload?user_id=${userId}`,
        { headers: this.getAfterCustomHeaders(), withCredentials: true});
    }

    joiningFormGetPersonalDetailsSave(data) {
      // let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
      return this.http.post(`${this.BASE_URL}/profile/personal_page`, data, { headers: this.getAfterCustomHeaders(), withCredentials: true });
    }

    joiningFormGetContactDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/contact_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetContactDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/contact_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDependentDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/dependent_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDependentDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/dependent_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetAccomplishmentsDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/accomplishment_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetAccomplishmentsDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/accomplishment_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetProjectDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/project_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetProjectDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/project_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetWorkDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/employment_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetWorkDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/employment_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetEducationDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/education_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetEducationDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/education_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDiscipilinaryDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/discipilinary_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDiscipilinaryDetailsSave(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/discipilinary_page?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormDownloadableDocuments() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/joiningtemplate_downloads?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDocuments() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/uploaddocument_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetDocumentsinv(uid) {
      let userId = uid;
       return this.http.get(`${this.BASE_URL}/profile/uploaddocument_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormUpload(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/uploaddocument_pagesave?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     uploadJoiningDocs(documentData) {
      // this.datas is api body data
      // return this.http.post(`${this.BASE_URL}/profile/upload_certificate`, documentData, { headers: this.getAfterCustomHeaders(), withCredentials: true });
      return fetch(`${this.BASE_URL}/profile/upload_joining_docs`, {
        method: 'POST',
        body: documentData,
        headers: new Headers(this.forFetchCustomHeaders())
        // headers: this.getAfterCustomHeaders(), withCredentials: true
      });

    }


     joiningFormGetPreviewDetails() {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.get(`${this.BASE_URL}/profile/preview_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormGetPreviewDetailsCommon(userId) {
       return this.http.get(`${this.BASE_URL}/profile/preview_pageload?user_id=${userId}`,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }

     joiningFormSubmit(data) {
      let userId = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
       return this.http.post(`${this.BASE_URL}/profile/submit_joiningform?user_id=${userId}`, data,
         { headers: this.getAfterCustomHeaders(), withCredentials: true});
     }


}
