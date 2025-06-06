import { Injectable } from '@angular/core';

/** Représente un médicamment sous forme d'interface */
export interface Medicament {
  /** Nom du médicamment */
  nom: string;

  /** Durée de prise du médicamment */
  duree: number | null;

  /** Quantitée d'une prise' */
  quantite: number | null;

  /** Intervalle entre les pises du médicamment */
  intervallePrise?: string;

  /** Date de la première prise */
  premierePrise?: Date;
}

/**
 * Service de gestion des médicamments
 * Ajout / modification / récupération / suppression
 */
@Injectable({
  providedIn: 'root'
})
export class MedicamentsService {
  /** Clé pour accéder aux noms des médicamments stockés dans le local storage */
  private readonly storageKey = 'medicaments';

  /** Liste des médicamments */
  private medicaments: { [nom: string]: Medicament } = this.chargerMedicaments();

  /**
   * Constructeur du service de gestion des médicamments
   */
  constructor() { }

  /**
   * Sauvegarde de la liste des identifiants des médicamments
   */
  private sauvegarderMedicaments(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.medicaments));
  }

  /**
   * Récupération de la liste des médicamments dans le local storage
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
   * Récupère les informations d'un médicamment avec le nom passé en paramètres effectifs
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
   * Renvoi la liste de tous les médicamments
   * @returns les informations de l'ensemble des médicamments
   */
  getAllMedicaments(): Medicament[] {
    return Object.values(this.medicaments);
  }
}
