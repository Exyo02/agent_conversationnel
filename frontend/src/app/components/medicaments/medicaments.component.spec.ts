import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentsComponent } from './medicaments.component';

describe('MedicamentsComponent', () => {
  let component: MedicamentsComponent;
  let fixture: ComponentFixture<MedicamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
