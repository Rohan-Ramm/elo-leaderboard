import { useState,useContext,useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import GoToMenu from "../go-to-menu";
import { AppContext } from "../App";
import "../App.css";

function AddMultiple() {
  const [inputData,setInputData] = useState("")
  const tourName = useRef<HTMLInputElement>(null)
  const [presetTour,setPresetTour] = useState(false)
  const context = useContext(AppContext)

  let text = `Post game information in the following format:
{Winner},{Loser}, {Date}, {Tournament}
Each game should be on a different line`

  if (!context) {
    throw new Error("ImportLeague must be used inside AppContext.Provider");
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const tName = tourName.current?.value ?? "";
    invoke('add_mult_games',{inputData: inputData, presetTour: presetTour, tourName: tName}) 
    .then(() => {
      console.log("Successful");
      context.setPage("main-menu");
    })
    .catch((error) => {
      console.error(error);
      alert("Import Failed: Try Again")
    })
  };
  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Add Games</h1>
        <div className="row">
          <div className="text-bubble">Tournament</div>
          <input type="text" ref={tourName}/>
          <button className={presetTour ? "selected-btn" : ""} onClick={() => setPresetTour(!presetTour)}/>
        </div>
        <form className="long-answer" onSubmit={handleSubmit}> 
          <pre>{text}</pre>
          <textarea
            className="big-box"
            rows={20}
            placeholder="Place information here"
            onChange={(e) => setInputData(e.target.value)}
          />
          <br></br>
          <button type="submit" value="Submit">Submit</button>
        </form>
      </div>
    </main>
  );
}

export default AddMultiple;