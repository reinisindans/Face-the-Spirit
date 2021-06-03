import React from 'react'

import { Select, InputLabel, MenuItem } from "@material-ui/core";

const Header = (props) =>{
    return (
        <header className="App-header">
        <h1>Face the spirit App</h1>
        <InputLabel id="label"></InputLabel>
        <Select
          labelId="label"
          id="select"
          defaultValue={props.game}
          onChange={props.handleGameChange}
        >

        {props.gameList.map(game => (<MenuItem value={game.id} key={game.id}>{game.title}</MenuItem>))}

        </Select>
      </header>
    )
}

export default Header