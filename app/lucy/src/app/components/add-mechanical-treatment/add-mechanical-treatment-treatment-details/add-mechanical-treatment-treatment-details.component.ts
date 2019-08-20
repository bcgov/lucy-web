import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';

@Component({
  selector: 'app-add-mechanical-treatment-treatment-details',
  templateUrl: './add-mechanical-treatment-treatment-details.component.html',
  styleUrls: ['./add-mechanical-treatment-treatment-details.component.css']
})
export class AddMechanicalTreatmentTreatmentDetailsComponent implements OnInit {

   ///// Form Mode
   private _mode: FormMode = FormMode.View;
   // Get
   get mode(): FormMode {
     return this._mode;
   }
   // Set
   @Input() set mode(mode: FormMode) {
     this._mode = mode;
   }
   ////////////////////
 
   ///// Invasive plant objects
   private _object: MechanicalTreatment;
   // Get
   get object(): MechanicalTreatment {
     return this._object;
   }
   // Set
   @Input() set object(object: MechanicalTreatment) {
     this._object = object;
     this.autofill();
   }
   ////////////////////

   @Output() basicInfoChanged = new EventEmitter<MechanicalTreatment>();
   constructor() { }

   ngOnInit() {

   }

   autofill() {

   }

}
