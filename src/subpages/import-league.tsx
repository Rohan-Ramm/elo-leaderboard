import { invoke } from "@tauri-apps/api/core";
import { open,confirm} from '@tauri-apps/plugin-dialog';

// Not a page component: this is an action triggered from the main menu.
async function importLeague() {
  const disclaimer = `Once you import a new league the current league's data will be replaced with that of the imported league. If you have not already exported the current league's data to a file it will be lost forever.`

  const confirmation = await confirm(
    disclaimer,
    { title: 'Import League', kind: 'warning' }
  );
  console.log(confirmation);

  if (!confirmation) return
  const file = await open({
    multiple: false,
    directory: false,
  });
  console.log(file);
  if(!file) return

  const header_start = file.lastIndexOf(".")
  if (header_start == -1 || header_start == file.length) return

  const file_suffix = file.slice(header_start + 1)
  console.log(file_suffix)
  if (file_suffix != "json" && file_suffix != "csv") {
    console.log("Improper file type")
    return
  }
  await invoke("import_database", {"fileName": file, "fileType": file_suffix})
  .then(async (message) => {
    console.log(message)
  })
  .catch(async (err) => {
    console.error("Failure:",err)
  })
}

export default importLeague;
