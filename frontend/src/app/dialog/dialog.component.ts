import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule,FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  @Input() message = '';
  @Input() opt1 = '';
  @Input() opt2 = '';
  @Input() textField = false;
  nom:string = "";
  mail:string = "";
  telephone:string = "";

  constructor(public activeModal:NgbActiveModal){}

  valid(field:string){
    let f = document.getElementById(field) as HTMLInputElement;
    return f.validity.valid;
  }

  result(opt:boolean){
    if(this.textField){
      if(!opt){
        this.activeModal.close({opt:opt});
      }else{
        if(this.valid("nom") 
        && this.valid("mail") 
        && this.valid("telephone")){
          this.activeModal.close({
            opt:opt,
            nom:this.nom,
            mail:this.mail,
            telephone:this.telephone
          });
        }
      }
    }else{
      this.activeModal.close(opt)
    }
  }
}
