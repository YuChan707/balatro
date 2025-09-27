import React from "react";
export default function Button({ text, onClick, type = "button" }) {
  return (
    <button
      className="Button cursor-pointer hover:opacity-80"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}
