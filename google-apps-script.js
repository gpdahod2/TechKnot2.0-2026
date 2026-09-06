/**
 * TECHNOT 2.0 registration backend.
 *
 * Deploy this file as a Google Apps Script web app:
 * Execute as: Me
 * Who has access: Anyone
 */

var TIME_ZONE = "Asia/Kolkata";
var SPREADSHEET_ID = "1kCkX8nMBgrwZ-HBGNP2NuV01TXhBm42mDlhoSYmpdps";
var BACKEND_VERSION = "2026-09-06-techtrail-v2";

var EVENT_CONFIG = {
  "innovation-project": { sheet: "IdeaForge", maxMembers: 4 },
  "tech-quiz": { sheet: "MindMatrix", maxMembers: 3 },
  "cyber-awareness": { sheet: "CyberCanvas", maxMembers: 4 },
  "code-hunt": { sheet: "Codebreak", maxMembers: 1, semester: true },
  "techhunt": { sheet: "TechTrail", maxMembers: 5 },
  "freefire": { sheet: "Final Strike", maxPlayers: 4, players: true },
  "trust-partner": { sheet: "Blind Sync", maxMembers: 2 }
};

var MASTER_HEADERS = [
  "Timestamp", "Event ID", "Event Name", "Team / Participant Name",
  "Contact Phone", "Contact Email", "Department", "Total Participants",
  "Details Summary"
];

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getHeaders_(sheetName) {
  var headers = [
    "Timestamp", "Team Name", "Contact Phone", "Contact Email", "Department"
  ];
  var config = getEventConfigBySheet_(sheetName);

  if (config && config.semester) {
    return [
      "Timestamp", "Participant Name", "Contact Phone", "Contact Email",
      "Department", "Enrollment Number", "Semester"
    ];
  }

  if (config && config.players) {
    headers = ["Timestamp", "Team Name", "Leader Phone"];
    for (var player = 1; player <= config.maxPlayers; player++) {
      headers.push("Player " + player + " IGN", "Player " + player + " UID");
    }
    return headers;
  }

  var memberCount = config ? config.maxMembers : 0;
  for (var member = 1; member <= memberCount; member++) {
    headers.push("Member " + member + " Name", "Member " + member + " Enrollment");
  }
  return headers;
}

function getEventConfigBySheet_(sheetName) {
  for (var eventId in EVENT_CONFIG) {
    if (EVENT_CONFIG[eventId].sheet === sheetName) {
      return EVENT_CONFIG[eventId];
    }
  }
  return null;
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  // Remove legacy spacer headers while preserving all registration rows.
  sheet.getRange(1, 1, 1, Math.max(sheet.getMaxColumns(), headers.length)).clearContent();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#0A6ED3");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 35);
  return sheet;
}

