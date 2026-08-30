import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";

function Settings() {

  return (
    <main className="container">
      <GoToMenu/>
      <h1>Settings</h1>
    </main>
  );
}

export default Settings;