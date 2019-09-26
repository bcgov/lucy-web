import { TestBed } from '@angular/core/testing';

import { MechanicalTreatmentService } from './mechanical-treatment.service';

describe('MechanicalTreatmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MechanicalTreatmentService = TestBed.get(MechanicalTreatmentService);
    expect(service).toBeTruthy();
  });
});
