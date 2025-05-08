import { Injectable } from '@angular/core';

export interface Medicament { // Exportez l'interface pour pouvoir l'importer ailleurs
  nom: string;
  duree: number | null;
  quantite: number | null;
  heurePrise?: string; // Ajout de la propriété pour l'heure de prise (optionnelle)
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentsService {
  private readonly storageKey = 'medicaments';
  private medicaments: { [nom: string]: Medicament } = this.chargerMedicaments();

  constructor() { }

  private sauvegarderMedicaments(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.medicaments));
  }

  private chargerMedicaments(): { [nom: string]: Medicament } {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  ajouterMedicament(medicamentData: Medicament): void {
    this.medicaments[medicamentData.nom] = { ...medicamentData };
    this.sauvegarderMedicaments();
    console.log('Médicament ajouté :', medicamentData);
  }

  modifierMedicament(nom: string, medicamentData: Medicament): void {
    if (this.medicaments[nom]) {
      this.medicaments[nom] = { ...medicamentData };
      this.sauvegarderMedicaments();
      console.log('Médicament modifié :', medicamentData);
    }
  }

  chargerMedicament(nom: string): Medicament | undefined {
    return this.medicaments[nom];
  }

  supprimerMedicament(nom: string): void {
    delete this.medicaments[nom];
    this.sauvegarderMedicaments();
    console.log('Médicament supprimé, nom:', nom);
  }

  getAllMedicaments(): Medicament[] {
    return Object.values(this.medicaments);
  }
}
