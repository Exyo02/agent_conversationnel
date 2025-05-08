import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortieslisteComponent } from './sortiesliste.component';

describe('SortieslisteComponent', () => {
  let component: SortieslisteComponent;
  let fixture: ComponentFixture<SortieslisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortieslisteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortieslisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