function setupSheets() {
  var spreadsheet = getSpreadsheet_();
  ensureSheet_(spreadsheet, "All Registrations", MASTER_HEADERS);

  for (var eventId in EVENT_CONFIG) {
    var sheetName = EVENT_CONFIG[eventId].sheet;
    ensureSheet_(spreadsheet, sheetName, getHeaders_(sheetName));
  }

  var defaultSheet = spreadsheet.getSheetByName("Sheet1");
  if (
    defaultSheet &&
    spreadsheet.getSheets().length > 1 &&
    defaultSheet.getLastRow() === 0 &&
    defaultSheet.getLastColumn() === 0
  ) {
    spreadsheet.deleteSheet(defaultSheet);
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("TECHNOT")
    .addItem("Create / update registration sheets", "setupSheets")
    .addToUi();
}

function normalizeEventId_(eventId) {
  var normalized = String(eventId || "").toLowerCase().trim();
  if (normalized === "codebreak") return "code-hunt";
  if (normalized === "techtrail") return "techhunt";
  if (normalized === "blindsync") return "trust-partner";
  if (normalized === "ideaforge") return "innovation-project";
  if (normalized === "mindmatrix") return "tech-quiz";
  if (normalized === "cybercanvas") return "cyber-awareness";
  return normalized;
}

function clean_(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function getMembers_(data) {
  return Array.isArray(data.members) ? data.members : [];
}

function getPlayers_(data) {
  return Array.isArray(data.players) ? data.players : [];
}

function buildSummary_(data, config) {
  if (config.players) {
    return getPlayers_(data).map(function(player, index) {
      return "P" + (index + 1) + ": " + clean_(player.ign) +
        " (UID: " + clean_(player.uid) + ")";
    }).join(" | ");
  }

  return getMembers_(data).map(function(member, index) {
    var semester = clean_(member.semester || member.semister);
    var details = "M" + (index + 1) + ": " + clean_(member.name) +
      " [" + clean_(member.enrollment) + "]";
    return semester ? details + " Sem-" + semester : details;
  }).join(" | ");
}

function buildEventRow_(data, timestamp, config) {
  if (config.semester) {
    var codebreakMember = getMembers_(data)[0] || {};
    return [
      timestamp,
      clean_(codebreakMember.name || data.teamName),
      clean_(data.contactPhone),
      clean_(data.contactEmail),
      clean_(data.department),
      clean_(codebreakMember.enrollment),
      clean_(codebreakMember.semester || codebreakMember.semister)
    ];
  }

  if (config.players) {
    var playerRow = [
      timestamp,
      clean_(data.teamName),
      clean_(data.contactPhone)
    ];
    var players = getPlayers_(data);
    for (var player = 0; player < config.maxPlayers; player++) {
      var playerData = players[player] || {};
      playerRow.push(clean_(playerData.ign), clean_(playerData.uid));
    }
    return playerRow;
  }

  if (config.sheet === "TechTrail") {
    var techTrailMembers = getMembers_(data);
    return [
      timestamp,
      clean_(data.teamName || (techTrailMembers[0] || {}).name),
      clean_(data.contactPhone),
      clean_(data.contactEmail),
      clean_(data.department),
      techTrailMembers[0] ? clean_(techTrailMembers[0].name) : "",
      techTrailMembers[0] ? clean_(techTrailMembers[0].enrollment) : "",
      techTrailMembers[1] ? clean_(techTrailMembers[1].name) : "",
      techTrailMembers[1] ? clean_(techTrailMembers[1].enrollment) : "",
      techTrailMembers[2] ? clean_(techTrailMembers[2].name) : "",
      techTrailMembers[2] ? clean_(techTrailMembers[2].enrollment) : "",
      techTrailMembers[3] ? clean_(techTrailMembers[3].name) : "",
      techTrailMembers[3] ? clean_(techTrailMembers[3].enrollment) : "",
      techTrailMembers[4] ? clean_(techTrailMembers[4].name) : "",
      techTrailMembers[4] ? clean_(techTrailMembers[4].enrollment) : ""
    ];
  }

  var memberRow = [
    timestamp,
    clean_(data.teamName || (getMembers_(data)[0] || {}).name),
    clean_(data.contactPhone),
    clean_(data.contactEmail),
    clean_(data.department)
  ];
  var members = getMembers_(data);
  for (var member = 0; member < config.maxMembers; member++) {
    var memberData = members[member] || {};
    memberRow.push(clean_(memberData.name), clean_(memberData.enrollment));
  }
  return memberRow;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Request body is missing.");
    }

    var data = JSON.parse(e.postData.contents);
    var eventId = normalizeEventId_(data.eventId);
    var config = EVENT_CONFIG[eventId];
    if (!config) {
      throw new Error("Unknown event ID: " + clean_(data.eventId));
    }

    var spreadsheet = getSpreadsheet_();
    var timestamp = Utilities.formatDate(
      new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm:ss"
    );
    var eventSheet = ensureSheet_(
      spreadsheet,
      config.sheet,
      getHeaders_(config.sheet)
    );
    var masterSheet = ensureSheet_(
      spreadsheet,
      "All Registrations",
      MASTER_HEADERS
    );

    var participantCount = config.players
      ? getPlayers_(data).length
      : getMembers_(data).length;
    masterSheet.appendRow([
      timestamp,
      eventId,
      clean_(data.eventName),
      clean_(data.teamName || (getMembers_(data)[0] || {}).name),
      clean_(data.contactPhone),
      clean_(data.contactEmail),
      clean_(data.department),
      participantCount,
      buildSummary_(data, config)
    ]);
    eventSheet.appendRow(buildEventRow_(data, timestamp, config));

    return jsonResponse_({
      result: "success",
      message: "Registration recorded successfully",
      event: config.sheet,
      backendVersion: BACKEND_VERSION,
      memberCount: participantCount
    });
  } catch (error) {
    return jsonResponse_({ result: "error", error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({
    status: "online",
    message: "TECHNOT registration backend is ready.",
    backendVersion: BACKEND_VERSION
  });
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
