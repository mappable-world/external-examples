import '@mappable-world/mappable-default-ui-theme';
import '@mappable-world/mappable-types';
import {MMap} from '@mappable-world/mappable-types';

declare global {
    let map: MMap | null;

    interface Window {
        map: MMap | null;
    }
}

export {};
