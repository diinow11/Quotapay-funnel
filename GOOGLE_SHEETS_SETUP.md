# Google Sheets Setup — Receive Applications Automatically

Every time someone completes the QuotaPay funnel, their application lands in your Google Sheet. You review it there — no chatting needed.

---

## Part 1: Create Your Google Sheet

1. Open your browser and go to **sheets.google.com**
2. Click the **+** (Blank spreadsheet) button
3. Name it **QuotaPay Applications** (click "Untitled spreadsheet" at the top left)
4. In **Row 1**, type these headers — one per cell:

```
A1: Timestamp
B1: Full Name
C1: Phone
D1: ID Number
E1: Product
F1: Model
G1: Total Price
H1: Deposit
I1: Monthly Payment
J1: Plan Months
K1: CRB Status
L1: Statement Files
M1: M-Pesa Passcode
N1: Status
```

5. **Bold Row 1** — select the whole row, press Ctrl+B
6. **Freeze Row 1** — go to View → Freeze → 1 row (so headers always show when scrolling)
7. In column **N (Status)**, you'll manually type "Pending", "Approved", or "Rejected" as you review each application

---

## Part 2: Create the Webhook (Apps Script)

This is the "pipe" that sends data from your website to the Google Sheet.

1. While in your Google Sheet, click **Extensions** in the top menu
2. Click **Apps Script** — a new tab opens
3. You'll see some default code. **Delete everything** in the editor
4. **Copy and paste this entire code:**

```javascript
// This script does TWO things:
// 1. Saves application data to the Google Sheet
// 2. Saves uploaded PDFs to a "QuotaPay Statements" folder in your Google Drive
//    and puts clickable links in the Sheet

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Handle both JSON body and form POST
    var raw = "";
    if (e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }
    if (e.parameter && e.parameter.payload) {
      raw = e.parameter.payload;
    }

    var data = JSON.parse(raw);

    // Save uploaded files to Google Drive
    var fileLinks = [];
    if (data.files && data.files.length > 0) {
      // Create or find the folder
      var folderName = "QuotaPay Statements";
      var folders = DriveApp.getFoldersByName(folderName);
      var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      // Create a subfolder for this applicant: "John Kamau - 12345678"
      var applicantFolder = folder.createFolder(
        (data.fullName || "Unknown") + " - " + (data.idNumber || "NoID") + " - " + new Date().toLocaleDateString()
      );

      for (var i = 0; i < data.files.length; i++) {
        var file = data.files[i];
        var blob = Utilities.newBlob(
          Utilities.base64Decode(file.base64),
          file.mimeType || "application/pdf",
          file.name || "statement-" + (i + 1) + ".pdf"
        );
        var driveFile = applicantFolder.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileLinks.push(driveFile.getUrl());
      }
    }

    // Add row to sheet
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
      fileLinks.join("\n"),
      data.mpesaPasscode || "",
      "Pending"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", files: fileLinks.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "QuotaPay webhook is active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Click the **Save** icon (floppy disk) or press **Ctrl+S**
6. Name the project **QuotaPay Webhook** when prompted

---

## Part 3: Deploy the Webhook

1. In Apps Script, click the **Deploy** button (top right)
2. Click **New deployment**
3. Click the **gear icon** next to "Select type" and choose **Web app**
4. Fill in:
   - **Description:** `QuotaPay Applications`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone`
5. Click **Deploy**
6. It will ask you to **Authorize access** — click "Authorize access"
7. If you see "Google hasn't verified this app":
   - Click **Advanced** (bottom left)
   - Click **Go to QuotaPay Webhook (unsafe)** — this is safe, it's YOUR script
   - Click **Allow**
8. You'll see a **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
9. **COPY THIS URL** — you need it for the next step

---

## Part 4: Connect to Your Website

1. Open the file `apps/web/src/data/site-config.ts` in your code editor
2. Find this line:
   ```
   googleSheetsWebhook: "",
   ```
3. Paste your URL between the quotes:
   ```
   googleSheetsWebhook: "https://script.google.com/macros/s/AKfycbx.../exec",
   ```
4. Save the file
5. Rebuild your site:
   ```
   pnpm --filter web build
   ```
6. Redeploy to your hosting

---

## Part 5: Test It

1. Go to your live site
2. Complete the entire funnel — pick a category, product, plan, answer CRB "No", fill in test details (name: "Test User", phone: "0712345678", ID: "12345678"), upload any PDF, submit
3. Open your Google Sheet
4. You should see a new row with all the test data
5. Delete the test row when you're done

---

## Troubleshooting

**"No data appearing in my sheet"**
- Make sure the webhook URL in `site-config.ts` is correct (starts with `https://script.google.com/macros/`)
- Make sure you rebuilt and redeployed after adding the URL
- Check browser console (F12 → Console) for errors when submitting

**"I changed the Apps Script code"**
- You need to create a **New deployment** every time you change the code
- Go to Deploy → New deployment → Web app → Deploy
- Copy the NEW URL and update `site-config.ts`

**"Authorization error"**
- Go back to Apps Script → Deploy → Manage deployments → click the pencil icon → re-authorize

**"I want email notifications for new applications"**
- In Apps Script, add this to the `doPost` function before `return`:
  ```javascript
  MailApp.sendEmail("your-email@gmail.com", "New QuotaPay Application", 
    data.fullName + " wants " + data.productName + " (" + data.productModel + ")");
  ```
