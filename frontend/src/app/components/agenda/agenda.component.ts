import { AfterViewInit, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-agenda',
  imports: [],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements AfterViewInit{
  constructor() {
  }
  ngAfterViewInit(): void {
    window.open('https://calendar.google.com/', '_blank', 'noopener,noreferrer');
  }
}

const routes: Routes = [
  { path: 'google-calendar', component: AgendaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
