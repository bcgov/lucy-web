import { Component, OnInit } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';
import { AppRoutes } from 'src/app/constants';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {

  constructor(private routerService: RouterService) { }

  ngOnInit() {

  }

  createTreatment() {
    this.routerService.navigateTo(AppRoutes.AddMechanicalTreatment);
  }

  createObservation() {
    this.routerService.navigateTo(AppRoutes.AddObservation);
  }

  uploadFile() {

  }

}
