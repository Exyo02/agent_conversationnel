import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiURL = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = 'E0fGoSyjsWkSv8ZyVoZsSigcaRAA73sa';

  // Liste des messages entre l'utilisateur et le bot 
  // Contient un préambule informatif
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

  // Demandes spécififiques à chaque catégorie d'informations
  private demandeActus = "Inventes 1 actualité provenant d'un journal sous format json comprenant titre nommé title + description courte nommé short_description, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeSolutionsDomestique = "Inventes 1 technique pour éviter les risques domestiques sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeLoisirs = "Inventes 1 activité extérieur sous format json comprenant titre nommé title + adresse nommé adresse + date nommé date sous la forme aaaa-mm-jj + heure nommé heureDebut sous la forme hh:mm, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeAlimentation = "Inventes 1 conseil sur l'alimentation ou sur l'hydratation sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";
  private demandeAides = "Inventes 1 aide financière pour la retraite sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  /**
   * Constructeur
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * @param message le nouveau message de l'utilisateur
   * @returns un observable de la réonse du bot
   */
  envoi(message: string): Observable<Object> {
    // En tête avec le type de contenu en retour
    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    // Ajout du nouveau message de l'utilisateur à la liste
    this.messages.push({role:'user',content:message});

    // Le corps de la requête contenant le type de modèle utilisée + la liste des messages de la conversation avec le bot
    const body = {
      model: 'mistral-medium',
      messages: this.messages,
      temperature: 0.7
    };
    
    return this.http.post(this.apiURL, body,{headers:header});
  }

  /**
   * Ajoute la réponse à la liste des messages
   * @param rep réponse du bot
   */
  addReponse(rep:string){
    this.messages.push({role:'assistant',content:rep});
  }

  /**
   * @param categorieCourante numéro de la catégorie
   * @returns la demande spécifique à la catégorie + le numéro de cette dernière
   */
  getDemandeInfos(categorieCourante:number){
    // Si la catégorie spécifiée est -1 alors catégorie aléatoire
    if(categorieCourante == -1){
      categorieCourante = Math.floor(Math.random()*5);
    }

    // Renvoie en réponse la demande spécifique à la catégorie + le numéro de la catégorie 
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
