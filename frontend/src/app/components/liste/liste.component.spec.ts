import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListeComponent } from './liste.component';
import { ListesService } from '../../services/listes.service';
import { SyntheseVocaleService } from '../../services/synthese-vocale.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const mockRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => {
        return key === 'nom' ? 'TitreTest' : null;
      }
    }
  }
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    componentInstance: {},
    result: Promise.resolve(true)
  })
};

describe('ListeComponent', () => {
  let component: ListeComponent;
  let fixture: ComponentFixture<ListeComponent>;
  let service: jasmine.SpyObj<ListesService>;
  let synthese: jasmine.SpyObj<SyntheseVocaleService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeComponent],
      providers: [
        { provide: ActivatedRoute, useValue:mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: NgbModal, useValue: mockDialog },
        {
          provide: ListesService,
          useValue: jasmine.createSpyObj('ListesService', ['charger', 'enregistrer', 'supprimer'])
        },
        {
          provide: SyntheseVocaleService,
          useValue: jasmine.createSpyObj('SyntheseVocaleService', ['parler'])
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ListesService) as jasmine.SpyObj<ListesService>;
    synthese = TestBed.inject(SyntheseVocaleService) as jasmine.SpyObj<SyntheseVocaleService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    service.charger.and.returnValue('Contenu test');
    component.ngOnInit();
    expect(component.titre).toBe('TitreTest');
    expect(component.liste).toBe('Contenu test');
    expect(synthese.parler).toHaveBeenCalledWith('Contenu test');
  });

  it('enregistrer correctement', () => {
    component.titre = 'TitreTest';
    component.ajoutTitre = '';
    component.nouvelleListe = true;
    component.liste = 'Contenu test';

    service.enregistrer.and.returnValue(3);

    component.enregistrer();

    expect(component.creationCourante).toBeTrue();
    expect(component.ajoutTitre).toBe('TitreTest');
  });

  it('enregistrer avec titre vide', () => {
    component.titre = '';
    component.enregistrer();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('annuler', fakeAsync(() => {
    component.annuler();
    tick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-todolist']);
  }));

  it('supprimer', fakeAsync(() => {
    component.titre = 'TitreTest';

    component.supprimer();
    tick();
    
    expect(service.supprimer).toHaveBeenCalledWith('TitreTest');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-todolist']);
  }));

  it('enregistrer titre déjà utilisé', () => {
    component.titre = 'TitreTest';
    component.ajoutTitre = '';
    component.nouvelleListe = true;
    service.enregistrer.and.returnValue(1);

    component.enregistrer();

    expect(mockDialog.open).toHaveBeenCalled();
  });
});
