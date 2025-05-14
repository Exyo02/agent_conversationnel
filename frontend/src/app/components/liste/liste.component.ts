import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListesService } from '../../services/listes.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  standalone: true,
  selector: 'app-liste',
  imports: [FormsModule, CommonModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
})
export class ListeComponent implements OnInit {
  titre = '';
  ajoutTitre = '';
  liste = '';
  nouvelleListe!: boolean;
  creationCourante = false;

  constructor(
    private service: ListesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogBox: NgbModal
  ) { }
  ngOnInit() {
    this.titre = this.route.snapshot.paramMap.get('nom')!;
    this.nouvelleListe = this.titre == '' || this.titre == null;
    this.liste = this.service.charger(this.titre);
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
      if (exist == 1) {
        const mod = this.dialogBox.open(DialogComponent);
        mod.componentInstance.message = "Vous possédez déjà une liste du même titre. Veuillez changer de titre.";
        mod.componentInstance.opt1 = "Ok";
      }
    } else {
      const mod = this.dialogBox.open(DialogComponent);
      mod.componentInstance.message = "Veuillez saisir un titre pour votre liste.";
      mod.componentInstance.opt1 = "Ok";
    }
  }

  supprimer() {
    const mod = this.dialogBox.open(DialogComponent);
    mod.componentInstance.message = "Voulez-vous vraiment supprimer la liste " + this.titre+" ?";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      if(result){
        this.service.supprimer(this.titre);
        this.router.navigate(["/app-todolist"]);
      }
    })
  }

  annuler() {
    const mod = this.dialogBox.open(DialogComponent);
    mod.componentInstance.message = "Êtes-vous sûre de vouloir annuler vos modifications? Toute progression non sauvegardée sera perdu.";
    mod.componentInstance.opt1 = "Oui";
    mod.componentInstance.opt2 = "Non";
    mod.result.then(result=>{
      if(result){
        this.router.navigate(["/app-todolist"]);
      }
    })
  }
}
