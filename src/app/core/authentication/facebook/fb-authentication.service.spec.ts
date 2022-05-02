import { TestBed } from '@angular/core/testing';

import { FbAuthenticationService } from './fb-authentication.service';

describe('FbAuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: FbAuthenticationService = TestBed.get(FbAuthenticationService);
	expect(service).toBeTruthy();
  });
});
