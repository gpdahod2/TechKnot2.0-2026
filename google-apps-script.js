/**
 * ============================================================================
 * TECHNOT 2.0 - Complete Google Apps Script Backend (Automatic Sheet Creator)
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet (https://docs.google.com/spreadsheets/d/1kCkX8nMBgrwZ-HBGNP2NuV01TXhBm42mDlhoSYmpdps/edit)
 * 2. Click "Extensions" > "Apps Script".
 * 3. Replace all existing code in Code.gs with THIS ENTIRE FILE.
 * 4. At the top toolbar, select `setupSheets` from the dropdown and click "Run".
 *    (This will automatically create & format all 8 event tabs in your Google Sheet!)
 * 5. Click "Deploy" > "New deployment".
 * 6. Select Type: "Web app".
 * 7. Set Execute as: "Me", Who has access: "Anyone".
 * 8. Click "Deploy", authorize permissions, and copy the Web App URL!
 */

// Sheet Header Configuration for all events
var SHEET_CONFIG = {
  "All Registrations": [
    "Timestamp", "Event ID", "Event Name", "Team / Participant Name", 
    "Contact Phone", "Contact Email", "Department", "Total Members", "Details Summary"
  ],
  "Codebreak": [
    "Timestamp", "Participant Name", "Contact Phone", "Contact Email", 
    "Department", "Enrollment Number", "Semester"
  ],
  "IdeaForge": [
    "Timestamp", "Team Name", "Contact Phone", "Contact Email", "Department", 
    "Leader Name", "Leader Enrollment", 
    "Member 2 Name", "Member 2 Enrollment", 
    "Member 3 Name", "Member 3 Enrollment", 
    "Member 4 Name", "Member 4 Enrollment"
  ],
  "MindMatrix": [
    "Timestamp", "Team Name", "Contact Phone", "Contact Email", "Department", 
    "Member 1 Name", "Member 1 Enrollment", 
    "Member 2 Name", "Member 2 Enrollment"
  ],
  "CyberCanvas": [
    "Timestamp", "Team / Participant Name", "Contact Phone", "Contact Email", "Department", 
    "Member 1 Name", "Member 1 Enrollment", 
    "Member 2 Name", "Member 2 Enrollment"
  ],
  "TechTrail": [
    "Timestamp", "Team Name", "Contact Phone", "Contact Email", "Department", 
    "Member 1 Name", "Member 1 Enrollment", 
    "Member 2 Name", "Member 2 Enrollment", 
    "Member 3 Name", "Member 3 Enrollment", 
    "Member 4 Name", "Member 4 Enrollment"
  ],
  "Blind Sync": [
    "Timestamp", "Team Name", "Contact Phone", "Contact Email", "Department", 
    "Member 1 Name", "Member 1 Enrollment", 
    "Member 2 Name", "Member 2 Enrollment"
  ],
  "Final Strike": [
    "Timestamp", "Team Name", "Leader Phone", 
    "Player 1 IGN", "Player 1 UID", 
    "Player 2 IGN", "Player 2 UID", 
    "Player 3 IGN", "Player 3 UID", 
    "Player 4 IGN", "Player 4 UID", 
    "Player 5 IGN (Optional)", "Player 5 UID (Optional)"
  ]
};

/**
 * AUTOMATIC SHEET CREATOR & FORMATTER
 * Select `setupSheets` in Apps Script and click RUN to set up your entire spreadsheet!
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  for (var tabName in SHEET_CONFIG) {
    var headers = SHEET_CONFIG[tabName];
    var sheet = ss.getSheetByName(tabName);
    
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    } else {
      sheet.clearContents(); // Clear existing content to re-apply clean headers
    }
    
    // Set Header Row
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Style Header Row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0A6ED3"); // Cyber Blue accent
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
  }
  
  // Remove default blank 'Sheet1' if present
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }
  
  Logger.log("SUCCESS: All 8 TECHNOT 2.0 event tabs have been created and formatted!");
}

/**
 * Handles incoming POST requests from the website form
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Concurrency protection

  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    var eventId = (data.eventId || "").toLowerCase();
    var isFreeFire = data.isFreeFire || eventId === "freefire";
    var eventName = data.eventName || "";
    var teamName = data.teamName || "";
    var contactPhone = data.contactPhone || "";
    var contactEmail = data.contactEmail || "";
    var department = data.department || "";

    // -------------------------------------------------------------
    // 1. MASTER LOG ("All Registrations" Tab)
    // -------------------------------------------------------------
    var allSheet = getOrCreateTab(ss, "All Registrations");
    var totalCount = isFreeFire ? (data.players ? data.players.length : 0) : (data.members ? data.members.length : 0);
    
    var summaryStr = "";
    if (isFreeFire && data.players) {
      summaryStr = data.players.map(function(p, i) { return "P" + (i + 1) + ": " + p.ign + " (UID: " + p.uid + ")"; }).join(" | ");
    } else if (data.members) {
      summaryStr = data.members.map(function(m, i) { 
        var str = "M" + (i + 1) + ": " + m.name + " [" + m.enrollment + "]";
        if (m.semester) str += " Sem-" + m.semester;
        return str;
      }).join(" | ");
    }

    allSheet.appendRow([
      timestamp,
      eventId,
      eventName,
      teamName || (data.members && data.members[0] ? data.members[0].name : "N/A"),
      contactPhone,
      contactEmail,
      department,
      totalCount,
      summaryStr
    ]);

    // -------------------------------------------------------------
    // 2. EVENT-SPECIFIC TAB
    // -------------------------------------------------------------
    var tabName = getTabNameByEventId(eventId);
    var eventSheet = getOrCreateTab(ss, tabName);

    if (eventId === "codebreak") {
      // Individual Coding Event
      var m1 = (data.members && data.members[0]) ? data.members[0] : {};
      eventSheet.appendRow([
        timestamp,
        m1.name || teamName,
        contactPhone,
        contactEmail,
        department,
        m1.enrollment || "",
        m1.semester || ""
      ]);

    } else if (isFreeFire || eventId === "freefire") {
      // Free Fire Gaming Event
      var players = data.players || [];
      var ffRow = [timestamp, teamName, contactPhone];
      for (var p = 0; p < 5; p++) {
        var pl = players[p] || {};
        ffRow.push(pl.ign || "", pl.uid || "");
      }
      eventSheet.appendRow(ffRow);

    } else {
      // General Team Events (IdeaForge, MindMatrix, CyberCanvas, TechTrail, Blind Sync)
      var members = data.members || [];
      var stdRow = [
        timestamp,
        teamName || (members[0] ? members[0].name : ""),
        contactPhone,
        contactEmail,
        department
      ];
      for (var m = 0; m < 4; m++) {
        var mem = members[m] || {};
        stdRow.push(mem.name || "", mem.enrollment || "");
      }
      eventSheet.appendRow(stdRow);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Registration recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online", message: "TECHNOT 2.0 Apps Script backend is ready." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateTab(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(tabName);
  }
  return sheet;
}

function getTabNameByEventId(eventId) {
  var map = {
    "codebreak": "Codebreak",
    "ideaforge": "IdeaForge",
    "mindmatrix": "MindMatrix",
    "cybercanvas": "CyberCanvas",
    "techtrail": "TechTrail",
    "blindsync": "Blind Sync",
    "freefire": "Final Strike"
  };
  return map[eventId] || "All Registrations";
}
