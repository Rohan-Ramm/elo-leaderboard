import { invoke } from "@tauri-apps/api/core";
import { open, confirm } from '@tauri-apps/plugin-dialog';
import GoToMenu from "../go-to-menu";
import "../App.css";

function ImportLeague() {
  async function importData(type: string): Promise<void> {
    const disclaimer = `Once you import a new league the current league's data will be replaced with that of the imported league. If you have not already exported the current league's data to a file it will be lost forever.`

    const confirmation = await confirm(
      disclaimer,
      { title: 'Import League', kind: 'warning' }
    );
    if (!confirmation) return

    let path;
    if (type == "csv") {
      // A CSV export is a folder holding players.csv and matches.csv, so pick
      // the folder itself.
      path = await open({
        title: 'Import Database (choose the exported folder)',
        multiple: false,
        directory: true,
      });
    } else {
      // A JSON export is a single file.
      path = await open({
        title: 'Import Database',
        multiple: false,
        directory: false,
        filters: [
          {
            name: 'JSON',
            extensions: ['json'],
          },
        ],
      });
    }
    if (!path) return

    await invoke("import_database", {"fileName": path, "fileType": type})
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
            <button onClick={() => importData("json")}>Import from JSON</button>
            <button onClick={() => importData("csv")}>Import from CSV</button>
          </div>
      </div>
    </main>
  );
}

export default ImportLeague;
