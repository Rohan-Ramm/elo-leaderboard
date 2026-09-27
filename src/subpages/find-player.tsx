import { useState,useContext } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";

function FindPlayer() {
  const {db, loading} = useContext(DbContext)

  const [search,setSearch] = useState("")
  const [targetPlayer,setTargetPlayer] = useState("")
  const [targetElo,setTargetElo] = useState(1000)

  if(!db || loading) {
    console.log("Database failed to load.")
  }

  const onClick = async () => {
    setTargetPlayer(search)
    if(!db || loading) {
      console.log("Database failed to load.")
      return 
    }
    try {
      const elo = await db.select<{ elo: number }[]>(
        "SELECT elo FROM players WHERE name = $1;",[targetPlayer]
      );
      if(elo.length == 0) {
        console.log("Name not found")
        return 
      }
      setTargetElo(elo[0].elo)
      console.log("Succeeded")
    } catch(err) {
      console.error("Failure",err)
    }
  };

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Find Player</h1>
        <div className="row-2">
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e) => {
            if (e.key == "Enter") {
              onClick()
              setSearch("")
            }
          }}/>
          <button onClick={onClick}></button>
        </div>
        <h2>{targetPlayer}</h2>
        <div>
          <b>Elo:</b>
          {targetElo}
        </div>
      </div>
    </main>
  );
}

export default FindPlayer;