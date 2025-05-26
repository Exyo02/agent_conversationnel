import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DiscussionThread } from '../../discussion-thread';

@Component({
  standalone:true,
  selector: 'app-discussion-thread-list',
  templateUrl: './discussion-thread-list.component.html',
  styleUrls: ['./discussion-thread-list.component.css']
})
export class DiscussionThreadListComponent {
  @Input() threads: DiscussionThread[] = [];
  @Output() joinThread = new EventEmitter<string>();
  @Output() maskThread = new EventEmitter<string>();
  @Output() leaveThread = new EventEmitter<string>();

  onJoin(threadId: string): void {
    this.joinThread.emit(threadId);
  }

  onMask(threadId: string): void {
    this.maskThread.emit(threadId);
  }

  onLeave(threadId: string): void {
    this.leaveThread.emit(threadId);
  }
}
