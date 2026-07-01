function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var folderId = "1EmtpfFSTfnmeXKgtgr975CMlPy0tNYJf";
    var folder = DriveApp.getFolderById(folderId);
    
    var ktpUrl = "";
    if (data['Foto KTP'] && data['Foto KTP'].data) {
      var ktpBlob = Utilities.newBlob(Utilities.base64Decode(data['Foto KTP'].data), data['Foto KTP'].mimeType, data['Foto KTP'].fileName);
      var ktpFile = folder.createFile(ktpBlob);
      // Ensure file is shared so it can be viewed via link
      ktpFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      ktpUrl = ktpFile.getUrl();
    }
    
    var pasporUrl = "";
    if (data['Foto Paspor'] && data['Foto Paspor'].data) {
      var pasporBlob = Utilities.newBlob(Utilities.base64Decode(data['Foto Paspor'].data), data['Foto Paspor'].mimeType, data['Foto Paspor'].fileName);
      var pasporFile = folder.createFile(pasporBlob);
      // Ensure file is shared so it can be viewed via link
      pasporFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      pasporUrl = pasporFile.getUrl();
    }

    // FIX: Gunakan openById() bukan getActiveSpreadsheet()
    var spreadsheetId = "1E_pvo1asMX06f-D3Vr8iaDydlsqzq7UpRYFK1WN-YPE";
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName("Sheet1");

    if (!sheet) {
      // Create sheet if not exists
      sheet = ss.insertSheet("Sheet1");
    }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Nama Lengkap", "NIK", "Nomor Paspor", "Tanggal Lahir", 
        "Alamat", "Email", "No WhatsApp", "LPK", "Tanggal Keberangkatan", 
        "Tanggal Aktivasi", "Pilihan Paket", "Merk HP", "Jenis Kartu",
        "Sumber Informasi", "PIC", "Metode Pembayaran", "Link Foto KTP", "Link Foto Paspor"
      ]);
      // Format header
      sheet.getRange(1, 1, 1, 19).setFontWeight("bold").setBackground("#f3f3f3");
    }

    sheet.appendRow([
      new Date(),
      data['Nama Lengkap'] || "",
      data['NIK'] || "",
      data['Nomor Paspor'] || "",
      data['Tanggal Lahir'] || "",
      data['Alamat'] || "",
      data['Email'] || "",
      data['No WhatsApp'] || "",
      data['LPK'] || "",
      data['Tanggal Keberangkatan'] || "",
      data['Tanggal Aktivasi'] || "",
      data['Pilihan Paket'] || "",
      data['Merk HP'] || "",
      data['Jenis Kartu'] || "",
      data['Sumber Informasi'] || "",
      data['PIC'] || "",
      data['Metode Pembayaran'] || "",
      ktpUrl,
      pasporUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Catat error di Execution Log untuk debugging
    console.error("doPost Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "message": "JP Smart Registration API is running"
  })).setMimeType(ContentService.MimeType.JSON);
}
