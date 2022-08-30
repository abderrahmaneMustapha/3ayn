import React from "react";
import PrimarySearchAppBar from "../map/view";
import RTL from "../utils/rtl";
import './index.scss'
import 'leaflet/dist/leaflet.css';

const App = () => {
  return (
    <RTL>
        <PrimarySearchAppBar />
    </RTL>
  )
}

export default App