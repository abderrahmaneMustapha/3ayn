import React, { useEffect } from 'react'
import L from 'leaflet';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
});

const LeafletMap = () => {
  const position: [number, number] = [35.3451539, 1.337145]

  useEffect(() => {
    var map = L.map('map').setView(position, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(position).addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    return () => {
      map.remove();
    }
  }, [])

  return <div id="map" ></div>
}

const Map = () => {
  return (
    <LeafletMap />
  )
}

export default Map
