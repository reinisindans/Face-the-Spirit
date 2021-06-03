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
          defaultValue={game}
          onChange={props.handleGameChange}
        >

        {gameList.map(game => (<MenuItem value={game.id}>{game.title}</MenuItem>))}

        </Select>
      </header>
    )
}