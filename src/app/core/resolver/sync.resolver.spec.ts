import { TestBed } from '@angular/core/testing';

import { SyncResolver } from './sync.resolver';

describe('SyncResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: SyncResolver = TestBed.get(SyncResolver);
	expect(service).toBeTruthy();
  });
});
