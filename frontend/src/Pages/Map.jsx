// import { MapContainer, TileLayer } from "react-leaflet";
//
// export const Maps = () => {
//     return (
//         <>
//             <MapContainer center={[52.3702157, 4.8951676]} zoom={16.6} scrollWheelZoom={false}>
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//             </MapContainer>
//         </>
//     )
// }

import React, { useState } from "react";

import { MapContainer, TileLayer } from "react-leaflet";
// import osm from "./osm-providers";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";

export const Maps = () => {
    const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 });
    const ZOOM_LEVEL = 16.6;
    const mapRef = useRef();

    return (
        <>
            <div className="row">
                <div className="col text-center">
                    <h2>React-leaflet - Basic Openstreet Maps</h2>
                    <p>Loading basic map using layer from maptiler</p>
                    <div className="col">
                        <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    );
};