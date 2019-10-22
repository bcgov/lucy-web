import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material';
import { AdminToolsComponent } from './admin-tools.component';
import { RequestCellComponent } from 'src/app/components/Routes/admin-tools/request-cell/request-cell.component';
import { UserCellComponent } from 'src/app/components/Routes/admin-tools/user-cell/user-cell.component';
import { AccessRequestResponseModalComponent } from 'src/app/components/Routes/admin-tools/access-request-response-modal/access-request-response-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('AdminToolsComponent', () => {
  let component: AdminToolsComponent;
  let fixture: ComponentFixture<AdminToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, FormsModule, MatToolbarModule, NgbModule, HttpClientModule ],
      declarations: [ AdminToolsComponent, RequestCellComponent, UserCellComponent, AccessRequestResponseModalComponent ],
      providers: [ UserService, CookieService ],
      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
