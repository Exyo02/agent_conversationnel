import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Parametres, ParametresService } from '../../services/parametres.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

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
  uploadProgress = 0;
  uploadResponse: any;
  uploadError: string = '';
  serverUrl = 'http://localhost:4200';

  constructor(private parametresService: ParametresService, private http: HttpClient) { }

  ngOnInit(): void {
    const existingParams = this.parametresService.chargerParametres();
    this.nouveauxParametres = {
      police: existingParams?.police || this.parametresService.getPoliceActuelle(),
      themeNuitJour: existingParams?.themeNuitJour ?? true,
      listeNomBot: existingParams?.listeNomBot || [],
      listePhotoBot: existingParams?.listePhotoBot || [],
      fondEcran: existingParams?.fondEcran || [],
      fondEcranChoisi: existingParams?.fondEcranChoisi || '',
      modeNarrateur: existingParams?.modeNarrateur ?? true,
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

  toggleNarrateur(): void {
    this.nouveauxParametres.modeNarrateur = !this.nouveauxParametres.modeNarrateur;
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
  uploadFile(file: File, folder: string): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder); // Vous pouvez envoyer le dossier au serveur si nécessaire

    this.http.post(this.serverUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 100));
        } else if (event instanceof HttpResponse) {
          this.uploadResponse = event.body;
          this.uploadError = '';
          this.uploadProgress = 0;
          if (folder === 'bot-photos' && this.uploadResponse?.filename) {
            this.nouveauxParametres.listePhotoBot.push(`/uploads/${this.uploadResponse.filename}`);
          } else if (folder === 'fond-ecran' && this.uploadResponse?.filename) {
            this.nouveauxParametres.fondEcran.push(`/uploads/${this.uploadResponse.filename}`);
            this.nouveauxParametres.fondEcranChoisi = `/uploads/${this.uploadResponse.filename}`;
            this.appliquerFondEcran(this.nouveauxParametres.fondEcranChoisi);
          }
          this.enregistrerParametres();
          console.log('Réponse du serveur:', this.uploadResponse);
        }
      },
      error: (error) => {
        this.uploadError = 'Erreur lors du téléchargement du fichier.';
        console.error('Erreur de téléchargement:', error);
        this.uploadProgress = 0;
        this.uploadResponse = null;
      }
    });
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
      fondEcranChoisi: '',
      modeNarrateur: true
    };
    this.appliquerFondEcran('');
    this.enregistrerParametres();
  }

  appliquerFondEcran(url: string): void {
    document.body.style.backgroundImage = url ? `url('${url}')` : '';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
  }
}
