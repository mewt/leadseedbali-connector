# Portal Fresh - Google Sheets Integration

## Setup Google Sheets Webhook (5 minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.new)
2. Name it: **"THE SEED WiFi - Guest Registrations"**
3. Add headers in Row 1:
   - A1: `Timestamp`
   - B1: `Full Name`
   - C1: `Email`
   - D1: `Receive Offers`

### Step 2: Create Google Apps Script
1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete the default code
3. Paste the code from `google-apps-script.js`
4. Click **Save**

### Step 3: Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the gear icon → Select **Web app**
3. Fill in:
   - **Description:** `WiFi Portal Webhook`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/AKfycb.../exec`)

### Step 4: Add URL to Portal
1. Open `portal_fresh/js/index.js`
2. Replace this line at the top:
   ```javascript
   const WEBHOOK_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE";
   ```
3. With your actual URL:
   ```javascript
   const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```

### Step 5: Zip & Upload
```bash
cd /home/himehime/Archive
zip -r portal_fresh.zip portal_fresh/ -x "portal_fresh/.DS_Store"
```
Upload `portal_fresh.zip` to Ruijie Cloud

---

## How It Works

```
User connects → Fills Name + Email → Clicks "Connect Now"
         ↓
1. Data sent to Google Sheets (your webhook)
         ↓
2. Ruijie one-click auth triggered
         ↓
3. User gets internet access
         ↓
4. Redirects to your Instagram page
```
