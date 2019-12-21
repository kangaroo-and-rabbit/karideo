import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';

describe('TypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [testService]
    });
  });

  it('should be created', inject([TypeService], (service: TypeService) => {
    expect(service).toBeTruthy();
  }));
});
