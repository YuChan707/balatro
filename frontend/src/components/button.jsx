import React from "react";
export default function Button({ text, onClick, type = "button" }) {
  return (
    <button
      className="Button cursor-pointer hover:translate-x-[3px] hover:translate-y-[3px] transition-transform duration-200 shadow-[3px_3px_0_#FFF7E2] hover:shadow-none"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}
