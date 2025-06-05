import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SortiesService, Sortie } from '../../services/sorties.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-sorties-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './sortiesliste.component.html',
  styleUrl: './sortiesliste.component.css'
})
export class SortiesListeComponent implements OnInit, OnDestroy {
  sorties: Sortie[] = [] ;
  private intervalSubscription: Subscription | undefined;

  constructor(private SortiesService: SortiesService, private router: Router) { }

  ngOnInit(): void {
    this.chargerSorties();
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
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
