import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessRequestResponseModalComponent } from './access-request-response-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';



describe('AccessRequestResponseModalComponent', () => {
  let component: AccessRequestResponseModalComponent;
  let fixture: ComponentFixture<AccessRequestResponseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ AccessRequestResponseModalComponent ],
      providers: [UserService, CookieService],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRequestResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
