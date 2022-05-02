import { TestBed } from '@angular/core/testing';

import { CordovaEventService } from './cordova-event.service';

describe('CordovaEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CordovaEventService = TestBed.get(CordovaEventService);
    expect(service).toBeTruthy();
  });
});
