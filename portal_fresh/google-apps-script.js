function doPost(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};

    if (params.fullName || params.email) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet();
      if (!sheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ result: "error", message: "Sheet not found" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      var targetSheet = sheet.getActiveSheet();

      targetSheet.appendRow([
        params.timestamp || new Date().toISOString(),
        params.fullName || "",
        params.email || "",
        params.receiveOffers === "true" || false
      ]);

      return ContentService.createTextOutput(
        JSON.stringify({ result: "success", message: "Data saved via query params" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var contents;
    var postData = (e && e.postData) ? e.postData : null;
    if (postData && postData.contents) {
      contents = postData.contents;
    } else if (params.payload) {
      contents = params.payload;
    } else {
      Logger.log("doPost: no data found");
      return ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "No data found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "Sheet not found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var targetSheet = sheet.getActiveSheet();

    targetSheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.fullName || "",
      data.email || "",
      data.receiveOffers || false
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "Data saved via POST body" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};

    if (params.fullName || params.email) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet();
      if (!sheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ result: "error", message: "Sheet not found" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      var targetSheet = sheet.getActiveSheet();

      targetSheet.appendRow([
        params.timestamp || new Date().toISOString(),
        params.fullName || "",
        params.email || "",
        params.receiveOffers === "true" || false
      ]);

      return ContentService.createTextOutput(
        JSON.stringify({ result: "success", message: "Data saved via GET" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "webhook is working" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in doGet: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
