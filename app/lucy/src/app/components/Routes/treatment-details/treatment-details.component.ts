
import { Component, OnInit, Input } from '@angular/core';
import { CodeTableService } from 'src/app/services/code-table.service';
import { FormService } from 'src/app/services/form/form.service';
import { FormMode } from 'src/app/models';
import { SpeciesHerbicideSummary, ChemicalTreatment, HerbicideCodes } from 'src/app/models/ChemicalTreatment';

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

    constructor(private codeTables: CodeTableService, private formService: FormService) {}

    async ngOnInit() {
        this.config = await this.formService.getFormConfigForCurrentRoute();
        if (this.config) {
          this.treatment = await this.formService.getObjectWithId(this.config.api, this.config.objectId);
          if (this.treatment !== undefined) {
            this.responseBody = this.treatment;
          }
          this.compileSpeciesHerbicidesList();
        }
    }

    async compileSpeciesHerbicidesList() {
      const tankMixes = this.responseBody.tankMixes;
      const speciesTreated = this.responseBody.speciesObservations;
      tankMixes.forEach((hItem, hIndex) => {
        speciesTreated.forEach(async (sItem, sIndex) => {
            const obs = sItem.observation;
            const speciesCommonName = obs.species.commonName + ' (' + obs.species.species + ' ' + obs.species.genus + ')';
            let herb: HerbicideCodes;

            // depending on form mode, hItem.herbicide may be a HerbicideCodes object
            // or an int representing the herbicide_id
            // if it's a number, get the HerbicideCodes object from the code table
            if (typeof(hItem.herbicide) === 'number') {
              herb = await this.codeTables.getHerbicideWithId(hItem.herbicide);
            } else {
              // else hItem.herbicide is already a HerbicideCodes object
              herb = hItem.herbicide;
            }
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
