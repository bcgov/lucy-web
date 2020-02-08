import { TestBed } from '@angular/core/testing';
import { BcgwService } from './bcgw.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';

describe('BcgwService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      RouterTestingModule
    ],
    providers: [ CookieService ],
  }));

  it('should be created', () => {
    const service: BcgwService = TestBed.get(BcgwService);
    expect(service).toBeTruthy();
  });
});
