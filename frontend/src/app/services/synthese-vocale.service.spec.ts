import { TestBed } from '@angular/core/testing';

import { SyntheseVocaleService } from './synthese-vocale.service';

describe('SyntheseVocaleService', () => {
  let service: SyntheseVocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyntheseVocaleService);
  });

  it('instanciation', () => {
    expect(service).toBeTruthy();
  });

  it('initialisation', () => {
    expect(service.synthese).toBeDefined();
    expect(service.synthese.volume).toBe(1);
    expect(service.synthese.rate).toBe(1);
    expect(service.synthese.lang).toBe('fr-FR');
  });

  it('speak avec message est vide', () => {
    const speakSpy = spyOn(window.speechSynthesis, 'speak');

    service.parler('');

    expect(speakSpy).not.toHaveBeenCalled();
  });

  it('speak avec message', () => {
    const speakSpy = spyOn(window.speechSynthesis, 'speak');
    const message = 'Bonjour à tous';

    service.parler(message);

    expect(service.synthese.text).toBe(message);
    expect(speakSpy).toHaveBeenCalledWith(service.synthese);
  });
});
