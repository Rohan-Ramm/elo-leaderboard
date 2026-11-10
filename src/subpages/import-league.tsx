import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, confirm, message } from '@tauri-apps/plugin-dialog';
import GoToMenu from "../go-to-menu";
import LoadingSpinner from "../loading-spinner";
import "../App.css";

function ImportLeague() {
  // Text shown under the spinner while an import runs; null when idle.
  const [busyLabel, setBusyLabel] = useState<string | null>(null)

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

    // Spin only while the backend works, not while the dialogs are open.
    setBusyLabel("Importing...")
    let error: unknown = null
    try {
      console.log(await invoke("import_database", {"fileName": path, "fileType": type}))
    } catch (err) {
      error = err
      console.error("Failure:", err)
    } finally {
      setBusyLabel(null)
    }

    if (error) {
      await message(String(error), { title: 'Import failed', kind: 'error' })
    } else {
      await message('Done!', { title: 'Import League', kind: 'info' })
    }
  }

  return (
    <main className="container">
      <div className="central-column">
        {busyLabel && <LoadingSpinner label={busyLabel}/>}
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
