import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MedicamentsService } from '../../services/medicaments.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-medicaments-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './medicamentliste.component.html',
  styleUrl: './medicamentliste.component.css'
})
export class MedicamentsListComponent implements OnInit, OnDestroy {
  medicaments: { nom: string; duree: number | null; quantite: number | null; heurePrise?: string }[] = [];
  private intervalSubscription: Subscription | undefined;

  constructor(private medicamentsService: MedicamentsService, private router: Router) {}

  ngOnInit(): void {
    this.chargerMedicaments();
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  chargerMedicaments(): void {
    this.medicaments = this.medicamentsService.getAllMedicaments();
  }

  ajouterNouveauMedicament(): void {
    this.router.navigate(['/app-medicaments/ajouter']);
  }

  modifierMedicament(nom: string): void {
    this.router.navigate(['/app-medicaments/editer', nom]);
  }
}
