import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionThreadItemComponent } from './discussion-thread-item.component';

describe('DiscussionThreadItemComponent', () => {
  let component: DiscussionThreadItemComponent;
  let fixture: ComponentFixture<DiscussionThreadItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionThreadItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionThreadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
