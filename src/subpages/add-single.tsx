import { useRef } from "react";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function AddSingle() {
  const winner = useRef<HTMLInputElement>(null)
  const loser = useRef<HTMLInputElement>(null)
  const tournament = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)

  const onClick = () => {
    if (!winner.current || !loser.current || !tournament.current || !date.current ) {
      console.log("Insufficient data provided")
      return
    }
    invoke('add_game',{winner: winner, loser: loser, tournament: tournament, date: date})
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