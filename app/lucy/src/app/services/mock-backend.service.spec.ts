import { TestBed } from '@angular/core/testing';

import { MockBackendService } from './mock-backend.service';

describe('MockBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockBackendService = TestBed.get(MockBackendService);
    expect(service).toBeTruthy();
  });
});
