import React, { useState } from "react";
import logo from "./../assets/logo.svg";

export default function Menu() {
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
        let data = "";

        try {
          data = await response.json();
          console.log("worked");
        } catch {
          console.log("didnt work");
          data = JSON.parse(await response.text());
        }
        alert("File uploaded successfully!");
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
      <img src={logo} alt="logo" />
      <table>
        <thead>
          <tr>
            <th>Set</th>
            <th>Completion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sample</td>
            <td>85%</td>
            { <td><button>Select</button></td> /* when click, say selected and update curent choose file location to set name */}
          </tr>
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className="nameIn">
        <input
          className="text-white bg-[#523D57] text-[20px] px-4 py-2"
          placeholder="Subject Name"
          type="file"
          onChange={handleFileChange}
        />
        <button type="button" className="cursor-pointer Button">Play</button>
        <button type="submit" className="cursor-pointer">
          Upload File
        </button>
      </form>
    </div>
  );
}
