import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListesService } from '../../services/listes.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-todolist',
  imports: [RouterLink, CommonModule],
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
