import "./App.css";

import { useState, useEffect } from "react";

import { Select, InputLabel, MenuItem } from "@material-ui/core";

function App() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [game, setGame] = useState(1);
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
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
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
        console.log(response)
        return response.json();
        
      })
      .then((response) => {
        // pass the response objects to state
        console.log(response);
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
        setQuestions(response);
      })
      .catch((error) => console.log(error));
  }, [game]);

  const handleGameChange = (event) => {
    setGame(event.target.value);
    console.log("Changed game to : ", event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face the spirit App</h1>
        <InputLabel id="label"></InputLabel>
        <Select
          labelId="label"
          id="select"
          defaultValue={game}
          onChange={handleGameChange}
        >

        {gameList.map(game => (<MenuItem value={game.id}>{game.title}</MenuItem>))}

        </Select>
      </header>
      <div className="layout">
        <h2>Status: {status}</h2>
        <h2>Latitude: {lat}</h2>
        <h2>Longitude: {lng}</h2>
        <div>
            {gameList.map((game) => {
            return <h2>{game.title}</h2>;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
