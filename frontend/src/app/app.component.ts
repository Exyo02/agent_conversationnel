import { Component, OnDestroy, OnInit , Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ParametresService, Parametres } from './services/parametres.service';
import { Subscription } from 'rxjs';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  standalone: true,
  imports:[RouterOutlet, NavbarComponent,ChatComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'frontend';
  selectedFontClass: string = '';
  selectedSizeFontClass:string='';
  parametresSubscription: Subscription | undefined;

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
      if (params && params.taillePolice) {
        this.applySizeFontClass(params.taillePolice);
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

  loadInitialFont(): void {
    const initialParams = this.parametresService.chargerParametres();
    if (initialParams && initialParams.police && initialParams.taillePolice) {
      this.applyFontClass(initialParams.police);
      this.applySizeFontClass(initialParams.taillePolice);
    }
  }

  applyFontClass(font: string): void {
    if (this.selectedFontClass) {
      this.renderer.removeClass(document.body, this.selectedFontClass);
    }
    this.selectedFontClass = `font-${font.toLowerCase().replace(/\s+/g, '-')}`;
    this.renderer.addClass(document.body, this.selectedFontClass);
  }

  applySizeFontClass(font: string): void {
    if (this.selectedSizeFontClass) {
      this.renderer.removeClass(document.body, this.selectedSizeFontClass);
    }
    this.selectedSizeFontClass = `font-${font.toLowerCase().replace(/\s+/g, '-')}`;
    this.renderer.addClass(document.body, this.selectedSizeFontClass);
  }
}
