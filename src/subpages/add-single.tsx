import { useState } from "react";
import GoToMenu from "../go-to-menu";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function AddSingle() {

  return (
    <main className="container">
      <GoToMenu/>
      <p>Add Single</p>
    </main>
  );
}

export default AddSingle;