import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListesService } from '../../services/listes.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';

@Component({
  standalone: true,
  selector: 'app-liste',
  imports: [FormsModule, CommonModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
})
export class ListeComponent implements OnInit {
  // Titre du rappel
  titre = '';

  ajoutTitre = '';

  // Contenu du rappel 
  liste = '';
  
  nouvelleListe!: boolean;
  creationCourante = false;

  // Activation du narrateur
  narrateur: boolean = true;
  parametresSubscription: Subscription | undefined;

  /**
   * Constructeur
   * @param service 
   * @param route 
   * @param router 
   * @param dialogBox 
   * @param parametresService 
   * @param syntheseService 
   */
  constructor(
    private service: ListesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: NgbModal,
    private parametresService:ParametresService,
    private syntheseService:SyntheseVocaleService
  ) { }

  ngOnInit() {
    // Récuppérration du titre dans l'URL
    this.titre = this.route.snapshot.paramMap.get('nom')!;

    // Vérifier s'il s'agit d'un nouveau rappel
    this.nouvelleListe = this.titre == '' || this.titre == null;
    this.liste = this.service.charger(this.titre);

    // Vérifier si le narrateur est activé dans les paramètres
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });

    // Si le narrateur est activé lire le conteu du rappel
    if(this.narrateur){
      this.syntheseService.parler(this.liste);
    }
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  enregistrer() {
    if (this.titre != "" && this.titre != null) {
      if (this.ajoutTitre != this.titre) {
        this.creationCourante = false;
      }
      const exist = this.service.enregistrer(this.liste, this.titre, this.nouvelleListe, this.creationCourante);

      this.creationCourante = exist == 3 ? true : false;
      if (this.creationCourante) {
        this.ajoutTitre = this.titre;
      }

      // Si le titre est déjà utilisé
      if (exist == 1) {
        // Ouverture du'ne nouvelle boite de dialogue
        const mod = this.dialogBox.open(DialogComponent);

        // Configuration de la boite de dialogue
        mod.componentInstance.message = "Vous possédez déjà une liste du même titre. Veuillez changer de titre.";
        mod.componentInstance.opt1 = "Ok";
      }
    // S'il n'y a pas de titre afficher un message d'erreur
    } else {
      // Ouverture d'une nouvelle boite de dialogue
      const mod = this.dialogBox.open(DialogComponent);

      // Configuration de la boite de dialogue
      mod.componentInstance.message = "Veuillez saisir un titre pour votre liste.";
      mod.componentInstance.opt1 = "Ok";
    }
  }

  /**
   * Suppression du rappel, avec message de confirmation par boite de dialogue
   */
  supprimer() {
    // Ouverture d'une nouvelle boite de dialogue
    const mod = this.dialogBox.open(DialogComponent);

    //Configuration de la boite de dialogue
    mod.componentInstance.message = "Voulez-vous vraiment supprimer la liste " + this.titre+" ?";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      // Si on valide:
      // - Suppression du rappel
      // - Retour à la liste des rappels
      if(result){
        this.service.supprimer(this.titre);
        this.router.navigate(["/app-todolist"]);
      }
    })
  }

  /**
   * Annuler les modifications apportées au rappel, avec message de confirmation par boite de dialogue
   */
  annuler() {
    // Ouverture de la boite d edialogue
    const mod = this.dialogBox.open(DialogComponent);

    //Configuration de la boite de dialogue
    mod.componentInstance.message = "Êtes-vous sûre de vouloir annuler vos modifications? Toute progression non sauvegardée sera perdu.";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      // Si on valide on retourne sur la liste des rappels
      if(result){
        this.router.navigate(["/app-todolist"]);
      }
    })
  }
}
