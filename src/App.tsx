import { createContext, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import AddMultiple from "./subpages/add-multiple";
import AddSingle from "./subpages/add-single";
import ExportLeague from "./subpages/export-league";
import ImportLeague from "./subpages/import-league";
import Settings from "./subpages/settings";
import ViewLeaderboard from "./subpages/view-leaderboard";
import MainMenu from "./subpages/main-menu";


type AppContextType = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext<AppContextType | null>(null);

function App() {
  const [page,setPage] = useState("Add Multiple")

  const switchPage = (newPage: string) => {
    setPage(newPage);
  };

  switch (page) {
    case "add-multiple":
      return (
        <AppContext value={{setPage}}>
          <AddMultiple />;
        </AppContext>
      )
    case "add-single":
      return (
        <AppContext value={{setPage}}>
          <AddSingle />;
        </AppContext>
      )
    case "export-league":
      return (
        <AppContext value={{setPage}}>
          <ExportLeague />;
        </AppContext>
      )
    case "import-league":
      return (
        <AppContext value={{setPage}}>
          <ImportLeague />;
        </AppContext>
      )
    case "settings":
      return (
        <AppContext value={{setPage}}>
          <Settings />;
        </AppContext>
      )
  
    case "leaderboard":
      return (
        <AppContext value={{setPage}}>
          <ViewLeaderboard />;
        </AppContext>
      )
  
    default:
      return (
        <AppContext value={{setPage}}>
          <MainMenu />;
        </AppContext>
      )
  }
}

export default App;
