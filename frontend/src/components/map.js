import React, { useState, useEffect } from "react";

import "../css/map.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MainMap = (props) => {
  const [mapState, setMapState] = useState();
  //console.log(mapState)
  console.log("Preparing to fly!");
  console.log(props.game);
  if (mapState) mapState.map.flyTo(props.game.location);

  console.log("parsing map");
  return (
    <div className={"mapdiv"}>
      <MapContainer
        center={props.coords}
        zoom={13}
        scrollWheelZoom={true}
        whenCreated={(map) => setMapState({ map })}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MainMap;
