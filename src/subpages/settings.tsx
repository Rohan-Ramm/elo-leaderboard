import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";

function Settings() {

  return (
    <main className="container">
      <GoToMenu/>;
      <p>Settings</p>
    </main>
  );
}

export default Settings;