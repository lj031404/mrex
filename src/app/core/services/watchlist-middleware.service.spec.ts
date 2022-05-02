import { TestBed } from '@angular/core/testing';

import { WatchlistMiddlewareService } from './watchlist-middleware.service';

describe('WatchlistMiddlewareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatchlistMiddlewareService = TestBed.get(WatchlistMiddlewareService);
    expect(service).toBeTruthy();
  });
});
