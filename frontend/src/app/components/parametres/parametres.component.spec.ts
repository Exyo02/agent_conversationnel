import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametresComponent } from './parametres.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

const mockHttpClient = {
  get: jasmine.createSpy().and.returnValue(of({})),
  post: jasmine.createSpy().and.returnValue(of({})),
  put: jasmine.createSpy().and.returnValue(of({})),
  delete: jasmine.createSpy().and.returnValue(of({}))
}

describe('ParametresComponent', () => {
  let component: ParametresComponent;
  let fixture: ComponentFixture<ParametresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametresComponent],
      providers:[{provide:HttpClient,useValue:mockHttpClient}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
