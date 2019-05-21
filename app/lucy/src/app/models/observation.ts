export interface Observation {
    location: ObservationLocation
    surveyDetails: ObservationSurveyDetails[] 
}

export interface ObservationLocation {
    eastings: number
    northings: number
    zone: number
}

export interface ObservationSurveyDetails {
    date: Date
    agency: String
    Surveyors: String
}