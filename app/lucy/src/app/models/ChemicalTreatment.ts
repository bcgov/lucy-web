

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
}

export interface ChemicalTreatment {

}