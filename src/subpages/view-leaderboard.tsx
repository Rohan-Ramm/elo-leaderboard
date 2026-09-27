import { useState,useContext,useEffect } from "react";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";

type Player = {
  id: number;
  name: string;
  wins: number;
  losses: number;
  elo: number;
};

function ViewLeaderboard() {
  const {db, loading} = useContext(DbContext)
  const [leaderboard,setLeaderboard] = useState<Player>([])
  const [parameters, setParameters] = useState("")



  useEffect(() => {
    async function setup() {
      if(!db || loading) {
        console.log("Database failed to load.")
        return 
      }
      const prevLeaderboard = await db.select<Player[]>("Select * FROM players");
      console.log(prevLeaderboard)
    }
    setup();
  }, [parameters]);

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>View Leaderboard</h1>
      </div>
    </main>
  );
}

export default ViewLeaderboard;