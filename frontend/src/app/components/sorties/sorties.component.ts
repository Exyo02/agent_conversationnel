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

/**
 * Composant utilisé pour les pages détaillant 
 * les informations d'une sortie spécifique, 
 * et permettant de les modifier
 */
@Component({
  standalone:true,
  selector: 'app-sorties',
  imports: [FormsModule, CommonModule],
  templateUrl: './sorties.component.html',
  styleUrl: './sorties.component.css'
})
export class Sorties implements OnInit {
  /** Sortie existante? */
  estNouvelle = true;

  /** Activation de la sythèse vocale */
  narrateur: boolean = true;

  parametresSubscription: Subscription | undefined;
  nouvelleSortie: Sortie = {
    title: '',
    date: null,
    heureDebut: '',
    adresse: ''
  };

  /**
   * Constructeur
   * @param SortiesService 
   * @param route 
   * @param router 
   * @param dialogBox 
   * @param parametresService 
   * @param syntheseService 
   */
  constructor(
    private SortiesService: SortiesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: NgbModal,
    private parametresService:ParametresService,
    private syntheseService:SyntheseVocaleService
  ) {}

  ngOnInit(): void {
    // Récupère l'identifiant de la sortie dans l'URL
    const nomParam = this.route.snapshot.paramMap.get('title');

    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });

    // Si la sortie est stockée
    if (nomParam) {
      this.estNouvelle = false;

      // On récupère les informations de la sortie
      const sortieExistante = this.SortiesService.chargerSortie(nomParam);
      if (sortieExistante) {
        this.nouvelleSortie = { ...sortieExistante };

        // Si le narrateur est activé, il lit ls informations propres à la sortie
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
    // Sinon les informations de la sortie sont à saisir par l'utilisateur
    } else {
      this.estNouvelle = true;
      this.nouvelleSortie = { title: '', date: null, heureDebut: '' };
    }
  }

  /**
   * Libération des ressources propre à l'abonnement au service des paramètres
   */
  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  /**
   * Enregistrement de la sortie
   * @returns 
   */
  enregistrer(): void {
    // Si l'utilisateur ne spécifie pas le titre, on affiche un message d'erreur
    if (!this.nouvelleSortie.title) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'Le titre de la sortie est obligatoire.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    // Si l'utilisateur ne spécifie pas la date, on affiche un message d'erreur
    if (!this.nouvelleSortie.date) {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = 'La date de la sortie est obligatoire.';
      mod.componentInstance.opt1 = "Ok";
      return;
    }

    // Stockage de la sortie
    this.SortiesService.ajouterSortie(this.nouvelleSortie);
  }

  /**
   * Suppression de la sortie, avec boite de dialogue de confirmation
   */
  supprimer(): void {
    // Si la sortie a un nom
    if (this.nouvelleSortie.title) {
      // Création d'une boie de dialogue
      const mod = this.dialogBox.open(DialogComponent);
      // Configuration de la boite de dialogue
      mod.componentInstance.message = `Êtes-vous sûr de vouloir supprimer ${this.nouvelleSortie.title} ?`;
      mod.componentInstance.opt1 = "Oui";
      mod.componentInstance.opt2 = "Non";
      mod.result.then(result=>{
        // Si l'utilisateur valide, alors on supprime la sortie et rejoins la pge de liste des sortis
        if(result){
          this.SortiesService.supprimerSortie(this.nouvelleSortie.title);
          this.router.navigate(["/app-sorties"]);
        }
      })
    }
  }

  /**
   * Annuler les modifications apportées, avec boite dedialogue de confirmation
   */
  annuler(): void {
    // Création d'une boite de dialogue
    const mod = this.dialogBox.open(DialogComponent);

    // Configuration de lal boite de dialogue
    mod.componentInstance.message = "Êtes-vous sûre de vouloir annuler vos modifications? Toute progression non sauvegardée sera perdu.";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      // Sil'utilisatuer valide, on rejoins la pagede liste des sorties
      if(result){
        this.router.navigate(["/app-sorties"]);
      }
    })
  }

  /**
   * Vide l'ensemble des zones de saisie
   */
  reinitialiserFormulaire(): void {
    this.nouvelleSortie = { title: '', date: null, heureDebut: '', adresse: '' };
    this.estNouvelle = true;
  }
}
