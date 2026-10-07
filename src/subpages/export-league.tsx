import { useState,useEffect,useContext } from "react";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import Papa from 'papaparse'
import "../App.css";
import { Player,Match } from "../lib";

function ExportLeague() {
  const {db, loading} = useContext(DbContext)
  const [exportFormat,setExportFormat] = useState("JSON")
  const [exportData,setExportData] = useState("Hello World")

  useEffect(() => {
    async function setup() {
      if(!db || loading) {
        console.log("Database failed to load.")
        return 
      }
      const players = await db.select<Player[]>("Select * FROM players");
      const matches = await db.select<Match[]>("Select * FROM matches");
      const jsonData = JSON.stringify({"players": players, "matches": matches},null,1)
      if (exportFormat == "JSON") {
        setExportData(jsonData)
      } else {
        const playerCSV = Papa.unparse(players, {
          header:true,
          skipEmptyLines:true,
          newline: '\n',
        })
        const matchCSV = Papa.unparse(matches, {
          header: true,
          skipEmptyLines:true,
          newline: '\n',
        })
        const finalCSV = `players\n` +
          playerCSV +
          `\nmatches\n` +
          matchCSV
        setExportData(finalCSV)
      }
    }
    setup();
  }, [exportFormat]);
  
  async function copyExportData(): Promise<void> {
    await navigator.clipboard.writeText(exportData);
  }

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Export League</h1>
        <div className="row">
            <button className={exportFormat === "JSON" ? "selected-btn" : ""} onClick={() => setExportFormat('JSON')}>JSON</button>
            <button className={exportFormat === "CSV" ? "selected-btn" : ""} onClick={() => setExportFormat('CSV')}>CSV</button>
        </div>
        <pre className="text-box">{exportData}</pre>
        <div className="row"><button onClick={copyExportData}>Copy</button></div>
      </div>
    </main>
  );
}

export default ExportLeague;