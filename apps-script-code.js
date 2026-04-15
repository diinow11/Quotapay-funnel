function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var raw = "";
  try { if (e.postData) raw = e.postData.contents; } catch(err) {}
  try { if (e.parameter && e.parameter.payload) raw = e.parameter.payload; } catch(err) {}
  if (!raw) {
    return ContentService.createTextOutput('{"status":"error"}').setMimeType(ContentService.MimeType.JSON);
  }
  var data = JSON.parse(raw);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.fullName || "",
    data.phone || "",
    data.idNumber || "",
    data.productName || "",
    data.productModel || "",
    data.totalPrice || "",
    data.deposit || "",
    data.monthlyPayment || "",
    data.planMonths || "",
    data.crbStatus || "",
    "Pending"
  ]);
  return ContentService.createTextOutput('{"status":"success"}').setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('{"status":"ok"}').setMimeType(ContentService.MimeType.JSON);
}
