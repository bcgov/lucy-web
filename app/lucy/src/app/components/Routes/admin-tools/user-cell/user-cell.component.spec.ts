import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCellComponent } from './user-cell.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';
import { RolesService } from 'src/app/services/roles.service';

describe('UserCellComponent', () => {
  let component: UserCellComponent;
  let fixture: ComponentFixture<UserCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgbModule, HttpClientModule, RouterTestingModule ],
      declarations: [ UserCellComponent ],
      providers: [ CookieService, RolesService ],
      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
