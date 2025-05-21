import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentsListComponent } from './medicamentliste.component';

describe('MedicamentListeComponent', () => {
  let component: MedicamentsListComponent;
  let fixture: ComponentFixture<MedicamentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
