import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Composant de boite de dialogue personnalisable
 */
@Component({
  selector: 'app-dialog',
  imports: [CommonModule,FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  /** Message affiché dans la boite de dialogue */
  @Input() message = '';

  /** Bouton de la boite de dialogue pour la validation */
  @Input() opt1 = '';

  /** Bouton de la boite de dialogue pour l'annulation */
  @Input() opt2 = '';

  /** Présence de zones de saisie */
  @Input() textField = false;

  /** Spécifique à l'ajout d'un nouveau contact */
  /** Nom du nouveau contact */
  nom:string = "";
  /** Adresse mail du nouveau contact */
  mail:string = "";
  /** Numéro de téléphone du nouveau contact */
  telephone:string = "";

  /**
   * Constructeur
   * @param activeModal référence à la fenêtre ouverte
   */
  constructor(public activeModal:NgbActiveModal){}

  /**
   * Vérification de la validité des saisies
   * @param field identité de la zone à vérifiée
   * @returns true si valide, false sinon
   */
  valid(field:string){
    let f = document.getElementById(field) as HTMLInputElement;
    return f.validity.valid;
  }

  /**
   * La fonction de résultat renvoie :
   * - @param opt s'il ne s'agissait pas de l'ajout d'un nouvel utilisateur
   * - Un nouvel utilisateur si @param opt = true
   * - False sinon
   * @param opt true si l'utilisateur a cliqué sur le bouton de validation, false sinon
   */
  result(opt:boolean){
    // S'il yu a des zones de saisie
    if(this.textField){
      // Si l'utilisateur clique sur le bouton 2 alors ferme la boite de dialogue
      if(!opt){
        this.activeModal.close({opt:opt});
      // Sinon 
      }else{
        // On vérifie la validité des zones de saisie
        if(this.valid("nom")
        && this.valid("mail")
        && this.valid("telephone")){
          // On ferme la boite de dialogue et on renvoi les informations saisies
          this.activeModal.close({
            opt:opt,
            nom:this.nom,
            mail:this.mail,
            telephone:this.telephone
          });
        }
      }
    // Sinon ferme la boite de dialogue et on renvoi true si l'utilistaeur choisit le premier bouton, false sinon
    }else{
      this.activeModal.close(opt)
    }
  }
}
