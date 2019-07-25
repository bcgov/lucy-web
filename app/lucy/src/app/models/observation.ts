export interface Observation {
    observation_id: number;
    lat: number;
    long: number;
    date: string;
    
    surveyorFirstName: string;
    surveyorLastName: string;
    speciesAgency: SpeciesAgencyCodes;

    species: InvasivePlantSpecies;
    jurisdiction: Jurisdiction;
    density: SpeciesDensityCodes;
    distribution: SpeciesDistributionCodes;
    surveyType: SurveyTypeCodes;
    surveyGeometry: SurveyGeometryCodes;
    specificUseCode: SpecificUseCodes;
    soilTexture: SoilTextureCodes;
    width: number;
    length: number;
    accessDescription: string;
}
export interface InvasivePlantSpecies {
    commonName: string;
    containmentSpacialRef: number;
    containmentSpecies: number;
    earlyDetection: boolean;
    genus: string;
    latinName: string;
    mapCode: string;
    species: string;
    species_id: number;
}

export interface Jurisdiction {
    jurisdiction_code_id: number;
    code: string;
    description: string;
    activeIndicator: true;
}

export interface SpeciesObservations {
    observationSpecies_Id: number;
    species: InvasivePlantSpecies;
    jurisdiction: Jurisdiction;
    density: SpeciesDensityCodes;
    distribution: SpeciesDistributionCodes;
    surveyType: SurveyTypeCodes;
    surveyGeometry: SurveyGeometryCodes;
    specificUseCode: SpecificUseCodes;
    soilTexture: SoilTextureCodes;
    width: number;
    length: number;
    accessDescription: string;

    surveyorFirstName: string;
    surveyorLastName: string;
    speciesAgency: SpeciesAgencyCodes;
}

export interface SpeciesDensityCodes {
        species_density_code_id: number;
        code: string;
        description: string;
        activeIndicator: boolean;
}

export interface SpeciesDistributionCodes {
        description: string;
        activeIndicator: boolean;
        species_distribution_code_id: number;
}

export interface SpeciesAgencyCodes {
    description: string;
    activeIndicator: boolean;
    species_agency_code_id: number;
    code: string;
}

export interface SurveyTypeCodes {
    description: string;
    activeIndicator:  boolean;
    survey_type_code_id: 1;
    code: string;
}

export interface SoilTextureCodes {
    description: string;
    activeIndicator:  boolean;
    soil_texture_code_id: number;
    code: string;
}

export interface SurveyGeometryCodes {
    description: string;
    activeIndicator: boolean;
    survey_geometry_code_id: number;
    code: string;
}

export interface SpecificUseCodes {
    description: string;
    activeIndicator: boolean;
    specific_use_code_id: number;
    code: string;
}
