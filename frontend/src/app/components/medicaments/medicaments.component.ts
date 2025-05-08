import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicamentsService } from '../../services/medicaments.service';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-medicaments',
  imports: [FormsModule, CommonModule],
  templateUrl: './medicaments.component.html',
  styleUrl: './medicaments.component.css'
})
export class MedicamentsComponent implements OnInit {
  medicaments: any[] = [];
  afficherFormulaire = false;
  estNouveau = true;
  nouveauMedicament: { nom: string; duree: number | null; quantite: number | null , heurePrise?: string} = {
    nom: '',
    duree: null,
    quantite: null,
    heurePrise: ''
  };

  constructor(
    private medicamentsService: MedicamentsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const nomParam = this.route.snapshot.paramMap.get('nom');
    if (nomParam) {
      this.estNouveau = false;
      const medicamentExistant = this.medicamentsService.chargerMedicament(nomParam);
      if (medicamentExistant) {
        this.nouveauMedicament = { ...medicamentExistant };
      }
    } else {
      this.estNouveau = true;
      this.nouveauMedicament = { nom: '', duree: null, quantite: null, heurePrise: '' };
    }
  }

  chargerMedicaments(): void {
    this.medicaments = this.medicamentsService.getAllMedicaments();
  }

  ajouterNouveauMedicament(): void {
    this.afficherFormulaire = true;
    this.estNouveau = true;
    this.reinitialiserFormulaire();
  }

  modifierMedicament(nom: string): void {
    this.router.navigate(['/app-medicaments', { nom: nom }]);
  }

  enregistrer(): void {
    if (!this.nouveauMedicament.nom) {
      alert('Le nom du médicament est obligatoire.');
      return;
    }

    if (this.nouveauMedicament.duree === null || this.nouveauMedicament.duree <= 0) {
      alert('La durée de la prise doit être supérieure à 0.');
      return;
    }

    if (this.nouveauMedicament.quantite === null || this.nouveauMedicament.quantite <= 0) {
      alert('La quantité par prise doit être supérieure à 0.');
      return;
    }

    if (this.estNouveau) {
      this.medicamentsService.ajouterMedicament(this.nouveauMedicament);
    } else {
      this.medicamentsService.modifierMedicament(this.nouveauMedicament.nom, this.nouveauMedicament);
    }
    this.afficherFormulaire = false;
    this.chargerMedicaments();
    this.location.back();
  }

  supprimer(): void {
    if (this.nouveauMedicament.nom && confirm(`Êtes-vous sûr de vouloir supprimer ${this.nouveauMedicament.nom} ?`)) {
      this.medicamentsService.supprimerMedicament(this.nouveauMedicament.nom);
      this.afficherFormulaire = false;
      this.chargerMedicaments();
      this.location.back();
    }
  }

  annuler(): void {
    this.afficherFormulaire = false;
    this.reinitialiserFormulaire();
    this.location.back();
  }

  reinitialiserFormulaire(): void {
    this.nouveauMedicament = { nom: '', duree: null, quantite: null, heurePrise: '' };
    this.estNouveau = true;
  }
}
