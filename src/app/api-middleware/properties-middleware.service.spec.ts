import { TestBed } from '@angular/core/testing';

import { PropertiesMiddlewareService } from './properties-middleware.service';

describe('PropertiesMiddlewareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: PropertiesMiddlewareService = TestBed.get(PropertiesMiddlewareService);
	expect(service).toBeTruthy();
  });
});
