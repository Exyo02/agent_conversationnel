import { Injectable } from '@angular/core';

export interface Sortie {
  nom: string;
  date: string | null;
  heureDebut?: string;
  adresse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SortiesService {
  private readonly storageKey = 'sorties';
  private sorties: { [nom: string]: Sortie } = this.chargerSorties();

  constructor() { }

  private sauvegarderSorties(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.sorties));
  }

  private chargerSorties(): { [nom: string]: Sortie } {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  ajouterSortie(sortiesData: Sortie): void {
    this.sorties[sortiesData.nom] = { ...sortiesData };
    this.sauvegarderSorties();
    console.log('Sortie ajoutée :', sortiesData);
  }

  modifierSortie(nom: string, sortiesData: Sortie): void {
    if (this.sorties[nom]) {
      this.sorties[nom] = { ...sortiesData };
      this.sauvegarderSorties();
      console.log('Sortie modifiée :', sortiesData);
    }
  }

  chargerSortie(nom: string): Sortie | undefined {
    return this.sorties[nom];
  }

  supprimerSortie(nom: string): void {
    delete this.sorties[nom];
    this.sauvegarderSorties();
    console.log('Sortie supprimé, nom:', nom);
  }

  getAllSorties(): Sortie [] {
    return Object.values(this.sorties);
  }
}
