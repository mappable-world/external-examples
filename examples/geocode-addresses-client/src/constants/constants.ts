import {MarkerColorProps} from '@mappable-world/mappable-default-ui-theme';
import {GroupsEnum, PrecisionEnum} from '../types/geocoding-result';

export const ALLOWED_FILE_TYPES = [
    'text/csv',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/x-csv'
];

const WHITE_ICON_STROKE_COLOR = '#FFFFFF';

const ORANGE_ICON_COLOR = '#F5AB00FF';
const ORANGE_ICON_HOVER_COLOR = '#f5ab0066';

const GRAY_ICON_COLOR = '#313133';
const GRAY_ICON_HOVER_COLOR = '#31313366';

export const MOBILE_MAX_WIDTH = 425;
export const MAP_MARGIN: [number, number, number, number] = [30, 30, 30, 30];

export const MARKER_COLORS: Record<'green' | 'orange', {active: MarkerColorProps; disabled: MarkerColorProps}> = {
    orange: {
        active: {
            night: ORANGE_ICON_COLOR,
            day: ORANGE_ICON_COLOR,
            iconDay: WHITE_ICON_STROKE_COLOR,
            strokeDay: WHITE_ICON_STROKE_COLOR
        },
        disabled: {
            night: ORANGE_ICON_HOVER_COLOR,
            day: ORANGE_ICON_HOVER_COLOR,
            iconDay: WHITE_ICON_STROKE_COLOR,
            strokeDay: WHITE_ICON_STROKE_COLOR
        }
    },
    green: {
        active: {
            night: GRAY_ICON_COLOR,
            day: GRAY_ICON_COLOR,
            iconDay: WHITE_ICON_STROKE_COLOR,
            strokeDay: WHITE_ICON_STROKE_COLOR
        },
        disabled: {
            night: GRAY_ICON_HOVER_COLOR,
            day: GRAY_ICON_HOVER_COLOR,
            iconDay: WHITE_ICON_STROKE_COLOR,
            strokeDay: WHITE_ICON_STROKE_COLOR
        }
    }
};

export const PRECISION_COLORS: Record<PrecisionEnum, string> = {
    exact: 'green',
    near: 'orange',
    street: 'orange',
    number: 'orange',
    range: 'orange',
    other: 'orange'
};

export const GROUP_COLORS: Record<GroupsEnum, string> = {
    building: 'green',
    closeBuilding: 'orange',
    streetOrCity: 'orange',
    wasntDefined: 'red'
};

export const GROUP_TITLES: Record<GroupsEnum, string> = {
    building: 'building',
    closeBuilding: 'close building',
    streetOrCity: 'street or city',
    wasntDefined: 'wasn’t defined'
};
