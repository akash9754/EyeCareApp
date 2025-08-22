// backupUtils.js
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { getAllUsers, importUsers } from "../utils/database"; // update path to your DB file

/**
 * Export users to a JSON file
 */
export const exportUsersToJson = async () => {
  try {
    const users = await getAllUsers();

    if (!users || users.length === 0) {
      alert("No users to export");
      return;
    }

    const fileName = `eyeCare_backup_${Date.now()}.json`;
    const jsonData = JSON.stringify(users, null, 2);

    await Filesystem.writeFile({
      path: fileName,
      data: jsonData,
      directory: Directory.Documents, // Stored in Android "Documents"
      encoding: Encoding.UTF8,
    });

    alert(`✅ Data exported as ${fileName} in Documents folder`);
  } catch (err) {
    console.error("Export error:", err);
    alert("❌ Failed to export data");
  }
};

/**
 * Import users from a JSON file
 */
// export const importUsersFromJson = async () => {

export const importUsersFromJson = async () => {
  try {
    // Step 1: Pick JSON file
    const result = await FilePicker.pickFiles({
      types: ["application/json"],
      multiple: false,
      readData: true, // ✅ ensures file contents are returned directly
    });

    if (!result.files || result.files.length === 0) {
      alert("No file selected");
      return;
    }

    const file = result.files[0];
    let jsonData;

    // Step 2: Handle depending on what FilePicker returns
    if (file.data) {
      // Some platforms return the file content as Base64
      const text = atob(file.data);
      jsonData = JSON.parse(text);
    } else if (file.path) {
      // Otherwise, read file from path with Capacitor Filesystem
      const contents = await Filesystem.readFile({ path: file.path });
      jsonData = JSON.parse(contents.data);
    } else {
      alert("Could not read file");
      return;
    }

    // Step 3: Validate and import
    if (!Array.isArray(jsonData)) {
      alert("Invalid JSON file format");
      return;
    }

    await importUsers(jsonData);
    alert("✅ Data imported successfully!");
  } catch (err) {
    console.error("Import error:", err);
    alert("❌ Failed to import data");
  }
};
