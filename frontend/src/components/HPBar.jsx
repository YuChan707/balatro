import React, { useState } from "react";

const TOP = 15;

function HPBar({ type = "player", bars = 15 }) {
  return (
    <div className="flex gap-0">
      {Array(TOP)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`border-[3px] border-white ${type === "player" ? "bg-green-900" : "bg-yellow-900"} ${index > bars && "!bg-transparent"} w-[30px] h-[30px]`}
          />
        ))}
    </div>
  );
}

export default HPBar;
