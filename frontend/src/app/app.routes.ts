import { Routes } from "@angular/router";
import { AccueilComponent } from "./components/accueil/accueil.component";
import { AgendaComponent } from "./components/agenda/agenda.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { TodolistComponent } from "./components/todolist/todolist.component";
import { CoursesComponent } from "./components/courses/courses.component";
import { MedicamentsComponent } from "./components/medicaments/medicaments.component";
import { ActusComponent } from "./components/actus/actus.component";
import { ParamsComponent } from "./components/params/params.component";
import { AmenagementComponent } from "./components/amenagement/amenagement.component";
import { SortiesComponent } from "./components/sorties/sorties.component";
import { ListeComponent } from "./components/liste/liste.component";
import { ChatComponent } from "./components/chat/chat.component";

export const routes: Routes=[
    {path:'', component:AccueilComponent},
    {path:'app-accueil', component:AccueilComponent},
    {path:'app-agenda', component:AgendaComponent},
    {path:'app-todolist', component:TodolistComponent},
    {path:'app-liste/:nom', component:ListeComponent},
    {path:'app-liste', component:ListeComponent},
    {path:'app-courses', component:CoursesComponent},
    {path:'app-medicaments', component:MedicamentsComponent},
    {path:'app-actus', component:ActusComponent},
    {path: 'app-amenagement', component:AmenagementComponent},
    {path: 'app-sorties', component:SortiesComponent},
    {path: 'app-params',component:ParamsComponent},
    {path: 'app-chat',component:ChatComponent}
];