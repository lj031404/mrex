import { TestBed } from '@angular/core/testing';

import { MarketinfoshareService } from './marketinfoshare.service';

describe('MarketinfoshareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketinfoshareService = TestBed.get(MarketinfoshareService);
    expect(service).toBeTruthy();
  });
});
