import { useState, useContext } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";

function ImportLeague() {
  const [importFormat,setImportFormat] = useState("JSON")
  const [inputData,setInputData] = useState("")
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("ImportLeague must be used inside AppContext.Provider");
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Submitted info:",inputData)
    invoke('input_database',{inputFormat: importFormat, inputData: inputData}) // Does not currently exist
    .then(() => {
      console.log("Successful");
      context.setPage("main-menu");
    })
    .catch((error) => {
      console.error(error);
      alert("Import Failed: Try Again")
    })
  };

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        
        <h2>Import League</h2>
        <div className="row">
            <button className={importFormat === "JSON" ? "selected-btn" : ""} onClick={() => setImportFormat('JSON')}>JSON</button>
            <button className={importFormat === "CSV" ? "selected-btn" : ""} onClick={() => setImportFormat('CSV')}>CSV</button>
        </div>
        <form className="long-answer" onSubmit={handleSubmit}>
          <p>Paste your league's information into the textbox below</p>
          <textarea
            className="big-box"
            rows={20}
            placeholder="Place information here"
            onChange={(e) => setInputData(e.target.value)}
          />
          <br></br>
          <button type="submit" value="Submit">Submit</button>
        </form>
      </div>
    </main>
  );
}

export default ImportLeague;