import { Component, OnDestroy, OnInit , Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ParametresService } from './services/parametres.service';
import { Subscription } from 'rxjs';
import { ChatComponent } from './components/chat/chat.component';

/**
 * Composant racine de l'application
 */
@Component({
  standalone: true,
  imports:[RouterOutlet, NavbarComponent,ChatComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'frontend';

  /** Police sélectionnée */
  selectedFontClass: string = '';
  parametresSubscription: Subscription | undefined;

  /**
   * Constructeur
   * @param parametresService service de gestion des paramètres
   * @param renderer 
   */
  constructor(
    private parametresService: ParametresService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadInitialFont();
    this.parametresSubscription = this.parametresService.parametres$.subscribe(params => {
      if (params && params.police) {
        this.applyFontClass(params.police);
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

  /**
   * Récupération de la police d'écriture dans les paramètres pour application
   */
  loadInitialFont(): void {
    const initialParams = this.parametresService.chargerParametres();
    if (initialParams && initialParams.police) {
      this.applyFontClass(initialParams.police);
    }
  }

  /**
   * Application dela police d'écriture à l'application
   * @param font police d'écriture sous la forme d'une chaine de caractères
   */
  applyFontClass(font: string): void {
    if (this.selectedFontClass) {
      this.renderer.removeClass(document.body, this.selectedFontClass);
    }
    this.selectedFontClass = `font-${font.toLowerCase().replace(/\s+/g, '-')}`;
    this.renderer.addClass(document.body, this.selectedFontClass);
  }
}
