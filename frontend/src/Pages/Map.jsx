import React, {useEffect, useState} from "react";
import {Link} from "react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from "leaflet";
import "leaflet/dist/leaflet.css";
import LocatorIcon from "../LocatorIcon.png";

const markerIcon = new Icon({
    iconUrl: LocatorIcon,
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
})

export const Maps = () => {
    const [position, setPosition] = useState([52.52043, 6.08436]);
    const [marks, setMarks] = useState([
        {"lat": 52.52095, "lng":6.08475, "title":"Ingang Oost", "found": false},
        {"lat": 52.52060, "lng":6.08310, "title":"Ingang West", "found": true}
    ]);
    const ZOOM_LEVEL = 20;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    const addMarker = (e) => {
        const newMarker = e.latlng;
        setMarks([...marks, newMarker]);
    };

    return (
            <MapContainer center={position} scrollWheelZoom={false} dragging={true} zoomControl={false} zoom={ZOOM_LEVEL} style={{ height: "100vh" }} whenCreated={(map) => {
            map.on("click", addMarker);
        }}>
            <TileLayer url="https://api.maptiler.com/maps/landscape-v4/{z}/{x}/{y}.png?key=oTB2mxurTK1hJ0J9Ozpl" />
            {marks.map((mark, index) => (
                <Marker key={index} position={mark} icon={markerIcon}>
                    <Popup>
                        <div className={"flex flex-col gap-2"}>
                        <span className={"text-md font-bold"}>
                            {`${mark.title}`}
                        </span>
                            {mark.found ? (<span className={"cursor-default text-emerald-500"}>Opgelost!</span>) : (<span className={"cursor-default text-red-500"}>???</span>)}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};