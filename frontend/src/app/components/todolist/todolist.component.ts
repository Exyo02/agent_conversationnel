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
  nomDesListes=[];
  narrateur: boolean = true;
  parametresSubscription: Subscription | undefined;

  constructor(private service:ListesService,
              private parametresService: ParametresService,
              private synthese: SyntheseVocaleService
  ){}

  ngOnInit(): void {
    this.refreshListe();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });
    if (this.narrateur){
      for(let i of this.nomDesListes){
        this.synthese.parler(i);
      }
    }
  }

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
