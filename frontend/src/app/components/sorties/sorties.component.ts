import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SortiesService, Sortie } from '../../services/sorties.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';


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
  narrateur: boolean = true;
  parametresSubscription: Subscription | undefined;
  nouvelleSortie: Sortie = {
    title: '',
    date: null,
    heureDebut: '',
    adresse: ''
  };

  constructor(
    private SortiesService: SortiesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: NgbModal,
    private parametresService:ParametresService,
    private syntheseService:SyntheseVocaleService
  ) {}

  ngOnInit(): void {
    const nomParam = this.route.snapshot.paramMap.get('title');
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });
    if (nomParam) {
      this.estNouvelle = false;
      const sortieExistante = this.SortiesService.chargerSortie(nomParam);
      if (sortieExistante) {
        this.nouvelleSortie = { ...sortieExistante };
        if(this.narrateur){
          let message = this.nouvelleSortie.title + 
          " le "+this.nouvelleSortie.date+" à "+
          this.nouvelleSortie.heureDebut;
          message = message.concat(this.nouvelleSortie.adresse!=""
                          ?" à l'adresse "+this.nouvelleSortie.adresse
                          :"")
          this.syntheseService.parler(message);
        }
      }
    } else {
      this.estNouvelle = true;
      this.nouvelleSortie = { title: '', date: null, heureDebut: '' };
    }
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  modifierSortie(title: string): void {
    this.router.navigate(['/app-sorties', { title: title }]);
  }

  enregistrer(): void {
    if (!this.nouvelleSortie.title) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'Le titre de la sortie est obligatoire.';
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
    if (this.nouvelleSortie.title) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = `Êtes-vous sûr de vouloir supprimer ${this.nouvelleSortie.title} ?`;
      mod.componentInstance.opt1 = "Oui";
      mod.componentInstance.opt2 = "Non";
      mod.result.then(result=>{
        if(result){
          this.SortiesService.supprimerSortie(this.nouvelleSortie.title);
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
    this.nouvelleSortie = { title: '', date: null, heureDebut: '', adresse: '' };
    this.estNouvelle = true;
  }
}
