import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore
const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);

// @ts-ignore
const reactify = mappableReact.reactify.bindTo(React, ReactDOM);
const {
    MMap,
    MMapDefaultFeaturesLayer,
    MMapDefaultSchemeLayer,
    MMapControls,
    MMapControlButton,
    MMapContainer,
    MMapListener,
    MMapControl
} = reactify.module(mappable);

const {MMapZoomControl, MMapDefaultMarker} = reactify.module(await import('@mappable-world/mappable-default-ui-theme'));

export {
    MMap as Map,
    MMapContainer as MapContainer,
    MMapControl as MapControl,
    MMapControlButton as MapControlButton,
    MMapControls as MapControls,
    MMapDefaultFeaturesLayer as MapDefaultFeaturesLayer,
    MMapDefaultMarker as MapDefaultMarker,
    MMapDefaultSchemeLayer as MapDefaultSchemeLayer,
    MMapListener as MapListener,
    MMapZoomControl as MapZoomControl,
    reactify
};
