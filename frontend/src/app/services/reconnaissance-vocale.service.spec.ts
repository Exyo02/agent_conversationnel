import { TestBed } from '@angular/core/testing';

import { ReconnaissanceVocaleService } from './reconnaissance-vocale.service';

describe('ReconnaissanceVocaleService', () => {
  let service: ReconnaissanceVocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconnaissanceVocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
