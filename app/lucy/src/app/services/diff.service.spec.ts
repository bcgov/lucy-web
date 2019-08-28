import { TestBed } from '@angular/core/testing';

import { DiffService } from './diff.service';

describe('DiffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiffService = TestBed.get(DiffService);
    expect(service).toBeTruthy();
  });
});
