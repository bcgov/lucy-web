import { TestBed } from '@angular/core/testing';
import { ObservationService } from './observation.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ObservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule],
    providers: [ CookieService ],
  }));

  it('should be created', () => {
    const service: ObservationService = TestBed.get(ObservationService);
    expect(service).toBeTruthy();
  });
});
