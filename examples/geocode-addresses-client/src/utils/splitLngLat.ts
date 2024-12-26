import {LngLat} from '@mappable-world/mappable-types';

export function splitLngLat(str: string): LngLat {
    const [longitude, latitude] = str.split(' ').map((coord) => coord.trim());
    return [Number(longitude), Number(latitude)];
}
