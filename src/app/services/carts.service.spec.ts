import { TestBed } from '@angular/core/testing';

import { CartsService } from './carts.service';

describe('CartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartsService = TestBed.get(CartsService);
    expect(service).toBeTruthy();
  });
});
