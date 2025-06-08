import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ContactsComponent } from './contacts.component';
import { ContactsService } from '../../services/contacts.service';
import { ParametresService } from '../../services/parametres.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let service: jasmine.SpyObj<ContactsService>;
  let parametresService: jasmine.SpyObj<ParametresService>;
  let mockNgbModal: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    parametresService = jasmine.createSpyObj('ParametresService', ['chargerParametres']);
    mockNgbModal = jasmine.createSpyObj('NgbModal', ['open']);
    parametresService.parametres$ = of({
      themeNuitJour: true,
      police: 'Arial',
      listeNomBot: ['Bot'],
      listePhotoBot: ['bot.png'],
      fondEcran: ['default.jpg'],
      fondEcranChoisi: 'default.jpg',
      modeNarrateur: true
    });

    await TestBed.configureTestingModule({
      imports: [ContactsComponent],
      providers:[
        { 
          provide: ParametresService, 
          useValue: parametresService
        },
        { provide: NgbModal, useValue: mockNgbModal },
        {
          provide: ContactsService,
          useValue: jasmine.createSpyObj('ContactsService', ['chargerContacts','enregistrer', 'charger'])
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ContactsService) as jasmine.SpyObj<ContactsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onInit', () => {
    service.chargerContacts.and.returnValue(['Alice', 'Bob']);

    component.ngOnInit();

    expect(component.contacts).toEqual(['Alice', 'Bob']);
    expect(component.isDarkMode).toBeTrue();
  });

  it('add contact', fakeAsync(() => {
    component.contacts = [];
    const modalRef = {
      componentInstance: {
        message: '',
        opt1: '',
        opt2: '',
        textField: false
      },
      result: Promise.resolve({
        opt: true,
        nom: 'Charlie',
        mail: 'charlie@example.com',
        telephone: '123456789'
      })
    } as unknown as NgbModalRef;

    mockNgbModal.open.and.returnValue(modalRef);
    service.enregistrer.and.stub();

    component.ajouterContact();
    fixture.detectChanges();

    fixture.detectChanges();
    tick();

    expect(service.enregistrer).toHaveBeenCalledWith('Charlie', 'charlie@example.com', '123456789');
    expect(component.contacts).toContain('Charlie');
  }));

  it('dark mode class', () => {
    component.isDarkMode = true;

    expect(component.getPClass()).toBe('p-nuit');
    expect(component.getDiscussionClass()).toBe('discussion discussion-nuit');
  });

  it('light mode class', () => {
    component.isDarkMode = false;

    expect(component.getPClass()).toBe('p-jour');
    expect(component.getDiscussionClass()).toBe('discussion discussion-jour');
  });

  it('envoi email', () => {
    component.contactCourant = { mail: 'dupond@example.com' };
    component.currentMessage = 'Bonjour';

    spyOn(window,'open').and.callThrough();

    component.envoiMail();

    expect(window.open).toHaveBeenCalledWith('mailto:dupond@example.com?subject=testApp&body=Bonjour');
    expect(component.messagesRecents).toContain('Bonjour');
    expect(component.currentMessage).toBe('');
  });

  it('should join conversation with contact', () => {
    service.charger.and.returnValue({ nom: 'Alice', mail: 'alice@example.com', telephone: '0000000000' });

    component.rejoindreConversation('Alice');

    expect(component.contactCourant).toEqual({ nom: 'Alice', mail: 'alice@example.com', telephone: '0000000000' });
    expect(component.messagesRecents).toEqual([]);
    expect(component.currentMessage).toBe('');
  });
});
