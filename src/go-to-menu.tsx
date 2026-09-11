import { useContext } from "react";
import { PageSwapContext } from "./App";
import "./App.css";

function GoToMenu() {
  const pageSwapContext = useContext(PageSwapContext)
  
  if (!pageSwapContext) {
    throw new Error("GoToMenu must be used inside PageSwapContext.Provider");
  }

  return (
    <button id="return-to-menu" onClick={() => pageSwapContext.setPage("main-menu")}>Back</button>
  );
}

export default GoToMenu;