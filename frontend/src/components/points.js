import React from "react";

import "../css/points.css";

const GamePoints = (props) => {

    return (
      <div id="pointsContainer">
        <img classname="star" src={'staricon.png'} alt="points" />
        <div className="points">   {props.points}</div>
      </div>
    );
};


export default GamePoints