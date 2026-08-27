import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";

function ImportLeague() {

  return (
    <main className="container">
      <GoToMenu/>;
      <p>Import League</p>
    </main>
  );
}

export default ImportLeague;