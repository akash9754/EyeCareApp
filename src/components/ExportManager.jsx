// BackupButtons.jsx
import React from "react";
import { exportUsersToJson, importUsersFromJson } from "./backupUtils";

const BackupButtons = () => {
  return (
    <div className="export-manager">
      <h2>📄 Export & Backup</h2>
      <section className="export-section">
        <h3>💾 Data Backup</h3>
        <p>Create backups of your data or restore from previous backups.</p>
        <button onClick={exportUsersToJson} className="btn-primary">
          📤 Export Data
        </button>
      </section>
      <section className="export-section">
        <h3>Restore from Backup</h3>
        <label htmlFor="import-file" className="file-label">
          📁 Choose Backup File
        </label>
        <button onClick={importUsersFromJson} className="btn-secondary">
          📥 Import Data
        </button>
        <p className="warning-text">
          ⚠ Importing will add to existing data. Duplicates may occur.
        </p>
      </section>
    </div>
  );
};
//           <div className="import-backup">
//             <h4>Restore from Backup</h4>
//             <div className="file-input-group">
//               <input
//                 type="file"
//                 accept=".json"
//                 onChange={(e) => setImportFile(e.target.files[0])}
//                 className="file-input"
//                 id="import-file"
//               />
//               <label htmlFor="import-file" className="file-label">
//                 📁 Choose Backup File
//               </label>
//               {importFile && (
//                 <span className="file-name">{importFile.name}</span>
//               )}
//             </div>
//             <button
//               onClick={handleJSONImport}
//               disabled={!importFile}
//               className="btn-secondary"
//             >
//               📥 Import Backup
//             </button>
//             <p className="warning-text">
//               ⚠ Importing will add to existing data. Duplicates may occur.
//             </p>
//           </div>
//         </div>
//       </section>

export default BackupButtons;

{
  /* <div className="export-manager"> */
}
//       <h2>📄 Export & Backup</h2>

//       {/* PDF Export Section */}
//       <section className="export-section">
//         <h3>📑 PDF Export</h3>
//         <p>
//           Export user prescriptions as PDF documents for printing or sharing.
//         </p>

//         <div className="export-actions">
//           <button
//             onClick={handleAllUsersExport}
//             disabled={isExporting || users.length === 0}
//             className="btn-primary"
//           >
//             {isExporting ? "Exporting..." : "📄 Export All Users to PDF"}
//           </button>

//           {users.length === 0 && (
//             <p className="help-text">No users available to export</p>
//           )}
//         </div>

//         {users.length > 0 && (
//           <div className="user-export-list">
//             <h4>Export Individual Users:</h4>
//             <div className="user-export-grid">
//               {users.map((user) => (
//                 <div key={user.id} className="user-export-item">
//                   <div className="user-info">
//                     <strong>{user.name}</strong>
//                     <span>#{user.clientCode}</span>
//                   </div>
//                   <button
//                     onClick={() => handleSingleUserExport(user)}
//                     disabled={isExporting}
//                     className="btn-secondary"
//                   >
//                     📄 Export PDF
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Backup Section */}
//       <section className="export-section">
//         <h3>💾 Data Backup</h3>
//         <p>Create backups of your data or restore from previous backups.</p>

//         <div className="backup-actions">
//           <div className="export-backup">
//             <h4>Create Backup</h4>
//             <button
//               onClick={handleJSONExport}
//               disabled={users.length === 0}
//               className="btn-primary"
//             >
//               💾 Export & Share Backup (JSON)
//             </button>
//             {users.length === 0 && (
//               <p className="help-text">No data to backup</p>
//             )}
//           </div>

// import React, { useState } from "react";
// import { exportUserToPDF, exportAllUsersToPDF } from "../utils/pdfExport";
// import { importFromJSON, clearAllData } from "../utils/dataManager";
// import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
// import { Share } from "@capacitor/share";

// const ExportManager = ({ users, onRefresh }) => {
//   const [isExporting, setIsExporting] = useState(false);
//   const [importFile, setImportFile] = useState(null);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const handleSingleUserExport = async (user) => {
//     setIsExporting(true);
//     try {
//       await exportUserToPDF(user);
//     } catch (error) {
//       console.error("Failed to export user:", error);
//       alert("Failed to export user to PDF");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const handleAllUsersExport = async () => {
//     if (users.length === 0) {
//       alert("No users to export");
//       return;
//     }

