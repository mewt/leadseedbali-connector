  function doPost(e) {
    try {
      var params = (e && e.parameter) ? e.parameter : {};

      if (params.guestName || params.email) {
        var sheet = SpreadsheetApp.getActiveSpreadsheet();
        if (!sheet) {
          return ContentService.createTextOutput(
            JSON.stringify({ result: "error", message: "Sheet not found" })
          ).setMimeType(ContentService.MimeType.JSON);
        }
        var targetSheet = sheet.getSheetByName("Leads") || sheet.getActiveSheet();

        var tz = "Asia/Singapore"; // GMT+8
        var now = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
        var timeNow = Utilities.formatDate(new Date(), tz, "HH:mm:ss");
        var loginDate = params.loginDate || now;
        var loginTime = params.loginTime || timeNow;

        targetSheet.appendRow([
          loginDate,
          loginTime,
          params.guestName || "",
          params.email || "",
          params.consent === "true" || false,
          params.macAddress || "",
          params.deviceType || ""
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
      var targetSheet = sheet.getSheetByName("Leads") || sheet.getActiveSheet();

      var tz = "Asia/Singapore"; // GMT+8
      var now = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
      var timeNow = Utilities.formatDate(new Date(), tz, "HH:mm:ss");
      var loginDate = data.loginDate || now;
      var loginTime = data.loginTime || timeNow;

      targetSheet.appendRow([
        loginDate,
        loginTime,
        data.guestName || "",
        data.email || "",
        data.consent || false,
        data.macAddress || "",
        data.deviceType || ""
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

      if (params.guestName || params.email) {
        var sheet = SpreadsheetApp.getActiveSpreadsheet();
        if (!sheet) {
          return ContentService.createTextOutput(
            JSON.stringify({ result: "error", message: "Sheet not found" })
          ).setMimeType(ContentService.MimeType.JSON);
        }
        var targetSheet = sheet.getSheetByName("Leads") || sheet.getActiveSheet();

        var tz = "Asia/Singapore"; // GMT+8
        var now = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
        var timeNow = Utilities.formatDate(new Date(), tz, "HH:mm:ss");
        var loginDate = params.loginDate || now;
        var loginTime = params.loginTime || timeNow;

        targetSheet.appendRow([
          loginDate,
          loginTime,
          params.guestName || "",
          params.email || "",
          params.consent === "true" || false,
          params.macAddress || "",
          params.deviceType || ""
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
