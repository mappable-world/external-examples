import '@mappable-world/mappable-default-ui-theme/dist/esm/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
window.map = null;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
