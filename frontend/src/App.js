import "./css/App.css";

import { useState, useEffect, useRef } from "react";

import Header from './components/header'
import MainMap from './components/map'

function App() {

  const [coordinates, setCoordinates] = useState()
  const [status, setStatus] = useState(null);
  const [game, setGame] = useState({ id: 1, location: [56.94199, 24.120308] });
  const [gameList, setGameList] = useState([{title:'testGame'}]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // getting the user location listener!!!!!
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.watchPosition(
        (position) => {
          setStatus(null);
          setCoordinates([position.coords.latitude, position.coords.longitude])
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  }, []);

  useEffect(() => {  // getting the game list!
    fetch("http://127.0.0.1:8000/api/games/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
        
      })
      .then((response) => {
        // pass the response objects to state
        
        for (var object in response){
          response[object].location = response[object].location.split(",")
        }
        setGameList(response);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => { // getting the questions of current game! Only after game change/setting
    fetch("http://127.0.0.1:8000/api/questions/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log(response);
        return response.json();
        
      })
      .then((response) => {
        // pass the response objects to state
        response.location = response.location.split(",")
        console.log("setting the questions")
        console.log(response)
        setQuestions(response);
      })
      .catch((error) => console.log(error));
  }, [game]);

  const handleGameChange = (event) => {
    setGame(gameList.filter((element) =>{
      return element.id === event.target.value
    })[0])
    console.log("Changed game to : ", event.target.value)
  };

  return (
    <div className="App">
      <Header handleGameChange= {handleGameChange} gameList={gameList} game={game}/>
      <div className="layout">
      <MainMap game={game} coords={game.location} questions={questions}/>
      </div>
    </div>
  );
}

export default App;
