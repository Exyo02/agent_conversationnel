import { AfterViewInit, NgModule } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-agenda',
  imports: [],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements AfterViewInit{
  /**
   * Constructeur
   */
  constructor() {
  }

  /**
   * Rejoins google-calender après l'initialisation de la vue
   */
  ngAfterViewInit(): void {
    window.open('https://calendar.google.com/', '_blank', 'noopener,noreferrer');
  }
}
 
