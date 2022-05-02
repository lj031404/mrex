import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PropertyPendingEvent } from '@app-models/propertyPendingEvent.enum'
@Injectable({
  providedIn: 'root'
})
export class PropertyPendingService {
  private listeningPendingPropertySource:Subject<PropertyPendingEvent>=new Subject<PropertyPendingEvent>();
  pendingPropertyEvent: Observable<PropertyPendingEvent> = this.listeningPendingPropertySource.asObservable()
  
  constructor() { }

  sendEvent(event: PropertyPendingEvent) {
    this.listeningPendingPropertySource.next(event)
  }
}
