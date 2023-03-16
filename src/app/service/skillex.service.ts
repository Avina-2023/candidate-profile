import { HttpClient } from '@angular/common/http';
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
}
