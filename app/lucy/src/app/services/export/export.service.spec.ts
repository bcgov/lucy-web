import { TestBed } from '@angular/core/testing';

import { ExportService } from './export.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';

describe('ExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      RouterModule.forRoot([])
    ],
    providers: [ CookieService ]
  }));

  it('should be created', () => {
    const service: ExportService = TestBed.get(ExportService);
    expect(service).toBeTruthy();
  });
});
