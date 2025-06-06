import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { Router } from '@angular/router';
import { ListesService } from '../../services/listes.service';
import { ReconnaissanceVocaleService } from '../../services/reconnaissance-vocale.service';
import { OnInit } from '@angular/core';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * Composant permettant la conversaton avec le Bot
 * Par le biais de l'écrit et de loral
 */
@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  /** Zone de saisie */
  currentText = '';

  /** Dernière réponse du bot */
  botAnswer='';
  
  /** Liste des messages de la conversation */
  messages: Array<any> = [];

  /** Reconnaissance vocale activée */
  ecouteEnCours:boolean;

  /** Synthèse vocale activée */
  narrateur: boolean = true;

  parametresSubscription: Subscription | undefined;
  
  /**
   * Constructeur
   * @param service du chatbot
   * @param router 
   * @param listService
   * @param recVocaleService 
   * @param syntheseService 
   * @param parametresService 
   */
  constructor(
    private service:ChatbotService,
    private router:Router,
    private listService:ListesService,
    private recVocaleService:ReconnaissanceVocaleService,
    private syntheseService:SyntheseVocaleService,
    private parametresService:ParametresService){
      this.ecouteEnCours = false;
  }

  /**
   * - Focus sur la zone de saisie
   * - Configuration de la zone de saisie
   * - Lien avec les paramètres
   */
  ngOnInit(): void {
    let entree = document.getElementById("saisie");
    entree?.addEventListener("keydown",(key)=>{
      /** Pressez "Enter" pour envyer un message au bot */
      if (key.key == "Enter"){
        this.envoyer()
      /** Pressez "+" pour activer la reconnaissance vocale */
      }else if (key.key == "+"){
        key.preventDefault();
        this.ecoute();
      }
    })
    /** Focus à l'initialisation sur la zone de saisie du chatbot */
    entree?.focus();

    /** Vérification de l'activation du narrateur */
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });
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
   * Utilisation de la reconnaissance vocale
   */
  ecoute(){
    // Arrêt de la reconnaissance vocale lorsque l'on presse le bouton "+" si elle est déjà activée
    if(this.ecouteEnCours){
      this.ecouteEnCours = false;
      this.recVocaleService.stop();
    // Démarrage de la reconnaissance vocale lorsque l'on presse le bouton "+" si elle n'est pas activée
    } else {
      this.ecouteEnCours = true;
      this.recVocaleService.start().then(
        (result:string)=>{
          this.currentText = result;
          this.ecouteEnCours = false;
          
          // Envoi de la réponse
          this.envoyer();
        },
        (error:string)=>{
          this.ecouteEnCours = false;
          console.log(error);
        }
      )
    }
  }

  /**
   * Envoi au chatbot + traitement de la réponse
   * @returns 
   */
  envoyer(){
    // Si la zone de saisie est vide ne rien envoyer
    if(this.currentText == null || this.currentText == ""){
      return;
    }

    this.service.envoi(this.currentText).subscribe(
      reponse=>{
        // Récupérration de la réponse
        const desc = Object.getOwnPropertyDescriptor(reponse,"choices");
        let answer = desc?.value[0].message.content;

        let param = 0;
        if(answer.includes("app-infos")){
          this.router.navigate(['/app-infos']);
        }else if(answer.includes("app-medicaments")){
          this.router.navigate(['/app-medicaments']);
        }else if(answer.includes("app-agenda")){
          this.router.navigate(['/app-agenda']);
        }else if(answer.includes("app-contacts")){
          this.router.navigate(['/app-contacts']);
        }else if(answer.includes("app-todolist")){
          this.router.navigate(['/app-todolist']);
        }else if(answer.includes("add-list")){
          // Récupérration des informations du nouveau rappel dans la réponse
          let result=JSON.parse(answer.substring(answer.indexOf("{"),answer.lastIndexOf("}")+1));
          let contenu = result.content;
          let titre = result.title;

          // Enregistrement du nouveau rappel
          this.listService.enregistrer(contenu,titre,true,true);

          // Si on est déjà dans l'onglet rappels raffraichir la page
          if(window.location.toString().endsWith("/app-todolist")){
            window.location.reload();
          // Sinon rejoindre l'onglet rappels
          }else{
            this.router.navigate(['/app-todolist']);
          }
        // Réponse sans  contenu spécifique
        }else{
          this.botAnswer = answer;
          // Si la synthèse vocale esst activée dans les paramètres lire la réponse du bot
          if(this.narrateur){
            this.syntheseService.parler(answer);
          }
          param = 1;
        }

        // Informer le service de la réponse du bot
        this.service.addReponse(answer);

        this.refresh(param);
      }
    );
  }
  
  /**
   * Permet d'afficher la conversation et de vider la zone de saisie
   * @param param configure la réponse du bot si égale à 1 on l'affiche, sinon non
   */
  refresh(param:number){
    // Affichage du message de l'utilisateur dans la liste
    this.messages.push({role:'user',content: this.currentText});
    // Affichage de la réponse du bot, si elle ne contient pas de contenu spécifique
    if(param == 1){
      this.messages.push({role: 'assistant',content: this.botAnswer});
    }

    // Raffraichir la zone de saisie
    this.currentText = "";
  }
  
  /**
   * Visualisation de l'activation de la reconnaissance vocale
   * @returns la classe utilisée par le bouton de reconnaissance vocale en fonction de l'utilisation de cette dernière
   */
  getRecVocClass(){
    return this.ecouteEnCours?"rec-voc-en-cours":"rec-voc";
  }
}
