import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export interface Message {
  channelId: string;
  user: string;
  content: string;
  timestamp: Date;
}
