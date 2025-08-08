"use client";

import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";
import "react-leaflet-fullscreen/styles.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { Spinner } from "@heroui/react";

interface MapBooking {
  id: string;
  coordinates: [latitude: number, longitude: number];
  name: string;
  service_title: string;
}

interface MapComponentProps {
  bookingsForMap: MapBooking[] | null;
}

function MapComponent({ bookingsForMap }: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const bookingLength = bookingsForMap?.length;
    let lat = 0;
    let long = 0;
    bookingsForMap?.forEach(({ coordinates }) => {
      lat += coordinates[0];
      long += coordinates[1];
    });
    if (bookingLength) {
      setMapCenter({
        latitude: lat / bookingLength,
        longitude: long / bookingLength,
      });
    }
  }, [bookingsForMap]);


  if (mapCenter.latitude === 0 || mapCenter.longitude === 0) {
    return <Spinner className="h-[30dvh] w-full" />;
  }

  return (
    <MapContainer
      center={[mapCenter.latitude, mapCenter.longitude]}
      zoom={10}
      className="h-[30dvh] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {bookingsForMap?.map(({ id, coordinates, name, service_title }) => (
        <Marker key={id} position={[coordinates[0], coordinates[1]]}>
          <Popup>
            {service_title} for {name}
          </Popup>
        </Marker>
      ))}
      <FullscreenControl
        position="topright"
        title="Full Screen"
        titleCancel="Exit Full Screen"
        forceSeparateButton
      />
    </MapContainer>
  );
}

export default MapComponent;
