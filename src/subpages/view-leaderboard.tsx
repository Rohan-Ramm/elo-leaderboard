import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";

function ViewLeaderboard() {

  return (
    <main className="container">
      <GoToMenu/>;
      <p>View Leaderboard</p>
    </main>
  );
}

export default ViewLeaderboard;