import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicamentsService } from '../../services/medicaments.service';
import { DialogComponent } from '../dialog/dialog.component';
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
    // Récupération de l'identifiant du médicamment dans l'URL
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

  modifierMedicament(nom: string): void {
    this.router.navigate(['/app-medicaments', { nom: nom }]);
  }

  /**
   * Fonction d'enregistrement ou d'ajout d'un médicamment
   * @returns 
   */
  enregistrer(): void {
    // Si l'utilisateur n'écrit pas le nom du médicamment, alors affiche un messae d'erreur
    if (!this.nouveauMedicament.nom) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'Le nom du médicament est obligatoire.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    // Si l'utilisateur met une durée de prise <= 0 alors affiche un message d'erreur
    if (this.nouveauMedicament.duree === null || this.nouveauMedicament.duree <= 0) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'La durée de la prise doit être supérieure à 0.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    // Si l'uitlisateur met une quantité de prise <= 0 alors affiche un message d'erreur
    if (this.nouveauMedicament.quantite === null || this.nouveauMedicament.quantite <= 0) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'La quantité par prise doit être supérieure à 0.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    // Ajoute ou modifie le médicamment en fonction de s'il est déjà stocké
    if (this.estNouveau) {
      this.medicamentsService.ajouterMedicament(this.nouveauMedicament);
    } else {
      this.medicamentsService.modifierMedicament(this.nouveauMedicament.nom, this.nouveauMedicament);
    }

    // Si l'utilisateur ne précise pas la date de première prise, affiche un message d'erreur
    if (!this.nouveauMedicament.premierePrise) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = "La date de la première prise est obligatoire.";
      mod.componentInstance.opt1 = "Ok";
      return;
    }
  }

  supprimer(): void {
    if (this.nouveauMedicament.nom) {
      // Création d'une boite de dialogue
      const mod = this.dialogBox.open(DialogComponent);
      // Configuration de la boite de dialogue
      mod.componentInstance.message = `Êtes-vous sûr de vouloir supprimer ${this.nouveauMedicament.nom} ?`;
      mod.componentInstance.opt1 = "Oui";
      mod.componentInstance.opt2 = "Non";
      mod.result.then(result=>{
        //  Si l'utilisateur valide, alors supprimeme le médicamment et retour à la liste des médicamments
        if(result){
          this.medicamentsService.supprimerMedicament(this.nouveauMedicament.nom);
          this.router.navigate(["/app-medicaments"]);
        }
      })
    }
  }

  /**
   * Fonction de retour à la liste de médicamments avec boite de dialogue de confirmation
   */
  annuler(): void {
    // Création d'une boite de dialogue
    const mod = this.dialogBox.open(DialogComponent);
    // Configuration de la boite d edialogue
    mod.componentInstance.message = "Êtes-vous sûre de vouloir annuler vos modifications? Toute progression non sauvegardée sera perdu.";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      // Si l'utilisateur valide, alors retour à la lite des médicamments
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
