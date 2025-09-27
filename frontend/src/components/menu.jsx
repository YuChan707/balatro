import React from "react";
import logo from "./../assets/logo.svg";

export default function Menu() {
  return (
    <div className="background-image">
      <img src={logo} alt="logo" />
      <div className="nameIn">
        <input
          className="text-white bg-[#523D57] text-[20px] px-4 py-2"
          type="file"
          placeholder="Subject Name"
        />
        <button>Play</button>
      </div>

      <div className="upLoad">
        <button className="upbutton">Upload</button>
      </div>
    </div>
  );
}
