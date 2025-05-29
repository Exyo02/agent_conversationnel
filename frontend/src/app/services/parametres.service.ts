import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Parametres {
  police: string;
  themeNuitJour: boolean;
  listeNomBot: string[];
  listePhotoBot: string[];
  fondEcran: string[];
  fondEcranChoisi: string;
  modeNarrateur: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ParametresService {
  private readonly storageKey = 'app-parametres';
  private parametresSubject = new BehaviorSubject<Parametres | null>(this.chargerParametres());
  parametres$: Observable<Parametres | null> = this.parametresSubject.asObservable();
  private currentFont: string = localStorage.getItem('selectedFont') || 'Roboto, sans-serif';

  constructor() {
    this.chargerParametresInitial();
   }

  chargerParametres(): Parametres | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  sauvegarderParametres(parametres: Parametres): void {
    localStorage.setItem(this.storageKey, JSON.stringify(parametres));
    this.parametresSubject.next(parametres);
    this.appliquerPolice(parametres.police);
    this.appliquerFondEcran(parametres.fondEcranChoisi);
  }

  reinitialiserParametres(): void {
    const defaultParametres: Parametres = {
      police: '',
      themeNuitJour: true,
      listeNomBot: [],
      listePhotoBot: [],
      fondEcran: [],
      fondEcranChoisi: '',
      modeNarrateur: true,
    };
    this.sauvegarderParametres(defaultParametres);
    this.parametresSubject.next(defaultParametres);
  }
  appliquerPolice(police: string): void {
    console.log('Application de la police :', police);
    document.documentElement.style.setProperty('--main-font', police);
    this.currentFont = police;
    localStorage.setItem('selectedFont', police);
  }

  getPoliceActuelle(): string {
    return this.currentFont;
  }

  private chargerParametresInitial(): void {
    const params = this.chargerParametres();
    if (params) {
      this.appliquerPolice(params.police);
      this.appliquerFondEcran(params.fondEcranChoisi);
    }
  }

  appliquerFondEcran(url: string): void {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (url) {
        mainElement.style.backgroundImage = `url('${url}')`;
        mainElement.style.backgroundSize = 'cover';
        mainElement.style.backgroundRepeat = 'no-repeat';
      } else {
        mainElement.style.backgroundImage = '';
      }
    }
  }
}
