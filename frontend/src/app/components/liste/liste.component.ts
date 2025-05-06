import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListesService } from '../../services/listes.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private service:ListesService,
    private route: ActivatedRoute,
    private router: Router){}
    
  ngOnInit(){
    this.titre = this.route.snapshot.paramMap.get('nom')!;
    this.nouvelleListe = this.titre == '' || this.titre == null;
    this.liste = this.service.charger(this.titre);
    console.log(this.nouvelleListe)
  }

  enregistrer(){
    if (this.titre != "" && this.titre != null){
      if(this.ajoutTitre != this.titre){
        this.creationCourante = false;
      }
      const exist = this.service.enregistrer(this.liste,this.titre,this.nouvelleListe,this.creationCourante);

      this.creationCourante = exist==3?true:false;
      if (this.creationCourante) {
        this.ajoutTitre = this.titre;
      }
      if (exist == 1){
        alert("Vous possédez déjà une liste du même titre. Veuillez changer de titre.");
      }
    } else {
      alert("Veuillez saisir un titre pour votre liste.");
    }
  }

  supprimer(){
    let confirmation = confirm("Voulez-vous vraiment supprimer la liste "+this.titre);

    if (confirmation){
      this.service.supprimer(this.titre);
      this.router.navigate(["/app-todolist"]);
    }
  }

  annuler(){
    let confirmation = confirm("Êtes-vous sûre de vouloir annuler vos modifications? Toute progression non sauvegardée sera perdu.");

    if (confirmation){
      this.router.navigate(["/app-todolist"]);
    }
  }
}
