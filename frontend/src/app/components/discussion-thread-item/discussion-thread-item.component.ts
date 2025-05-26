import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DiscussionThread } from '../../discussion-thread';

@Component({
  standalone:true,
  selector: 'app-discussion-thread-item',
  templateUrl: './discussion-thread-item.component.html',
  styleUrls: ['./discussion-thread-item.component.css']
})
export class DiscussionThreadItemComponent {
  @Input() thread!: DiscussionThread;
  @Output() join = new EventEmitter<string>();
  @Output() mask = new EventEmitter<string>();
  @Output() leave = new EventEmitter<string>();

  onJoin(): void {
    this.join.emit(this.thread.id);
  }

  onMask(): void {
    this.mask.emit(this.thread.id);
  }

  onLeave(): void {
    this.leave.emit(this.thread.id);
  }
}
