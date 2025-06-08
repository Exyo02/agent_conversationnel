import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let activeModalSpy: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affichage du message et des boutons', () => {
    component.message = 'TitreTest';
    component.opt1 = 'Oui';
    component.opt2 = 'Non';
    
    fixture.detectChanges();

    const dom = fixture.nativeElement as HTMLElement;
    expect(dom.textContent).toContain('TitreTest');
    expect(dom.textContent).toContain('Oui');
    expect(dom.textContent).toContain('Non');
  });

  it('textField = true et saisies valides', () => {
    component.textField = true;
    component.nom = 'dupond';
    component.mail = 'dupond@example.com';
    component.telephone = '0000000000';

    fixture.detectChanges();

    const fakeInput = {
      validity: { valid: true }
    } as HTMLInputElement;

    spyOn(document, 'getElementById').and.callFake((id: string) => fakeInput);

    component.result(true);

    expect(activeModalSpy.close).toHaveBeenCalledWith({
      opt: true,
      nom: 'dupond',
      mail: 'dupond@example.com',
      telephone: '0000000000'
    });
  });

  it('textField = false et opt1', () => {
    component.textField = false;

    component.result(true);

    expect(activeModalSpy.close).toHaveBeenCalledWith(true);
  });

  it('textField = false et opt2', () => {
    component.textField = false;

    component.result(false);

    expect(activeModalSpy.close).toHaveBeenCalledWith(false);
  });

  it('textField = true et opt2', () => {
    component.textField = true;

    component.result(false);
    
    expect(activeModalSpy.close).toHaveBeenCalledWith({ opt: false });
  });

  it('valid', () => {
    const input = document.createElement('input');
    input.setAttribute('id', 'nom');
    input.setCustomValidity('');
    document.body.appendChild(input);

    expect(component.valid('nom')).toBeTrue();
  });
});
