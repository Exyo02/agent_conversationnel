import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListeComponent } from '../liste/liste.component';
import { ListesService } from '../../services/listes.service';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';

@Component({
  standalone: true,
  selector: 'app-todolist',
  imports: [RouterLink, CommonModule,ChatComponent],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css'
})
export class TodolistComponent implements OnInit{
  nomDesListes=[]
  constructor(private service:ListesService){}
  ngOnInit(){
    this.nomDesListes = this.service.chargerNomsListes();
  }
}
