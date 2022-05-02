import { TestBed } from '@angular/core/testing';

import { PropertyPendingService } from './property-pending.service';

describe('PropertyPendingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropertyPendingService = TestBed.get(PropertyPendingService);
    expect(service).toBeTruthy();
  });
});
