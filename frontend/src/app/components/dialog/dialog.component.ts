import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule,FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  @Input() message = '';

  // Les deux boutons de la boite de dialogue
  @Input() opt1 = '';
  @Input() opt2 = '';

  //Zones de saisie
  @Input() textField = false;
  nom:string = "";
  mail:string = "";
  telephone:string = "";

  /**
   * Constructeur
   * @param activeModal 
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
