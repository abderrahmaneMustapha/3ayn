import React, { CSSProperties, useEffect } from 'react'
import L from 'leaflet';
import { WaterPoint, Position, Photo, ActiveTime, User } from '../../types/index'

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
});

const photos: Photo[] = [
  {
    title: "photo 1",
    src: "azeza",
    description: "arr",
  }
]

const activeTime: ActiveTime = {
  closeAt: new  Date(12, 12, 2021),
  openAt: new Date(11, 11, 2021)
}

const user: User =  {
  id: 1,
  name: "1212"
}

const waterPoints: WaterPoint[] = [
  {
     id: 0,
     name: "Watter point",
     description: "Watter point",
     position: [33.232, 1.444],
     photos: photos,
     activeTime: activeTime,
     created_by: user,
  },
  {
    id: 2,
    name: "Watter point aych hayf",
    description: "Watter point aych hayft",
    position: [33.3434, 2.444],
    photos: photos,
    activeTime: activeTime,
    created_by: user,
  }
]

const LeafletMap = () => {
  const position: Position = [35.3451539, 1.337145]

  useEffect(() => {
    var map = L.map('map').setView(position, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    waterPoints.forEach((waterPoint) => {
      L.marker(waterPoint.position).addTo(map)
      .bindPopup(waterPoint.description)
      .openPopup();
    })

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
