import { useState, useContext } from "react";
import Papa from 'papaparse'
import { Player,Match } from "../lib";
import { DbContext } from "../App";
import Database from "@tauri-apps/plugin-sql";
import { invoke } from "@tauri-apps/api/core";
import { PageSwapContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";

function ImportLeague() {
  const [importFormat,setImportFormat] = useState("JSON")
  const [inputData,setInputData] = useState("")
  const [submittable,setSubmittable] = useState(true)
  const pageSwapContext = useContext(PageSwapContext)
  const {db, loading} = useContext(DbContext)

  if (!pageSwapContext) {
    throw new Error("ImportLeague must be used inside PageSwapContext.Provider");
  }

  async function importJson(db: Database) {
    const playerData = JSON.parse(inputData).players
    const matchData = JSON.parse(inputData).matches
    for (const playerD of playerData) {
      const currPlayer: Player = playerD
      await db.execute(`INSERT INTO players (id,name,wins,losses,elo) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )`, [currPlayer.id,currPlayer.name,currPlayer.wins,currPlayer.losses,currPlayer.elo])
    }
    console.log("Player adds successful")

    for (const matchD of matchData) {
      const currMatch: Match = matchD
      await db.execute(`INSERT INTO matches (id,winner_id, loser_id, tournament_name, date) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )`,[currMatch.id,currMatch.winner_id,currMatch.loser_id,currMatch.tournament_name,currMatch.date])
    }
    console.log("Match adds successful")
  }

  async function importCSV(db: Database) {
    const sections = inputData.split(/^(players|matches)\s*$/im);
    const result: Record<string, any[]> = {};
    console.log(sections)
    for (let i = 1; i < sections.length; i += 2) {
        const tableName = sections[i].toLowerCase();
        const csv = sections[i + 1].trim();
        result[tableName] = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        }).data;
    }
    for (const playerD of result["players"]) {
      const currPlayer: Player = playerD
      await db.execute(`INSERT INTO players (id,name,wins,losses,elo) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )`, [currPlayer.id,currPlayer.name,currPlayer.wins,currPlayer.losses,currPlayer.elo])
    }
    console.log("Player adds successful")

    for (const matchD of result["matches"]) {
      const currMatch: Match = matchD
      console.log(currMatch)
      await db.execute(`INSERT INTO matches (id,winner_id, loser_id, tournament_name, date) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )`,[currMatch.id,currMatch.winner_id,currMatch.loser_id,currMatch.tournament_name,currMatch.date])
    }
    console.log("Match adds successful")
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submittable) {
      return
    }
    console.log("Submitted info")
    setSubmittable(false)
    if(!db || loading) {
      console.log("Database failed to load.")
      return 
    }
    try {
      await db.execute('DELETE FROM matches')
      await db.execute('DELETE FROM sqlite_sequence WHERE name="matches"')
      await db.execute('DELETE FROM players')
      await db.execute('DELETE FROM sqlite_sequence WHERE name="players"')
      console.log("Deletes successful")

      if (importFormat == "JSON") {
        await importJson(db);
      } else {
        await importCSV(db);
      }
      console.log("Success")
      setSubmittable(true)
      pageSwapContext.setPage("main-menu")
    }
    catch(error) {
      console.error("Error:",error)
    }
  };

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        
        <h1>Import League</h1>
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