import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointModalComponent } from './waypoint-modal.component';
import { WaypointInfoComponent } from '../waypoint-info/waypoint-info.component';
import { FieldComponent } from 'src/app/components/Input/field/field.component';
import { WaypointTextEntryComponent } from '../waypoint-text-entry/waypoint-text-entry.component';
import { MapPreviewComponent } from 'src/app/components/Utilities/map-preview/map-preview.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementFocusDirective } from 'src/app/directives/element-focus/element-focus.directive';
import { LottieAnimationViewModule } from 'ng-lottie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WaypointModalComponent', () => {
  let component: WaypointModalComponent;
  let fixture: ComponentFixture<WaypointModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        LottieAnimationViewModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        WaypointModalComponent,
        WaypointInfoComponent,
        FieldComponent,
        WaypointTextEntryComponent,
        MapPreviewComponent,
        ElementFocusDirective
      ]
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
