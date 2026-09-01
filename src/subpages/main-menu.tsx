import { useContext } from "react";
import { AppContext } from "../App";
import "../App.css";

function MainMenu() {

  const context = useContext(AppContext)
  
  if (!context) {
    throw new Error("GoToMenu must be used inside AppContext.Provider");
  }

  return (
    <main className="container">
      <div className="menu-container">
        <h1 className="menu-title">Main Menu</h1>
        
        <div className="button-grid">
            <button className="menu-btn" onClick={() => context.setPage('leaderboard')}>View Leaderboard</button>
            <button className="menu-btn" onClick={() => context.setPage('settings')}>Settings</button>
            
            <button className="menu-btn" onClick={() => context.setPage('add-single')}>Add Game (single)</button>
            <button className="menu-btn" onClick={() => context.setPage('add-multiple')}>Add Game<br/>(multiple)</button>
            
            <button className="menu-btn" onClick={() => context.setPage('import-league')}>Import League</button>
            <button className="menu-btn" onClick={() => context.setPage('export-league')}>Export League</button>
        </div>
    </div>
    </main>
  )
}

export default MainMenu;