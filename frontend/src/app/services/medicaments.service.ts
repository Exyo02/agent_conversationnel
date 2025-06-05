import { Injectable } from '@angular/core';

export interface Medicament {
  nom: string;
  duree: number | null;
  quantite: number | null;
  intervallePrise?: string;
  premierePrise?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentsService {
  // Clé pour accéder aux noms des médicamments stockés dans le local storage 
  private readonly storageKey = 'medicaments';
  private medicaments: { [nom: string]: Medicament } = this.chargerMedicaments();

  constructor() { }

  /**
   * Sauvegarde de la liste des identifiants des médicamments
   */
  private sauvegarderMedicaments(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.medicaments));
  }

  public clear(){
    localStorage.clear()
  }

  /**
   * @returns les informations sur les médicamments
   */
  private chargerMedicaments(): { [nom: string]: Medicament } {
    // Récupère les informations sur les médicamments à partir de la clé
    const data = localStorage.getItem(this.storageKey);

    return data ? JSON.parse(data) : {};
  }

  /**
   * Stocke les informations du médicamment spécifié en paramètres effectifs
   * @param medicamentData informations du médicamment
   */
  ajouterMedicament(medicamentData: Medicament): void {
    this.medicaments[medicamentData.nom] = { ...medicamentData };
    this.sauvegarderMedicaments();
    console.log('Médicament ajouté :', medicamentData);
  }

  /**
   * Stocke les informations du médicamment spécifié en paramètres effectifs
   * @param nom du médicamment
   * @param medicamentData informations du médicamment
   */
  modifierMedicament(nom: string, medicamentData: Medicament): void {
    // Modifie les informations du médicamment s'il est stocké
    if (this.medicaments[nom]) {
      this.medicaments[nom] = { ...medicamentData };
      this.sauvegarderMedicaments();
      console.log('Médicament modifié :', medicamentData);
    }
  }

  /**
   * @param nom du médicamment
   * @returns les informations du médicamment
   */
  chargerMedicament(nom: string): Medicament | undefined {
    return this.medicaments[nom];
  }

  /**
   * Supprimer le médicamment dont le nom est spécifié dans les paramètres effectifs
   * @param nom du médicamment
   */
  supprimerMedicament(nom: string): void {
    delete this.medicaments[nom];
    this.sauvegarderMedicaments();
    console.log('Médicament supprimé, nom:', nom);
  }

  /**
   * @returns les informations de l'ensemble des médicamments
   */
  getAllMedicaments(): Medicament[] {
    return Object.values(this.medicaments);
  }
}
