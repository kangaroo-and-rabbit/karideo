import { TestBed, inject } from '@angular/core/testing';

import { SaisonService } from './saison.service';

describe('SaisonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaisonService]
    });
  });

  it('should be created', inject([SaisonService], (service: SaisonService) => {
    expect(service).toBeTruthy();
  }));
});
