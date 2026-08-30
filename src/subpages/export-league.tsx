import { useState } from "react";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function ExportLeague() {

  return (
    <main className="container">
      <GoToMenu/>
      <h1>Export League</h1>
    </main>
  );
}

export default ExportLeague;