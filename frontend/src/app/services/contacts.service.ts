import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  accessKey: string = 'contacts-access-agent-conversationnel';

  constructor() { }

  charger(nom: string){
    const data = localStorage.getItem(nom);
    if(data){
      return {
        nom:nom,
        mail:JSON.parse(data).mail,
        telephone:JSON.parse(data).telephone
      };
    } else {
      return false;
    }
  }

  chargerContacts(){
    const data = localStorage.getItem(this.accessKey);
    if(data){
      return JSON.parse(data).contenu;
    } else {
      return [];
    }
  }
  
  clear(){
    localStorage.clear();
  }

  enregistrer(nom: string,mail: string,telephone: string){
    const noms = this.chargerContacts();
    
    if (!noms.includes(nom))
    {
      localStorage.setItem(nom,JSON.stringify({mail: mail,telephone:telephone}));
      
      noms.push(nom);
      localStorage.setItem(this.accessKey,JSON.stringify({contenu: noms}));
      
      return true;
    } else {
      return false;
    }
  }
}
