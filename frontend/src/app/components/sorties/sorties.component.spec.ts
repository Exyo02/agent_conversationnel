import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sorties } from './sorties.component';

describe('SortiesComponent', () => {
  let component: Sorties;
  let fixture: ComponentFixture<Sorties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sorties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sorties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
