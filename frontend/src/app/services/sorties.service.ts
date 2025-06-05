import { Injectable } from '@angular/core';

export interface Sortie {
  title: string;
  date: string | null;
  heureDebut?: string;
  adresse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SortiesService {
  // Clé pour accéder aux noms des sorties stockés dans le local storage 
  private readonly storageKey = 'sorties';
  private sorties: { [title: string]: Sortie } = this.chargerSorties();

  constructor() { }

  /**
   * Sauvegarde de la liste des identifiants des sorties
   */
  private sauvegarderSorties(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.sorties));
  }

  /**
   * @returns les informations sur les sorties
   */
  private chargerSorties(): { [title: string]: Sortie } {
    // Récupère les informations sur les sorties à partir de la clé
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Stocke les informations de la sortie spécifié en paramètres effectifs
   * @param sortiesData les informations de la sortie
   */
  ajouterSortie(sortiesData: Sortie): void {
    this.sorties[sortiesData.title] = { ...sortiesData };
    this.sauvegarderSorties();
    console.log('Sortie ajoutée :', sortiesData);
  }

  /**
   * Stocke les informations de la sortie spécifiée en paramètres effectifs
   * @param title de la sortie
   * @param sortiesData informations de la sortie
   */
  modifierSortie(title: string, sortiesData: Sortie): void {
    // Modifie les informations de la sortie si elle est stockée
    if (this.sorties[title]) {
      this.sorties[title] = { ...sortiesData };
      this.sauvegarderSorties();
      console.log('Sortie modifiée :', sortiesData);
    }
  }

  /**
   * @param title de la sortie
   * @returns les informations de la sortie
   */
  chargerSortie(title: string): Sortie | undefined {
    return this.sorties[title];
  }

  /**
   * Supprimer la sortie dont le titre est spécifié dans les paramètres effectifs
   * @param title de la sortie
   */
  supprimerSortie(title: string): void {
    delete this.sorties[title];
    this.sauvegarderSorties();
    console.log('Sortie supprimé, title:', title);
  }

  /**
   * @returns les informations de l'ensemble des sorties
   */
  getAllSorties(): Sortie [] {
    return Object.values(this.sorties);
  }
}
