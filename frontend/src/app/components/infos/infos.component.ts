import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';
import { SortiesService } from '../../services/sorties.service';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-infos',
  imports: [CommonModule],
  templateUrl: './infos.component.html',
  styleUrl: './infos.component.css'
})
export class InfosComponent implements OnInit{
  isDarkMode: boolean = false;
  parametresSubscription: Subscription | undefined;
    
  infosList:Array<any>=[];
  loisirsList:Array<any>=[];
  nbAffichage:Array<boolean>=[true];
  nbArticle = 5;
  numCategorie = -1;

  constructor(
    private botService:ChatbotService,
    private sortieService:SortiesService,
    private parametresService:ParametresService
  ){}

  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });
    this.ajoutArticle(0);
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  participerSortie(loisir:any){
    this.sortieService.ajouterSortie(loisir);
  }

  async ajoutArticle(nbRefresh:number){
    await delayPerso(1000);
    if((this.infosList.length+this.loisirsList.length)<this.nbArticle){
      try{
        let infosCategorie = this.botService.getDemandeInfos(this.numCategorie)
        this.botService.envoi(infosCategorie.demande).subscribe(
          reponse=>{
            try {
              const desc = Object.getOwnPropertyDescriptor(reponse,"choices");
              let result:string = desc?.value[0].message.content;
              result=result.substring(result.indexOf("{"),result.lastIndexOf("}")+1);
              if(this.nbAffichage[nbRefresh]){
                let result_parse = JSON.parse(result);
                if(infosCategorie.num==2 && !this.containsTitle(result_parse.nom,true)){
                  this.loisirsList.push(result_parse);
                }else if(!this.containsTitle(result_parse.title,false)){
                  this.infosList.push(result_parse);
                }
                this.ajoutArticle(nbRefresh);
              }
              return;
            } catch (err) {
              console.log(err)
            }
            if(this.nbAffichage[nbRefresh]){
              this.ajoutArticle(nbRefresh);
            }
          }
        );
        return;
      }catch(err){
        console.log(err)
      }
      if(this.nbAffichage[nbRefresh]){
        this.ajoutArticle(nbRefresh);
      }
    }
  }

  containsTitle(title:string,loisir:boolean){
    let i = 0, find = false;
    if(loisir){
      while(i<this.loisirsList.length && !find){
        if(this.loisirsList[i].nom == title){
          find = true;
        }
        i++;
      }
    }else{
      while(i<this.infosList.length && !find){
        if(this.infosList[i].title == title){
          find = true;
        }
        i++;
      }
    }
    
    return find;
  }
  
  changeCategorie(categorie:number){
    this.nbAffichage[this.nbAffichage.length-1] = false;
    this.nbAffichage.push(true);
    document.getElementById("categorie"+this.numCategorie)?.classList.remove(this.isDarkMode?"use-nuit":"use-jour");
    this.numCategorie = categorie;
    document.getElementById("categorie"+this.numCategorie)?.classList.add(this.isDarkMode?"use-nuit":"use-jour");
    this.infosList = [];
    this.loisirsList = [];
    
    this.ajoutArticle(this.nbAffichage.length-1);
  }

  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  getCategorieClass(all:boolean){
    return all ? (this.isDarkMode ? 'use-nuit categorie categorie-nuit' 
      : 'use-jour categorie categorie-jour')
      : (this.isDarkMode ? 'categorie categorie-nuit' 
      : 'categorie categorie-jour');
  }
  getFNClass(){
    return this.isDarkMode ? 'fn fn-nuit' : 'fn fn-jour';
  }
}

function delayPerso(delay:number) {
    return new Promise(r=>{
      setTimeout(r,delay);
    })
  }
