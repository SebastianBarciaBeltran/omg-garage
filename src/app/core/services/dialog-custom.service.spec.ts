import { TestBed } from '@angular/core/testing';

import { DialogCustomService } from './dialog-custom.service';

describe('DialogCustomService', () => {
  let service: DialogCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
