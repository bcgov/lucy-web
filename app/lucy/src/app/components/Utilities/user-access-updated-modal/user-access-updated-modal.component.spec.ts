import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccessUpdatedModalComponent } from './user-access-updated-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('UserAccessUpdatedModalComponent', () => {
  let component: UserAccessUpdatedModalComponent;
  let fixture: ComponentFixture<UserAccessUpdatedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, RouterTestingModule ],
      providers: [ CookieService ],
      declarations: [ UserAccessUpdatedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessUpdatedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
