import { Component, Input } from '@angular/core';

/** Représente un message sous forme d'interface */
interface Message {
  /** Identifiant du channel */
  channelId: string;

  /** Nom de l'envoyeur */
  sender: string;

  /** Contenu du message */
  content: string;

  /** Date et heure d'envoi du message */
  timestamp: Date;
}

/**
 * Composant pour les messages dans les groupes de la communauté
 */
@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  /** Contenu du message */
  @Input() message!: Message;
}
