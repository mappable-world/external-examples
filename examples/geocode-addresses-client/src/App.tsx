import {Main} from './pages/Main';
import {GeocoderProvider} from './providers/GeocoderProvider';
import {MobileProvider} from './providers/MobileProvider';

function App() {
    return (
        <MobileProvider>
            <GeocoderProvider>
                <Main />
            </GeocoderProvider>
        </MobileProvider>
    );
}
export default App;
