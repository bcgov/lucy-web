
import { Component, OnInit, Input } from '@angular/core';
import { ObservationService } from 'src/app/services/observation.service';
import { CodeTableService } from 'src/app/services/code-table.service';
import { FormService } from 'src/app/services/form/form.service';
import { FormMode } from 'src/app/models';
import { SpeciesHerbicideSummary, HerbicideTankMix, SpeciesObservedTreated, ChemicalTreatment } from 'src/app/models/ChemicalTreatment';
import { HerbicideTankMixService, ObservationChemicalTreatmentService } from 'src/app/services/chemical-treatment.service';

@Component({
    selector: 'app-treatment-details',
    templateUrl: './treatment-details.component.html',
    styleUrls: ['./treatment-details.component.css']
  })
export class TreatmentDetailsComponent implements OnInit {
    // Base form response body
    private _responseBody: any = {};
    get responseBody(): any {
      return this._responseBody;
    }
    @Input() set responseBody(responseBody: any) {
      this._responseBody = responseBody;
    }

    ///// Form Mode
    private _mode: FormMode = FormMode.View;
    get mode(): FormMode {
      return this._mode;
    }
    @Input() set mode(mode: FormMode) {
      this._mode = mode;
      if (this.mode === FormMode.View) {
        this.inViewMode = true;
      } else { this.inViewMode = false; }
    }

    speciesHerbicides: SpeciesHerbicideSummary[] = [];
    inViewMode: boolean;
    config: any;
    treatment: ChemicalTreatment;

    constructor(private observationService: ObservationService, private htmService: HerbicideTankMixService, private ocService: ObservationChemicalTreatmentService, private codeTables: CodeTableService, private formService: FormService) {}

    async ngOnInit() {
        this.config = await this.formService.getFormConfigForCurrentRoute();
        this.treatment = await this.formService.getObjectWithId(this.config.api, this.config.objectId);
        this.compileSpeciesHerbicidesList();
    }

    async compileSpeciesHerbicidesList() {
      if (this.mode === FormMode.Create) {
        const tankMixes = this.responseBody.tankMixes;
        const speciesTreated = this.responseBody.speciesObservations;

        tankMixes.forEach((hItem, hIndex) => {
          speciesTreated.forEach(async (sItem, sIndex) => {
              const obs = sItem.observation;
              const speciesCommonName = obs.species.commonName + ' (' + obs.species.species + ' ' + obs.species.genus + ')';
              const herb = await this.codeTables.getHerbicideWithId(hItem.herbicide);
              const summary: SpeciesHerbicideSummary = {
                  speciesName: speciesCommonName,
                  herbicideName: herb.compositeName,
                  amountUsed: hItem.dilutionRate,
                  applicationRate: hItem.applicationRate
              };
              this.speciesHerbicides.push(summary);
          });
        });
      } else if (this.mode === FormMode.Edit  || FormMode.View) {
        const tankMixes = this.treatment.tankMixes;
        const speciesTreated = this.treatment.speciesObservations;

        tankMixes.forEach((hItem, hIndex) => {
          speciesTreated.forEach(async (sItem, sIndex) => {
              const obs = sItem.observation;
              const speciesCommonName = obs.species.commonName + ' (' + obs.species.species + ' ' + obs.species.genus + ')';
              const herb = await this.codeTables.getHerbicideWithId(hItem.herbicide.herbicide_id);
              const summary: SpeciesHerbicideSummary = {
                  speciesName: speciesCommonName,
                  herbicideName: herb.compositeName,
                  amountUsed: hItem.dilutionRate,
                  applicationRate: hItem.applicationRate
              };
              this.speciesHerbicides.push(summary);
          });
      });
      }
    }
}
