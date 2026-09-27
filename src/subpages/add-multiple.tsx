import { useState,useContext,useRef } from "react";
import GoToMenu from "../go-to-menu";
import { PageSwapContext, DbContext } from "../App";
import addGame from "../lib";
import "../App.css";

function AddMultiple() {
  const [inputData,setInputData] = useState("")
  const tourName = useRef<HTMLInputElement>(null)
  const [presetTour,setPresetTour] = useState(false)
  const pageSwapContext = useContext(PageSwapContext)
  const {db, loading} = useContext(DbContext)

  let text = `Post game information in the following format:
{Winner},{Loser}, {Date}, {Tournament}
Each game should be on a different line`

  if (!pageSwapContext) {
    throw new Error("ImportLeague must be used inside PageSwapContext.Provider");
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    if (!db || loading) {
      console.error("Database could not be accessed")
      return
    }

    event.preventDefault()

    const tName = tourName.current?.value ?? "";
    const gameList = inputData.split("\n")
    let currGame = null;

    await db.execute('BEGIN TRANSACTION;')
    try {
      for (const game of gameList) {
        currGame = game.split(",")
        if (presetTour) {
          await addGame(currGame[0],currGame[1],tName,currGame[2],db)
        } else {
          await addGame(currGame[0],currGame[1],currGame[2],currGame[3],db)
        }
      }
    } catch(error) {
      await db.execute('ROLLBACK;')
      console.error("Error occured on: ",currGame)
      console.error(error);
      alert("Games could not be added: Try Again")
      return
    }
    await db.execute('COMMIT;')
    console.log("Successful");
    pageSwapContext.setPage("main-menu");
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