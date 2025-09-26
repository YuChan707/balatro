import React from "react";

export default function Menu() {
  return (
    <div className="background-image">
      <h1 className="title">Balatest</h1>
      <div className="nameIn">
        <input className="Player" type="text" placeholder="Subject Name" />
        <button>Play</button>
      </div>

      <div className="upLoad">
        <button className="upbutton">Upload </button>
      </div>
    </div>
  );
}
