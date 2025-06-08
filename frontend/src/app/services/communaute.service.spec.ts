import { TestBed } from '@angular/core/testing';
import { CommunauteService } from '../services/communaute.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

const mockHttpClient = {
  get: jasmine.createSpy().and.returnValue(of({})),
  post: jasmine.createSpy().and.returnValue(of({})),
  put: jasmine.createSpy().and.returnValue(of({})),
  delete: jasmine.createSpy().and.returnValue(of({}))
}

describe('CommunauteService', () => {
  let service: CommunauteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:HttpClient,useValue:mockHttpClient}]
    });
    service = TestBed.inject(CommunauteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
