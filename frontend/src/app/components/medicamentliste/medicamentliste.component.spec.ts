import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentListeComponent } from './medicamentliste.component';

describe('MedicamentListeComponent', () => {
  let component: MedicamentListeComponent;
  let fixture: ComponentFixture<MedicamentListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
