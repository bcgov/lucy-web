import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointInfoComponent } from './waypoint-info.component';

describe('WaypointInfoComponent', () => {
  let component: WaypointInfoComponent;
  let fixture: ComponentFixture<WaypointInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaypointInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaypointInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
