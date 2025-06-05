import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';
import { SortiesService } from '../../services/sorties.service';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';

@Component({
  standalone: true,
  selector: 'app-infos',
  imports: [CommonModule],
  templateUrl: './infos.component.html',
  styleUrl: './infos.component.css'
})
export class InfosComponent implements OnInit{
  // Activation du mod nuit
  isDarkMode: boolean = false;

  // Activation de lasynthèse vocale
  narrateur: boolean = true;

  parametresSubscription: Subscription | undefined;

  // Liste des informtions affichées 
  infosList:Array<any>=[];

  // En cours d'initialisation es informatons
  nbAffichage:Array<boolean>=[true];

  // Nombre d'informations à afficher
  nbArticle = 5;

  // Numéro de la catégorie affichée
  numCategorie = -1;

  // Noms et numéros des catégories
  nomsCategories =[
    {nom: "Actualités", num: 0},
    {nom: "Aménagements", num: 1},
    {nom: "Loisirs", num: 2},
    {nom: "Alimentation", num: 3},
    {nom: "Aides", num: 4}
  ];

  /**
   * Constructeur
   * @param botService 
   * @param sortieService 
   * @param parametresService 
   * @param syntheseService 
   */
  constructor(
    private botService:ChatbotService,
    private sortieService:SortiesService,
    private parametresService:ParametresService,
    private syntheseService:SyntheseVocaleService
  ){}

  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });

    // Ajout de nouveau articles
    this.ajoutArticle(0);
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  /**
   * @param num de la catégorie
   * @returns du nom de la classe en fonction du numéro de la catégorie en paramètres effectifs
   */
  catNom(num:number){
    return "categorie"+num;
  }

  /**
   * Ajout du loisir affiché sous la forme d'article à la liste des loisirs
   * @param loisir 
   */
  participerSortie(loisir:any){
    this.sortieService.ajouterSortie(loisir);
  }

  /**
   * Ajout de nouveau articles
   * @param nbRefresh numéro de l'affichage en cours depuis le début de la session
   * @returns 
   */
  async ajoutArticle(nbRefresh:number){
    // Délai d'attente pour éviter les erreurs avec e'api de Mistral
    await delayPerso(1000);

    // Tant que l'on a pas atteint le nombre d'articles max à afficher on continu
    if(this.infosList.length<this.nbArticle){
      try{
        // Récupérration des informations d ela catégorie courante (demande + numéro)
        let infosCategorie = this.botService.getDemandeInfos(this.numCategorie);

        // Envi de la demande au bot
        this.botService.envoi(infosCategorie.demande).subscribe(
          reponse=>{
            try {
              // Récupérration de la réponse
              const desc = Object.getOwnPropertyDescriptor(reponse,"choices");
              let result:string = desc?.value[0].message.content;
              result=result.substring(result.indexOf("{"),result.lastIndexOf("}")+1);

              // Si l'affichage n'a pas était coupé 
              if(this.nbAffichage[nbRefresh]){
                // Envoi au bot des ifnormations propres à l'information
                this.botService.addReponse(result);

                let result_parse = JSON.parse(result);
                result_parse.numCategorie = infosCategorie.num;

                // Si l'information n'est pas déjà affichée l'ajouter à l'affichage
                if(!this.containsTitle(result_parse.title,result_parse.numCategorie)){
                  this.infosList.push(result_parse);

                  // Si le narrateur est activé lire le titre de l'information 
                  if(this.narrateur){
                    this.syntheseService.parler(result_parse.title)
                  }
                }
                
                this.ajoutArticle(nbRefresh);
              }
              return;
            } catch (err) {
              console.log(err)
            }

            // Si l'affichage est toujours en cours ajouter un nouvel article
            if(this.nbAffichage[nbRefresh]){
              this.ajoutArticle(nbRefresh);
            }
          }
        );
        return;
      }catch(err){
        console.log(err)
      }

      // Si l'affichage est toujours en cours ajouter un nouvel article
      if(this.nbAffichage[nbRefresh]){
        this.ajoutArticle(nbRefresh);
      }
    }
  }

  /**
   * @param title de l'article
   * @param num 
   * @returns vrai si le titre existe déjà, false sinon
   */
  containsTitle(title:string, num:number){
    let i = 0, find = false;

    while(i<this.infosList.length && !find){
      if(this.infosList[i].title == title){
        find = true;
      }
      i++;
    }

    return find;
  }

  /**
   * Changement de catégorie
   * @param categorie numéro de la nouvelle catégorie en cours
   */
  changeCategorie(categorie:number){
    // Couper l'affichage en cours
    this.nbAffichage[this.nbAffichage.length-1] = false;
    
    document.getElementById("categorie"+this.numCategorie)?.classList.remove(this.isDarkMode?"use-nuit":"use-jour");
    this.numCategorie = categorie;
    document.getElementById("categorie"+this.numCategorie)?.classList.add(this.isDarkMode?"use-nuit":"use-jour");

    // Retirer lesarticles affichés
    this.infosList = [];

    // Effectuer l'affichage de nouveaux articles 
    this.nbAffichage.push(true);
    this.ajoutArticle(this.nbAffichage.length-1);
  }

  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  /**
   * @param all 
   * @returns changement de la classe du menu des catégories en fonction de l'activation du mod nuit
   */
  getCategorieClass(all:boolean){
    return all ? (this.isDarkMode ? 'use-nuit categorie categorie-nuit'
      : 'use-jour categorie categorie-jour')
      : (this.isDarkMode ? 'categorie categorie-nuit'
      : 'categorie categorie-jour');
  }

  /**
   * @returns le nom de la classe de style a appliqué sur la bare de défilement en fonction de l'activation du mod nuit
   */
  getFNClass(){
    return this.isDarkMode ? 'fn fn-nuit' : 'fn fn-jour';
  }
}

/**
 * @param delay à attendre
 * @returns 
 */
function delayPerso(delay:number) {
    return new Promise(r=>{
      setTimeout(r,delay);
    })
  }
