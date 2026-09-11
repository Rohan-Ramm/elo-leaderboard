import { useState,useContext } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DbContext } from "../App";
import GoToMenu from "../go-to-menu";
import "../App.css";

function FindPlayer() {
  const [dummyVal,setDummyVal] = useState(-1)
  const {db, loading} = useContext(DbContext)

  if(!db || loading) {
    console.log("Database failed to load.")
  }

  const onClick = async () => {
    if(!db || loading) {
      console.log("Database failed to load.")
      return 
    }
    try {
      const elo = await db.select<{ elo: number }[]>(
        "SELECT elo FROM players WHERE name = $1;",["abcd"]
      );
      if(elo.length == 0) {
        console.log("Name not found")
        return 
      }
      setDummyVal(elo[0].elo)
      console.log("Succeeded")
    } catch(err) {
      console.error("Failure",err)
    }
  };

  return (
    <main className="container">
      <GoToMenu/>
      <h1>Find Player</h1>
      <button onClick={onClick}></button>
      <p>{dummyVal}</p>
    </main>
  );
}

export default FindPlayer;