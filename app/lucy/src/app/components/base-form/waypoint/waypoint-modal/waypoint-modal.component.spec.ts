import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointModalComponent } from './waypoint-modal.component';

describe('WaypointModalComponent', () => {
  let component: WaypointModalComponent;
  let fixture: ComponentFixture<WaypointModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaypointModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaypointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
