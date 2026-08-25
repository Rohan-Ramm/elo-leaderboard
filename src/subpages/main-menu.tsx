import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function MainMenu() {

  return (
    <main className="container">
      <div className="menu-container">
        <h1 className="menu-title">Main Menu</h1>
        
        <div className="button-grid">
            <button className="menu-btn">View Leaderboard</button>
            <button className="menu-btn">Settings</button>
            
            <button className="menu-btn">Add Game (single)</button>
            <button className="menu-btn">Add Game<br/>(multiple)</button>
            
            <button className="menu-btn">Import League</button>
            <button className="menu-btn">Export League</button>
        </div>
    </div>
    </main>
  );
}

export default MainMenu;