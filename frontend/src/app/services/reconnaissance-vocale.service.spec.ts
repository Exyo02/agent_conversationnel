import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ReconnaissanceVocaleService } from './reconnaissance-vocale.service';
import { NgZone } from '@angular/core';

describe('ReconnaissanceVocaleService', () => {
  let service: ReconnaissanceVocaleService;
  let zone: NgZone;
  let mockRecognition: any;

  beforeEach(() => {
    mockRecognition = {
      start: jasmine.createSpy('start'),
      stop: jasmine.createSpy('stop'),
      onresult: null,
      onerror: null,
      onend: null,
      lang: '',
      continuou: false
    };

    (window as any).webkitSpeechRecognition = function () {
      return mockRecognition;
    };

    zone = new NgZone({ enableLongStackTrace: false });
    service = new ReconnaissanceVocaleService(zone);
  });

  it('instanciation', () => {
    expect(service).toBeTruthy();
  });

  
  it('initialisation', () => {
    expect(service.reconnaissanceVocale).toBe(mockRecognition);
    expect(service.reconnaissanceVocale.lang).toBe('fr-FR');
    expect(service.reconnaissanceVocale.continuou).toBeFalse();
  });

  it('start', fakeAsync(() => {
    const resultPromise = service.start();
    
    const event = {
      results: [
        [
          { transcript: 'Bonjour' }
        ]
      ]
    };

    expect(mockRecognition.start).toHaveBeenCalled();

    mockRecognition.onresult(event);
    tick();

    resultPromise.then((result) => {
      expect(result).toBe('Bonjour');
      expect(service.ecoute).toBeFalse();
    });
  }));

  it('start et déjà en écoute', fakeAsync(() => {
    service.ecoute = true;

    service.start().catch((err) => {
      expect(err).toBe('En cours d\'écoute');
    });
    tick();
  }));

  it('erreur', async () => {
    const resultPromise = service.start();

    expect(mockRecognition.start).toHaveBeenCalled();

    mockRecognition.onerror({});

    await resultPromise.catch((err) => {
      expect(err).toBe('Erreur lors de la reconnaissance vocale');
      expect(service.ecoute).toBeFalse();
    });
  });


  it('stop', () => {
    service.ecoute = true;

    service.stop();

    expect(service.ecoute).toBeFalse();
    expect(mockRecognition.stop).toHaveBeenCalled();
  });

  it('stop avec écoute désactivée', () => {
    service.ecoute = false;

    service.stop();

    expect(mockRecognition.stop).not.toHaveBeenCalled();
  });
});
