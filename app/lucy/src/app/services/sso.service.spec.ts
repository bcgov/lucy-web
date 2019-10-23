/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
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
    service.storeAccessToken('eyJqdGkiOiJhMjE1MDdkOS05OTNjLTRkNzAtODlkOC0wMzc2MDUwYWM1MTEiLCJleHAiOjE1NzE4NzQ3MDEsIm5iZiI6MCwiaWF0IjoxNTcxODcxMTAxLCJpc3MiOiJodHRwczovL3Nzby5wYXRoZmluZGVyLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy9kZm1sY2c3eiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiIzMmUzM2UwMy05ZDEyLTQzYTUtODhlNi1jZTAzMWZjMzZiZTgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsdWN5Iiwibm9uY2UiOiIxNzRlZWVjMS0wNTYyLTQ3YjQtYmM0Yi03ZTk3ZTU4MjU0ZTEiLCJhdXRoX3RpbWUiOjE1NzE4NzEwOTcsInNlc3Npb25fc3RhdGUiOiI3ODVhMjdhOS0zZmM2LTRhMmEtYTU3ZC1lZGJmOTkwMGJkOTciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctcmVhbG0iLCJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwicmVhbG0tYWRtaW4iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiIiwibmFtZSI6IkFtaXIgU2hheWVnaCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFzaGF5ZWdhQGlkaXIiLCJnaXZlbl9uYW1lIjoiQW1pciIsImZhbWlseV9uYW1lIjoiU2hheWVnaCIsImVtYWlsIjoiYW1pckBmcmVzaHdvcmtzLmlvIn0.GzukJVeLskIyQRAuFLE73PILip4z1V5c01YlWA-OpeYFnvgSNN6pGXAsRI_ZB1jiQowMMFUqIUe32a-Cyojmwek3WRYEnmOmEtyx7RE9GltmXgI7PAIatgZuHrNUJ4h40X_sJb7mvkiIQ10aYba7MrzKm5nOIVEQeq01Rk-6c2e7YUJqBSt9DUWGmMf_kMV4OyzZ5Z9MbPbJfkWp_nz2j7WfFMU1333esSYShGZ-1CeUGxHkh65x_MYsjgN5uhnyM1rjc7ogJFJIzJPlkfTIdk_cLeBPLS_YjejwLjrBj2g2D0S7yEbBU_9jSRMAq1FMSzjVLQIR2pxkD2OMFgHn2A'
    , 3600);
    service.storeRefreshToken('eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3MmNmMWUyMS1iNmJiLTQ1MzctYTQyMy1hOTc2ZWNhMTdkZDAifQ', 18000);
    expect(service).toBeTruthy();
  });
});
