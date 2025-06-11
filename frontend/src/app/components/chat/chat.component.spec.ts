import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatbotService } from '../../services/chatbot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsComponent } from '../contacts/contacts.component';
import { ContactsService } from '../../services/contacts.service';
import { ListeComponent } from '../liste/liste.component';
import { ListesService } from '../../services/listes.service';
import { SortiesService } from '../../services/sorties.service';

const mockHttpClient = {
  get: jasmine.createSpy().and.returnValue(of({})),
  post: jasmine.createSpy().and.returnValue(of({})),
  put: jasmine.createSpy().and.returnValue(of({})),
  delete: jasmine.createSpy().and.returnValue(of({}))
}

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let service: any;
  let contactsService: jasmine.SpyObj<ContactsService>;
  let listesService: jasmine.SpyObj<ListesService>;
  let sortiesService: jasmine.SpyObj<SortiesService>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    service= {
      envoi: jasmine.createSpy('envoi').and.returnValue(of({
        choices: [{ message: { content: 'Bonjour !' } }]
      })),
      addReponse: jasmine.createSpy('addReponse')
    };

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers:[
        {provide:HttpClient,useValue:mockHttpClient},
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        {
          provide: ContactsService,
          useValue: jasmine.createSpyObj('ContactsService', ['enregistrer'])
        },
        {
          provide: ListesService,
          useValue: jasmine.createSpyObj('ListesService', ['enregistrer'])
        },
        {
          provide: SortiesService,
          useValue: jasmine.createSpyObj('SortiesService', ['ajouterSortie'])
        },
        {
          provide: ChatbotService,
          useValue: service
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;

    contactsService = TestBed.inject(ContactsService) as jasmine.SpyObj<ContactsService>;
    listesService = TestBed.inject(ListesService) as jasmine.SpyObj<ListesService>;
    sortiesService = TestBed.inject(SortiesService) as jasmine.SpyObj<SortiesService>;
    fixture.detectChanges();
  });

  it('instanciation', () => {
    expect(component).toBeTruthy();
  });

  it('envoi message avec Enter press', () => {
    component.currentText = 'Bonjour';
    component.envoyer = jasmine.createSpy('envoyer');
    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(component.envoyer).toHaveBeenCalled();
  });

  it('voice recognition avec "+" press', () => {
    component.ecoute = jasmine.createSpy('ecoute');
    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }));

    expect(component.ecoute).toHaveBeenCalled();
  });

  it('navigation app-infos', fakeAsync(() => {
    service.envoi.and.returnValue(of({ choices: [{ message: { content: 'Navigation vers app-infos' } }] }));
    component.currentText = "test";
    component.envoyer();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-infos']);
  }));

  it('navigation app-medicaments', fakeAsync(() => {
    service.envoi.and.returnValue(of({
      choices: [{ message: { content: 'Navigation vers app-medicaments' } }]
    }));
    component.currentText = "test";
    component.envoyer();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-medicaments']);
  }));

  it('navigation app-sorties', fakeAsync(() => {
    service.envoi.and.returnValue(of({ choices: [{ message: { content: 'Navigation vers app-sorties page' } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-sorties']);
  }));

  it('navigation app-contacts', fakeAsync(() => {
    service.envoi.and.returnValue(of({ choices: [{ message: { content: 'Navigation vers app-contacts page' } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-contacts']);
  }));

  it('navigation app-todolist', fakeAsync(() => {
    service.envoi.and.returnValue(of({ choices: [{ message: { content: 'Navigation vers app-todolist page' } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-todolist']);
  }));

  it('add-contact', fakeAsync(() => {
    const answer = 'add-contact {"nom":"dupond","mail":"dupond@example.com","telephone":"0000000000"}';
    service.envoi.and.returnValue(of({ choices: [{ message: { content: answer } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(contactsService.enregistrer).toHaveBeenCalledWith("dupond", "dupond@example.com", "0000000000");
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-contacts']);
  }));

  it('add-rappel', fakeAsync(() => {
    const answer = 'add-list {"title":"Courses","content":"Acheter du lait"}';
    service.envoi.and.returnValue(of({ choices: [{ message: { content: answer } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(listesService.enregistrer).toHaveBeenCalledWith("Acheter du lait", "Courses", true, true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-todolist']);
  }));

  it('add-sortie', fakeAsync(() => {
    const answer = 'add-sortie {"title":"Concert","date":"2025-06-20","heure":"20:00","adresse":"Paris"}';
    service.envoi.and.returnValue(of({ choices: [{ message: { content: answer } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(sortiesService.ajouterSortie).toHaveBeenCalledWith({
      title: "Concert",
      date: "2025-06-20",
      heureDebut: "20:00",
      adresse: "Paris"
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-sorties']);
  }));

  it('navigation vers app-infos avec search', fakeAsync(() => {
    const mockResponse = 'app-infos {"search": "test"}';
    service.envoi.and.returnValue(of({ choices: [{ message: { content: mockResponse } }] }));
    component.currentText = 'test';
    component.envoyer();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-infos', 'test']);
  }));

  it('affichage messages and refresh', fakeAsync(() => {
    component.currentText = 'Bonjour';
    component.envoyer();
    tick();

    expect(component.messages.length).toBeGreaterThan(0);
    expect(component.currentText).toBe('');
  }));
});
