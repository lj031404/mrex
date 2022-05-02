import { TestBed } from '@angular/core/testing';

import { OauthInterceptService } from './oauth-intercept.service';

describe('OauthInterceptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: OauthInterceptService = TestBed.get(OauthInterceptService);
	expect(service).toBeTruthy();
  });
});
