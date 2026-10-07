import { useState,useContext } from "react";
import { Player, Match, PlayerMatch } from "../lib";
import { invoke } from "@tauri-apps/api/core";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";

function FindPlayer() {
  const {db, loading} = useContext(DbContext)

  const [search,setSearch] = useState("")
  const [targetPlayer,setTargetPlayer] = useState<Player>()
  const [matchList,setMatchList] = useState<PlayerMatch[]>([])

  function getMatchData(match: PlayerMatch) {
    return `${match.tournament_name} ${match.outcome} vs ${match.opponent}\n${match.date}`
  }

  if(!db || loading) {
    console.log("Database failed to load.")
  }

  const onClick = async () => {
    if(!db || loading) {
      console.log("Database failed to load.")
      return 
    }
    try {
      const result = await db.select<Player[]>(
        "SELECT * FROM players WHERE name = $1;",[search]
      );
      if(result.length == 0) {
        console.log("Player not found")
        return 
      }
      setTargetPlayer(result[0])

      const match_data = await db.select<Match[]>(`
        SELECT * FROM matches 
        WHERE winner_id = $1 OR loser_id = $1 
        ORDER BY date DESC 
        LIMIT 4`,[result[0].id]);

      const personalized_match_data:PlayerMatch[]  = []
      let opponent;
      let outcome;
      for (const match of match_data) {
        if (match.winner_id == result[0].id) {
          outcome = "Won"
          opponent = await db.select<Player[]>("SELECT name from players where id = $1",[match.loser_id])
        } else {
          outcome = "Lost"
          opponent = await db.select<Player[]>("SELECT name from players where id = $1",[match.loser_id])
        }
        personalized_match_data.push({"outcome": outcome, "opponent": opponent[0].name, "tournament_name":match.tournament_name, "date":match.date})
      }
      console.log(match_data)
      console.log(personalized_match_data)
      setMatchList(personalized_match_data)
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
                  <div><b>{match.outcome}</b> vs {match.opponent}</div>
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