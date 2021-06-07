import React, { useState, useEffect } from "react";

import "../css/map.css";

import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";

// needed for userIcon
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";

import Question from "../components/question";

const rigaLocation = [56.951475, 24.113143];

const MainMap = (props) => {
  const [mapState, setMapState] = useState();
  const [coordinates, setCoordinates] = useState();
  const [game, setGame] = useState(props.game);

  // define the userLocation Icon from FontAwesome
  const iconMarkup = renderToStaticMarkup(
    <i className=" fa fa-walking fa-3x" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  
  function getDistance(origin, destination) {
  if (origin && destination){
    // return distance in meters
    var lon1 = toRadian(origin[1]),
      lat1 = toRadian(origin[0]),
      lon2 = toRadian(destination[1]),
      lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    console.log("Distance is: ", c * EARTH_RADIUS * 1000);
    return (c * EARTH_RADIUS * 1000) / 2;
  }
    else return null
}
function toRadian(degree) {
    return degree*Math.PI/180;
};

  const locationCheck = (userLocation, questionList) => {
    for (let index in questionList) {
      console.log("Iterating questions: ", questionList)
      if (questionList[index].location &&
        getDistance(userLocation, questionList[index].location) <
        questionList[index].radius
      ) {
        console.log(
          "Distance: ",
          getDistance(userLocation, questionList[index].location)
        );
        console.log("Radius: ", questionList[index].radius);
        return questionList[index].id;
      }
    }
  };

  useEffect(() => {
    // getting the user location listener!!!!!
    if (!navigator.geolocation) {
    } else {
      navigator.geolocation.watchPosition(
        (position) => {
          setCoordinates([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
  }, []);

  useEffect(() => {
    console.log("Preparing to fly!");
    console.log(props.game);
    if (mapState) mapState.map.flyTo(props.game.location);
  }, [mapState, props.game]);

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

  useEffect(() => {
    
  })
  let questionIndex = locationCheck(coordinates, props.questions);

  const renderQuestion = () => {
    console.log(
      "Location check!!!",
      props.questions.filter((question) => {
        return question.id == questionIndex;
      })
    );
    if (questionIndex !== false && !props.answered.includes(questionIndex)) {
      return <Question question={props.questions.filter(question => { return question.id == questionIndex })[0]} />;
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
        {props.questions.map((question) => {
          console.log("Mapping questions, ", question.text);
          return (
            <Circle center={question.location} radius={question.radius} key={question.id}>
              <Popup>{question.text}</Popup>
            </Circle>
          );
        })}
      </MapContainer>
      {renderQuestion()}
    </div>
  );
};

export default MainMap;
