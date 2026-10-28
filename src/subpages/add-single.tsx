import { useState, useContext } from "react";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import { Match } from "../lib";
import "../App.css";

function AddSingle() {
  const [matchData, setMatchData] = useState<Match>({"winner_name": "", "loser_name": "", "tournament_name": "", "date": ""})

  const onClick = async () => {
    if (matchData.winner_name == "" || matchData.loser_name == "" || matchData.tournament_name == "" || matchData.date == "") {
      console.error("Failure")
      return
    }
    const jsonString = JSON.stringify([{
      "winner_name": matchData.winner_name,
      "loser_name": matchData.loser_name,
      "tournament_name": matchData.tournament_name,
      "date": matchData.date}])
    await invoke("add_games", {"inputData": jsonString})
    .then(async (message) => {
      console.log(message)
    })
    .catch(async (err) => {
      console.error("Failure:",err)
    })

    setMatchData(prev => ({...prev, "winner_name": ""}))
    setMatchData(prev => ({...prev, "loser_name": ""}))
    setMatchData(prev => ({...prev, "tournament_name": ""}))
    setMatchData(prev => ({...prev, "date": ""}))
  };

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Add Game</h1>
        <div className="field-list">
          <div className="row-2">
            <div className="text-bubble">Winner</div>
            <input type="text" value={matchData.winner_name} onChange={(e)=>setMatchData(prev => ({...prev, "winner_name": e.target.value}))}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Loser</div>
            <input type="text" value={matchData.loser_name} onChange={(e)=>setMatchData(prev => ({...prev, "loser_name": e.target.value}))}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Tournament</div>
            <input type="text" value={matchData.tournament_name} onChange={(e)=>setMatchData(prev => ({...prev, "tournament_name": e.target.value}))}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Date</div>
            <input type="text" value={matchData.date} onChange={(e)=>setMatchData(prev => ({...prev, "date": e.target.value}))}/>
          </div>
        </div>
        <br/>
        <button onClick={onClick} className="submit-btn">Submit</button>
      </div>
    </main>
  );
}

export default AddSingle;