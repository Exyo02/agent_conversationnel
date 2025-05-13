import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActusComponent } from './infos.component';

describe('ActusComponent', () => {
  let component: ActusComponent;
  let fixture: ComponentFixture<ActusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
