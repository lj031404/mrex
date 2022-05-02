import { TestBed } from '@angular/core/testing';

import { ApiMiddlewareService } from './api-middleware.service';

describe('ApiMiddlewareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: ApiMiddlewareService = TestBed.get(ApiMiddlewareService);
	expect(service).toBeTruthy();
  });
});
