import { TestBed } from '@angular/core/testing';
import { MechanicalTreatmentService } from './mechanical-treatment.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';

describe('MechanicalTreatmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule],
    providers: [ CookieService ],
  }));

  it('should be created', () => {
    const service: MechanicalTreatmentService = TestBed.get(MechanicalTreatmentService);
    expect(service).toBeTruthy();
  });
});
