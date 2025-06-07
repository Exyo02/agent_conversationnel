import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service Angular pour interagir avec l'API du chatbot
 * Mistral, avec contextualisation et demandes spécifiques 
 */
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  /** URL de l'API */
  private apiURL = 'https://api.mistral.ai/v1/chat/completions';
  /** Clé d'accès à l'API */
  private apiKey = 'E0fGoSyjsWkSv8ZyVoZsSigcaRAA73sa';

  /** Liste des messages entre l'utilisateur et le bot 
  Contient un préambule informatif */
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
      +"- soit 'informations' sur un sujet particulier => 'app-infos' nommé action + sujet nommé search sous format json"
      +"Si on te demande d'ajouter un rappel => 'add-list' nommé action + titre nommé title + contenu nommé content sous format json"
      +"Si on te demande d'ajouter un contact => 'add-contact' nommé action + nom nommé nom + mail nommé mail + telephone nommé telephone sous format json"
      +"Si on te demande d'ajouter une sortie => 'add-sortie' nommé action + titre nommé title + adresse nommé adresse + heureDebut nommé heure + dat nommé date sous format json"}
  ];

  /** Ajout d'une spécificité à la demande */
  private ajoutSujet = "L'information doit concerner le domaine de ";

  /** Demandes spécififiques à la catégorie d'informations actualités */
  private demandeActus = "Inventes 1 actualité provenant d'un journal sous format json comprenant titre nommé title + description courte nommé short_description, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  /** Demandes spécififiques à la catégorie d'informations solutions au risque domestique */
  private demandeSolutionsDomestique = "Inventes 1 technique pour éviter les risques domestiques sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  /** Demandes spécififiques à la catégorie d'informations loisirs */
  private demandeLoisirs = "Inventes 1 activité extérieur sous format json comprenant titre nommé title + adresse nommé adresse + date nommé date sous la forme aaaa-mm-jj + heure nommé heureDebut sous la forme hh:mm, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  /** Demandes spécififiques à la catégorie d'informations sur l'alimentation */
  private demandeAlimentation = "Inventes 1 conseil sur l'alimentation ou sur l'hydratation sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  /** Demandes spécififiques à la catégorie d'informations sur les aides */
  private demandeAides = "Inventes 1 aide financière pour la retraite sous format json comprenant titre nommé title + description courte nommé short_description, sois inventif, ta réponse ne devra contenir que le JSON elle commencera par le json et terminera par le json";

  /**
   * Constructeur
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * Envoi d'un message au bot par le biais de l'API
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
   * Détermine les informations spécifiques à la catégorie en paramètres effectifs
   * Si la catégorie est -1 alors choisir aléatoirement une catégorie
   * @param categorieCourante numéro de la catégorie
   * @returns la demande + le numéro de la catégorie
   */
  getDemandeInfos(categorieCourante:number, recherche: string | null){
    if (recherche != null && recherche != ""){
      return { demande: this.demandeActus + this.ajoutSujet + recherche, num: 0};
    }

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
