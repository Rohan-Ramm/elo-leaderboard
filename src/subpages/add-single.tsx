import { useRef, useContext } from "react";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function AddSingle() {
  const winner = useRef<HTMLInputElement>(null)
  const loser = useRef<HTMLInputElement>(null)
  const tournament = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)
  const {db, loading} = useContext(DbContext)

  function calculateNewElo(winnerElo: number, loserElo: number, kFactor = 32) {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));
  
    const newWinnerElo = Math.round(winnerElo + kFactor * (1 - expectedWinner));
    const newLoserElo = Math.round(loserElo + kFactor * (0 - expectedLoser));
  
    return { newWinnerElo, newLoserElo };
  }

  const onClick = async () => {
    if (!winner.current || !loser.current || !tournament.current || !date.current || loading || !db) {
      console.error("Failure")
      return
    }
    try {
      await db.execute('BEGIN TRANSACTION;')
      console.log("phase 1")
      await db.execute("INSERT OR IGNORE INTO players (name) VALUES ($1);", [winner.current.value]);
      await db.execute("INSERT OR IGNORE INTO players (name) VALUES ($1);", [loser.current.value]); 
      console.log("phase 2")
      const currentWinnerElo = await db.select<{ elo: number }[]>(
        "SELECT elo FROM players WHERE name = $1;",
        [winner.current.value]
      );

      const currentLoserElo = await db.select<{ elo: number }[]>(
        "SELECT elo FROM players WHERE name = $1;",
        [loser.current.value]
      );
      console.log("phase 3")
      const { newWinnerElo, newLoserElo } = calculateNewElo(currentWinnerElo[0].elo, currentLoserElo[0].elo);

      await db.execute("UPDATE players SET wins = wins + 1, elo = $2 WHERE NAME = $1",[winner.current.value,newWinnerElo])
      await db.execute("UPDATE players SET losses = losses + 1, elo = $2 WHERE NAME = $1",[loser.current.value,newLoserElo])
      console.log("Phase 4")
      await db.execute(`INSERT INTO matches (winner_id, loser_id, tournament_name, date) VALUES (
        (SELECT id FROM players WHERE name = $1),
        (SELECT id FROM PLAYERS WHERE name = $2),
        $3,
        $4
      )`,[winner.current.value,loser.current.value,tournament.current.value,date.current.value])
      console.log("Phase 5")
      await db.execute('COMMIT;')
    } catch(err) {
      await db.execute('ROLLBACK;')
      console.error(err)
    }
    winner.current = null
    loser.current = null
    tournament.current = null
    date.current = null
  };

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Add Game</h1>
        <div className="field-list">
          <div className="row-2">
            <div className="text-bubble">Winner</div>
            <input type="text" ref={winner}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Loser</div>
            <input type="text" ref={loser}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Tournament</div>
            <input type="text" ref={tournament}/>
          </div>
          <div className="row-2">
            <div className="text-bubble">Date</div>
            <input type="text" ref={date}/>
          </div>
        </div>
        <br/>
        <button onClick={onClick} className="submit-btn">Submit</button>
      </div>
    </main>
  );
}

export default AddSingle;