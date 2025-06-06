import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { FormsModule } from '@angular/forms';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';

/**
 * Composant pour les communications privés avec des contacts
 */
@Component({
  standalone: true,
  selector: 'app-contacts',
  imports: [CommonModule,FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit{
  /** Mod nuit activé? */
  isDarkMode: boolean = false;

  parametresSubscription: Subscription | undefined;

  /** Liqste des noms des contacts */
  contacts:Array<string> = [];

  /** Contact sur lequel l'utilisateur à cliqué */
  contactCourant:any;

  /** Chaine de caractères inscrit dans la zone de saisie */
  currentMessage:string = "";

  /** Liste des messages envoyés pendant la session */
  messagesRecents:Array<string> = [];

  /**
   * Constructeur
   * @param dialogBox pour la boite de dialog avec l'utilisateur lors de l'entrée d'un nouveau contact
   * @param contactsService 
   * @param parametresService 
   */
  constructor(
    private dialogBox:NgbModal,
    private contactsService:ContactsService,
    private parametresService:ParametresService
  ){}

  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });

    // Récupérration de laliste des contacts sous la forme d'une liste de noms
    this.contacts = this.contactsService.chargerContacts();
  }

  /**
   * Libération des ressources propre à l'abonnement au service des paramètres
   */
  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  /**
   * Ajout d'un nouveau contact en fonction desinformations saisies dan sl a boite de dialog '
   */
  ajouterContact(){
    // Ouverture d'une nouvelle boite de dialogue
    const mod = this.dialogBox.open(DialogComponent);

    // Configuration de la boite de dialogue
    mod.componentInstance.message ="Ajout d'un nouveau contact :"
    mod.componentInstance.opt1 ="Ajouter";
    mod.componentInstance.opt2 = "Annuler";
    mod.componentInstance.textField = true;

    mod.result.then(result=>{
      // Si l'utilisateur valide, alors on ajoute et enregistre le contact
      if(result.opt){
        this.contactsService.enregistrer(
          result.nom,
          result.mail,
          result.telephone
        )
        this.contacts.push(result.nom);
      }
    });
  }

  /**
   * Initialisation de la conversation avec un contact
   * @param nomContact identification du contact
   */
  rejoindreConversation(nomContact:string){
    // Récupération des informations du contact
    let contact = this.contactsService.charger(nomContact);

    // Si le contact existe, alors on affiche la boite de conversation
    if(contact){
      document.getElementById("afficheConversation")!.style.visibility = "visible";
      this.contactCourant = contact;
      this.messagesRecents = [];
      this.currentMessage = "";
    }
  }

  /**
   * Ouverture de l'application d'envoi d'un mail en fonction des informations de l'utilisateur
   */
  envoiMail() {
    // Si la zone de saisie n'est pas vide alors on accède à l'application contact
    if(this.currentMessage!=''){
      let mailString = "mailto:"+this.contactCourant.mail+"?subject=testApp&body="+this.currentMessage;
      this.messagesRecents.push(this.currentMessage);
      this.currentMessage = "";
      window.location.href = mailString;
    }
  }

  /**
   * Active ou non le mod Nuit en fonction du cntenu des paramètres
   */
  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  /**
   * Application du style des messages en fonction de l'activation du mod Nuit
   * @returns la classe de style
   */
  getPClass(){
    return this.isDarkMode ? 'p-nuit' : 'p-jour';
  }

  /**
   * Application du style de la barre de défilement en fonction de l'activation du mod Nuit
   * @returns la classe de style
   */
  getDiscussionClass(){
    return this.isDarkMode ? 'discussion discussion-nuit' : 'discussion discussion-jour';
  }
}
