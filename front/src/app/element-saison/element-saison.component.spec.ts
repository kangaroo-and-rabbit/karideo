import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSaisonComponent } from './top-menu.component';

describe('ElementSaisonComponent', () => {
  let component: ElementSaisonComponent;
  let fixture: ComponentFixture<ElementSaisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementSaisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSaisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
