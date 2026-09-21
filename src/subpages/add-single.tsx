import { useState, useContext } from "react";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import addGame from "../lib";
import "../App.css";

function AddSingle() {
  const [winner,setWinner] = useState("")
  const [loser,setLoser] = useState("")
  const [tournament,setTournament] = useState("")
  const [date,setDate] = useState("")
  const {db, loading} = useContext(DbContext)

  const onClick = async () => {
    if (winner == "" || loser == "" || tournament == "" || date == "" || loading || !db) {
      console.error("Failure")
      return
    }
    
    await db.execute('BEGIN TRANSACTION;')
    await addGame(winner,loser,tournament,date,db)
    .then(async () => {
      await db.execute('COMMIT;')
      console.log("Success")
    })
    .catch(async (err) => {
      await db.execute('ROLLBACK;')
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