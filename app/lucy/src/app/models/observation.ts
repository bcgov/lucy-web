export interface Observation {
	observation_Id: number;
	lat: number;
	long: number;
	invasivePlantSpecies: ObservationInvasivePlantSpecies[];
}
export interface InvasivePlantSpecies {
    species_id: number;
    mapCode: string;
    earlyDetection: number;
    containmentSpecies: number;
    containmentSpacialRef: number;
    species: string;
    genus: string;
    commonName: string;
    latinName: string;
}

export interface Jurisdiction {
	juristiction_id: number;
	Code: string;
	description: string;
}

export interface ObservationInvasivePlantSpecies {
    observationSpecies_Id: number;
    species: InvasivePlantSpecies[];
    jurisdiction: Jurisdiction;
	width: number;
	length: number;
	accessDescription: number;
}