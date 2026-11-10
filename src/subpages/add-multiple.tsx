import { useState,useContext,useRef } from "react";
import GoToMenu from "../go-to-menu";
import { PageSwapContext} from "../App";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";

function AddMultiple() {
  const [inputData,setInputData] = useState("")
  const tourName = useRef<HTMLInputElement>(null)
  const [presetTour,setPresetTour] = useState(false)
  const pageSwapContext = useContext(PageSwapContext)

  let text = `Post game information in the following format:
{Winner},{Loser},{Date},{Tournament}
Each game should be on a different line`

  if (!pageSwapContext) {
    throw new Error("ImportLeague must be used inside PageSwapContext.Provider");
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {

    event.preventDefault()

    const tName = (tourName.current?.value ?? "").trim();
    // Drop blank or whitespace-only lines
    const gameList = inputData.split("\n").filter((line) => line.trim() !== "")
    let currGame;
    let gameObjects;

    gameObjects = gameList.map((game) => {
      currGame = game.split(",").map((field) => field.trim())
      if (presetTour) {
        console.log(currGame)
        return {"winner_name": currGame[0], "loser_name": currGame[1], "date": currGame[2], "tournament_name": tName} 
      } else {
        return  {"winner_name": currGame[0], "loser_name": currGame[1], "date": currGame[2],"tournament_name": currGame[3]}
      }
    })
    console.log(gameObjects)
    const jsonString = JSON.stringify(gameObjects)

    try {
      await invoke("add_games", {"inputData": jsonString})
    } catch(error) {
      console.error("Error occured on: ",currGame)
      console.error(error);
      alert("Games could not be added: Try Again")
      return
    }

    console.log("Successful");
    pageSwapContext.setPage("main-menu");
  };
  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
        <h1>Add Games</h1>
        <div className="row">
          <div className={presetTour ? "text-bubble-emphasized" : "text-bubble"}>Tournament</div>
          <input type="text" ref={tourName}/>
          <button className="skinny-btn" onClick={() => setPresetTour(!presetTour)}>
            {presetTour ? "Clear" : "Set"}
          </button>
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