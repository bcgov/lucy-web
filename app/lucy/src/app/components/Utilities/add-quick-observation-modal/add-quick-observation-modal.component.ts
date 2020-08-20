/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Andrea Williams on 2019-12-09.
 */
import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import {NgbModal, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { InvasivePlantSpecies, SpeciesDensityCodes, SpeciesDistributionCodes, ObservationTypeCodes, SoilTextureCodes } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';

@Component({
  selector: 'app-add-quick-observation-modal',
  templateUrl: './add-quick-observation-modal.component.html',
  styleUrls: ['./add-quick-observation-modal.component.css']
})
export class AddQuickObservationModalComponent implements OnInit, AfterViewInit {

  public species: InvasivePlantSpecies;
  public density: SpeciesDensityCodes;
  public distribution: SpeciesDistributionCodes;
  public surveyType: ObservationTypeCodes;
  public soilTexture: SoilTextureCodes;

  speciesDropdownObjects: DropdownObject[];
  densityDropdownObjects: DropdownObject[];
  distributionDropdownObjects: DropdownObject[];
  surveyTypeDropdownObjects: DropdownObject[];
  soilTextureDropdownObjects: DropdownObject[];

  private modalReference: NgbModalRef;

  // Lottie Animation
  public lottieConfig: Object;
  private anim: any;
  //private underConstructionIcon = 'https://assets8.lottiefiles.com/packages/lf20_hntzYU.json';
  private underConstructionIcon = '../../../../assets/lf20_hntzYU.json';

  @Output() addQuickObservationModalEventEmitter = new EventEmitter<boolean>();
  @ViewChild('addQuickObservationModal') private content;

  constructor(private modalService: NgbModal, private codeTables: CodeTableService, private dropdowns: DropdownService) {
    this.lottieConfig = {
      path: this.underConstructionIcon,
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  async ngOnInit() {
      // await this.codeTables.getInvasivePlantSpecies()
      //   .then((codes) => {
      //       this.speciesDropdownObjects = this.dropdowns.createDropdownObjectsFrom(codes);
      //   });
      // await this.codeTables.getDensityCodes()
      //   .then((codes) => {
      //       this.densityDropdownObjects = this.dropdowns.createDropdownObjectsFrom(codes);
      //   });
      // await this.codeTables.getDistributionCodes()
      //   .then((codes) => {
      //       this.distributionDropdownObjects = this.dropdowns.createDropdownObjectsFrom(codes);
      //   });
      // await this.codeTables.getObservationTypeCodes()
      //   .then((codes) => {
      //       this.surveyTypeDropdownObjects = this.dropdowns.createDropdownObjectsFrom(codes);
      //   });
      // await this.codeTables.getSoilTextureCodes()
      //   .then((codes) => {
      //       this.soilTextureDropdownObjects = this.dropdowns.createDropdownObjectsFrom(codes);
      //   });
  }

  ngAfterViewInit(): void {
    this.showModal();
  }

   /////////// Lottie ///////////
   handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.anim.setSpeed(speed);
  }
  /////////// End Lottie ///////////

  private removeModal() {
    if (this.modalReference) {
      this.modalReference.dismiss();
      delete(this.modalReference);
      this.addQuickObservationModalEventEmitter.emit(true);
    }
  }

  private submitObservation() {
    this.addQuickObservationModalEventEmitter.emit(true);
  }

  private async showModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'alertModalTitle',
    };

    if (!this.modalReference) {
      this.modalReference = this.modalService.open(this.content, ngbModalOptions);
    }
  }

}
