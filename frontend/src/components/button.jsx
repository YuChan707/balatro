import React from "react";
export default function Button({ text, onClick, type = "button" }) {
  return (
    <button className="Button cursor-pointer" onClick={onClick} type={type}>
      {text}
    </button>
  );
}
