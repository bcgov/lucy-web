import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessUpdatedModalComponent } from './user-access-updated-modal.component';

describe('UserAccessUpdatedModalComponent', () => {
  let component: UserAccessUpdatedModalComponent;
  let fixture: ComponentFixture<UserAccessUpdatedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
