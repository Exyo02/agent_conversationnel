import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockHttpClient = {
    get: jasmine.createSpy().and.returnValue(of({})),
    post: jasmine.createSpy().and.returnValue(of({})),
    put: jasmine.createSpy().and.returnValue(of({})),
    delete: jasmine.createSpy().and.returnValue(of({}))
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers:[
        {provide:HttpClient,useValue:mockHttpClient},
        {provide: ActivatedRoute, useValue:mockRouter}
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });
});