//     setIsExporting(true);
//     try {
//       await exportAllUsersToPDF(users);
//     } catch (error) {
//       console.error("Failed to export all users:", error);
//       alert("Failed to export all users to PDF");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // 🔥 NEW: Universal JSON Export (Browser + Capacitor)
//   const handleJSONExport = async () => {
//     if (users.length === 0) {
//       alert("No users to export");
//       return;
//     }

//     const jsonString = JSON.stringify(users, null, 2);

//     try {
//       if (window.Capacitor?.isNativePlatform()) {
//         // ✅ Capacitor (Android/iOS)
//         const result = await Filesystem.writeFile({
//           path: "backup.json",
//           data: jsonString,
//           directory: Directory.Documents,
//           encoding: Encoding.UTF8,
//         });

//         alert("✅ Backup saved as backup.json in Documents folder!");

//         // Open Share dialog (WhatsApp, Gmail, Drive etc.)
//         await Share.share({
//           title: "User Backup",
//           text: "Here is my backup file",
//           url: result.uri, // File URI returned by Filesystem
//           dialogTitle: "Share your backup",
//         });
//       } else {
//         // ✅ Browser fallback
//         const blob = new Blob([jsonString], { type: "application/json" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "backup.json";
//         a.click();
//         URL.revokeObjectURL(url);
//         alert("✅ Backup downloaded!");
//       }
//     } catch (error) {
//       console.error("Failed to export JSON:", error);
//       alert("❌ Failed to export backup file");
//     }
//   };

//   const handleJSONImport = async () => {
//     if (!importFile) {
//       alert("Please select a file to import");
//       return;
//     }

//     try {
//       await importFromJSON(importFile);
//       onRefresh();
//       setImportFile(null);
//       alert("Data imported successfully!");
//     } catch (error) {
//       console.error("Failed to import JSON:", error);
//       alert("Failed to import data. Please check the file format.");
//     }
//   };

//   const handleClearAllData = async () => {
//     try {
//       await clearAllData();
//       onRefresh();
//       setShowClearConfirm(false);
//       alert("All data cleared successfully!");
//     } catch (error) {
//       console.error("Failed to clear data:", error);
//       alert("Failed to clear data");
//     }
//   };

//   return (
//     <div className="export-manager">
//       <h2>📄 Export & Backup</h2>

//       {/* PDF Export Section */}
//       <section className="export-section">
//         <h3>📑 PDF Export</h3>
//         <p>
//           Export user prescriptions as PDF documents for printing or sharing.
//         </p>

//         <div className="export-actions">
//           <button
//             onClick={handleAllUsersExport}
//             disabled={isExporting || users.length === 0}
//             className="btn-primary"
//           >
//             {isExporting ? "Exporting..." : "📄 Export All Users to PDF"}
//           </button>

//           {users.length === 0 && (
//             <p className="help-text">No users available to export</p>
//           )}
//         </div>

//         {users.length > 0 && (
//           <div className="user-export-list">
//             <h4>Export Individual Users:</h4>
//             <div className="user-export-grid">
//               {users.map((user) => (
//                 <div key={user.id} className="user-export-item">
//                   <div className="user-info">
//                     <strong>{user.name}</strong>
//                     <span>#{user.clientCode}</span>
//                   </div>
//                   <button
//                     onClick={() => handleSingleUserExport(user)}
//                     disabled={isExporting}
//                     className="btn-secondary"
//                   >
//                     📄 Export PDF
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Backup Section */}
//       <section className="export-section">
//         <h3>💾 Data Backup</h3>
//         <p>Create backups of your data or restore from previous backups.</p>

//         <div className="backup-actions">
//           <div className="export-backup">
//             <h4>Create Backup</h4>
//             <button
//               onClick={handleJSONExport}
//               disabled={users.length === 0}
//               className="btn-primary"
//             >
//               💾 Export & Share Backup (JSON)
//             </button>
//             {users.length === 0 && (
//               <p className="help-text">No data to backup</p>
//             )}
//           </div>

//           <div className="import-backup">
//             <h4>Restore from Backup</h4>
//             <div className="file-input-group">
//               <input
//                 type="file"
//                 accept=".json"
//                 onChange={(e) => setImportFile(e.target.files[0])}
//                 className="file-input"
//                 id="import-file"
//               />
//               <label htmlFor="import-file" className="file-label">
//                 📁 Choose Backup File
//               </label>
//               {importFile && (
//                 <span className="file-name">{importFile.name}</span>
//               )}
//             </div>
//             <button
//               onClick={handleJSONImport}
//               disabled={!importFile}
//               className="btn-secondary"
//             >
//               📥 Import Backup
//             </button>
//             <p className="warning-text">
//               ⚠ Importing will add to existing data. Duplicates may occur.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Data Management Section */}
//       <section className="export-section danger-section">
//         <h3>⚠ Data Management</h3>
//         <p>Manage your stored data. Use with caution!</p>

