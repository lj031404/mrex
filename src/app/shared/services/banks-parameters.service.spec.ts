import { TestBed } from '@angular/core/testing';

import { BanksParametersService } from './banks-parameters.service';

describe('BanksParametersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
	const service: BanksParametersService = TestBed.get(BanksParametersService);
	expect(service).toBeTruthy();
  });
});
