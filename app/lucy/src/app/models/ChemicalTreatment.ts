import { Observation, Jurisdiction, SpeciesAgencyCodes } from './observation';


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

export interface ChemicalTreatment {
    chemical_treatment_id: number;
    latitude: number;
    longitude: number;
    length: number;
    width: number;
    firstApplicator: string;
    secondApplicator: string;
    pesticideEmployer: PesticideEmployerCode;
    speciesAgency: SpeciesAgencyCodes;
    date: string;
    primaryPaperFileReference: string;
    secondaryPaperFileReference: string;
    jurisdiction: Jurisdiction;
    pmp: string;
    pup: string;
    treatmentMethod: ChemicalTreatmentMethodCode;
    humidity: number;
    temperature: number;
    windSpeed: number;
    windDirection: WindDirectionCode;
    tankMixes: HerbicideTankMix[];
    speciesObservedTreated: SpeciesObservedTreated[];
    speciesHerbicides: SpeciesHerbicideSummary[];
    comment: string;
}

export interface ChemicalTreatmentMethodCode {
    chemical_treatment_method_id: number;
    treatmentMethodCode: string;
    treatmentMethodDescription: string;
}

export interface WindDirectionCode {
    wind_direction_code_id: number;
    windDirectionCode: string;
    description: string;
}

export interface PesticideEmployerCode {
    pesticide_employer_code_id: number;
    registrationNumber: number;
    businessName: string;
    licenceExpiryDate: Date;
}