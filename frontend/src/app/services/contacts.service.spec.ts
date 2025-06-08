import { TestBed } from '@angular/core/testing';

import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;

  const storageMock: { [key: string]: string } = {};

  beforeEach(() => {
    service = new ContactsService();

    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return storageMock[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      storageMock[key] = value;
    });
  });

  afterEach(() => {
    for (let key in storageMock) {
      delete storageMock[key];
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('chargerContacts', () => {
    it('liste vide', () => {
      expect(service.chargerContacts()).toEqual([]);
    });

    it('liste de noms de contacts', () => {
      const noms = ['Alice', 'Bob'];
      storageMock[service.accessKey] = JSON.stringify({ contenu: noms });

      expect(service.chargerContacts()).toEqual(noms);
    });
  });

  describe('enregistrer', () => {
    it('enregistrer un nouveau contact', () => {
      expect(service.enregistrer('Charlie', 'charlie@mail.com', '0123456789')).toBeTrue();

      const savedContact = JSON.parse(storageMock['Charlie']);
      expect(savedContact).toEqual({
        mail: 'charlie@mail.com',
        telephone: '0123456789'
      });

      const contactList = JSON.parse(storageMock[service.accessKey]).contenu;
      expect(contactList).toContain('Charlie');
    });

    it('enregistrer avec nom qui existe déjà', () => {
      storageMock[service.accessKey] = JSON.stringify({ contenu: ['Alice'] });

      expect(service.enregistrer('Alice', 'alice@mail.com', '0987654321')).toBeFalse();
      expect(storageMock['Alice']).toBeUndefined(); 
    });
  });

  describe('charger', () => {
    it('charger infos du contact', () => {
      storageMock['Alice'] = JSON.stringify({ mail: 'alice@mail.com', telephone: '1234567890' });

      const contact = service.charger('Alice');
      expect(contact).toEqual({
        nom: 'Alice',
        mail: 'alice@mail.com',
        telephone: '1234567890'
      });
    });

    it('false si le contact n’existe pas', () => {
      expect(service.charger('Inconnu')).toBeFalse();
    });
  });
});
