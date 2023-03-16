import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InterComponentMessenger {

  constructor() { }
  private subject = new Subject<any>();

  sendMessage(head: any,value:any) {
    let data = {
      head,
      value
    }
      this.subject.next( data );
  }

  clearMessages() {
      this.subject.next({});
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
