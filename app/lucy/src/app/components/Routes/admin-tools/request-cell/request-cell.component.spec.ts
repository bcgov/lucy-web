import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCellComponent } from './request-cell.component';

describe('RequestCellComponent', () => {
  let component: RequestCellComponent;
  let fixture: ComponentFixture<RequestCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
