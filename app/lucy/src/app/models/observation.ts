export interface Observation {
	observation_Id: number;
	lat: number;
	long: number;
	invasivePlantSpecies: ObservationInvasivePlantSpecies[];
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
    juristiction_id: number;
    code: string;
    description: string;
    activeIndicator: true;
}

export interface ObservationInvasivePlantSpecies {
    observationSpecies_Id: number;
    species: InvasivePlantSpecies;
    jurisdiction: Jurisdiction;
	width: number;
	length: number;
	accessDescription: string;
}