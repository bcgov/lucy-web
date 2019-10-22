import { TestBed } from '@angular/core/testing';

import { CodeTableService } from './code-table.service';

describe('CodeTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodeTableService = TestBed.get(CodeTableService);
    expect(service).toBeTruthy();
  });
});
