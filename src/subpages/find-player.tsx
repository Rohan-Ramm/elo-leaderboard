import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";

function FindPlayer() {
  const [dummyVal,setDummyVal] = useState("-1")

  const onClick = () => {
    invoke<string>('find_player',{playerName: "X"})
    .then((success: string) => {
      console.log("Successful");
      setDummyVal(success)
    })
    .catch((error) => {
      console.error(error);
      alert("Game could not be added\n Try Again")
    })
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