import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import "../App.css";

function AddMultiple() {

  return (
    <main className="container">
      <GoToMenu/>;
      <p>Add Multiple</p>
    </main>
  );
}

export default AddMultiple;