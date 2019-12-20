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
    chemicalTreatmentId: number;
}

export interface SpeciesObservedTreated {
    observationObject: Observation;
    observation: number;
    treatmentAreaCoverage: number;
    chemicalTreatmentId: number;
}

export interface SpeciesHerbicideSummary {
    speciesName: string;
    herbicideName: string;
    amountUsed: number;
    applicationRate: number;
}

export interface ProjectManagementPlanCode {
    pmpNumber: string;
    description: string;
    pmpHolder: string;
    startDate: string;
    endDate: string;
}

export interface ChemicalTreatmentEmployee {
    certificate: string;
    firstName: string;
    lastName: string;
}

export interface ChemicalTreatment {
    chemical_treatment_id: number;
    latitude: number;
    longitude: number;
    length: number;
    width: number;
    firstApplicator: ChemicalTreatmentEmployee;
    secondApplicator: ChemicalTreatmentEmployee;
    pesticideEmployer: PesticideEmployerCode;
    speciesAgency: SpeciesAgencyCodes;
    date: string;
    primaryPaperFileReference: string;
    secondaryPaperFileReference: string;
    jurisdiction: Jurisdiction;
    pmp: ProjectManagementPlanCode;
    pup: string;
    treatmentMethod: ChemicalTreatmentMethodCode;
    humidity: number;
    temperature: number;
    windSpeed: number;
    windDirection: WindDirectionCode;
    mixDeliveryRate: number;
    tankMixes: HerbicideTankMix[];
    speciesObservedTreated: SpeciesObservedTreated[];
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