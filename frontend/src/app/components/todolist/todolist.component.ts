import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListesService } from '../../services/listes.service';
import { CommonModule } from '@angular/common';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';

@Component({
  standalone: true,
  selector: 'app-todolist',
  imports: [RouterLink, CommonModule],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css'
})
export class TodolistComponent implements OnInit{
  // Noms donnés aux rappels
  nomDesListes=[];

  // Activation du narrateur
  narrateur: boolean = true;

  parametresSubscription: Subscription | undefined;

  /**
   * Constructeur
   * @param service propre aux listes
   * @param parametresService 
   * @param synthese 
   */
  constructor(private service:ListesService,
              private parametresService: ParametresService,
              private synthese: SyntheseVocaleService
  ){}

  /**
   * Initialisation des noms de liste et du narrateur
   */
  ngOnInit(): void {
    this.refreshListe();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });
    
    // Si le narrateur est activé, lire les noms des lsites
    if (this.narrateur){
      for(let i of this.nomDesListes){
        this.synthese.parler(i);
      }
    }
  }

  /**
   * Récupérration des noms des listes
   */
  refreshListe(){
    this.nomDesListes = this.service.chargerNomsListes();
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }
}
