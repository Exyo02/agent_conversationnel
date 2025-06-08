import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentsListComponent } from './medicamentliste.component';
import { MedicamentsService } from '../../services/medicaments.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { of } from 'rxjs';

describe('MedicamentListeComponent', () => {
  let component: MedicamentsListComponent;
  let fixture: ComponentFixture<MedicamentsListComponent>;
  let mockMedicamentsService: any;
  
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const medicamentMock1 = {
    nom: 'Paracétamol',
    duree: 10,
    quantite: 1,
    intervallePrise: 7,
    premierePrise: new Date(Date.now()-2*60*60*1000)
  };

  const medicamentMock2 = {
    nom: 'Ibuprofène',
    duree: 10,
    quantite: 2,
    intervallePrise: 1,
    premierePrise: new Date(Date.now()-0.5*60*60*1000)
  };

  const medicamentMock3 = {
    nom: 'Doliprane',
    duree: 10,
    quantite: 2,
    intervallePrise: 6,
    premierePrise: new Date(Date.now()-5.5*60*60*1000)
  };

  beforeEach(async () => {
    mockMedicamentsService = {
      getAllMedicaments: jasmine.createSpy('getAllMedicaments').and.returnValue([medicamentMock1,medicamentMock2,medicamentMock3])
    };

    await TestBed.configureTestingModule({
      imports: [MedicamentsListComponent],
      providers:[
        { provide: MedicamentsService, useValue: mockMedicamentsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('chargerMedicaments', () => {
    fixture.detectChanges();
    expect(mockMedicamentsService.getAllMedicaments).toHaveBeenCalled();
    expect(component.medicaments.length).toBeGreaterThan(0);
    expect(component.medicaments[0].nom).toBe('Ibuprofène');
    expect(component.medicaments[1].nom).toBe('Doliprane');
    expect(component.medicaments[2].nom).toBe('Paracétamol');
  });

  it('ajouter medicament', () => {
    component.ajouterNouveauMedicament();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-medicaments/ajouter']);
  });

  it('modifier medicament', () => {
    component.modifierMedicament('Doliprane');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-medicaments/editer', 'Doliprane']);
  });

  it('class pour alerte = 0', () => {
    const medic = {
      suivant: { alerte: 0 }
    };
    expect(component.getLineClass(medic)).toBe('line line-alerte-alert');
  });

  it('class pour alerte = 1', () => {
    const medic = {
      suivant: { alerte: 1 }
    };
    expect(component.getLineClass(medic)).toBe('line line-alerte-warning');
  });

  it('class pour alerte = 2', () => {
    const medic = {
      suivant: { alerte: 2 }
    };
    expect(component.getLineClass(medic)).toBe('line line-without-alerte');
  });

  it('getSuivant null si la date de fin est passé', () => {
    const med = {
      premierePrise: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      duree: 2,
      intervallePrise: 6
    };
    const result = component.getSuivant(med, new Date());

    expect(result).toBeNull();
  });
});
