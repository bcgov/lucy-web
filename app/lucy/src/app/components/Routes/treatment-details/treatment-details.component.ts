
import { Component, OnInit, Input } from '@angular/core';
import { ObservationService } from 'src/app/services/observation.service';
import { CodeTableService } from 'src/app/services/code-table.service';
import { SpeciesHerbicideSummary, HerbicideTankMix, SpeciesObservedTreated } from 'src/app/models/ChemicalTreatment';

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

    speciesHerbicides: SpeciesHerbicideSummary[] = [];

    readonly = true;

    constructor(private observationService: ObservationService, private codeTables: CodeTableService) {}

    ngOnInit() {
        this.compileSpeciesHerbicidesList();
    }

    async compileSpeciesHerbicidesList() {
        const tankMixes: any[] = this.responseBody.tankMixes;
        const speciesTreated: any[] = this.responseBody.speciesObservations;

        tankMixes.forEach((hItem, hIndex) => {
            speciesTreated.forEach(async (sItem, sIndex) => {
                const obs = await this.observationService.getWithId(sItem.observation);
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
    }
}
