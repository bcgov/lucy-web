import { InvasivePlantSpecies, Observation } from './observation';


export interface HerbicideCodes {
    herbicide_id: number;
    herbicideCode: string;
    compositeName: string;
    activeIngredient: string;
    tradeName: string;
    pmraRegNum: number;
    formulation: string;
    applicationRate: number;
    applicationUnits: string;
}

export interface HerbicideTankMix {
    displayLabel: string;
    applicationRate: number;
    amountUsed: number;
    herbicide: HerbicideCodes;
}

export interface SpeciesObservedTreated {
    observationObject: Observation;
    observation: number;
    treatmentAreaCoverage: number;
}

export interface SpeciesHerbicideSummary {
    speciesName: string;
    herbicideName: string;
    amountUsed: number;
    applicationRate: number;
}
