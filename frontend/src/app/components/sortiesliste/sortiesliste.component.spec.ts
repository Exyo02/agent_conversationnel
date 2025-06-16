import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortiesListeComponent } from './sortiesliste.component';
import { SortiesService } from '../../services/sorties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('SortieslisteComponent', () => {
  let component: SortiesListeComponent;
  let fixture: ComponentFixture<SortiesListeComponent>;
  let service: any;
  
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    service = {
      getAllSorties: jasmine.createSpy('getAllSorties').and.returnValue([])
    };

    await TestBed.configureTestingModule({
      imports: [SortiesListeComponent],
      providers:[
        { provide: SortiesService, useValue: service },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SortiesListeComponent);
    component = fixture.componentInstance;

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
