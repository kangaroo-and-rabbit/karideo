import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisonDetailComponent } from './saison-detail.component';

describe('SaisonDetailComponent', () => {
  let component: SaisonDetailComponent;
  let fixture: ComponentFixture<SaisonDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaisonDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
