import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MedicamentsService } from '../../services/medicaments.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

/**
 * Composant pour la visualisation de la liste des 
 * informations des médicamments: 
 * - Nom 
 * - Quantité
 * - Date et heure de prochaine prise
 * - Durée
 * - Intervalle de prise
 */
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

  /**
   * Constructeur
   * @param medicamentsService 
   * @param router 
   */
  constructor(private medicamentsService: MedicamentsService, private router: Router) {}

  /**
   * Initialisation del aliste des médicamments
   */
  ngOnInit(): void {
    // Charger la liste des médicamments
    this.chargerMedicaments();
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  /**
   * Charger la liste des médicamments
   */
  chargerMedicaments(): void {
    // Récupérration de la liste des médicamments
    let medic = this.medicamentsService.getAllMedicaments();

    // Ordonnancement de la liste des médicamments
    this.medicaments = this.ordreMedicSuivant(medic);
  }

  /**
   * Fonction d'ordonnancement de la liste des médicamments
   * @param medic liste des médicamments non ordonnancés
   * @returns la liste des médicamments ordonnés en fonction de la date de la prochaine prise des médicamments
   */
  ordreMedicSuivant(medic:any[]){
    const now = new Date();

    let m = medic.map(med=>
      ({...med,suivant:this.getSuivant(med,now)
    }))
    .filter(med=>med.suivant.dateFormat!==null)
    .sort((a,b)=>(a.suivant.dateFormat!.getTime()-b.suivant.dateFormat!.getTime()));

    return m;
  }

  /**
   * Fonction pour connaitre les médicamment avec les prochaines prises les plus proches
   * @param med 
   * @param now 
   * @returns les informations sur la date de prochaine prise
   */
  getSuivant(med:any,now:Date){
    const debut = new Date(med.premierePrise);
    const fin = new Date(debut.getTime()+med.duree*24*60*60*1000);
    const heure = 60*60*1000;

    // Si on a atteint la date de fin de prise alors on retourne null
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
      
      // On retourne les informations sur la qprochaine prise
      return {dateFormat:suivant,prochainePrise:med.prochainePrise,alerte:med.alerte};
    }else{
      return null;
    }
  }

  /**
   * Redirrection vers la page d'ajout d'un médicamment
   */
  ajouterNouveauMedicament(): void {
    this.router.navigate(['/app-medicaments/ajouter']);
  }

  /**
   * Rejoindre la page du médicamment
   * @param nom identifiant du médicamment à modifier
   */
  modifierMedicament(nom: string): void {
    this.router.navigate(['/app-medicaments/editer', nom]);
  }

  /**
   * Pour visualiser le niveau d'alerte dans la prise des médicamments
   * @param medic le médicamment concerné
   * @returns la couleur de la ligne en fonction de l'état d'alerte 
   */
  getLineClass(medic:any){
    return medic.suivant.alerte==0?"line line-alerte-alert":(medic.suivant.alerte==1?"line line-alerte-warning":"line line-without-alerte");
  }
}
