import {createContext, Dispatch, FC, ReactNode, SetStateAction, useState} from 'react';
import {BookType, read, utils, write} from 'xlsx';
import {GeocodingResult} from '../types/geocoding-result';
import {splitLngLat} from '../utils/splitLngLat';

type Props = {
    children?: ReactNode;
};

async function makeRequest(params: Record<string, string>) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `https://geocoder.api.mappable.world/v1/?${queryParams}`;

    const response = await fetch(url);
    return response;
}

async function geocodeAddress(address: string, options: Record<string, string>) {
    try {
        const response = await makeRequest({format: 'json', geocode: address, lang: 'en_US', ...options});

        if (!response.ok) {
            throw new Error(String(response.status));
        }

        const res = await response.json();
        const featureMember = res.response.GeoObjectCollection.featureMember[0];
        if (featureMember) {
            const geoObject = featureMember.GeoObject;
            const fetchAddress = geoObject.metaDataProperty.GeocoderMetaData.Address.formatted;
            const precision = geoObject.metaDataProperty.GeocoderMetaData.precision;
            const coordinates = geoObject.Point.pos;

            return {
                status: 'OK',
                address: fetchAddress,
                coordinates,
                precision
            };
        }
        return {
            address,
            status: 'FAIL'
        };
    } catch (error) {
        throw new Error(`Geocoder API error ${(error as Error).message}`);
    }
}

async function processFile(buffer: Buffer, bookType: BookType, options: Record<string, string>) {
    const outputData = [];

    const newWorkbook = utils.book_new();
    const workbook = read(buffer, {type: 'buffer', codepage: 65001});
    const sheetNames = workbook.SheetNames;

    for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: Array<Record<string, string>> = utils.sheet_to_json(worksheet);
        for (let row of jsonData) {
            const geocodeResult = await geocodeAddress(row.Address, options);
            outputData.push({...geocodeResult, input: row.Address});
        }
        const newWorksheet = utils.json_to_sheet(outputData);
        utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
    }

    return {
        data: outputData,
        buffer: write(newWorkbook, {bookType, type: 'buffer'})
    };
}

export type GeocoderContextType = {
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>;
    result: Array<GeocodingResult>;
    setResult: Dispatch<SetStateAction<Array<GeocodingResult>>>;
    error: boolean;
    setError: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    testApiKey: (apiKey: string) => Promise<void>;
    onLoadFile: (buffer: Buffer) => void;
    outputBuffer: Buffer | undefined;
};

export const GeocoderContext = createContext({} as GeocoderContextType);

export const GeocoderProvider: FC<Props> = ({children}) => {
    const [apiKey, setApiKey] = useState<string>('');
    const [result, setResult] = useState<Array<GeocodingResult>>([]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [outputBuffer, setOutputBuffer] = useState<Buffer>();

    const testApiKey = async (apiKey: string) => {
        try {
            const response = await makeRequest({apikey: apiKey, geocode: 'A', lang: 'en_US'});

            if (!response.ok) {
                throw new Error(String(response.status));
            }

            return;
        } catch (error) {
            throw new Error(`Geocoder API error ${(error as Error).message}`);
        }
    };

    const onLoadFile = async (buffer: Buffer) => {
        try {
            setLoading(true);
            const {data, buffer: outputBuffer} = await processFile(buffer, 'csv', {
                apikey: apiKey
            });
            setOutputBuffer(outputBuffer);
            setError(false);
            setResult(
                data.map((item, index) => ({
                    ...item,
                    id: index + 1,
                    coordinates: item.coordinates ? splitLngLat(item.coordinates) : null
                })) as Array<GeocodingResult>
            );
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GeocoderContext.Provider
            value={{
                apiKey,
                setApiKey,
                testApiKey,
                onLoadFile,
                loading,
                setLoading,
                error,
                setError,
                result,
                setResult,
                outputBuffer
            }}
        >
            {children}
        </GeocoderContext.Provider>
    );
};
