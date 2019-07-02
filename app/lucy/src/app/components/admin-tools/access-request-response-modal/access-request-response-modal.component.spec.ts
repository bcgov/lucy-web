import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestResponseModalComponent } from './access-request-response-modal.component';

describe('AccessRequestResponseModalComponent', () => {
  let component: AccessRequestResponseModalComponent;
  let fixture: ComponentFixture<AccessRequestResponseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessRequestResponseModalComponent ]
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
