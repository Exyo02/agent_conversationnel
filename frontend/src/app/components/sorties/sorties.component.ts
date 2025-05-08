import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SortiesService, Sortie } from '../../services/sorties.service';
import { Location } from '@angular/common';


@Component({
  standalone:true,
  selector: 'app-sorties',
  imports: [FormsModule, CommonModule],
  templateUrl: './sorties.component.html',
  styleUrl: './sorties.component.css'
})

export class Sorties implements OnInit {
  sorties: Sortie[] = [];
  afficherFormulaire = false;
  estNouvelle = true;
  nouvelleSortie: Sortie = {
    nom: '',
    duree: null,
    date: null,
    heureDebut: '',
    adresse: ''
  };

  constructor(
    private SortiesService: SortiesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
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
      this.nouvelleSortie = { nom: '', duree: null, date: null, heureDebut: '' };
    }
  }

  chargerSorties(): void {
    this.sorties = this.SortiesService.getAllSorties();
  }

  ajouterNouvelleSortie(): void {
    this.afficherFormulaire = true;
    this.estNouvelle = true;
    this.reinitialiserFormulaire();
  }

  modifierSortie(nom: string): void {
    this.router.navigate(['/app-sorties', { nom: nom }]);
  }

  enregistrer(): void {
    if (!this.nouvelleSortie.nom) {
      alert('Le nom de la sortie est obligatoire.');
      return;
    }

    if (this.nouvelleSortie.duree === null || this.nouvelleSortie.duree <= 0) {
      alert('La durée de la sortie doit être supérieure à 0.');
      return;
    }

    if (!this.nouvelleSortie.date) {
      alert('La date de la sortie est obligatoire.');
      return;
    }

    this.SortiesService.ajouterSortie(this.nouvelleSortie);
    this.afficherFormulaire = false;
    this.chargerSorties();
    this.location.back();
  }

  supprimer(): void {
    if (this.nouvelleSortie.nom && confirm(`Êtes-vous sûr de vouloir supprimer ${this.nouvelleSortie.nom} ?`)) {
      this.SortiesService.supprimerSortie(this.nouvelleSortie.nom);
      this.afficherFormulaire = false;
      this.chargerSorties();
      this.location.back();
    }
  }

  annuler(): void {
    this.afficherFormulaire = false;
    this.reinitialiserFormulaire();
    this.location.back();
  }

  reinitialiserFormulaire(): void {
    this.nouvelleSortie = { nom: '', duree: null, date: null, heureDebut: '', adresse: '' };
    this.estNouvelle = true;
  }
}
