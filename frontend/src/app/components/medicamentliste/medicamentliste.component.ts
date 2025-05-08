import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MedicamentsService } from '../../services/medicaments.service';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
interface Rappel {
  medicamentNom: string;
  heurePrise: Date;
}

@Component({
  standalone: true,
  selector: 'app-medicaments-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './medicamentliste.component.html',
  styleUrl: './medicamentliste.component.css'
})
export class MedicamentsListComponent implements OnInit, OnDestroy {
  medicaments: { nom: string; duree: number | null; quantite: number | null; heurePrise?: string }[] = [];
  rappelActif: Rappel | null = null;
  afficherNotification = false;
  private intervalSubscription: Subscription | undefined;

  constructor(private medicamentsService: MedicamentsService, private router: Router) {}

  ngOnInit(): void {
    this.chargerMedicaments();
    this.intervalSubscription = interval(60000)
      .subscribe(() => this.verifierRappels());
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

  verifierRappels(): void {
    const maintenant = new Date();
    this.medicaments.forEach(medicament => {
      if (medicament.heurePrise) {
        const [heures, minutes] = medicament.heurePrise.split(':').map(Number);
        const heurePrise = new Date(maintenant); // Créez une nouvelle date basée sur 'maintenant'
        heurePrise.setHours(heures);
        heurePrise.setMinutes(minutes);
        heurePrise.setSeconds(0);
        heurePrise.setMilliseconds(0);

        if (maintenant.getTime() >= heurePrise.getTime() &&
            maintenant.getTime() <= heurePrise.getTime() + 60 * 60 * 1000 &&
            !this.rappelActif) {
          this.rappelActif = { medicamentNom: medicament.nom, heurePrise: heurePrise };
          this.afficherNotification = true;
          console.log('Rappel déclenché pour :', medicament.nom, 'à', heurePrise);
          console.log('Heure actuelle :', maintenant);
        }
      }
    });
  }

  prendreMedicament(): void {
    this.afficherNotification = false;
    this.rappelActif = null;
  }

  nePasPrendreMedicament(): void {
    this.afficherNotification = false;
    this.rappelActif = null;
  }
}
