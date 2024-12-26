import {useContext} from 'react';
import {InputComponent} from '../components/InputComponent';
import {ResultComponent} from '../components/ResultComponent';
import {GeocoderContext} from '../providers/GeocoderProvider';

export const Main = () => {
    const {result} = useContext(GeocoderContext);
    return result.length ? <ResultComponent /> : <InputComponent />;
};
