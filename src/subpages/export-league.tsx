import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { save, message } from '@tauri-apps/plugin-dialog';
import GoToMenu from "../go-to-menu";
import LoadingSpinner from "../loading-spinner";
import "../App.css";
function ExportLeague() {
  // Text shown under the spinner while an export runs; null when idle.
  const [busyLabel, setBusyLabel] = useState<string | null>(null)

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

    // Spin only while the backend works, not while the save dialog is open.
    setBusyLabel("Exporting...")
    let error: unknown = null
    try {
      console.log(await invoke("export_database", {"fileName": path, "fileType": type}))
    } catch (err) {
      error = err
      console.error("Failure:", err)
    } finally {
      setBusyLabel(null)
    }

    if (error) {
      await message(String(error), { title: 'Export failed', kind: 'error' })
    } else {
      await message('Done!', { title: 'Export League', kind: 'info' })
    }
  }

  return (
    <main className="container">
      <div className="central-column">
        {busyLabel && <LoadingSpinner label={busyLabel}/>}
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