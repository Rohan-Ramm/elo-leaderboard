import { useState, useContext } from "react";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function AddSingle() {
  const [winner,setWinner] = useState("")
  const [loser,setLoser] = useState("")
  const [tournament,setTournament] = useState("")
  const [date,setDate] = useState("")

  const onClick = async () => {
    if (winner == "" || loser == "" || tournament == "" || date == "") {
      console.error("Failure")
      return
    }
    const jsonString = JSON.stringify([{"winner_name": winner,"loser_name": loser,"tournament_name": tournament,date: date}])
    await invoke("add_games", {"inputData": jsonString})
    .then(async (message) => {
      console.log(message)
    })
    .catch(async (err) => {
      console.error("Failure:",err)
    })

    setWinner("")
    setLoser("")
    setTournament("")
    setDate("")
  };

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Add Game</h1>
        <div className="field-list">
          <div className="row-2">
            <div className="text-bubble">Winner</div>
            <input type="text" value={winner} onChange={(e)=>setWinner(e.target.value)}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Loser</div>
            <input type="text" value={loser} onChange={(e)=>setLoser(e.target.value)}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Tournament</div>
            <input type="text" value={tournament} onChange={(e)=>setTournament(e.target.value)}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Date</div>
            <input type="text" value={date} onChange={(e)=>setDate(e.target.value)}/>
          </div>
        </div>
        <br/>
        <button onClick={onClick} className="submit-btn">Submit</button>
      </div>
    </main>
  );
}

export default AddSingle;