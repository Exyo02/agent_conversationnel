import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListesService {
  accessKey: string = 'file-access-agent-conversationnel';


  chargerNomsListes(){
    const data = localStorage.getItem(this.accessKey);
    if(data){
      return JSON.parse(data).contenu;
    } else {
      return [];
    }
  }

  charger(nom: string){
    const data = localStorage.getItem(nom);
    if(data){
      return JSON.parse(data).contenu;
    } else {
      return '';
    }
  }
  supprimer(nom: string){
    localStorage.removeItem(nom);

    let noms_listes = this.chargerNomsListes();
    noms_listes = noms_listes.filter((item:string)=>item!=nom);
    localStorage.setItem(this.accessKey,JSON.stringify({contenu: noms_listes}));
  }

  enregistrer(contenu: string, nom: string, nouvelleListe: boolean,creationCourante:boolean){
    const noms_listes = this.chargerNomsListes();
    if(!creationCourante){
      creationCourante = nouvelleListe && !noms_listes.includes(nom);
    }
    if (creationCourante || !nouvelleListe || !noms_listes.includes(nom))
    {
      localStorage.setItem(nom,JSON.stringify({contenu: contenu}));

      if(!noms_listes.includes(nom)){
        noms_listes.push(nom);
        localStorage.setItem(this.accessKey,JSON.stringify({contenu: noms_listes}));
      }
      
      return creationCourante?3:2;
    } else {
      return 1;
    }
  }
}
