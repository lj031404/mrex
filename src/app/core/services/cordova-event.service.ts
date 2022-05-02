import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CordovaEvent } from '@app-models/cordovaEvent.enum';

@Injectable({
  providedIn: 'root'
})
export class CordovaEventService {

  private listeningSource:Subject<CordovaEvent>=new Subject<CordovaEvent>();
  cordovaEvent:Observable<CordovaEvent>=this.listeningSource.asObservable();

  constructor() { }

  sendEvent(evento:CordovaEvent)
  {
    this.listeningSource.next(evento);
  }
}
