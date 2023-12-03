import { DoinSportModel } from './DoinSportModel';

export interface PlaygroundOption extends DoinSportModel{
    id: string;
    description: string;
    label: string;
    enabled: boolean;
    maxQuantity: number;
    minQuantity: number;
    price: number;
    quantifiable: boolean;
    option: string;
}

export interface PlaygroundOptionDTO {
    quantity: number;
    option: string;
    price: number;
    label: string;
}
