import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../../dialog/dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { FormsModule } from '@angular/forms';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-contacts',
  imports: [CommonModule,FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit{
  isDarkMode: boolean = false;
  parametresSubscription: Subscription | undefined;
  contacts:Array<string> = [];
  contactCourant:any;
  currentMessage:string = "";
  messagesRecents:Array<string> = [];

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
    this.contacts = this.contactsService.chargerContacts();
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }

  ajouterContact(){
    const mod = this.dialogBox.open(DialogComponent);
    mod.componentInstance.message ="Ajout d'un nouveau contact :"
    mod.componentInstance.opt1 ="Ajouter";
    mod.componentInstance.opt2 = "Annuler";
    mod.componentInstance.textField = true;
    mod.result.then(result=>{
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

  rejoindreConversation(nomContact:string){
    let contact = this.contactsService.charger(nomContact);

    if(contact){
      document.getElementById("afficheConversation")!.style.visibility = "visible";
      this.contactCourant = contact;
      this.messagesRecents = [];
      this.currentMessage = "";
    }
  }

  envoiMail() {
    if(this.currentMessage!=''){
      let mailString = "mailto:"+this.contactCourant.mail+"?subject=testApp&body="+this.currentMessage;
      this.messagesRecents.push(this.currentMessage);
      this.currentMessage = "";
      window.location.href = mailString;
    }
  }

  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  getPClass(){
    return this.isDarkMode ? 'p-nuit' : 'p-jour';
  }

  getDiscussionClass(){
    return this.isDarkMode ? 'discussion discussion-nuit' : 'discussion discussion-jour';
  }

}
