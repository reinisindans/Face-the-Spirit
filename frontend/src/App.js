import "./App.css";

import { useState, useEffect } from "react";

import { Select, InputLabel, MenuItem } from "@material-ui/core";

function App() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face the spirit App</h1>
      </header>
      <div className="layout">
        <InputLabel id="label">Age</InputLabel>
        <Select labelId="label" id="select" value="20">
          <MenuItem value="10">Ten</MenuItem>
          <MenuItem value="20">Twenty</MenuItem>
        </Select>
        <h2>Status: {status}</h2>
        <h2>Latitude: {lat}</h2>
        <h2>Longitude: {lng}</h2>
      </div>
    </div>
  );
}

export default App;
