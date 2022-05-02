import { TestBed } from '@angular/core/testing';

import { TabsStatesService } from './tabs-states.service';

describe('TabsStatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabsStatesService = TestBed.get(TabsStatesService);
    expect(service).toBeTruthy();
  });
});
