import { TestBed } from '@angular/core/testing';

import { BcgwService } from './bcgw.service';

describe('BcgwService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BcgwService = TestBed.get(BcgwService);
    expect(service).toBeTruthy();
  });
});
