import { invoke } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';
import GoToMenu from "../go-to-menu";
import "../App.css";
function ExportLeague() {
  async function copyExportData(type: String): Promise<void> {
    let path;
    if (type == "csv") {
      // CSV exports to a new folder (named in the save dialog) that the backend
      // creates and fills with one CSV per table.
      path = await save({
        title: 'Export Database (choose a name for the new folder)',
        defaultPath: 'my-database',
      });
    } else {
      // JSON exports to a single file.
      path = await save({
        title: 'Export Database',
        defaultPath: `my-database.${type}`,
        filters: [
          {
            name: type.valueOf().toUpperCase(),
            extensions: [type.valueOf()],
          },
        ],
      });
    }
    if (!path) return

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