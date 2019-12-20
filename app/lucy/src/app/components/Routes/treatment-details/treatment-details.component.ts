
import { Component, OnInit, Input } from '@angular/core';
import { ObservationService } from 'src/app/services/observation.service';
import { CodeTableService } from 'src/app/services/code-table.service';
import { FormService } from 'src/app/services/form/form.service';
import { FormMode } from 'src/app/models';
import { SpeciesHerbicideSummary, HerbicideTankMix, SpeciesObservedTreated } from 'src/app/models/ChemicalTreatment';
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

    constructor(private observationService: ObservationService, private htmService: HerbicideTankMixService, private ocService: ObservationChemicalTreatmentService, private codeTables: CodeTableService, private formService: FormService) {}

    async ngOnInit() {
        this.config = await this.formService.getFormConfigForCurrentRoute();
        this.compileSpeciesHerbicidesList();
    }

    async compileSpeciesHerbicidesList() {
        const tankMixes: HerbicideTankMix[] = await this.htmService.getAllForTreatment(this.config.objectId);
        const speciesTreated: SpeciesObservedTreated[] = await this.ocService.getAllForTreatment(this.config.objectId);

        tankMixes.forEach((hItem, hIndex) => {
            speciesTreated.forEach(async (sItem, sIndex) => {
                const obs = await this.observationService.getWithId(sItem.observation);
                const speciesCommonName = obs.species.commonName + ' (' + obs.species.species + ' ' + obs.species.genus + ')';
                const herb = hItem.herbicide;
                const summary: SpeciesHerbicideSummary = {
                    speciesName: speciesCommonName,
                    herbicideName: herb.compositeName,
                    amountUsed: hItem.amountUsed,
                    applicationRate: hItem.applicationRate
                };
                this.speciesHerbicides.push(summary);
            });
        });
    }
}
