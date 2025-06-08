import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';

/**
 * Service de reconnaissance vocale
 */
@Injectable({
  providedIn: 'root'
})
export class ReconnaissanceVocaleService {
  reconnaissanceVocale : any;

  /** Activation de la reconnaissance vocale */
  ecoute: boolean = false;

  /**
   * Initialisation et configuration de la reconnaissance vocale
   * @param zone 
   */
  constructor(private zone: NgZone) {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.reconnaissanceVocale = new webkitSpeechRecognition();
    this.reconnaissanceVocale.continuou = false;
    this.reconnaissanceVocale.lang = 'fr-FR';
  }

  /**
   * Démarre la reconnaissance vocale
   * @returns un texte résultat de l'annalyse de la voix
   */
  start(): Promise<string>{
    return new Promise((resolve,reject)=>{
      if (this.ecoute){
        reject("En cours d'écoute");
      }

      this.ecoute = true;
      
      this.reconnaissanceVocale.onresult = (event: any)=>{
        this.zone.run(()=>{
          const results = event.results[0][0].transcript;
          this.stop();
          resolve(results);
        });
      }

      this.reconnaissanceVocale.onerror = (event: any)=>{
        this.zone.run(()=>{
          this.ecoute = false;
          reject("Erreur lors de la reconnaissance vocale");
        });
      }

      this.reconnaissanceVocale.onend = ()=>{
        this.zone.run(()=>{
          this.ecoute = false;
        });
      }

      this.reconnaissanceVocale.start();
    });
  }

  /**
   * Arrêter la reconnaissance vocale
   */
  stop() {
    // Si la reconnaissance est sur écoute alors arrêter la reconnaissance
    if (this.ecoute){
      this.ecoute = false;
      this.reconnaissanceVocale.stop();
    }
  }
}

/**
 * Interface pour étendre l'interface native Window
 */
interface IWindow extends Window{
  /**
   * Constructeur de l'API webkitSpeechRecognition
   */
  webkitSpeechRecognition: any;
}