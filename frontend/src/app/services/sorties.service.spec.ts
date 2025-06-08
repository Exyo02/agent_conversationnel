import { TestBed } from '@angular/core/testing';

import { Sortie, SortiesService } from './sorties.service';

describe('SortiesService', () => {
  let service: SortiesService;

  const mockSortie: Sortie = {
    title: 'Sortie au parc',
    date: '2025-06-08',
    heureDebut: '14:00',
    adresse: 'Parc de la ville'
  };

  const storageMock: { [key: string]: string } = {};

  const storageKey = 'sorties';

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return storageMock[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      storageMock[key] = value;
    });

    service = new SortiesService();
  });

  
  afterEach(() => {
    for (const key in storageMock) {
      delete storageMock[key];
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ajouter', () => {
    service.ajouterSortie(mockSortie);

    const data = JSON.parse(storageMock[storageKey]);
    expect(data['Sortie au parc']).toEqual(mockSortie);
  });

  it('modifier', () => {
    service.ajouterSortie(mockSortie);

    const sortieModifiee: Sortie = {
      title: 'Sortie au parc',
      date: '2025-06-09',
      heureDebut: '16:00',
      adresse: 'Parc central'
    };

    service.modifierSortie('Sortie au parc', sortieModifiee);
    const data = JSON.parse(storageMock[storageKey]);

    expect(data['Sortie au parc']).toEqual(sortieModifiee);
  });

  it('modifier une sortie inexistante', () => {
    service.modifierSortie('Inconnue', mockSortie);

    expect(storageMock[storageKey]).toBeUndefined();
  });

  it('charger', () => {
    service.ajouterSortie(mockSortie);

    const sortie = service.chargerSortie('Sortie au parc');
    expect(sortie).toEqual(mockSortie);
  });

  it('charger une sortie inexistante', () => {
    const sortie = service.chargerSortie('Inconnu');

    expect(sortie).toBeUndefined();
  });

  
  it('supprimer', () => {
    service.ajouterSortie(mockSortie);
    service.supprimerSortie('Sortie au parc');

    const data = JSON.parse(storageMock[storageKey]);
    expect(data['Sortie au parc']).toBeUndefined();
  });

  it('getAllSorties', () => {
    const sortie2: Sortie = {
      title: 'Musée',
      date: '2025-06-10',
      heureDebut: '10:00',
      adresse: 'Musée national'
    };

    service.ajouterSortie(mockSortie);
    service.ajouterSortie(sortie2);

    const sorties = service.getAllSorties();

    expect(sorties.length).toBe(2);
    expect(sorties).toContain(jasmine.objectContaining({ title: 'Sortie au parc' }));
    expect(sorties).toContain(jasmine.objectContaining({ title: 'Musée' }));
  });
});
