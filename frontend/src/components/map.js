import React, { useState, useEffect } from "react";

import "../css/map.css";

import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";

// needed for userIcon
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";

import Question from '../components/question'

const rigaLocation = [56.951475, 24.113143];

const MainMap = (props) => {
  const [mapState, setMapState] = useState();
  const [status, setStatus] = useState(null);
  const [coordinates, setCoordinates] = useState();
  const [game, setGame] = useState(props.game);

  // define the userLocation Icon from FontAwesome
  const iconMarkup = renderToStaticMarkup(
    <i className=" fa fa-walking fa-3x" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });


const getDistance = (location1, location2) => {
  try {
    let x = location1[0] - location2[0];
    let y = location1[1] - location2[1];
    return Math.sqrt(x ** 2 + y ** 2);
  } catch {
    console.log("Error calculating distance");
    return 99999;
  }
};

const locationCheck = (userLocation, questionList) => {
  for (let index in questionList) {
    if (
      getDistance(userLocation, questionList[index].location) <
      questionList[index].radius
    ) {
      return index;
    } else {
      return false;
    }
  }
};

  useEffect(() => {
    // getting the user location listener!!!!!
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.watchPosition(
        (position) => {
          setStatus(null);
          setCoordinates([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  }, []);

  useEffect(() => {
    console.log("Preparing to fly!");
    console.log(game);
    if (mapState) mapState.map.flyTo(game.location);
  }, [game, mapState]);



  const renderUserLocation = () => {
    console.log("UserLocations: ", coordinates);
    if (coordinates) {
      return (
        <Marker
          id="userLocation"
          position={coordinates}
          icon={customMarkerIcon}
        >
          <Popup>Tu esi šeit!</Popup>
        </Marker>
      );
    } else {
      console.log("No userLocation");
    }
  };

  let questionIndex = locationCheck(coordinates, props.questions);
  const renderQuestion = () => {
    console.log("Location check!!!")
    if (questionIndex !== false && !props.answered.includes(questionIndex)) {
      
      return <Question question={props.questions[questionIndex]} />;
    }
  };

  console.log("parsing map");
  return (
    <div className={"mapdiv"}>
      <MapContainer
        center={rigaLocation}
        zoom={13}
        scrollWheelZoom={true}
        whenCreated={(map) => setMapState({ map })}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {renderUserLocation(coordinates)}
        {renderQuestion()}
        {props.questions.map((question) => {
          console.log("Mapping questions, ", question.text);
          return (
            <Circle center={question.location} radius={question.radius}>
              <Popup>{question.text}</Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MainMap;
