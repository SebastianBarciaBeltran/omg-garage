import { TestBed } from '@angular/core/testing';

import { InvoiceCalculationService } from './invoice-calculation.service';

describe('InvoiceCalculationService', () => {
  let service: InvoiceCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
