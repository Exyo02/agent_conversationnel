import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD

<<<<<<<< HEAD:frontend/src/app/components/contacts/contacts.component.spec.ts
=======
>>>>>>> 6bc19d7 (Modifications Parametres et interface)
import { ContactsComponent } from './contacts.component';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsComponent]
    })
<<<<<<< HEAD
    .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
========
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
>>>>>>>> 6bc19d7 (Modifications Parametres et interface):frontend/src/app/dialog/dialog.component.spec.ts
=======
      .compileComponents();

     fixture = TestBed.createComponent(ContactsComponent);
>>>>>>> 6bc19d7 (Modifications Parametres et interface)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
