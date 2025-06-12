import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortiesListeComponent } from './sortiesliste.component';
import { SortiesService } from '../../services/sorties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('SortieslisteComponent', () => {
  let component: SortiesListeComponent;
  let fixture: ComponentFixture<SortiesListeComponent>;
  let service: jasmine.SpyObj<SortiesService>;
  
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortiesListeComponent],
      providers:[
        {
          provide: SortiesService,
          useValue: jasmine.createSpyObj('SortiesService', ['getAllSorties'])
        },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SortiesListeComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(SortiesService) as jasmine.SpyObj<SortiesService>;
    fixture.detectChanges();
  });

  it('instanciation', () => {
    expect(component).toBeTruthy();
  });

  it('ajouter sortie', () => {
    component.ajouterNouvelleSortie();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-sorties/ajouter']);
  });

  it('modifier sortie', () => {
    component.modifierSortie("Visite d'un jardin");

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app-sorties/editer', "Visite d'un jardin"]);
  });
});
