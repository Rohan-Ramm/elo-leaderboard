import { useState,useContext,useEffect } from "react";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";
import { Player } from "../lib";

function ViewLeaderboard() {
  const {db, loading} = useContext(DbContext)
  const [leaderboard,setLeaderboard] = useState<Player[]>([])
  const [parameters, setParameters] = useState("")

  const headers = [
    {position: 0, title: "Name"},
    {position: 1, title: "Wins"},
    {position: 2, title: "Losses"},
    {position: 3, title: "Elo"},
  ];

  useEffect(() => {
    async function setup() {
      if(!db || loading) {
        console.log("Database failed to load.")
        return 
      }
      const prevLeaderboard = await db.select<Player[]>("SELECT * FROM players ORDER BY elo DESC LIMIT 10");
      console.log(prevLeaderboard)
      setLeaderboard(prevLeaderboard)
    }
    setup();
  }, [parameters]);

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <br></br>
        <h1>View Leaderboard</h1>
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