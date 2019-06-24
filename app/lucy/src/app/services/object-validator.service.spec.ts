import { TestBed } from '@angular/core/testing';

import { ObjectValidatorService } from './object-validator.service';

describe('ObjectValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectValidatorService = TestBed.get(ObjectValidatorService);
    expect(service).toBeTruthy();
  });
});
