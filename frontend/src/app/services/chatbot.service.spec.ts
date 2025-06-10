import { TestBed } from '@angular/core/testing';

import { ChatbotService } from './chatbot.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

const mockHttpClient = {
  get: jasmine.createSpy().and.returnValue(of({})),
  post: jasmine.createSpy().and.returnValue(of({})),
  put: jasmine.createSpy().and.returnValue(of({})),
  delete: jasmine.createSpy().and.returnValue(of({}))
}

describe('ChatbotService', () => {
  let service: ChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:HttpClient,useValue:mockHttpClient}]
    });
    service = TestBed.inject(ChatbotService);
  });

  it('instanciation', () => {
    expect(service).toBeTruthy();
  });

  it('envoi doit effectuer une requête POST avec le bon header et corps', () => {
    const message = 'Bonjour';
    service.envoi(message).subscribe();

    expect(mockHttpClient.post).toHaveBeenCalled();

    const [url, body, options] = mockHttpClient.post.calls.mostRecent().args;

    expect(url).toBe('https://api.mistral.ai/v1/chat/completions');
    expect(body.model).toBe('mistral-medium');
    expect(body.messages.some((m: any) => m.content === message && m.role === 'user')).toBeTrue();

    const headers = options.headers as HttpHeaders;
    expect(headers.get('Authorization')).toContain('Bearer');
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('addReponse doit ajouter une réponse à la liste des messages', () => {
    const initialLength = (service as any).messages.length;
    service.addReponse('Réponse du bot');
    const messages = (service as any).messages;

    expect(messages.length).toBe(initialLength + 1);
    expect(messages[messages.length - 1]).toEqual({ role: 'assistant', content: 'Réponse du bot' });
  });

  it('getDemandeInfos retourne une demande avec recherche', () => {
    const result = service.getDemandeInfos(0, 'santé');

    expect(result.num).toBe(0);
  });

  it('getDemandeInfos retourne un numéro de catégorie spécifique', () => {
    const actus = service.getDemandeInfos(0, '');
    const risques = service.getDemandeInfos(1, '');
    const loisirs = service.getDemandeInfos(2, '');
    const alim = service.getDemandeInfos(3, '');
    const aides = service.getDemandeInfos(4, '');

    expect(actus.num).toBe(0);
    expect(risques.num).toBe(1);
    expect(loisirs.num).toBe(2);
    expect(alim.num).toBe(3);
    expect(aides.num).toBe(4);
  });

  it('getDemandeInfos avec catégorie -1 retourne une catégorie aléatoire valide', () => {
    const result = service.getDemandeInfos(-1, "");

    expect(result.num).toBeGreaterThanOrEqual(0);
    expect(result.num).toBeLessThanOrEqual(4);
    expect(result.demande).toBeDefined();
  });
});
