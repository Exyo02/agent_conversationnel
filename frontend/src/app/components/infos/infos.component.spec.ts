import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosComponent } from './infos.component';

describe('ActusComponent', () => {
  let component: InfosComponent;
  let fixture: ComponentFixture<InfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
