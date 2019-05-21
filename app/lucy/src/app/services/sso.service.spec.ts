import { TestBed } from '@angular/core/testing';

import { SsoService } from './sso.service';

describe('SsoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SsoService = TestBed.get(SsoService);
    expect(service).toBeTruthy();
  });
});