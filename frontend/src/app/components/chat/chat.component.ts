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

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  currentText = '';
  botAnswer='';
  messages: Array<any> = [];
  ecouteEnCours:boolean;
  narrateur: boolean = true;
  parametresSubscription: Subscription | undefined;
  
  constructor(
    private service:ChatbotService,
    private router:Router,
    private listService:ListesService,
    private recVocaleService:ReconnaissanceVocaleService,
    private syntheseService:SyntheseVocaleService,
    private parametresService:ParametresService){
      this.ecouteEnCours = false;
  }

  ngOnInit(): void {
    let entree = document.getElementById("saisie");
    entree?.addEventListener("keydown",(key)=>{
      if (key.key == "Enter"){
        this.envoyer()
      }else if (key.key == "+"){
        key.preventDefault();
        this.ecoute();
      }
    })
    entree?.focus();

    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if(params && params.modeNarrateur !== undefined){
        this.narrateur = params.modeNarrateur;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  ecoute(){
    if(this.ecouteEnCours){
      this.ecouteEnCours = false;
      this.recVocaleService.stop();
    } else {
      this.ecouteEnCours = true;
      this.recVocaleService.start().then(
        (result:string)=>{
          this.currentText = result;
          this.ecouteEnCours = false;
          this.envoyer();
        },
        (error:string)=>{
          this.ecouteEnCours = false;
          console.log(error);
        }
      )
    }
  }

  envoyer(){
    if(this.currentText == null || this.currentText == ""){
      return;
    }

    this.service.envoi(this.currentText).subscribe(
      reponse=>{
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
          let result=JSON.parse(answer.substring(answer.indexOf("{"),answer.lastIndexOf("}")+1));
          let contenu = result.content;
          let titre = result.title;

          this.listService.enregistrer(contenu,titre,true,true);
          if(window.location.toString().endsWith("/app-todolist")){
            window.location.reload();
          }else{
            this.router.navigate(['/app-todolist']);
          }
        }else{
          this.botAnswer = answer;
          if(this.narrateur){
            this.syntheseService.parler(answer);
          }
          param = 1;
        }

        this.service.addReponse(answer);
        this.refresh(param);
      }
    );
  }
  
  refresh(param:number){
    this.messages.push({role:'user',content: this.currentText});
    if(param == 1){
      this.messages.push({role: 'assistant',content: this.botAnswer});
    }
    this.currentText = "";
  }
  
  getRecVocClass(){
    return this.ecouteEnCours?"rec-voc-en-cours":"rec-voc";
  }
}
