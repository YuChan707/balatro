import React, { useState } from "react";
import logo from "./../assets/logo.svg";
import Button from "./button";

export default function Menu({ setInGame, setCards }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        let data = "bruh";

        try {
          data = await response.json();
          console.log("worked");
        } catch {
          console.log("didnt work");
          data = JSON.parse(await response.text());
        }
        alert("File uploaded successfully!");

        console.log(data);
        setCards(data);
        setInGame(true);
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error);
    }
  };

  return (
    <div className="background-image">
      <img src={logo} alt="logo" className="mb-[86px]" />

      <form onSubmit={handleSubmit} className="nameIn">
        <input
          className="text-white bg-[#523D57] text-[20px] px-4 py-2"
          placeholder="Subject Name"
          type="file"
          onChange={handleFileChange}
        />
        <Button type="submit" className="cursor-pointer" text="Upload File" />
      </form>

      <Button
        type="button"
        className="cursor-pointer"
        onClick={() => setInGame(true)}
        text="Play"
      />
    </div>
  );
}
