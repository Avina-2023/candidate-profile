import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillexService {

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
  uploadProfilePic(profileform) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/uploadCandidateProfileImage`, profileform);
  }
  districtList(stateId) {
    // this.datas is api body data
    return this.http.post(`${environment.SKILLEX_BASE_URL}/districtList`, stateId);
  }
  collegeList(){
    return this.http.post(`${environment.SKILLEX_BASE_URL}/collegesList`,{});
  }
}
