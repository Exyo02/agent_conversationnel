import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Parametres, ParametresService } from '../../services/parametres.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

/**
 * Composant pour la gestion des paramètres par l'utilisateur
 */
@Component({
  standalone: true,
  selector: 'app-params',
  imports: [FormsModule, CommonModule],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent implements OnInit {
  nouveauxParametres!: Parametres;
  availableFonts: string[] = ['Roboto, sans-serif', 'Open Sans, sans-serif', 'Didot, serif', 'American Typewriter, serif',
    'Montserrat, sans-serif', 'Trebuchet MS, sans-serif', 'Gill Sans, sans-serif', 'Optima, sans-serif'];
  uploadProgress = 0;
  uploadResponse: any;
  uploadError: string = '';
  serverUrl = 'http://localhost:4200';

  /**
   * Constructeur
   * @param parametresService 
   * @param http 
   */
  constructor(private parametresService: ParametresService, private http: HttpClient) { }

  ngOnInit(): void {
    // Récupération des paramètres
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
  
  /**
   * Changement de la police d'écriture
   * @param nouvellePolice nom de la nouvelle police
   */
  changerPolice(nouvellePolice: string): void {
    this.nouveauxParametres.police = nouvellePolice;
    this.parametresService.appliquerPolice(nouvellePolice);
    this.enregistrerParametres();
  }

  /**
   * Si le mod jour est activé passage au mod nuit et inversement
   */
  toggleThemeNuitJour(): void {
    this.nouveauxParametres.themeNuitJour = !this.nouveauxParametres.themeNuitJour;
    this.enregistrerParametres();
  }

  /**
   * Si le mod narrateur est activé, le désactiver, et inversement
   */
  toggleNarrateur(): void {
    this.nouveauxParametres.modeNarrateur = !this.nouveauxParametres.modeNarrateur;
    this.enregistrerParametres();
  }

  /**
   * Ajout d'un nouveau nom au bot
   * @param nom nouveau nom du bot
   */
  ajouterNomBot(nom: string): void {
    // Ajout u nom, s'il n'existe pas déjà dans la liste
    if (nom && !this.nouveauxParametres.listeNomBot.includes(nom)) {
      this.nouveauxParametres.listeNomBot.push(nom);
    }
  }

  /**
   * Suppression d'un nom du bot dans la liste à partir deson identifiant
   * @param index identifiant du nom dans la liste des noms du bot
   */
  supprimerNomBot(index: number): void {
    this.nouveauxParametres.listeNomBot.splice(index, 1);
  }

  /**
   * Ajout d'un nouveau logo à la liste des logos du bot
   * @param url nouveau logo du bot sous la forme d'une URL
   */
  ajouterPhotoBotUrl(url: string): void {
    // Ajout de l'image si l'URL n'est aps déjà prsent
    if (url && !this.nouveauxParametres.listePhotoBot.includes(url)) {
      this.nouveauxParametres.listePhotoBot.push(url);
    }
  }

  /**
   * Suppression d'un logo du bot dans la liste à partir de son identifiant
   * @param index identifiant de l'URL dans la liste des logos du bot
   */
  supprimerPhotoBot(index: number): void {
    this.nouveauxParametres.listePhotoBot.splice(index, 1);
  }

  /**
   * Ajout d'un nouveau fond d'écran à la liste
   * @param url nouveau fond d'écran sous la forme d'une URL
   */
  ajouterFondEcranUrl(url: string): void {
    console.log('ajouterFondEcranUrl appelée avec url =', url);
    // Ajout de l'image si l'URL n'est aps déjà prsent
    if (url && !this.nouveauxParametres.fondEcran.includes(url)) {
      this.nouveauxParametres.fondEcran.push(url);
      this.nouveauxParametres.fondEcranChoisi = url;
      this.appliquerFondEcran(url);
      this.enregistrerParametres();
    }
  }

  /**
   * 
   * @param event 
   */
  telechargerPhotoBot(event: any): void {
    // Récupération du ficher
    const file = event.target.files[0];

    // Si le fichier existe
    if (file) {
      this.uploadImage(file, 'bot-photos');
    }
  }

  /**
   * 
   * @param event 
   */
  telechargerFondEcran(event: any): void {
    // Récupération du ficher
    const file = event.target.files[0];

    // Si le fichier existe
    if (file) {
      this.uploadImage(file, 'fond-ecran');
    }
  }

  /**
   * 
   * @param file 
   * @param folder 
   */
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

  /**
   * Choix de fond d'écran
   * @param fondEcran nom du fond d'écran à appliquer
   */
  choisirFondEcran(fondEcran: string): void {
    this.nouveauxParametres.fondEcranChoisi = fondEcran;
    this.appliquerFondEcran(fondEcran);
    this.enregistrerParametres();
  }

  /**
   * Suppression du fond d'écran
   * @param index du fond d'écran sous la forme d'un indice dans la liste des fonds d'écran stockés
   */
  supprimerFondEcran(index: number): void {
    this.nouveauxParametres.fondEcran.splice(index, 1);
    // Si le fon d'écran actuel est le fond d'écran que l'on souhaite supprimer
    if (this.nouveauxParametres.fondEcranChoisi === this.nouveauxParametres.fondEcran[index]) {
      // On retire le fond d'écran
      this.nouveauxParametres.fondEcranChoisi = '';
      this.appliquerFondEcran('');
    }
    this.enregistrerParametres();
  }

  /**
   * Enregistrement des nouveaux paramètres
   */
  enregistrerParametres(): void {
    this.parametresService.sauvegarderParametres(this.nouveauxParametres);
  }

  /**
   * Réinitialisation des paramètres par défault
   */
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

    // Enregistrement des paramètres
    this.enregistrerParametres();
  }

  /**
   * Changement de fond d'écran
   * @param url nouveau fond d'écran courant sous la forme d eson URL
   */
  appliquerFondEcran(url: string): void {
    document.body.style.backgroundImage = url ? `url('${url}')` : '';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
  }
}
