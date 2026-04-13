function doPost(e) {
  try {
    // Handle case where e is undefined or postData is missing
    var contents;
    if (e && e.postData && e.postData.contents) {
      contents = e.postData.contents;
    } else if (e && e.parameter && e.parameter.payload) {
      // Fallback: data sent as form parameter
      contents = e.parameter.payload;
    } else {
      // Log the issue for debugging
      Logger.log("doPost received unrecognized format: " + JSON.stringify(e));
      return ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "Invalid request format", received: JSON.stringify(e) })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.fullName || "",
      data.email || "",
      data.receiveOffers || false
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ result: "webhook is working" })
  ).setMimeType(ContentService.MimeType.JSON);
}
