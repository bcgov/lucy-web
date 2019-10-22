import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntryComponent } from './add-entry.component';
import { RouterService } from 'src/app/services/router.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddEntryComponent', () => {
  let component: AddEntryComponent;
  let fixture: ComponentFixture<AddEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ AddEntryComponent ],
      providers: [ RouterService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
