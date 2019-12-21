import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementVideoComponent } from './top-menu.component';

describe('ElementVideoComponent', () => {
  let component: ElementVideoComponent;
  let fixture: ComponentFixture<ElementVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
