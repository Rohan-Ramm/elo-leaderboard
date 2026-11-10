import { useState,useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";
import "./view-leaderboard.css"
import { Player } from "../lib";

function ViewLeaderboard() {
  const [leaderboard,setLeaderboard] = useState<Player[]>([])
  const [filters, setFilters] = useState({"category": "elo", "count": "10"}) // A way to edit parameters is forthcoming

  const headers = [
    {position: 0, title: "Name"},
    {position: 1, title: "Wins"},
    {position: 2, title: "Losses"},
    {position: 3, title: "Elo"},
  ];

  useEffect(() => {
    async function setup() {
      const prevLeaderboard = await invoke("get_leaderboard",{"preferences": JSON.stringify(filters)})
      console.log(prevLeaderboard)
      setLeaderboard(prevLeaderboard as Player[])
    }
    setup();
  }, [filters]);

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <br></br>
        <h1>Leaderboard</h1>
        <table>
          <thead>
            <tr>
              {headers.map(header => 
                <td key={header.position}>{header.title}</td>
              )}
            </tr>
          </thead>
          <tbody>
            {
              leaderboard.map((player,index) => 
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{player.wins}</td>
                  <td>{player.losses}</td>
                  <td>{player.elo}</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ViewLeaderboard;