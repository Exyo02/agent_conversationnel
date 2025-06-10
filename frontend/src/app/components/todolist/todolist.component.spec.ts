import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistComponent } from './todolist.component';
import { ActivatedRoute } from '@angular/router';

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('TodolistComponent', () => {
  let component: TodolistComponent;
  let fixture: ComponentFixture<TodolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodolistComponent],
      providers: [
        {provide: ActivatedRoute, useValue:mockRouter}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('instanciation', () => {
    expect(component).toBeTruthy();
  });
});
