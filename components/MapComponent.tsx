"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "react-leaflet-fullscreen/styles.css";

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
  const [providerCoordinates, setProviderCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  //   sets an avereage of latitudes and longitudes so provider can see a high view of all locations for service
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

  //   makes use of watch position function to get live updates on provider position
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return; // Exit early if geolocation is not available
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setProviderCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
    /* eslint-disable consistent-return */
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (mapCenter.latitude === 0 || mapCenter.longitude === 0) {
    return <Spinner className="h-[30dvh] w-full" />;
  }

  return (
    <MapContainer
      // IMPORTANT: sizes must be set on this component or it will not render
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
      {providerCoordinates && (
        <Marker
          position={[
            providerCoordinates.latitude,
            providerCoordinates.longitude,
          ]}
        >
          <Popup>Your location</Popup>
        </Marker>
      )}
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
