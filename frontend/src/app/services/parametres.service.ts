import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** Représente les paramètres de l'application sous forme d'interface */
export interface Parametres {
  /** Police d'écriture de l'application */
  police: string;

  /** Activation du mod Nuit */
  themeNuitJour: boolean;

  /** Liste des noms donnés au bot */
  listeNomBot: string[];

  /** Liste des logos donnés au bot */
  listePhotoBot: string[];

  /** Liste des URL de fond d'écran donnés à l'application */
  fondEcran: string[];

  /** URL du fond d'écran sélectionné dans la liste */
  fondEcranChoisi: string;

  /** Activation du mod Narrateur */
  modeNarrateur: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ParametresService {
  /** Clé pour accéder aux paramètres stockés dans le local storage */
  private readonly storageKey = 'app-parametres';

  private parametresSubject = new BehaviorSubject<Parametres | null>(this.chargerParametres());
  parametres$: Observable<Parametres | null> = this.parametresSubject.asObservable();

  /** Police actuellement utilisé */
  private currentFont: string = localStorage.getItem('selectedFont') || 'Roboto, sans-serif';

  /**
   * Le constructeur charge les paramètres
   */
  constructor() {
    this.chargerParametresInitial();
   }

   /**
    * @returns les informations sur les paramètres
    */
  chargerParametres(): Parametres | null {
    // Récupère les informations sur les paramètres à partir de la clé
    const data = localStorage.getItem(this.storageKey);
    
    return data ? JSON.parse(data) : null;
  }

  /**
   * Sauvegarde les paramètres
   * Applique la police
   * Applique le fond d'écran
   * @param parametres à sauvegarder
   */
  sauvegarderParametres(parametres: Parametres): void {
    localStorage.setItem(this.storageKey, JSON.stringify(parametres));
    this.parametresSubject.next(parametres);
    this.appliquerPolice(parametres.police);
    this.appliquerFondEcran(parametres.fondEcranChoisi);
  }

  /**
   * Réinitialisation des paramètres par défault
   */
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

  /**
   * Changement de la police
   * @param police nom de la police
   */
  appliquerPolice(police: string): void {
    console.log('Application de la police :', police);
    document.documentElement.style.setProperty('--main-font', police);
    this.currentFont = police;

    // Enregistrement de la nouvelle police
    localStorage.setItem('selectedFont', police);
  }

  /**
   * @returns le nom de la police actuelle
   */
  getPoliceActuelle(): string {
    return this.currentFont;
  }

  /**
   * Replacer les paramètres, tel qu'ils sont enregistrés
   */
  private chargerParametresInitial(): void {
    // Récupération des paramètres enregistrés
    const params = this.chargerParametres();

    if (params) {
      this.appliquerPolice(params.police);
      this.appliquerFondEcran(params.fondEcranChoisi);
    }
  }

  /**
   * Changement de fond d'écran
   * @param url du nouveau fond d'écran
   */
  appliquerFondEcran(url: string): void {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // Si l'URL de l'image est correcte, on change le fond d'écran
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
