import "./css/App.css";

import { useState, useEffect} from "react";

import Header from "./components/header";
import MainMap from "./components/map";

function App() {
  const [game, setGame] = useState({ id: 1, location: [56.94199, 24.120308] });
  const [gameList, setGameList] = useState([{ title: "testGame" }]);


  useEffect(() => {
    // getting the game list!
    fetch("http://127.0.0.1:8000/api/games/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // pass the response objects to state

        for (var object in response) {
          response[object].location = response[object].location.split(",");
        }
        setGameList(response);
      })
      .catch((error) => console.log(error));
  }, []);


  const handleGameChange = (event) => {
    setGame(
      gameList.filter((element) => {
        return element.id === event.target.value;
      })[0]
    );
    console.log("Changed game to : ", event.target.value);
  };

  return (
    <div className="App">
      <Header
        handleGameChange={handleGameChange}
        gameList={gameList}
        game={game}
      />
      <div className="layout">
        <MainMap game={game}/>
      </div>
    </div>
  );
}

export default App;
