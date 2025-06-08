import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MedicamentsComponent } from './medicaments.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedicamentsService } from '../../services/medicaments.service';

describe('MedicamentsComponent', () => {
  let component: MedicamentsComponent;
  let fixture: ComponentFixture<MedicamentsComponent>;
  let service: jasmine.SpyObj<MedicamentsService>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentsComponent],
      providers: [
        { provide: ActivatedRoute, useValue:mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: NgbModal, useValue: mockDialog },
        {
          provide: MedicamentsService,
          useValue: jasmine.createSpyObj('MedicamentsService', ['ajouterMedicament','modifierMedicament', 'supprimerMedicament','chargerMedicament'])
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MedicamentsService) as jasmine.SpyObj<MedicamentsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit modification', () => {
    const mockMedicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 2,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    service.chargerMedicament.and.returnValue(mockMedicament);

    fixture.detectChanges();

    expect(component.estNouveau).toBeFalse();
    expect(component.nouveauMedicament.nom).toBe('Doliprane');
  });

  it('enregistrer avec nom vide', () => {
    component.nouveauMedicament.nom = '';
    component.enregistrer();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('enregistrer avec duree <= 0', () => {
    component.nouveauMedicament.nom = 'Paracétamol';
    component.nouveauMedicament.duree = 0;
    component.enregistrer();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('enregistrer avec quantite <= 0', () => {
    component.nouveauMedicament = {
      nom: 'Paracétamol',
      duree: 5,
      quantite: 0,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    component.enregistrer();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('enregistrer avec premierePrise undefined', () => {
    component.nouveauMedicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 1,
      intervallePrise: '6h',
      premierePrise: undefined
    };

    component.enregistrer();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('enregistrer estNouveau est vrai', () => {
    component.nouveauMedicament = {
      nom: 'Ibuprofène',
      duree: 5,
      quantite: 1,
      intervallePrise: '6h',
      premierePrise: new Date()
    };
    component.estNouveau = true;

    component.enregistrer();
    expect(service.ajouterMedicament).toHaveBeenCalledWith(component.nouveauMedicament);
  });

  it('enregistrer avec estNouveau est faux', () => {
    component.nouveauMedicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 1,
      intervallePrise: '8h',
      premierePrise: new Date()
    };
    component.estNouveau = false;

    component.enregistrer();

    expect(service.modifierMedicament).toHaveBeenCalledWith('Doliprane', component.nouveauMedicament);
  });

  it('supprimer', fakeAsync(() => {
    component.nouveauMedicament.nom = 'Aspirine';

    component.supprimer();
    tick();

    expect(service.supprimerMedicament).toHaveBeenCalledWith('Aspirine');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-medicaments']);
  }));

  it('annuler', fakeAsync(()=>{
    component.annuler();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-medicaments']);
  }));

  it('reinitialiserFormulaire', () => {
    component.nouveauMedicament.nom = 'Amoxicilline';
    component.estNouveau = false;

    component.reinitialiserFormulaire();

    expect(component.nouveauMedicament.nom).toBe('');
    expect(component.estNouveau).toBeTrue();
  });

  it('modifierMedicament', () => {
    component.modifierMedicament('Doliprane');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-medicaments', { nom: 'Doliprane' }]);
  });
});
