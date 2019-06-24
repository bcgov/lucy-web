export interface Observation {
    location: ObservationLocation
    invasivePlantSpecies: InvasivePlantSpecies[]
    surveyDetails: ObservationSurvey[]
}

export interface ObservationLocation {
    location_id: number
    eastings: number
    northings: number
    zone: number
}

export interface ObservationSurvey {
    survey_id: number
	date: string
	companyName: string
	companyLicence: string
	
	primary_surveyor: {
		firstName: string
		lastName: string
	}
	secondary_surveyor: {
		firstName: string
		lastName: string
	}
}

export interface InvasivePlantSpecies {
    observationSpecies_Id: number
	plantSpecies: number
	juristiction: number
	density: number
	distribution: number
	dimentions: {
		width: number
		length: number
	}
	surveyMode: number
	soilTextureCode: number
	useCode: number
	accessDescription: number
}