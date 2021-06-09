import React, {useEffect} from 'react'

import { Select, InputLabel, MenuItem } from "@material-ui/core";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import "../css/header.css"

const Header = (props) => {

  const [token, setToken, removeToken] = useCookies(['spirit-token'])
  

  useEffect(() => {
    if (!token['spirit-token']) {
      window.location.href='/'
    }
  },[token])

  const logoutUser = () => {
    removeToken(['spirit-token'])
  }

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
        <FontAwesomeIcon className='logoutIcon' icon={faSignOutAlt} size="2x" onClick={ logoutUser} cursor='hand'/>
      </header>
    );
}

export default Header