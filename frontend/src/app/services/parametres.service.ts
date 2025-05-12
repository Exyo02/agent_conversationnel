import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Parametres {
  police: string;
  themeNuitJour: boolean;
  listeNomBot: string[];
  listePhotoBot: string[];
  fondEcran: string[];
  fondEcranChoisi: string
}

@Injectable({
  providedIn: 'root'
})
export class ParametresService {
  private readonly storageKey = 'app-parametres';
  private parametresSubject = new BehaviorSubject<Parametres | null>(this.chargerParametres());
  parametres$: Observable<Parametres | null> = this.parametresSubject.asObservable();

  constructor() { }
  chargerParametres(): Parametres | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  sauvegarderParametres(parametres: Parametres): void {
    localStorage.setItem(this.storageKey, JSON.stringify(parametres));
    this.parametresSubject.next(parametres);
  }

  reinitialiserParametres(): void {
    const defaultParametres: Parametres = {
      police: '',
     themeNuitJour: true,
      listeNomBot: [],
      listePhotoBot: [],
      fondEcran: [],
      fondEcranChoisi: '',
    };
    this.sauvegarderParametres(defaultParametres);
    this.parametresSubject.next(defaultParametres);
  }

}

