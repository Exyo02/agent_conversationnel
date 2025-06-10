import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunauteComponent } from './communaute.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

const mockHttpClient = {
  get: jasmine.createSpy().and.returnValue(of({})),
  post: jasmine.createSpy().and.returnValue(of({})),
  put: jasmine.createSpy().and.returnValue(of({})),
  delete: jasmine.createSpy().and.returnValue(of({}))
}

describe('CommunauteComponent', () => {
  let component: CommunauteComponent;
  let fixture: ComponentFixture<CommunauteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunauteComponent],
      providers:[{provide:HttpClient,useValue:mockHttpClient}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunauteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('instanciation', () => {
    expect(component).toBeTruthy();
  });
});
