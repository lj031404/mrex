import { TestBed } from '@angular/core/testing';


import { GlobalService } from './global.service';
import { Location, LocationStrategy, APP_BASE_HREF, PathLocationStrategy } from '@angular/common';
import { inject } from '@angular/core';
import { environment } from '@env/environment';

const locationStub = {
  back: jasmine.createSpy('back')
}

describe('GlobalService', () => {
  beforeEach(() => TestBed.configureTestingModule({
	providers: [
		Location,
		{ provide: LocationStrategy, useClass: PathLocationStrategy },
		{ provide: APP_BASE_HREF, useValue: environment.serverUrl }
	]
  }));

  it('should be created',  () => {
	const service: GlobalService = TestBed.get(GlobalService);
	expect(service).toBeTruthy();
  });
});
