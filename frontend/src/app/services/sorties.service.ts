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
  private readonly storageKey = 'sorties';
  private sorties: { [title: string]: Sortie } = this.chargerSorties();

  constructor() { }

  private sauvegarderSorties(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.sorties));
  }

  private chargerSorties(): { [title: string]: Sortie } {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  ajouterSortie(sortiesData: Sortie): void {
    this.sorties[sortiesData.title] = { ...sortiesData };
    this.sauvegarderSorties();
    console.log('Sortie ajoutée :', sortiesData);
  }

  modifierSortie(title: string, sortiesData: Sortie): void {
    if (this.sorties[title]) {
      this.sorties[title] = { ...sortiesData };
      this.sauvegarderSorties();
      console.log('Sortie modifiée :', sortiesData);
    }
  }

  chargerSortie(title: string): Sortie | undefined {
    return this.sorties[title];
  }

  supprimerSortie(title: string): void {
    delete this.sorties[title];
    this.sauvegarderSorties();
    console.log('Sortie supprimé, title:', title);
  }

  getAllSorties(): Sortie [] {
    return Object.values(this.sorties);
  }
}
