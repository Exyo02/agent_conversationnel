import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametresService } from '../../services/parametres.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}
interface Message {
  channelId: string;
  user: string;
  content: string;
  timestamp: Date;
}

@Component({
  standalone: true,
  selector: 'app-communaute',
  imports: [MessageComponent],
  templateUrl: './communaute.component.html',
  styleUrls: ['./communaute.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CommunauteComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = false;
  parametresSubscription: Subscription | undefined;
  currentMessage: string = "";
  messages: Message[] = [];
  @ViewChild('discussionContainer') private discussionContainer!: ElementRef;

  constructor(
    private dialogBox: NgbModal,
    private parametresService: ParametresService
  ) { }

  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      this.parametresSubscription.unsubscribe();
    }
  }

  rejoindreConversation() {
    document.getElementById("afficheConversation")!.style.visibility = "visible";
    this.messages = [];
    this.currentMessage = "";
    this.ajouterMessage('Système', 'Bonjour !');
  }

  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  getPClass() {
    return this.isDarkMode ? 'p-nuit' : 'p-jour';
  }

  getDiscussionClass() {
    return this.isDarkMode ? 'discussion discussion-nuit' : 'discussion discussion-jour';
  }

  envoyerMessage() {
    if (this.currentMessage.trim() !== "") {
      this.ajouterMessage('Vous', this.currentMessage);
      this.currentMessage = "";
    }
  }

  ajouterMessage(sender: string, content: string) {
    this.messages.push({ sender: sender, content: content, timestamp: new Date() });
  }

  scrollToBottom(): void {
    try {
      this.discussionContainer.nativeElement.scrollTop = this.discussionContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
