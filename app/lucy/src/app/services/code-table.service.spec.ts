import { TestBed } from '@angular/core/testing';
import { CodeTableService } from './code-table.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CodeTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      RouterTestingModule
    ],
    providers: [ CookieService ],
  }));

  it('should be created', () => {
    const service: CodeTableService = TestBed.get(CodeTableService);
    expect(service).toBeTruthy();
  });
});
