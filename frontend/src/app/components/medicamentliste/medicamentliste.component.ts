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
  medicaments: {suivant:{dateFormat:any,prochainePrise?:string,alerte:number}, nom: string; duree: number | null; quantite: number | null; intervallePrise?: string, premierePrise?: Date}[] = [];
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
    let medic = this.medicamentsService.getAllMedicaments();
    this.medicaments = this.ordreMedicSuivant(medic);
    console.log(medic)
    console.log(this.medicaments)
  }

  ordreMedicSuivant(medic:any[]){
    const now = new Date();
    let m = medic.map(med=>
      ({...med,suivant:this.getSuivant(med,now)
    }))
    .filter(med=>med.suivant.dateFormat!==null)
    .sort((a,b)=>(a.suivant.dateFormat!.getTime()-b.suivant.dateFormat!.getTime()));
    return m;
  }

  getSuivant(med:any,now:Date){
    const debut = new Date(med.premierePrise);
    const fin = new Date(debut.getTime()+med.duree*24*60*60*1000);
    const heure = 3600000;

    if(now>fin){
      return null;
    }

    let suivant = new Date(debut);

    while (suivant<new Date(now.getTime()-heure)){
      suivant = new Date(suivant.getTime()+med.intervallePrise*60*60*1000);
    }
    if(suivant!=debut && suivant<=fin){
      
      med.prochainePrise = suivant.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      med.alerte = suivant<now?0:(suivant<new Date(now.getTime()+heure)?1:2);
      
      return {dateFormat:suivant,prochainePrise:med.prochainePrise,alerte:med.alerte};
    }else{
      return null;
    }
  }

  ajouterNouveauMedicament(): void {
    this.router.navigate(['/app-medicaments/ajouter']);
  }

  modifierMedicament(nom: string): void {
    this.router.navigate(['/app-medicaments/editer', nom]);
  }

  getLineClass(medic:any){
    return medic.suivant.alerte==0?"line line-alerte-alert":(medic.suivant.alerte==1?"line line-alerte-warning":"line line-without-alerte");
  }
}
