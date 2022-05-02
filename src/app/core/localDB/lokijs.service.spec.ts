import { TestBed } from '@angular/core/testing';

import { LokijsService } from './lokijs.service';

describe('LokijsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LokijsService = TestBed.get(LokijsService);
    expect(service).toBeTruthy();
  });
});
