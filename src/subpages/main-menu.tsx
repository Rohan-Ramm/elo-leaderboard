import { useContext } from "react";
import { PageSwapContext } from "../App";
import "../App.css";
import "./main-menu.css"

function MainMenu() {

  const pageSwapContext = useContext(PageSwapContext)
  
  if (!pageSwapContext) {
    throw new Error("GoToMenu must be used inside PageSwapContext.Provider");
  }

  return (
    <main className="container">
      <div className="menu-container">
        <h1 className="menu-title">Main Menu</h1>
        
        <div className="button-grid">
            <button className="menu-btn" onClick={() => pageSwapContext.setPage('leaderboard')}>Leaderboard</button>
            <button className="menu-btn" onClick={() => pageSwapContext.setPage('find-player')}>Find a player</button>
            
            <button className="menu-btn" onClick={() => pageSwapContext.setPage('add-single')}>Add Game (single)</button>
            <button className="menu-btn" onClick={() => pageSwapContext.setPage('add-multiple')}>Add Game (multiple)</button>
            
            <button className="menu-btn" onClick={() => pageSwapContext.setPage('import-league')}>Import League</button>
            <button className="menu-btn" onClick={() => pageSwapContext.setPage('export-league')}>Export League</button>
        </div>
    </div>
    </main>
  )
}

export default MainMenu;