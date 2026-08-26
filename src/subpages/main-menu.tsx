import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

interface mainMenuProps {
    onClick: (pageName: string) => void
}

function MainMenu({onClick}: mainMenuProps) {

  return (
    <main className="container">
      <div className="menu-container">
        <h1 className="menu-title">Main Menu</h1>
        
        <div className="button-grid">
            <button className="menu-btn" onClick={() => onClick('leaderboard')}>View Leaderboard</button>
            <button className="menu-btn" onClick={() => onClick('settings')}>Settings</button>
            
            <button className="menu-btn" onClick={() => onClick('add-single')}>Add Game (single)</button>
            <button className="menu-btn" onClick={() => onClick('add-multiple')}>Add Game<br/>(multiple)</button>
            
            <button className="menu-btn" onClick={() => onClick('import-league')}>Import League</button>
            <button className="menu-btn" onClick={() => onClick('export-league')}>Export League</button>
        </div>
    </div>
    </main>
  );
}

export default MainMenu;