//         <div className="danger-actions">
//           <button
//             onClick={() => setShowClearConfirm(true)}
//             className="btn-danger"
//             disabled={users.length === 0}
//           >
//             🗑 Clear All Data
//           </button>
//           {users.length === 0 && <p className="help-text">No data to clear</p>}
//         </div>

//         {/* Clear Confirmation Modal */}
//         {showClearConfirm && (
//           <div className="modal-overlay">
//             <div className="modal">
//               <h3>⚠ Clear All Data</h3>
//               <p>Are you sure you want to delete ALL user data?</p>
//               <p>
//                 This will permanently remove {users.length} user(s) and cannot
//                 be undone!
//               </p>
//               <p>
//                 <strong>Consider creating a backup first.</strong>
//               </p>
//               <div className="modal-actions">
//                 <button
//                   onClick={() => setShowClearConfirm(false)}
//                   className="btn-secondary"
//                 >
//                   Cancel
//                 </button>
//                 <button onClick={handleClearAllData} className="btn-danger">
//                   Clear All Data
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Statistics */}
//       <section className="export-section">
//         <h3>📊 Statistics</h3>
//         <div className="stats-grid">
//           <div className="stat-item">
//             <strong>Total Users:</strong>
//             <span>{users.length}</span>
//           </div>
//           <div className="stat-item">
//             <strong>Storage Used:</strong>
//             <span>~{Math.round(JSON.stringify(users).length / 1024)} KB</span>
//           </div>
//           <div className="stat-item">
//             <strong>Last Update:</strong>
//             <span>
//               {users.length > 0
//                 ? new Date(
//                     Math.max(...users.map((u) => new Date(u.updatedAt)))
//                   ).toLocaleDateString()
//                 : "No data"}
//             </span>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ExportManager;

// // ================

// // import React, { useState } from "react";
// // import { exportUserToPDF, exportAllUsersToPDF } from "../utils/pdfExport";
// // import {
// //   exportToJSON,
// //   importFromJSON,
// //   clearAllData,
// // } from "../utils/dataManager";

// // const ExportManager = ({ users, onRefresh }) => {
// //   const [isExporting, setIsExporting] = useState(false);
// //   const [isExportingJson, setIsExportingJson] = useState(false);
// //   const [importFile, setImportFile] = useState(null);
// //   const [showClearConfirm, setShowClearConfirm] = useState(false);

// //   const handleSingleUserExport = async (user) => {
// //     setIsExporting(true);
// //     try {
// //       await exportUserToPDF(user);
// //     } catch (error) {
// //       console.error("Failed to export user:", error);
// //       alert("Failed to export user to PDF");
// //     } finally {
// //       setIsExporting(false);
// //     }
// //   };

// //   const handleAllUsersExport = async () => {
// //     if (users.length === 0) {
// //       alert("No users to export");
// //       return;
// //     }

// //     setIsExporting(true);
// //     try {
// //       await exportAllUsersToPDF(users);
// //     } catch (error) {
// //       console.error("Failed to export all users:", error);
// //       alert("Failed to export all users to PDF");
// //     } finally {
// //       setIsExporting(false);
// //     }
// //   };

// //   const handleJSONExport = async () => {
// //     try {
// //       await exportToJSON(users);
// //     } catch (error) {
// //       console.error("Failed to export JSON:", error);
// //       alert("Failed to export backup file");
// //     }
// //   };

// //   const handleJSONImport = async () => {
// //     if (!importFile) {
// //       alert("Please select a file to import");
// //       return;
// //     }

// //     try {
// //       await importFromJSON(importFile);
// //       onRefresh();
// //       setImportFile(null);
// //       alert("Data imported successfully!");
// //     } catch (error) {
// //       console.error("Failed to import JSON:", error);
// //       alert("Failed to import data. Please check the file format.");
// //     }
// //   };

// //   const handleClearAllData = async () => {
// //     try {
// //       await clearAllData();
// //       onRefresh();
// //       setShowClearConfirm(false);
// //       alert("All data cleared successfully!");
// //     } catch (error) {
// //       console.error("Failed to clear data:", error);
// //       alert("Failed to clear data");
// //     }
// //   };

// //   return (
// //     <div className="export-manager">
// //       <h2>📄 Export & Backup</h2>

// //       {/* Json Export Section */}
// //       <section className="export-section">
// //         <h3>📑 PDF Export</h3>
// //         <p>
// //           Export user prescriptions as PDF documents for printing or sharing.
// //         </p>

