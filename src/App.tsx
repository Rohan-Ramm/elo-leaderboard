import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import AddMultiple from "./subpages/add-multiple";
import AddSingle from "./subpages/add-single";
import ExportLeague from "./subpages/export-league";
import ImportLeague from "./subpages/import-league";
import Settings from "./subpages/settings";
import ViewLeaderboard from "./subpages/view-leaderboard";
import MainMenu from "./subpages/main-menu";

function App() {
  const [page,setPage] = useState("Add Multiple")

  switch (page) {
    case "add-multiple":
      return <AddMultiple />;
  
    case "add-single":
      return <AddSingle />;
  
    case "export-league":
      return <ExportLeague />;
  
    case "import-league":
      return <ImportLeague />;
  
    case "settings":
      return <Settings />;
  
    case "leaderboard":
      return <ViewLeaderboard />;
  
    default:
      return <MainMenu/>;
  }
}

export default App;
