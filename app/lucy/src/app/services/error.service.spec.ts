import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule
    ],
  }));

  it('should be created', () => {
    const service: ErrorService = TestBed.get(ErrorService);
    expect(service).toBeTruthy();
  });
});
