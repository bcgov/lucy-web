export interface Observation {
    observation_id: number;
    lat: number;
    long: number;
    date: string;
 
    observerFirstName: string;
    observerLastName: string;
    speciesAgency: SpeciesAgencyCodes;

    species: InvasivePlantSpecies;
    jurisdiction: Jurisdiction;
    density: SpeciesDensityCodes;
    distribution: SpeciesDistributionCodes;
    observationType: ObservationTypeCodes;
    specificUseCode: SpecificUseCodes;
    soilTexture: SoilTextureCodes;
    width: number;
    length: number;
    accessDescription: string;

    proposedAction: ProposedActionCodes;
    sampleTaken: string;
    rangeUnitNumber: string;
    groundAspect: GroundAspectCodes;
    groundSlope: GroundSlopeCodes;
    observationGeometry: ObservationGeometryCodes;
}

export interface ProposedActionCodes {
    proposed_actions_code_id: number;
    code: string;
    description: string;
    activeIndicator: true;
}

export interface GroundAspectCodes {
    ground_aspect_code_id: number;
    code: string;
    description: string;
    activeIndicator: true;
}

export interface GroundSlopeCodes {
    ground_slope_code_id: number;
    code: string;
    description: string;
    activeIndicator: true;
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

export interface ObservationTypeCodes {
    description: string;
    activeIndicator:  boolean;
    observation_type_code_id: 1;
    code: string;
}

export interface SoilTextureCodes {
    description: string;
    activeIndicator:  boolean;
    soil_texture_code_id: number;
    code: string;
}

export interface ObservationGeometryCodes {
    description: string;
    activeIndicator: boolean;
    observation_geometry_code_id: number;
    code: string;
}

export interface SpecificUseCodes {
    description: string;
    activeIndicator: boolean;
    specific_use_code_id: number;
    code: string;
}
