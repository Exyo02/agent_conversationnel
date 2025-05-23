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
  nouveauxParametres!: Parametres;
  availableFonts: string[] = ['Roboto, sans-serif', 'Open Sans, sans-serif', 'Didot, serif', 'American Typewriter, serif',
     'Montserrat, sans-serif', 'Trebuchet MS, sans-serif', 'Gill Sans, sans-serif', 'Optima, sans-serif'];

  constructor(private parametresService: ParametresService) { }

  ngOnInit(): void {
    const existingParams = this.parametresService.chargerParametres();
    this.nouveauxParametres = {
      police: existingParams?.police || this.parametresService.getPoliceActuelle(),
      themeNuitJour: existingParams?.themeNuitJour ?? true,
      listeNomBot: existingParams?.listeNomBot || [],
      listePhotoBot: existingParams?.listePhotoBot || [],
      fondEcran: existingParams?.fondEcran || [],
      fondEcranChoisi: existingParams?.fondEcranChoisi || ''
    };
  }
  changerPolice(nouvellePolice: string): void {
    this.nouveauxParametres.police = nouvellePolice;
    this.parametresService.appliquerPolice(nouvellePolice);
    this.enregistrerParametres();
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
    console.log('ajouterFondEcranUrl appelée avec url =', url);
    if (url && !this.nouveauxParametres.fondEcran.includes(url)) {
      this.nouveauxParametres.fondEcran.push(url);
      this.nouveauxParametres.fondEcranChoisi = url;
      this.appliquerFondEcran(url);
      this.enregistrerParametres();
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
    console.log("Téléchargement de ${file.name} vers le dossier ${folder}");
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      if (folder === 'bot-photos') {
        this.nouveauxParametres.listePhotoBot.push(imageUrl);
      } else if (folder === 'fonds-ecran') {
        this.nouveauxParametres.fondEcran.push(imageUrl);
        this.nouveauxParametres.fondEcranChoisi = imageUrl;
        this.appliquerFondEcran(imageUrl);
        this.enregistrerParametres();
      }
    };
    reader.readAsDataURL(file);
  }

  choisirFondEcran(fondEcran: string): void {
    this.nouveauxParametres.fondEcranChoisi = fondEcran;
    this.appliquerFondEcran(fondEcran);
    this.enregistrerParametres();
  }

  supprimerFondEcran(index: number): void {
    this.nouveauxParametres.fondEcran.splice(index, 1);
    if (this.nouveauxParametres.fondEcranChoisi === this.nouveauxParametres.fondEcran[index]) {
      this.nouveauxParametres.fondEcranChoisi = '';
      this.appliquerFondEcran('');
    }
    this.enregistrerParametres();
  }

  enregistrerParametres(): void {
    this.parametresService.sauvegarderParametres(this.nouveauxParametres);
  }

  reinitialiserParametres(): void {
    this.nouveauxParametres = {
      police: this.parametresService.getPoliceActuelle(),
      themeNuitJour: true,
      listeNomBot: [],
      listePhotoBot: [],
      fondEcran: [],
      fondEcranChoisi: ''
    };
    this.appliquerFondEcran('');
    this.enregistrerParametres();
  }

  appliquerFondEcran(url: string): void {
    document.body.style.backgroundImage = url ? `url('${url}')` : '';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    console.log('nouveauxParametres après ajout:', this.nouveauxParametres);
  }
}
