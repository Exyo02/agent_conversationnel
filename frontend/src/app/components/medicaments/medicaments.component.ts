import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicamentsService } from '../../services/medicaments.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  nouveauMedicament: { nom: string; duree: number | null; quantite: number | null , intervallePrise?: string, premierePrise?: Date} = {
    nom: '',
    duree: null,
    quantite: null,
    intervallePrise: '',
    premierePrise: new Date()
  };

  constructor(
    private medicamentsService: MedicamentsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: NgbModal
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
      this.nouveauMedicament = { nom: '', duree: null, quantite: null, intervallePrise: '' , premierePrise: new Date()};
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
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'Le nom du médicament est obligatoire.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    if (this.nouveauMedicament.duree === null || this.nouveauMedicament.duree <= 0) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'La durée de la prise doit être supérieure à 0.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    if (this.nouveauMedicament.quantite === null || this.nouveauMedicament.quantite <= 0) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'La quantité par prise doit être supérieure à 0.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    if (this.estNouveau) {
      this.medicamentsService.ajouterMedicament(this.nouveauMedicament);
    } else {
      this.medicamentsService.modifierMedicament(this.nouveauMedicament.nom, this.nouveauMedicament);
    }
    if (!this.nouveauMedicament.premierePrise) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = "La date de la première prise est obligatoire.";
      mod.componentInstance.opt1 = "Ok";
      return;
    }
    this.afficherFormulaire = false;
    this.chargerMedicaments();
  }

  supprimer(): void {
    if (this.nouveauMedicament.nom) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = `Êtes-vous sûr de vouloir supprimer ${this.nouveauMedicament.nom} ?`;
      mod.componentInstance.opt1 = "Oui";
      mod.componentInstance.opt2 = "Non";
      mod.result.then(result=>{
        if(result){
          this.medicamentsService.supprimerMedicament(this.nouveauMedicament.nom);
          this.afficherFormulaire = false;
          this.chargerMedicaments();
        }
      })
    }
  }

  annuler(): void {
    const mod = this.dialogBox.open(DialogComponent);
    mod.componentInstance.message = "Êtes-vous sûre de vouloir annuler vos modifications? Toute progression non sauvegardée sera perdu.";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      if(result){
        this.router.navigate(["/app-medicaments"]);
      }
    })
  }

  reinitialiserFormulaire(): void {
    this.nouveauMedicament = { nom: '', duree: null, quantite: null, intervallePrise: '' , premierePrise: new Date()};
    this.estNouveau = true;
  }
}
