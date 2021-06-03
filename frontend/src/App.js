import "./css/App.css";

import { useState, useEffect } from "react";

import Header from './components/header'
import MainMap from './components/map'

function App() {

  const [coordinates, setCoordinates] = useState([56.955634, 24.116529])
  const [status, setStatus] = useState(null);
  const [game, setGame] = useState({id:1, location:[59.293, 23.746]});
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
        console.log("Setting game list: ", response)
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
        console.log(response)
        return response.json();
        
      })
      .then((response) => {
        // pass the response objects to state
        console.log(response);
        response.location= response.location.split(",")
        setQuestions(response);
      })
      .catch((error) => console.log(error));
  }, [game]);

  const handleGameChange = (event) => {
    setGame(gameList.filter((element) =>{
      return element.id === event.target.value
    })[0])
    console.log("filter result: ", gameList.filter((element) =>{
      return element.id === event.target.value
    })[0])
    console.log("Changed game to : ", event.target.value)
    console.log(game)
  };

  return (
    <div className="App">
      <Header handleGameChange= {handleGameChange} gameList={gameList} game={game}/>
      <div className="layout">
      <MainMap game={game} coords={coordinates}/>
        <h2>Status: {status}</h2>
        <h2>Latitude: {coordinates[0]}</h2>
        <h2>Longitude: {coordinates[1]}</h2>

      </div>
    </div>
  );
}

export default App;
