import { TestBed } from '@angular/core/testing';

import { ListesService } from './listes.service';

describe('ListesService', () => {
  let service: ListesService;

  beforeEach(() => {
    service = new ListesService();

    let store: { [key: string]: string } = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return store[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      store[key] = value;
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
  });

  it('instanciation', () => {
    expect(service).toBeTruthy();
  });

  describe('chargerNomsListes', () => {
    it('localStorage vide', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      expect(service.chargerNomsListes()).toEqual([]);
    });

    it('localStorage avec données', () => {
      const storedData = { contenu: ['liste1', 'liste2'] };
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(storedData));

      expect(service.chargerNomsListes()).toEqual(['liste1', 'liste2']);
    });
  });

  describe('charger', () => {
    it('sans contenu', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      expect(service.charger('liste1')).toBe('');
    });

    it('avec contenu', () => {
      const storedData = { contenu: 'contenu de la liste' };
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(storedData));

      expect(service.charger('liste1')).toBe('contenu de la liste');
    });
  });

  describe('supprimer', () => {
    it('suppression de rappel', () => {
      const initialList = ['liste1', 'liste2', 'liste3'];
      (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === service.accessKey) return JSON.stringify({ contenu: initialList });
        if (key === 'liste1') return JSON.stringify({ contenu: 'contenu1' });
        return null;
      });

      service.supprimer('liste1');

      expect(localStorage.removeItem).toHaveBeenCalledWith('liste1');
      
      const updatedList = initialList.filter(n => n !== 'liste1');
      expect(localStorage.setItem).toHaveBeenCalledWith(service.accessKey, JSON.stringify({ contenu: updatedList }));
    });
  });

  describe('enregistrer', () => {
    beforeEach(() => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify({ contenu: [] }));
    });

    it("creation d'un nouveau", () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify({ contenu: [] }));

      const result = service.enregistrer('contenu test', 'nouvelleListe', true, false);

      expect(result).toBe(3);
      expect(localStorage.setItem).toHaveBeenCalledWith('nouvelleListe', JSON.stringify({ contenu: 'contenu test' }));
      expect(localStorage.setItem).toHaveBeenCalledWith(service.accessKey, jasmine.any(String));
    });

    it("mise a jour d'un nouveau rappel", () => {
      (localStorage.getItem as jasmine.Spy).and.callFake((key) => {
        if (key === service.accessKey) return JSON.stringify({ contenu: ['existeDeja'] });
        if (key === 'existeDeja') return JSON.stringify({ contenu: 'ancien contenu' });
        return null;
      });

      const result = service.enregistrer('contenu modifié', 'existeDeja', false, false);

      expect(result).toBe(2);
      expect(localStorage.setItem).toHaveBeenCalledWith('existeDeja', JSON.stringify({ contenu: 'contenu modifié' }));
    });

    it('rappel existant avec nouvelleListe true et creationCourante false', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify({ contenu: ['listeExistante'] }));

      const result = service.enregistrer('contenu', 'listeExistante', true, false);

      expect(result).toBe(1);
    });
  });
});


