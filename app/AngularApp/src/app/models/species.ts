export interface Species {
    id: number;
    name: string;
    latin: string;
    category: string;
    introduction: string;
}

export interface SpeciesPost {
    name: string;
    latin: string;
    category: string;
    introduction: string;
    description: string;
}

export interface SpeciesDetails extends Species {
    description: string;
}
