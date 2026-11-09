import { createContext, useState, useEffect } from "react";
import "./App.css";

import AddMultiple from "./subpages/add-multiple";
import AddSingle from "./subpages/add-single";
import ExportLeague from "./subpages/export-league";
import ViewLeaderboard from "./subpages/view-leaderboard";
import MainMenu from "./subpages/main-menu";
import FindPlayer from "./subpages/find-player";


type PageSwapContextType = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export const PageSwapContext = createContext<PageSwapContextType | null>(null);

function App() {
  const [page, setPage] = useState("main-menu");

  // Helper function to render active subpage
  const renderPage = () => {
    switch (page) {
      case "add-multiple":
        return <AddMultiple />;
      case "add-single":
        return <AddSingle />;
      case "export-league":
        return <ExportLeague />;
      case "find-player":
        return <FindPlayer />;
      case "leaderboard":
        return <ViewLeaderboard />;
      case "main-menu":
      default:
        return <MainMenu />;
    }
  };

  return (
    <PageSwapContext.Provider value={{ setPage }}>
      <div className="app-container">
        {renderPage()}
      </div>
    </PageSwapContext.Provider>
  );
}

export default App;
