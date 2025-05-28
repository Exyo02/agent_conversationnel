import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReconnaissanceVocaleService {
  reconnaissanceVocale : any;
  ecoute: boolean = false;

  constructor(private zone: NgZone) {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.reconnaissanceVocale = new webkitSpeechRecognition();
    this.reconnaissanceVocale.continuou = false;
    this.reconnaissanceVocale.lang = 'fr-FR';
  }

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
          reject();
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

  stop() {
    if (this.ecoute){
      this.ecoute = false;
      this.reconnaissanceVocale.stop();
    }
  }
}

interface IWindow extends Window{
  webkitSpeechRecognition: any;
}