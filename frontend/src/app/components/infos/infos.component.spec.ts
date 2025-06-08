import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InfosComponent } from './infos.component';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatbotService } from '../../services/chatbot.service';
import { SortiesService } from '../../services/sorties.service';
import { ParametresService } from '../../services/parametres.service';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';

describe('InfosComponent', () => {
  let component: InfosComponent;
  let fixture: ComponentFixture<InfosComponent>;
  let botService: any;
  let sortieService: any;
  let parametresService: any;
  let syntheseService: any;

  const mockHttpClient = {
    get: jasmine.createSpy().and.returnValue(of({})),
    post: jasmine.createSpy().and.returnValue(of({})),
    put: jasmine.createSpy().and.returnValue(of({})),
    delete: jasmine.createSpy().and.returnValue(of({}))
  }

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          return key === 'search' ? 'test' : null;
        }
      }
    }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    botService = jasmine.createSpyObj('ChatbotService', ['getDemandeInfos', 'envoi', 'addReponse']);
    sortieService = jasmine.createSpyObj('SortiesService', ['ajouterSortie']);
    parametresService = {
      chargerParametres: jasmine.createSpy('chargerParametres').and.returnValue({
        themeNuitJour: true,
      }),
      parametres$: of({
        themeNuitJour: true,
        modeNarrateur: true
      })
    };
    syntheseService = jasmine.createSpyObj('SyntheseVocaleService', ['parler']);

    await TestBed.configureTestingModule({
      imports: [InfosComponent],
      providers: [
        { provide: ChatbotService, useValue: botService },
        { provide: SortiesService, useValue: sortieService },
        { provide: ParametresService, useValue: parametresService },
        { provide: SyntheseVocaleService, useValue: syntheseService },
        { provide: ActivatedRoute, useValue:mockRoute },
        { provide: Router, useValue: mockRouter },
        {provide:HttpClient,useValue:mockHttpClient}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();

    expect(component.isDarkMode).toBeTrue();
    expect(component.recherche).toBe('test');
  });

  it('doit se désabonner lors du destroy', () => {
    const sub = new Subject();
    component['parametresSubscription'] = sub.subscribe();
    const spy = spyOn(component['parametresSubscription'], 'unsubscribe');
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('catNom', () => {
    expect(component.catNom(3)).toBe('categorie3');
  });

  it('doit ajouter une sortie', () => {
    const sortie = { title: 'Sortie test' };
    component.participerSortie(sortie);

    expect(sortieService.ajouterSortie).toHaveBeenCalledWith(sortie);
  });

  it('containsTitle', () => {
    component.infosList = [{ title: 'test' }];

    expect(component.containsTitle('test')).toBeTrue();
  });
  
  it("containsTitle si le titre n'existe pas", () => {
    component.infosList = [{ title: 'autre' }];

    expect(component.containsTitle('test')).toBeFalse();
  });

  it('getCategorieClass avec isDarkMode true et all true', () => {
    component.isDarkMode = true;

    expect(component.getCategorieClass(true)).toBe('use-nuit categorie categorie-nuit');
  });

  it('getCategorieClass avec isDarkMode false et all true', () => {
    component.isDarkMode = false;

    expect(component.getCategorieClass(true)).toContain('use-jour categorie categorie-jour');
  });

  it('getCategorieClass avec isDarkMode true et all false', () => {
    component.isDarkMode = true;

    expect(component.getCategorieClass(false)).toBe('categorie categorie-nuit');
  });

  it('getCategorieClass avec isDarkMode false et all false', () => {
    component.isDarkMode = false;

    expect(component.getCategorieClass(false)).toContain('categorie categorie-jour');
  });

  it('getFNClass avec isDarkMode true', () => {
    component.isDarkMode = true;

    expect(component.getFNClass()).toBe('fn fn-nuit');
  });

  it('getFNClass avec isDarkMode false', () => {
    component.isDarkMode = false;

    expect(component.getFNClass()).toBe('fn fn-jour');
  });

  it('changeCategorie',fakeAsync(()=>{
    component.numCategorie = -1;
    component.isDarkMode = true;
    component.nbAffichage = [true];
    component.infosList = [{ title: 'Ancien article' }];
    spyOn(component, 'ajoutArticle');

    component.changeCategorie(2);
    tick();

    expect(component.numCategorie).toBe(2);
    expect(component.nbAffichage[0]).toBeFalse();
    expect(component.nbAffichage[1]).toBeTrue();
    expect(component.infosList.length).toBe(0);
    expect(component.ajoutArticle).toHaveBeenCalledWith(1);
  }));

  it('ajoutArticle', fakeAsync(()=>{
    botService.getDemandeInfos.and.returnValue({ demande: 'Quelle est la météo ?', num: 1 });
    const fakeResponse = {
      choices: [
        {
          message: {
            content: '{"title": "Nouvelle Info", "short_description": "Ensoleillé"}'
          }
        }
      ]
    };

    botService.envoi.and.returnValue(of(fakeResponse));
    spyOn(component, 'containsTitle').and.returnValue(false);
    botService.addReponse.and.stub();
    syntheseService.parler.and.stub();

    component.nbArticle = 1;
    component.nbAffichage = [true];
    component.narrateur = true;

    component.ajoutArticle(0);
    tick(1000);

    expect(botService.getDemandeInfos).toHaveBeenCalled();
    expect(botService.envoi).toHaveBeenCalled();
    expect(botService.addReponse).toHaveBeenCalled();
    expect(syntheseService.parler).toHaveBeenCalledWith('Nouvelle Info');
    expect(component.infosList.length).toBe(1);
    expect(component.infosList[0].title).toBe('Nouvelle Info');
    expect(component.infosList[0].short_description).toBe('Ensoleillé');
  }));
});