// //         <div className="export-actions">
// //           <button
// //             onClick={handleAllUsersExport}
// //             disabled={isExporting || users.length === 0}
// //             className="btn-primary"
// //           >
// //             {isExporting ? "Exporting..." : "📄 Export All Users to PDF"}
// //           </button>

// //           {users.length === 0 && (
// //             <p className="help-text">No users available to export</p>
// //           )}
// //         </div>

// //         {users.length > 0 && (
// //           <div className="user-export-list">
// //             <h4>Export Individual Users:</h4>
// //             <div className="user-export-grid">
// //               {users.map((user) => (
// //                 <div key={user.id} className="user-export-item">
// //                   <div className="user-info">
// //                     <strong>{user.name}</strong>
// //                     <span>#{user.clientCode}</span>
// //                   </div>
// //                   <button
// //                     onClick={() => handleSingleUserExport(user)}
// //                     disabled={isExporting}
// //                     className="btn-secondary"
// //                   >
// //                     📄 Export PDF
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </section>

// //       {/* Backup Section */}
// //       <section className="export-section">
// //         <h3>💾 Data Backup</h3>
// //         <p>Create backups of your data or restore from previous backups.</p>

// //         <div className="backup-actions">
// //           <div className="export-backup">
// //             <h4>Create Backup</h4>
// //             <button
// //               onClick={handleJSONExport}
// //               disabled={users.length === 0}
// //               className="btn-primary"
// //             >
// //               💾 Download Backup (JSON)
// //             </button>
// //             {users.length === 0 && (
// //               <p className="help-text">No data to backup</p>
// //             )}
// //           </div>

// //           <div className="import-backup">
// //             <h4>Restore from Backup</h4>
// //             <div className="file-input-group">
// //               <input
// //                 type="file"
// //                 accept=".json"
// //                 onChange={(e) => setImportFile(e.target.files[0])}
// //                 className="file-input"
// //                 id="import-file"
// //               />
// //               <label htmlFor="import-file" className="file-label">
// //                 📁 Choose Backup File
// //               </label>
// //               {importFile && (
// //                 <span className="file-name">{importFile.name}</span>
// //               )}
// //             </div>
// //             <button
// //               onClick={handleJSONImport}
// //               disabled={!importFile}
// //               className="btn-secondary"
// //             >
// //               📥 Import Backup
// //             </button>
// //             <p className="warning-text">
// //               ⚠️ Importing will add to existing data. Duplicates may occur.
// //             </p>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Data Management Section */}
// //       <section className="export-section danger-section">
// //         <h3>⚠️ Data Management</h3>
// //         <p>Manage your stored data. Use with caution!</p>

// //         <div className="danger-actions">
// //           <button
// //             onClick={() => setShowClearConfirm(true)}
// //             className="btn-danger"
// //             disabled={users.length === 0}
// //           >
// //             🗑️ Clear All Data
// //           </button>
// //           {users.length === 0 && <p className="help-text">No data to clear</p>}
// //         </div>

// //         {/* Clear Confirmation Modal */}
// //         {showClearConfirm && (
// //           <div className="modal-overlay">
// //             <div className="modal">
// //               <h3>⚠️ Clear All Data</h3>
// //               <p>Are you sure you want to delete ALL user data?</p>
// //               <p>
// //                 This will permanently remove {users.length} user(s) and cannot
// //                 be undone!
// //               </p>
// //               <p>
// //                 <strong>Consider creating a backup first.</strong>
// //               </p>
// //               <div className="modal-actions">
// //                 <button
// //                   onClick={() => setShowClearConfirm(false)}
// //                   className="btn-secondary"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button onClick={handleClearAllData} className="btn-danger">
// //                   Clear All Data
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </section>

// //       {/* Statistics */}
// //       <section className="export-section">
// //         <h3>📊 Statistics</h3>
// //         <div className="stats-grid">
// //           <div className="stat-item">
// //             <strong>Total Users:</strong>
// //             <span>{users.length}</span>
// //           </div>
// //           <div className="stat-item">
// //             <strong>Storage Used:</strong>
// //             <span>~{Math.round(JSON.stringify(users).length / 1024)} KB</span>
// //           </div>
// //           <div className="stat-item">
// //             <strong>Last Update:</strong>
// //             <span>
// //               {users.length > 0
// //                 ? new Date(
// //                     Math.max(...users.map((u) => new Date(u.updatedAt)))
// //                   ).toLocaleDateString()
// //                 : "No data"}
// //             </span>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default ExportManager;
