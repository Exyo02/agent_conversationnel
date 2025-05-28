import { Component, Input } from '@angular/core';

interface Message {
  channelId: string;
  user: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message!: Message;
}
