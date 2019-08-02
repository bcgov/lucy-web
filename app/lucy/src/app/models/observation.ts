export interface Observation {
    // Basic //
    // Location
    observation_id: number;
    lat: number;
    long: number;
    date: string;
    // Observer
    observerFirstName: string;
    observerLastName: string;
    speciesAgency: SpeciesAgencyCodes;
    // Invasive Plant Species
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
    // Advanced //
    // indicators
    sampleTakenIndicator: boolean;
    wellIndicator: boolean;
    legacySiteIndicator: boolean;
    edrrIndicator: boolean;
    researchIndicator: boolean;
    specialCareIndicator: boolean;
    biologicalIndicator: boolean;
    aquaticIndicator: boolean;
    // Further details
    proposedAction: ProposedActionCodes;
    sampleIdentifier: string;
    rangeUnitNumber: string;
    aspectCode: AspectCodes;
    slopeCode: SlopeCodes;
    observationGeometry: ObservationGeometryCodes;
}

export interface ProposedActionCodes {
    observation_proposed_action_code_id: number;
    code: string;
    description: string;
    activeIndicator: true;
}

export interface AspectCodes {
    observation_aspect_code_id: number;
    code: string;
    description: string;
    activeIndicator: true;
}

export interface SlopeCodes {
    observation_slope_code_id: number;
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
