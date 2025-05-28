import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { Router } from '@angular/router';
import { ListesService } from '../../services/listes.service';
import { ReconnaissanceVocaleService } from '../../services/reconnaissance-vocale.service';
import { OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  currentText = '';
  userText='';
  botAnswer='';
  ecouteEnCours:boolean;
  
  constructor(
    private service:ChatbotService,
    private router:Router,
    private listService:ListesService,
    private recVocaleService:ReconnaissanceVocaleService){
      this.ecouteEnCours = false;
    }

    ngOnInit(): void {
      document.getElementById("saisie")?.addEventListener("keydown",(key)=>{
        if (key.key == "Enter"){
          this.envoyer()
        }else if (key.key == "Control"){
          this.ecoute();
        }
      })
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
          this.router.navigate(['/app-todolist']);
          let result=JSON.parse(answer.substring(answer.indexOf("{"),answer.lastIndexOf("}")+1));
          let contenu = result.content;
          let titre = result.title;

          this.listService.enregistrer(contenu,titre,true,true)
        }else{
          this.botAnswer = answer;
          param = 1;
        }

        this.service.addReponse(answer);
        this.refresh(param);
      }
    );
  }
  
  refresh(param:number){
    if(param == 1){
      const user = document.getElementById("user");
      if(user!=null && param==1){
        user.style.visibility ="visible";
      }
      this.userText = this.currentText;
    }
    this.currentText = "";
  }
  
  getRecVocClass(){
    return this.ecouteEnCours?"rec-voc-en-cours":"rec-voc";
  }
}
