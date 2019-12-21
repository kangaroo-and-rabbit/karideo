import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementGroupComponent } from './top-menu.component';

describe('ElementGroupComponent', () => {
  let component: ElementGroupComponent;
  let fixture: ComponentFixture<ElementGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
