import { useState } from "react";
import { Player, Match } from "../lib";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";
import "./find-player.css"

function FindPlayer() {

  const [search,setSearch] = useState("")
  const [targetPlayer,setTargetPlayer] = useState<Player>()
  const [matchList,setMatchList] = useState<Match[]>([])

  const onClick = async () => {

    try {
      const result_player = await invoke("find_player", {name: search});
      if(result_player == null) {
        console.log("Player not found")
        return 
      }
      setTargetPlayer(result_player as Player)
      //console.log(result_player)

      const result_matches = await invoke("find_assc_matches", {name: search});
      if(result_matches == null) {
        console.log("Player not found")
        return 
      }
      setMatchList(result_matches as Match[])
      //console.log(result_matches)

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
        <div className="row">
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e) => {
            if (e.key == "Enter") {
              onClick()
              setSearch("")
            }
          }}/>
          <button className="skinny-btn" onClick={onClick}>Search</button>
        </div>
        <br/>
        {targetPlayer && <div className="player-info-box">
            <div className="info-header">{targetPlayer.name}</div>
            <div className="small-info-box">Record: {targetPlayer.wins}-{targetPlayer.losses}</div>
            <div className="small-info-box">Elo: {targetPlayer.elo}</div>
            <div className="info-header">Recent Games</div>
            {
              matchList.map((match,index) => 
                <div className="big-info-box" key = {index}>
                  <div>{match.tournament_name}</div>
                  <div><b>{match.winner_name}</b> defeated {match.loser_name}</div>
                  <div>{match.date}</div>
                </div>
            )}
          </div>
        }
      </div>
    </main>
  );
}

export default FindPlayer;