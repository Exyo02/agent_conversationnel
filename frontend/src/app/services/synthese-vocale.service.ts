import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SyntheseVocaleService{
  synthese!:SpeechSynthesisUtterance;

  constructor() {
    this.init();
  }

  init(): void {
    this.synthese = new SpeechSynthesisUtterance();
    this.synthese.volume = 1;
    this.synthese.rate = 1;
    this.synthese.pitch = 0.2;
    this.synthese.lang = "fr-FR";
  }

  parler(message:string){
    if (message == "")
      return;

    this.synthese.text = message;
    speechSynthesis.speak(this.synthese);
  }
}
