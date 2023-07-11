import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import toast from 'react-hot-toast';

// Allowed extensions for input file
const allowedExtensions = ["csv"];

export const Parsing = ({collectionName, setData }) => {

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  const [error, setError] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    toast.success("Parsed sucessfully!")

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;

      parsedData.forEach(question => {
        question.collection = collectionName;
      });

      console.log(parsedData);
      console.log(collectionName);

      const { data } = await axios.post(
        "http://localhost:8000/bulkAdd/",
        parsedData
      );

      setData(parsedData);
    };
    reader.readAsText(file);
    
  };

  return (
    <div>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
      </label>
      <input
        onChange={handleFileChange}
        id="csvInput"
        name="file"
        type="File"
      />
      <div>
        <button onClick={handleParse} disabled={collectionName === ""}>Add Questions</button>

        <p>{error}</p>
      </div>
    </div>
  );
};