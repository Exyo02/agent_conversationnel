import { Injectable } from '@angular/core';

/**
 * Service de gestion des contacts, avec enregistrement et récupération
 */
@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  /** Clé pour accéder aux noms des contacts stockées dans le local storage */
  accessKey: string = 'contacts-access-agent-conversationnel';

  /**
   * Constructeur
   */
  constructor() { }

  /**
   * Récupère les informations d'un contact à partir de son identifiant qui est son nom
   * @param nom du contact à récupérer
   * @returns les informations propres aux contact sous la forme nom + adresse mail + numéro de téléphone
   */
  charger(nom: string){
    const data = localStorage.getItem(nom);
    if(data){
      return {
        nom:nom,
        mail:JSON.parse(data).mail,
        telephone:JSON.parse(data).telephone
      };
    // Si aucun contact n'est identifié sous ce nom return false
    } else {
      return false;
    }
  }

  /**
   * Récupère la liste des identifiants des contacts dans le local storage
   * @returns la liste des noms des contacts
   */
  chargerContacts(){
    const data = localStorage.getItem(this.accessKey);
    if(data){
      return JSON.parse(data).contenu;
    } else {
      return [];
    }
  }

  /**
   * Enregistrer un nouveau contact
   * @param nom 
   * @param mail 
   * @param telephone 
   * @returns vrai s'il a bien était enregistrer, faux si son nom existait déjà dans le local storage
   */
  enregistrer(nom: string,mail: string,telephone: string){
    const noms = this.chargerContacts();

    if (!noms.includes(nom))
    {
      // Enregistrement du nouveau contact
      localStorage.setItem(nom,JSON.stringify({mail: mail,telephone:telephone}));

      // Ajout de son nom à la liste de noms
      noms.push(nom);
      localStorage.setItem(this.accessKey,JSON.stringify({contenu: noms}));

      return true;
    } else {
      return false;
    }
  }
}
