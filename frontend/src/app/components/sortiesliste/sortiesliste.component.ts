import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SortiesService, Sortie } from '../../services/sorties.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ParametresService } from '../../services/parametres.service';

/**
 * Composant permettant de visualiser la liste des sorties 
 */
@Component({
  standalone: true,
  selector: 'app-sorties-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './sortiesliste.component.html',
  styleUrl: './sortiesliste.component.css'
})
export class SortiesListeComponent implements OnInit {
  /** Mod nuit activé? */
  isDarkMode: boolean = false;

  parametresSubscription: Subscription | undefined;

  /** Liste des sorties */
  sorties: Sortie[] = [];

  /** Liste des sorties pour chaque jour */
  sortiesParJour: {[key: string]:Sortie[]} = {};

  /** Debut de la semaine courante */
  currentWeekStart!: Date;

  /** Jours de la semaine courante */
  joursSemaine: Date[] = [];

  /**
   * Constructeur
   * @param SortiesService 
   * @param router 
   */
  constructor(private SortiesService: SortiesService, 
              private router: Router,
              private parametresService:ParametresService) { }

  /**
   * Récupère la liste des sorties
   */
  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });

    this.chargerSorties();
    this.setCurrentWeek(new Date())
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
   * Active ou non le mod Nuit en fonction du cntenu des paramètres
   */
  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  /**
   * Application du style de la page en fonction de l'activation du mod Nuit
   * @returns la classe de style
   */
  getFNClass(){
    return this.isDarkMode ? 'fn fn-nuit' : 'fn fn-jour';
  }

  /**
   * Initialisation dfes informations sur:
   * - Le début de la semine
   * - La fin de la semaine
   * - Les sorties propres à la semaine
   */
  setCurrentWeek(date: Date){
    const intervalLundi = (date.getDay() + 6)%7;
    this.currentWeekStart = new Date(date);
    this.currentWeekStart.setDate(date.getDate()-intervalLundi);

    this.joursSemaine = Array.from({ length: 7},(_,i)=>{
      const day = new Date(this.currentWeekStart);
      day.setDate(day.getDate()+i);
      return day;
    });

    this.trierSortiesDeLaSemaine();
  }

  /**
   * Trier les sorties de la semaine par jour
   */
  trierSortiesDeLaSemaine(){
    this.sortiesParJour = {};
    this.joursSemaine.forEach(day=>{
      const key = day.toLocaleDateString("en-CA")
      this.sortiesParJour[key] = this.sorties
      .filter(sortie=>sortie.date === key )
      .sort((a,b)=>{
        const hA = a.heureDebut??'00:00';
        const hB = b.heureDebut??'00:00';
        return hA.localeCompare(hB);
      });
    });
  }

  /**
   * Renvoi la date avec le format
   * lundi 01/01
   * @param date 
   * @returns la date
   */
  formatDate(date: Date){
    return date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'numeric'});
  }

  /**
   * Changer de semaine courante
   * @param change 1 pour la semaine suivante, -1 sinon
   */
  changeSemaine(change:number){
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate()+(7*change));
    this.setCurrentWeek(newDate);
  }

  /**
   * Récupérration de l'ensemble des sorties
   */
  chargerSorties(): void {
    this.sorties = this.SortiesService.getAllSorties();
  }

  /**
   * Redirrection vers la page de création d'une sortie
   */
  ajouterNouvelleSortie(): void {
    this.router.navigate(['/app-sorties/ajouter']);
  }

  /**
   * Redirrection vers la page de modification d'une sortie
   * @param title identifiant de la sortie
   */
  modifierSortie(title: string): void {
    this.router.navigate(['/app-sorties/editer', title]);
  }
}
