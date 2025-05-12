import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Parametres, ParametresService } from '../../services/parametres.service';

@Component({
  standalone: true,
  selector: 'app-params',
  imports: [FormsModule, CommonModule],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent implements OnInit {
  sontNouveaux = true;
  parametres: Parametres[] = [];
  afficherFormulaire = false;
  nouveauxParametres: Parametres = {
    police: '',
    themeNuitJour: true,
    listeNomBot: [],
    listePhotoBot: [],
    fondEcran: [],
    fondEcranChoisi: ''
  };

  constructor(private parametresService: ParametresService) { }

  ngOnInit(): void {
    const existingParams = this.parametresService.chargerParametres();
    if (existingParams) {
      this.nouveauxParametres = { ...existingParams };
    }
  }

  toggleThemeNuitJour(): void {
    this.nouveauxParametres.themeNuitJour = !this.nouveauxParametres.themeNuitJour;
    this.enregistrerParametres();
  }

  ajouterNomBot(nom: string): void {
    if (nom && !this.nouveauxParametres.listeNomBot.includes(nom)) {
      this.nouveauxParametres.listeNomBot.push(nom);
    }
  }

  supprimerNomBot(index: number): void {
    this.nouveauxParametres.listeNomBot.splice(index, 1);
  }

  ajouterPhotoBotUrl(url: string): void {
    if (url && !this.nouveauxParametres.listePhotoBot.includes(url)) {
      this.nouveauxParametres.listePhotoBot.push(url);
    }
  }

  supprimerPhotoBot(index: number): void {
    this.nouveauxParametres.listePhotoBot.splice(index, 1);
  }

  ajouterFondEcranUrl(url: string): void {
    if (url && !this.nouveauxParametres.fondEcran.includes(url)) {
      this.nouveauxParametres.fondEcran.push(url);
    }
  }

  telechargerPhotoBot(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, 'bot-photos');
    }
  }

  telechargerFondEcran(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, 'fond-ecran');
    }
  }

  uploadImage(file: File, folder: string): void {
    console.log(`Téléchargement de ${file.name} vers le dossier ${folder}`);
    const imageUrl = URL.createObjectURL(file);
    if (folder === 'bot-photos') {
      this.nouveauxParametres.listePhotoBot.push(imageUrl);
    } else if (folder === 'fonds-ecran') {
      this.nouveauxParametres.fondEcran.push(imageUrl);
      this.nouveauxParametres.fondEcranChoisi = imageUrl;
    }
  }

  enregistrerParametres(): void {
    this.parametresService.sauvegarderParametres(this.nouveauxParametres);
  }

  reinitialiserParametres(): void {
    this.nouveauxParametres = {
      police: '',
      themeNuitJour: true,
      listeNomBot: [],
      listePhotoBot: [],
      fondEcran: [],
      fondEcranChoisi: ''
    };
  }

}
