import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListesService {
  // Clé pour accéder aux noms des rappels stockés dans le local storage 
  accessKey: string = 'file-access-agent-conversationnel';

  /**
   * @returns la liste des identifians
   */
  chargerNomsListes(){
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

  /**
   * @param nom identifiant du rappel
   * @returns le contenu du rappel
   */
  charger(nom: string){
    const data = localStorage.getItem(nom);
    if(data){
      return JSON.parse(data).contenu;
    } else {
      return '';
    }
  }

  /**
   * @param nom de la liste à supprimer
   */
  supprimer(nom: string){
    // Suppression du contenu du rappel
    localStorage.removeItem(nom);

    // Suppression de l'identifiant du rappel de la liste des identifiants
    let noms_listes = this.chargerNomsListes();
    noms_listes = noms_listes.filter((item:string)=>item!=nom);
    localStorage.setItem(this.accessKey,JSON.stringify({contenu: noms_listes}));
  }

  /**
   * Fonction d'enregistrement d'un rappel
   * @param contenu 
   * @param nom 
   * @param nouvelleListe 
   * @param creationCourante 
   * @returns 
   */
  enregistrer(contenu: string, nom: string, nouvelleListe: boolean,creationCourante:boolean){
    const noms_listes = this.chargerNomsListes();

    if(!creationCourante){
      creationCourante = nouvelleListe && !noms_listes.includes(nom);
    }

    if (creationCourante || !nouvelleListe || !noms_listes.includes(nom))
    {
      // Ajout ou modification du contenu du rappel
      localStorage.setItem(nom,JSON.stringify({contenu: contenu}));

      // Si l'identifiant n'est pas stocké, le stocker
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
