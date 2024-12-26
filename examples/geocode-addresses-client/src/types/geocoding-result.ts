import {LngLat} from '@mappable-world/mappable-types';

export type GeocodingResult = {
    address: string;
    input: string;
    status: 'OK' | 'FAIL';
    coordinates: LngLat;
    precision: PrecisionEnum;
    id: number;
};

export enum PrecisionEnum {
    EXACT = 'exact',
    NEAR = 'near',
    STREET = 'street',
    NUMBER = 'number',
    OTHER = 'other',
    RANGE = 'range'
}

export enum GroupsEnum {
    BUILDING = 'building',
    CLOSE_BUILDING = 'closeBuilding',
    STREET_OR_CITY = 'streetOrCity',
    WASNT_DEFINED = 'wasntDefined'
}
