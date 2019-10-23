import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { DiffViewerComponent } from './diff-viewer.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DiffViewerComponent', () => {
  let component: DiffViewerComponent;
  let fixture: ComponentFixture<DiffViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatExpansionModule, BrowserAnimationsModule ],
      declarations: [ DiffViewerComponent ],
      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
