import { TestBed } from '@angular/core/testing';

import { ParametresService } from '../services/parametres.service';

describe('ParametresService', () => {
  let service: ParametresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametresService);
  });

  it('instanciation', () => {
    expect(service).toBeTruthy();
  });
});
