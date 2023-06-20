import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SkillexService {
  // encryptnew: any;
  EncryptKEY = environment.encryptionKey;
  cryptoEncryptionKey = environment.cryptoEncryptionKey;
constructor(
  private http: HttpClient,
) {}


  // Forgot Password
  forgotPassword(email) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/userforgotPassword`, email);
  }
   // Reset Password
   passwordReset(data) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/submitResetPassword`, data);
  }
   // userlogin
   login(loginData) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/userLogin`, loginData);
  }


  // userlogin
  saveCandidateProfile(loginData) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/addUserDetail`, loginData);
  }
  // uploadfile(profileform) {
  //   // this.datas is api body data
  //   return this.http.post(`${environment.SKILLEX_BASE_URL}/uploadCandidateFile`, profileform);
  // }
  uploadfile(profileform) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/imageUploadForProfile`, profileform);
  }
  pdfFileUpload(profileform) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/imageUpload`, profileform);
  }
//progressbar
  candidateDetails(data){
    return this.http.post(`${environment.SKILLEX_BASE_URL}/getcandidatedetail`,data)
  }

  encrypt(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.EncryptKEY).toString();
    } catch (e) {
      console.log(e);
      return data;
    }
  }

  encryptnew(data, customSecretKey) {
    try {
      this.EncryptKEY = customSecretKey ? customSecretKey : this.EncryptKEY;
      return CryptoJS.AES.encrypt(data, this.EncryptKEY).toString();
      // return CryptoJS.AES.encrypt(JSON.stringify(data), this.EncryptKEY).toString();
    } catch (e) {
      console.log(e);
      return data;
    }
  }


  // candidateprogress(data){
  //   return this.http.post(`${environment.SKILLEX_BASE_URL}/getcandidatedetail`, data);
  // }

  getCustomHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*.lntedutech.com',
      "Access-Control-Allow-Credentials": 'true'
    })
      // .set('Content-Type', 'application/json')
      // .set('custCode', this.appConfig.getSelectedCustomerCode() ? this.appConfig.getSelectedCustomerCode() : '')
      // .set('driveId', this.appConfig.getDriveId() ? this.appConfig.getDriveId() : '')
      // .set('userId', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '')
      // .set('X-CSRF-Token', this.appConfig.getSessionData('csrf'))
      .set('Authorization',"Bearer aqSkKT6qguVyANMPtR6qqWaiCLUTRNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9CzM16Vi89ecAX6ADPfhGBzpAEXze1do0SqtMkdQ5oGqFqtXphoc4DZL4hb6wRdg09RWzEJcnYJLtvska9HfvQiywtu1LZvDt1AD104ypzLaIRV6dGtKWHrhYgxVn7D3Q9mkTS3oejbVX8z81RwN3Ely6g59t5RRU88BVJiv")
      // .set('Access-Control-Allow-Origin', '*');
    return headers;
  }

  districtList(stateId) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/districtList`, stateId);
  }
  collegeList(){
    return this.http.post(`${environment.SKILLEX_BASE_URL}/collegesList`,{});
  }
  getdescription(data:any){

    return this.http.post(`${environment.SKILLEX_BASE_URL}/getprofileSummary`,data)
  }

  // LMSCOURSE //

  getCourseToken(): HttpHeaders {
    const headers = new HttpHeaders()

         .set('Authorization',"Bearer 104150f8e66cae68b40203e1dbba7b4529231970")
         .set('requestId', 'integrSer')

         return headers;
  }

  geteduTechCourses(){
    const headers = this.getCourseToken();
    const LMSBASE_URL = 'https://devfacade.lntedutech.com';
    return this.http.get(`${LMSBASE_URL}/getCourses`,
     { headers: headers});
 }

  //get JOB Description page
  getJobDetail(jobdata){
    return this.http.post(`${environment.SKILLEX_BASE_URL}/getJobDetail`,jobdata);
    // {"jobId":"34567"}
  }
  //Apply for JOB
  submitJobForm(jobdata){
    return this.http.post(`${environment.SKILLEX_BASE_URL}/submitJobForm`,jobdata);
    // {"jobId":"34567"}
  }
   // userlogin
   externalLogin(loginData) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/externallogin`, loginData);
  }

  getassesment(assessdata){
    return this.http.post(`${ environment.SKILLEX_BASE_URL}/getTasktype`, assessdata)
  }

}
