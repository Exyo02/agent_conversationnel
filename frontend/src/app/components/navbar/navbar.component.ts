import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParametresService, Parametres } from '../../services/parametres.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDarkMode: boolean = false;
  parametresSubscription: Subscription | undefined;

  constructor(private parametresService: ParametresService) { }

  ngOnInit(): void {
    this.chargerEtatTheme();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.themeNuitJour !== undefined) {
        this.isDarkMode = params.themeNuitJour;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.parametresSubscription) {
      if (this.parametresSubscription) {
        this.parametresSubscription.unsubscribe();
      }
    }
  }
  chargerEtatTheme(): void {
    const params = this.parametresService.chargerParametres();
    if (params && params.themeNuitJour !== undefined) {
      this.isDarkMode = params.themeNuitJour;
    }
  }

  getNavbarClass(): string {
    return this.isDarkMode ? 'navbar navbar-dark' : 'navbar';
  }
}
