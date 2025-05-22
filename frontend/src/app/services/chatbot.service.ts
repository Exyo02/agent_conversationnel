import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService implements OnInit {
  private apiURL = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = 'E0fGoSyjsWkSv8ZyVoZsSigcaRAA73sa';
  private messages:Array<any> = [
    {role:'system',content:
      "Les utilisateurs ont 60 ans ou plus et vivent à Grenoble"+", nous sommes le "+new Date(Date.now()).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      +".  Si tu reçois un message contenant la chaine renvoi une chaine:"+
      +"- soit 'accueil' => '/'"
      +"- soit 'contacts' => 'app-contacts'"
      +"- soit 'rappels' => 'app-todolist'"
      +"- soit 'médicaments' => 'app-medicaments'"
      +"- soit 'agenda' => 'app-agenda'"
      +"- soit 'actualités' ou 'informations' => 'app-infos'"
      +"Si on te demande d'ajouter un rappel => 'add-list' et comprenant titre nommé title + contenu nommé content sous format json"}
  ];

  private demandeActus = "Inventes 1 actualité provenant d'un journal sous format json comprenant titre nommé title + description courte nommé short_description, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeSolutionsDomestique = "Inventes 1 technique pour éviter les risques domestiques sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeLoisirs = "Inventes 1 activité extérieur sous format json comprenant titre nommé nom + adresse nommé adresse + date nommé date sous la forme aaaa-mm-jj + heure nommé heureDebut sous la forme hh:mm, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeAlimentation = "Inventes 1 conseil sur l'alimentation ou sur l'hydratation sous format json comprenant titre nommé nom + adresse nommé adresse + date nommé date sous la forme aaaa-mm-jj, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
   private demandeAides = "Inventes 1 aide financière pour la retraite sous format json comprenant titre nommé nom + adresse nommé adresse + date nommé date sous la forme aaaa-mm-jj, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  envoi(message: string): Observable<Object> {
    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
    this.messages.push({role:'user',content:message});
    const body = {
      model: 'mistral-medium',
      messages: this.messages,
      temperature: 0.7
    };
    
    return this.http.post(this.apiURL, body,{headers:header});
  }

  addReponse(rep:string){
    this.messages.push({role:'assistant',content:rep});
  }

  getDemandeInfos(categorieCourante:number){
    if(categorieCourante == -1){
      categorieCourante = Math.floor(Math.random()*5);
    }
    if (categorieCourante == 0) {
      return { demande: this.demandeActus, num: 0 };
    } else if (categorieCourante == 1) {
      return { demande: this.demandeSolutionsDomestique, num: 1 };
    } else if (categorieCourante == 2) {
      return { demande: this.demandeLoisirs, num: 2 };
    } else if (categorieCourante == 3) {
      return { demande: this.demandeAlimentation, num: 3 };
    } else {
       return { demande: this.demandeAides, num: 4 };
    }
  }
}
