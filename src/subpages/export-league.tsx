import { invoke } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';
import GoToMenu from "../go-to-menu";
import "../App.css";
function ExportLeague() {
  async function copyExportData(type: String): Promise<void> {
    const path = await save({
      title: 'Export Database',
      defaultPath: 'my-database.json',
      filters: [
        {
          name: type.valueOf().toUpperCase(),
          extensions: [type.valueOf()],
        },
      ],
    });
    console.log(path);

    await invoke("export_database", {"fileName": path, "fileType": type})
    .then(async (message) => {
      console.log(message)
    })
    .catch(async (err) => {
      console.error("Failure:",err)
    })
  }

  return (
    <main className="container">
      <div className="central-column">
        <GoToMenu/>
          <div className="center-point">
            <button onClick={() => copyExportData("json")}>Export to JSON</button>
            <button onClick={() => copyExportData("csv")}>Export to CSV</button>
          </div>
      </div>
    </main>
  );
}

export default ExportLeague;