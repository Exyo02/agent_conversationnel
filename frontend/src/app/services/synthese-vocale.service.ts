import { Injectable } from '@angular/core';

/**
 * La classe SyntheseVocaleService est utilisée pour lire 
 * les informations spécifiques à l'application
 */
@Injectable({
  providedIn: 'root'
})
export class SyntheseVocaleService{
  synthese!:SpeechSynthesisUtterance;

  /**
   * Le constructeur initialise le narrateur
   */
  constructor() {
    this.init();
  }

  /**
   * Initialisation de la synthèse vocale avec configuration
   */
  init(): void {
    this.synthese = new SpeechSynthesisUtterance();
    this.synthese.volume = 1;
    this.synthese.rate = 1;
    this.synthese.pitch = 0.2;
    this.synthese.lang = "fr-FR";
  }

  /**
   * Fonction permettant de démarrer la synthèse vocale
   * @param message à dire par la synthèse vocale
   * @returns 
   */
  parler(message:string){
    // S'il n'y a pas de message alors ne rien dire
    if (message == "")
      return;

    // Sinon utilisation de la synthèse avec le message spécifié non vide
    this.synthese.text = message;
    speechSynthesis.speak(this.synthese);
  }
}
