import React from 'react'

import { Select, InputLabel, MenuItem } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import "../css/header.css"

const Header = (props) =>{
    return (
      <header className="App-header">
        <h1>Face the spirit App</h1>
        <InputLabel id="label"></InputLabel>
        <Select
          labelId="label"
          id="select"
          defaultValue={props.game.id}
          onChange={props.handleGameChange}
        >
          {props.gameList.map((game) => (
            <MenuItem value={game.id} key={game.id}>
              {game.title}
            </MenuItem>
          ))}
        </Select>
        <FontAwesomeIcon icon={faSignOutAlt} size="lg"/>
      </header>
    );
}

export default Header