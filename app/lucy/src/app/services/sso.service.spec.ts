import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { SsoService } from './sso.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('SsoService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule, RouterTestingModule],
    providers: [ CookieService],
  }));

  it('should be created', () => {
    const service: SsoService = TestBed.get(SsoService);
    expect(service).toBeTruthy();
  });
});