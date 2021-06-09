import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";


import "../css/map.css";

// needed for userIcon
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";

import Question from "../components/question";
import GamePoints from "../components/points";

const rigaLocation = [56.951475, 24.113143];


const locationCheck = (userLocation, questionList) => {
  for (let index in questionList) {
    if (
      questionList[index].location &&
      getDistance(userLocation, questionList[index].location) <
        questionList[index].radius
    ) {
      return questionList[index].id;
    }
  }
};


  const getDistance = (origin, destination) => {
    if (origin && destination) {
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
      return (c * EARTH_RADIUS * 1000) / 2;
    } else return null;
  };
  const toRadian = (degree) => {
    return (degree * Math.PI) / 180;
  };

const MainMap = (props) => {
  const [token] = useCookies(["spirit-token"]); // used to access the token!!!
  const [mapState, setMapState] = useState();
  const [coordinates, setCoordinates] = useState();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(-1);
  const [answered, setAnswered] = useState([]);
  const [points, setPoints] = useState(0);


  // define the userLocation Icon from FontAwesome
  const iconMarkup = renderToStaticMarkup(
    <i className=" fa fa-walking fa-3x" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });


  // TODO calculate points after answered changes

  // TODO change/ trigger answered after question has been answered in question.js

  // Get the answered questions on session start
  useEffect(() => {
    
    fetch("http://127.0.0.1:8000/api/userAnswers/getOwnAnsweredQuestions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["spirit-token"]}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // pass the response objects to state
        console.log("Already answered questions: ", response.result);
        setAnswered(response.result);
      })
      .catch((error) => console.log(error));
  }, [token]);

  // getting the points for the current game!!!
    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/userAnswers/getOwnPoints/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["spirit-token"]}`,
        },
        body: JSON.stringify({ game: props.game.id }),
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          // pass the response objects to state
          console.log("Got this many points:", response.result);
          setPoints(response.result);
        })
        .catch((error) => console.log(error));
    }, [token, props.game, answered]);

  useEffect(() => {
    // getting the questions of current game! Only after game change/setting
    fetch("http://127.0.0.1:8000/api/questions/getGameQuestions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: props.game.id }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // pass the response objects to state
        //console.log(response);
        for (let object in response.result) {
          response.result[object].location =
            response.result[object].location.split(",");
        }
        //console.log("setting the questions");
        //console.log(response.result);
        setQuestions(response.result);
      })
      .catch((error) => console.log(error));
  }, [props.game]);

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
    setSelectedQuestion(locationCheck(coordinates, questions));
  }, [coordinates, questions]);

  useEffect(() => {
    // TODO fix this to make it work!!
    if (mapState) mapState.map.flyTo(props.game.location);
  }, [mapState, props.game]);

  const renderUserLocation = () => {
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

  const updateAnswered = (answer, gotPoints) => {
    let newAnswered = answered;
    newAnswered.push(answer);
    const newPoints= points+gotPoints
    setPoints(newPoints);
    console.log("This is the new Answered question!", newAnswered);
    setAnswered(newAnswered);
  };

  const renderQuestion = () => {
    if (answered !== undefined && selectedQuestion!== undefined && coordinates) {
      console.log(
        questions.filter((question) => {
          return parseInt(question.id) === parseInt(selectedQuestion);
        })
      );
      if (
        selectedQuestion !== false &&
        !answered.includes(parseInt(selectedQuestion))
      ) {
        return (
          <Question
            question={
              questions.filter((question) => {
                return parseInt(question.id) === parseInt(selectedQuestion);
              })[0]
            }
            updateAnswered={updateAnswered}
          />
        );
      } else {
        return null;
      }
    } else return null;
  };

  const renderCircles = () => {
    if (answered !== undefined) {
      return questions.map((question) => {
        console.log("Mapping questions, ", question.text, question.id);
        if (!answered.includes(parseInt(question.id))) {
          console.log("drawing circles", question.location);
          return (
            <Circle
              className="questionCircle"
              center={question.location}
              radius={question.radius}
              key={question.id}
            >
              <Popup>{question.text}</Popup>
            </Circle>
          );
        } else return null;
      }
      );
    }
    else return null
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
        {renderCircles()}
      </MapContainer>
      {renderQuestion()}
      <GamePoints points={points} />
    </div>
  );
};

export default MainMap;
