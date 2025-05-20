import { HttpClient,HttpHeaders,provideHttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService implements OnInit {
  private apiURL = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = 'E0fGoSyjsWkSv8ZyVoZsSigcaRAA73sa';

  private demandeActus = "Inventes 1 actualité provenant d'un journal sous format json comprenant titre nommé title + description courte nommé short_description, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeSolutionsDomestique ="Inventes 1 technique pour éviter les risques domestiques sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeLoisirs ="Inventes 1 activité extérieur sous format json comprenant titre nommé nom + adresse nommé adresse + date nommé date sous la forme aaaa-mm-jj + heure nommé heureDebut sous la forme hh:mm, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  envoi(message:string) : Observable<Object>{
    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
    const body = {
      model: 'mistral-medium',
      messages: [
        { role: 'user', content: message }
      ],
      temperature: 0.7
    };

    return this.http.post(this.apiURL, body,{headers:header});
  }

  getDemandeInfos(categorieCourante:number){
    if(categorieCourante == -1){
      categorieCourante = Math.floor(Math.random()*3);
    }
    if(categorieCourante==0){
      return {demande:this.demandeActus,num:0};
    }else if(categorieCourante==1){
      return {demande:this.demandeSolutionsDomestique,num:1};
    }else{
      return {demande:this.demandeLoisirs,num:2};
    }
  }
}
