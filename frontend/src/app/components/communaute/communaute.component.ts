import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametresService } from '../../services/parametres.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** Représente un message sous forme d'interface */
interface Message {
  /** Nom de l'enoyeur */
  sender: string;
  /** Contenu du message */
  content: string;
  /** Date et heure d'envoi */
  timestamp: Date;
}

/** Représente un message sous forme d'interface */
interface Message {
  /** Numéro du channel de publication */
  channelId: string;
  /** Nom de l'enoyeur */
  sender: string;
  /** Contenu du message */
  content: string;
  /** Date et heure d'envoi */
  timestamp: Date;
}

/**
 * Composant pour la commmunication avec la communauté
 */
@Component({
  standalone: true,
  selector: 'app-communaute',
  imports: [CommonModule, FormsModule],
  templateUrl: './communaute.component.html',
  styleUrls: ['./communaute.component.css'],
})
export class CommunauteComponent implements OnInit, OnDestroy {
  /** Activation du mod Nuit */
  isDarkMode: boolean = false;

  parametresSubscription: Subscription | undefined;

  /** Contenu de la zone de saisie */
  currentMessage: string = "";

  /** Liste des messages */
  messages: Message[] = [];

  @ViewChild('discussionContainer') private discussionContainer!: ElementRef;

  /**
   * Constructeur du composant communauté
   * @param dialogBox 
   * @param parametresService 
   */
  constructor(
    private dialogBox: NgbModal,
    private parametresService: ParametresService
  ) { }

  /**
   * Récupération des paramètres
   */
  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });
  }

  /**
   * Libération des ressources propre à l'abonnement au service des paramètres
   */
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

  /**
   * Vérificaton de l'activation du mod Nuit dans les paramètres
   */
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

  /**
   * Envoi un message, puis vide la zone de saisie
   */
  envoyerMessage() {
    // Vérifie si la zone de saisie n'est pas vide
    if (this.currentMessage.trim() !== "") {
      this.ajouterMessage('Vous', this.currentMessage);
      this.currentMessage = "";
    }
  }

  /**
   * Ajoute un message à la liste
   * @param sender 
   * @param content 
   */
  ajouterMessage(sender: string, content: string) {
    this.messages.push({sender: sender, content: content, timestamp: new Date()} as Message);
  }

  scrollToBottom(): void {
    try {
      this.discussionContainer.nativeElement.scrollTop = this.discussionContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
