import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  currentText = '';
  userText='';
  botAnswer='';
  
  constructor(private service:ChatbotService){}

  envoyer(){
    this.service.envoi(this.currentText).subscribe(
      reponse=>{
        const desc = Object.getOwnPropertyDescriptor(reponse,"choices");
        this.botAnswer=desc?.value[0].message.content;
        this.refresh();
      }
    );
  }
  refresh(){
    this.userText = this.currentText;
    this.currentText = "";
    const bot = document.getElementById("bot");
    if(bot!=null){
      bot.style.visibility ="visible";
    }
    const user = document.getElementById("user");
    if(user!=null){
      user.style.visibility ="visible";
    }
    
  }
  
}
