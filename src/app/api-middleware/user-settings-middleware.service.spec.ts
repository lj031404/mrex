import { TestBed } from '@angular/core/testing';

import { UserSettingsMiddlewareService } from './user-settings-middleware.service';

describe('UserSettingsMiddlewareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: UserSettingsMiddlewareService = TestBed.get(UserSettingsMiddlewareService);
	expect(service).toBeTruthy();
  });
});
