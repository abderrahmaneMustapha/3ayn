import React, { useEffect } from 'react'
import L from 'leaflet';
import { WatterPoint, Position } from '../../types/index'

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
});

interface mapProps {
  items: WatterPoint[],
  focusedPosition: Position
}

let greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LeafletMap = ({ items, focusedPosition }: mapProps) => {
  const [currentTime, _] = React.useState<number>(new Date().getHours() + 1)

  const isOpen = (item: WatterPoint) => {
    return currentTime >= item.open.from.js && currentTime <= item.open.to.js
  }

  const popUpContent = (item: WatterPoint) => {
    return `
      <div>
        <div>
          <div class="leaflet-popup-content-header" >
            <h3>${item.title}</h3>
            <span>${item.stars}</span>
            </div>
          </div>
          <div class="leaflet-popup-content-body">
            <div>
              <span>${item.open.from.ar} - ${item.open.to.ar}</span>
              <span>.</span>
              <span>${item.address}</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  useEffect(() => {
    const  map = L.map('map')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    items.forEach((item) => {
      let marker = undefined
      const position = [item.position._lat, item.position._long]
      if (isOpen(item)) {
        marker = L.marker(position, {icon: greenIcon})
      } else {
        marker = L.marker(position, {icon: redIcon})
      }

      marker.addTo(map).bindPopup(popUpContent(item)).openPopup();
    })

    map.setView([focusedPosition._lat, focusedPosition._long], 15)

    return () => {
      map.remove();
    }
  }, [focusedPosition, items])

  return <div id="map" ></div>
}


const Map = ({ items, focusedPosition }: mapProps) => {
  return (
    <LeafletMap items={items} focusedPosition={focusedPosition} />
  )
}

export default Map
