import { useState,useEffect } from "react";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function ExportLeague() {
  const [exportFormat,setExportFormat] = useState("JSON")
  const [exportData,setExportData] = useState("Hello World")

  useEffect(() => { 
    invoke<string>("export_database",{exportFormat: exportFormat}) //export database does not yet exist
    .then((message) => {
      setExportData(message);
    })
  }, [exportFormat]);
  
  async function copyExportData(): Promise<void> {
    await navigator.clipboard.writeText(exportFormat);
  }

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h2>Export League</h2>
        <div className="row">
            <button className={exportFormat === "JSON" ? "selected-btn" : ""} onClick={() => setExportFormat('JSON')}>JSON</button>
            <button className={exportFormat === "CSV" ? "selected-btn" : ""} onClick={() => setExportFormat('CSV')}>CSV</button>
        </div>
        <p className="text-box">{exportData}</p>
        <div className="row"><button onClick={copyExportData}>Copy</button></div>
      </div>
    </main>
  );
}

export default ExportLeague;