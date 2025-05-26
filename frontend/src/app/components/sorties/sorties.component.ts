import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SortiesService, Sortie } from '../../services/sorties.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../../dialog/dialog.component';


@Component({
  standalone:true,
  selector: 'app-sorties',
  imports: [FormsModule, CommonModule],
  templateUrl: './sorties.component.html',
  styleUrl: './sorties.component.css'
})

export class Sorties implements OnInit {
  sorties: Sortie[] = [];
  estNouvelle = true;
  nouvelleSortie: Sortie = {
    nom: '',
    date: null,
    heureDebut: '',
    adresse: ''
  };

  constructor(
    private SortiesService: SortiesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: NgbModal
  ) {}

  ngOnInit(): void {
    const nomParam = this.route.snapshot.paramMap.get('nom');
    if (nomParam) {
      this.estNouvelle = false;
      const sortieExistante = this.SortiesService.chargerSortie(nomParam);
      if (sortieExistante) {
        this.nouvelleSortie = { ...sortieExistante };
      }
    } else {
      this.estNouvelle = true;
      this.nouvelleSortie = { nom: '', date: null, heureDebut: '' };
    }
  }

  modifierSortie(nom: string): void {
    this.router.navigate(['/app-sorties', { nom: nom }]);
  }

  enregistrer(): void {
    if (!this.nouvelleSortie.nom) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'Le nom de la sortie est obligatoire.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    if (!this.nouvelleSortie.date) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'La date de la sortie est obligatoire.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    this.SortiesService.ajouterSortie(this.nouvelleSortie);
  }

  supprimer(): void {
    if (this.nouvelleSortie.nom) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = `Êtes-vous sûr de vouloir supprimer ${this.nouvelleSortie.nom} ?`;
      mod.componentInstance.opt1 = "Oui";
      mod.componentInstance.opt2 = "Non";
      mod.result.then(result=>{
        if(result){
          this.SortiesService.supprimerSortie(this.nouvelleSortie.nom);
          this.router.navigate(["/app-sorties"]);
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
        this.router.navigate(["/app-sorties"]);
      }
    })
  }

  reinitialiserFormulaire(): void {
    this.nouvelleSortie = { nom: '', date: null, heureDebut: '', adresse: '' };
    this.estNouvelle = true;
  }
}
