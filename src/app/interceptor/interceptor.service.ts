import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '../config/app-config.service';
@Injectable()
export class InterceptorService implements HttpInterceptor {


  constructor(
    // private _loading: LoadingService,
    // private commonservice: CommonService,
    private appConfig: AppConfigService,
    public toast: ToastrService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    let lctoken: any = this.appConfig.getLocalData('csrf-login');
    if(lctoken){
      var token = 'Bearer ' + lctoken;
    } else {
      // id = 'RNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9';
      token = 'Bearer aqSkKT6qguVyANMPtR6qqWaiCLUTRNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9CzM16Vi89ecAX6ADPfhGBzpAEXze1do0SqtMkdQ5oGqFqtXphoc4DZL4hb6wRdg09RWzEJcnYJLtvska9HfvQiywtu1LZvDt1AD104ypzLaIRV6dGtKWHrhYgxVn7D3Q9mkTS3oejbVX8z81RwN3Ely6g59t5RRU88BVJiv'
    }
    let heads = {}
    if(request.url.includes(environment.SKILLEX_BASE_URL)){
      heads = {
        headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization':token
        })
      }
    }
    

    const clone = request.clone(heads);

    return next.handle(clone).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

        }
        return event;
      }),

      retry(1),

      catchError((error: HttpErrorResponse) => {
        // this._loading.setLoading(false, request.url);
        if(error?.error?.message == 'jwt expired'){
          this.toast.warning('Session Expired!!');
          // this.commonservice.logout();
        }
          if (error && error['status'] !== 200) {
          // console.log(error ? error : '');
        }

        if (error.status === 0) {
          return throwError(error);
        }

        if (error.status === 400) {
          return throwError(error);
        }

        if (error.status === 401) {
          // this.commonservice.logout('unauthorized');
          return throwError(error);
        }

        if (error.status === 403) {
            return throwError(error);
        }

        if (error.status === 422) {
          return throwError(error);
        }

        if (error.status === 500) {
          return throwError(error);
        }

        if (error.status === 404) {
          return throwError(error);
        }

        if (error.status === 409) {
          return throwError(error);
        }

        if (error.status === 200) {
        } else {
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }
}
