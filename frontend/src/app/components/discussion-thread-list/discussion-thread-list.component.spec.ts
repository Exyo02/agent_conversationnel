import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionThreadListComponent } from './discussion-thread-list.component';

describe('DiscussionThreadListComponent', () => {
  let component: DiscussionThreadListComponent;
  let fixture: ComponentFixture<DiscussionThreadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionThreadListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionThreadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
