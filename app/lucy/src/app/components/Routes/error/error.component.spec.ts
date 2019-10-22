import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { MatToolbarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatToolbarModule, RouterTestingModule ],
      declarations: [ ErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
