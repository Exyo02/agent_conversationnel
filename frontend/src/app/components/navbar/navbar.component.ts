import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { ParametresService } from '../../services/parametres.service';
import { Subscription } from 'rxjs';

/**
 * Composant de la barre de navigation de l'application
 */
@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  /** Mod nuit */
  isDarkMode: boolean = false;

  parametresSubscription: Subscription | undefined;

  /**
   * Constructeur
   * @param parametresService 
   */
  constructor(private parametresService: ParametresService) { }

  /**
   * Charge les paramètres pour activer ou non le mod Nuit
   */
  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });
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
   * Vérification de l'activation du mod Nuit dans les paramètres
   */
  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    // Activation ou non du mod nuit en fonction des paramètres
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  /**
   * Changement de la couleur de la barre de navigation
   * @returns la classe spécifique au mod Nuit ou non, en fonction du contenu des paramètres
   */
  getNavbarClass(): string {
    return this.isDarkMode ? 'navbar navbar-dark' : 'navbar';
  }
}
