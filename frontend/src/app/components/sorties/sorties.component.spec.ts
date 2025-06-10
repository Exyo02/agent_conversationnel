import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Sorties } from './sorties.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SortiesService } from '../../services/sorties.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('SortiesComponent', () => {
  let component: Sorties;
  let fixture: ComponentFixture<Sorties>;
  let service: jasmine.SpyObj<SortiesService>;

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          return key === 'title' ? 'TitreTest' : null;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sorties],
      providers: [
        { provide: ActivatedRoute, useValue:mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: NgbModal, useValue: mockDialog },
        {
          provide: SortiesService,
          useValue: jasmine.createSpyObj('SortiesService', ['ajouterSortie','modifierSortie', 'supprimerSortie','chargerSortie'])
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sorties);
    component = fixture.componentInstance;
    service = TestBed.inject(SortiesService) as jasmine.SpyObj<SortiesService>;
  });

  it('instanciation', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit modification', () => {
    const mockSortie = {
      title: 'TitreTest',
      date: '2025-07-06',
      heureDebut: '8h',
      adresse: '3 rue Universitaire'
    };

    service.chargerSortie.and.returnValue(mockSortie);

    fixture.detectChanges();

    expect(component.estNouvelle).toBeFalse();
    expect(component.nouvelleSortie.title).toBe('TitreTest');
  });

  it('enregistrer avec titre vide', () => {
    component.nouvelleSortie.title = '';

    component.enregistrer();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('enregistrer avec date null', () => {
    component.nouvelleSortie = {
      title: 'TitreTest',
      date: null,
      heureDebut: '8h',
      adresse: '3 rue Universitaire'
    };

    component.enregistrer();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('enregistrer estNouvelle est vrai', () => {
    component.nouvelleSortie = {
      title: 'TitreTest',
      date: '2025-07-06',
      heureDebut: '8h',
      adresse: '3 rue Universitaire'
    };
    component.estNouvelle = true;

    component.enregistrer();
    expect(service.ajouterSortie).toHaveBeenCalledWith(component.nouvelleSortie);
  });

  it('supprimer', fakeAsync(() => {
    component.nouvelleSortie.title = 'TitreTest';

    component.supprimer();
    tick();

    expect(service.supprimerSortie).toHaveBeenCalledWith('TitreTest');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-sorties']);
  }));

  it('annuler', fakeAsync(()=>{
    component.annuler();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-sorties']);
  }));

  it('reinitialiserFormulaire', () => {
    component.nouvelleSortie.title = 'TitreTest';
    component.estNouvelle = false;

    component.reinitialiserFormulaire();

    expect(component.nouvelleSortie.title).toBe('');
    expect(component.estNouvelle).toBeTrue();
  });
});

