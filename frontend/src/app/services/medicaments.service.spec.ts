import { TestBed } from '@angular/core/testing';

import { MedicamentsService } from './medicaments.service';

interface Medicament {
  nom: string;
  duree: number | null;
  quantite: number | null;
  intervallePrise?: string;
  premierePrise?: Date;
}

describe('MedicamentsService', () => {
  let service: MedicamentsService;

  const storageMock: { [key: string]: string } = {};

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return storageMock[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      storageMock[key] = value;
    });

    service = new MedicamentsService();
  });

  afterEach(() => {
    for (let key in storageMock) {
      delete storageMock[key];
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ajout', () => {
    const mockMedicament:Medicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 2,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    service.ajouterMedicament(mockMedicament);

    const data = JSON.parse(storageMock['medicaments']);
    expect(data['Doliprane'].nom).toEqual(mockMedicament.nom);
    expect(data['Doliprane'].duree).toEqual(mockMedicament.duree);
    expect(data['Doliprane'].quantite).toEqual(mockMedicament.quantite);
    expect(data['Doliprane'].intervallePrise).toEqual(mockMedicament.intervallePrise);
    expect(new Date(data['Doliprane'].premierePrise).getTime()).toEqual(mockMedicament.premierePrise!.getTime());
  });

  it('modification', () => {
    const mockMedicament:Medicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 2,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    const modifMockMedicament:Medicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 3,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    service.ajouterMedicament(mockMedicament);
    service.modifierMedicament('Doliprane', modifMockMedicament);

    const data = JSON.parse(storageMock['medicaments']);
    expect(data['Doliprane'].quantite).toEqual(modifMockMedicament.quantite);
  });

  it('modifier un médicament non existant', () => {
    const modifMockMedicament:Medicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 3,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    service.modifierMedicament('Doliprane', modifMockMedicament);

    expect(storageMock['medicaments']).toBeUndefined();
  });

  it('charger', () => {
    const mockMedicament:Medicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 3,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    service.ajouterMedicament(mockMedicament);

    const result = service.chargerMedicament('Doliprane');
    expect(result).toEqual(mockMedicament);
  });

  it('charger un médicament inexistant', () => {
    expect(service.chargerMedicament('Inconnu')).toBeUndefined();
  });

  it('supprimer', () => {
    const mockMedicament:Medicament = {
      nom: 'Doliprane',
      duree: 5,
      quantite: 3,
      intervallePrise: '8h',
      premierePrise: new Date()
    };

    service.ajouterMedicament(mockMedicament);
    service.supprimerMedicament('Doliprane');

    const data = JSON.parse(storageMock['medicaments']);
    expect(data['Doliprane']).toBeUndefined();
  });

  it('getAllMedicaments', () => {
    const meds: Medicament[] = [
      {
        nom: 'Doliprane',
        duree: 5,
        quantite: 3,
        intervallePrise: '8h',
        premierePrise: new Date()
      },
      {
        nom: 'Ibuprofene',
        duree: 5,
        quantite: 6,
        intervallePrise: '8h',
        premierePrise: new Date()
      }
    ];

    meds.forEach(m => service.ajouterMedicament(m));

    const result = service.getAllMedicaments();
    expect(result.length).toBe(2);
    expect(result).toContain(jasmine.objectContaining({ nom: 'Doliprane' }));
    expect(result).toContain(jasmine.objectContaining({ nom: 'Ibuprofene' }));
  });
});
