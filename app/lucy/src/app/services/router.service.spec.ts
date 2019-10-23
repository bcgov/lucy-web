import { TestBed } from '@angular/core/testing';
import { RouterService } from './router.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule]
  }));

  it('should be created', () => {
    const service: RouterService = TestBed.get(RouterService);
    expect(service).toBeTruthy();
  });
});
