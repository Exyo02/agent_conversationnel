import { TestBed } from '@angular/core/testing';

import { SortiesService } from './sorties.service';

describe('SortiesService', () => {
  let service: SortiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
