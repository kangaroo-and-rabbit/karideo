import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementTypeComponent } from './top-menu.component';

describe('ElementTypeComponent', () => {
  let component: ElementTypeComponent;
  let fixture: ComponentFixture<ElementTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
