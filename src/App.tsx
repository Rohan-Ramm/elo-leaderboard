import { createContext, useState, useEffect } from "react";
import Database from "@tauri-apps/plugin-sql";
import "./App.css";

import AddMultiple from "./subpages/add-multiple";
import AddSingle from "./subpages/add-single";
import ExportLeague from "./subpages/export-league";
import ImportLeague from "./subpages/import-league";
import ViewLeaderboard from "./subpages/view-leaderboard";
import MainMenu from "./subpages/main-menu";
import FindPlayer from "./subpages/find-player";


type PageSwapContextType = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

type DbContextType = {
  db: Database | null;
  loading: boolean;
};

export const PageSwapContext = createContext<PageSwapContextType | null>(null);

export const DbContext = createContext<DbContextType>({
  db: null,
  loading: true,
});

function App() {
  const [page, setPage] = useState("main-menu");
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const connection = await Database.load("sqlite:mydatabase.db");
        setDb(connection);
        console.log("Successfully connected to SQLite database")
      } catch (err) {
        console.error("Failed to connect to SQLite database:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Helper function to render active subpage
  const renderPage = () => {
    switch (page) {
      case "add-multiple":
        return <AddMultiple />;
      case "add-single":
        return <AddSingle />;
      case "export-league":
        return <ExportLeague />;
      case "import-league":
        return <ImportLeague />;
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
      <DbContext.Provider value={{ db, loading }}>
        <div className="app-container">
          {renderPage()}
        </div>
      </DbContext.Provider>
    </PageSwapContext.Provider>
  );
}

export default App;
