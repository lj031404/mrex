import { TestBed } from '@angular/core/testing';

import { GMapsService } from './gmaps.service';

describe('GMapsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: GMapsService = TestBed.get(GMapsService);
	expect(service).toBeTruthy();
  });
});
