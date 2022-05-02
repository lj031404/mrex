import { TestBed } from '@angular/core/testing';

import { MarketMiddlewareService } from './market-middleware.service';

describe('MarketMiddlewareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: MarketMiddlewareService = TestBed.get(MarketMiddlewareService);
	expect(service).toBeTruthy();
  });
});
