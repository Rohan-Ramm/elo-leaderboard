import { useContext } from "react";
import { AppContext } from "./App";
import "./App.css";

function GoToMenu() {
  const context = useContext(AppContext)
  
  if (!context) {
    throw new Error("GoToMenu must be used inside AppContext.Provider");
  }

  return (
    <button id="return-to-menu" onClick={() => context.setPage("main-menu")}>Back</button>
  );
}

export default GoToMenu;