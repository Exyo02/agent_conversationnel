import { Routes } from "@angular/router";
import { AccueilComponent } from "./components/accueil/accueil.component";
import { AgendaComponent } from "./components/agenda/agenda.component";
import { TodolistComponent } from "./components/todolist/todolist.component";
import { CoursesComponent } from "./components/courses/courses.component";
import { MedicamentsComponent } from "./components/medicaments/medicaments.component";
import { InfosComponent } from "./components/infos/infos.component";
import { ParametresComponent } from "./components/parametres/parametres.component";
import { Sorties } from "./components/sorties/sorties.component";
import { ListeComponent } from "./components/liste/liste.component";
import { MedicamentsListComponent } from "./components/medicamentliste/medicamentliste.component";
import { SortiesListeComponent } from "./components/sortiesliste/sortiesliste.component";
import { ChatComponent } from "./components/chat/chat.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { CommunauteComponent } from "./components/communaute/communaute.component";
import { MessageComponent } from "./components/message/message.component";

export const routes: Routes=[
    {path:'', component:AccueilComponent},
    {path:'app-accueil', component:AccueilComponent},
    {path:'app-agenda', component:AgendaComponent},
    {path:'app-todolist', component:TodolistComponent},
    {path:'app-liste/:nom', component:ListeComponent},
    {path:'app-liste', component:ListeComponent},
    {path:'app-courses', component:CoursesComponent},
    {path:'app-medicaments', component:MedicamentsListComponent},
    {path:'app-medicaments/ajouter', component:MedicamentsComponent},
    {path:'app-medicaments/editer/:nom', component:MedicamentsComponent},
    {path:'app-infos', component:InfosComponent},
    {path: 'app-contacts', component:ContactsComponent},
    {path: 'app-sorties', component:SortiesListeComponent},
    {path: 'app-sorties/ajouter', component:Sorties},
    {path: 'app-sorties/editer/:title', component:Sorties},
    {path: 'app-parametres',component:ParametresComponent},
    {path: 'app-chat',component:ChatComponent},
    {path: 'app-communaute', component:CommunauteComponent},
];
