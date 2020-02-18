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
    applicationRate: number;
    dilutionRate: number;  // actually amount used, for now
    amountUsed: number;
    herbicide: HerbicideCodes;
    chemicalTreatmentId: number;
    herbicide_tank_mix_id: number;
    showAnimation: boolean;
}

export interface SpeciesObservedTreated {
    observation: Observation;
    treatmentAreaCoverage: number;
    chemicalTreatmentId: number;
    observation_chemical_treatment_id: number;
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
    speciesObservations: SpeciesObservedTreated[];
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