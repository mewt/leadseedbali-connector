# Portal Fresh - Project Documentation

**Last Updated:** 2025-06-12

---

## Project Goal

Create a custom Ruijie Cloud captive portal that:
1. Collects **Full Name + Email** from guests
2. Saves the data to **Google Sheets**
3. Authenticates the user on the network
4. Redirects to Instagram: `https://www.instagram.com/THESEEDBALI/`

---

## Current Status

### ✅ Working
- Google Sheets webhook integration (Apps Script deployed)
- CORS fix (changed `contentType` to `text/plain`)
- Full Name + Email form with validation
- Checkbox for "Receive invitations"
- Branding (THE SEED logo, custom CSS)

### ❌ Not Working
- **Preview mode shows "Oops! Server Not Available"**
- Preview mode from Ruijie Cloud dashboard **does NOT have authentication context**
- `/api/auth/general` returns 404 in preview — but **may work in real captive portal flow**

### ⚠️ Cannot Test Remotely
The captive portal **only activates when a device is physically connected to the guest WiFi**.
The AP intercepts traffic from unauthenticated devices — the dashboard preview is just a file viewer with no auth server.

---

## Root Cause

| Mode | Auth Endpoint | Status |
|---|---|---|
| **Local AP/Gateway** | `http://<AP-IP>/api/auth/general` | ✅ Works (Ruijie's default template assumes this) |
| **Ruijie Cloud** | `https://cloud-as.ruijienetworks.com/api/auth/general` | ❌ 404 — endpoint doesn't exist on cloud |

The default template Ruijie provides (`default/` folder) is a **generic template** designed for local AP deployment. When used with Ruijie Cloud, the relative URL `/api/auth/general` resolves to the **cloud domain**, not the AP.

---

## What Needs to Be Resolved

### Priority 1: Find the Correct Cloud Auth Endpoint

When Ruijie Cloud redirects a user to the captive portal, the **URL contains parameters** that tell us where to authenticate.

**Action Needed:**
1. Connect to your guest WiFi on a device
2. Open the captive portal preview
3. Copy the **full URL** (with all query parameters)
4. It should look something like:
   ```
   https://noc.ruijie.com.cn/...?sessionId=xxx&userUrl=xxx&...
   ```

**Key parameters to look for:**
- `sessionId` — identifies the user session
- `userUrl` / `redirectUrl` / `wlanuserip` — tells us where to POST auth
- `acname` / `wlanacname` — AP/controller name

### Priority 2: Alternative Approaches

If the cloud doesn't expose a direct auth endpoint, we have two alternatives:

#### Option A: External Portal Mode
- Host the HTML on **your own server** (not Ruijie Cloud)
- Configure Ruijie as "External Captive Portal"
- Point the portal URL to your server
- Your server handles the form → sends data → authenticates via Ruijie's external protocol

#### Option B: Use Ruijie's Built-in Registration
- Stop using Custom HTML mode
- Use Ruijie Cloud's native **Registration** feature
- Configure custom fields (Full Name, Email) in the UI
- No coding needed, Ruijie handles everything

---

## Files Structure

```
portal_fresh/
├── loadConfig.json          # Portal config (auth type: pass)
├── index.html               # Main page (Full Name + Email form)
├── css/
│   └── index.css            # Styling (glassmorphism card design)
├── js/
│   ├── index.js             # Main logic (webhook + auth trigger)
│   ├── language.js          # i18n translations (en_US, zh_CN, es_ES)
│   ├── i18n/
│   │   └── i18n.js          # Language switcher
│   └── jquery/
│       └── jquery.min.js    # jQuery dependency
├── img/
│   ├── logo-seed.PNG        # Custom logo
│   ├── bg-alt.jpeg          # Background image
│   ├── favicon.ico
│   └── loading.gif
├── google-apps-script.js    # Google Sheets backend code (NOT in zip)
└── README.md                # Setup guide
```

---

## Google Sheets Webhook

### Status: ✅ Deployed
- **Webhook URL:** `https://script.google.com/macros/s/AKfycbxnIjMaKGCBF5txvZLrFJPbvluUO59T_-yqaoaOvKEbWKYEt7L1HBKliCctQDHRfFBtgw/exec`
- **CORS fix:** `contentType: "text/plain"` (avoids OPTIONS preflight)
- **Data format sent:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "receiveOffers": true,
    "timestamp": "2025-06-12T10:30:00.000Z"
  }
  ```

### Google Apps Script Code
Location: `portal_fresh/google-apps-script.js`
- Already deployed and working
- Append data to Google Sheet on POST request
- Returns `{ "result": "success" }`

---

## Ruijie Cloud Configuration

### What's Configured
| Setting | Value |
|---|---|
| Policy Name | the seed guest |
| Policy Mode | Cloud Auth |
| Portal Mode | Custom HTML |
| Post-login URL | `https://www.instagram.com/THESEEDBALI/` |

### What Needs Checking
- Walled garden: `script.google.com` should be allowed (for webhook)
- SSID: Make sure the policy is applied to the correct guest WiFi

---

## Next Steps (When You're Back)

1. **Preview the portal** on a device connected to the guest WiFi
2. **Copy the full URL** with all query parameters
3. **Share the URL** so we can find the correct auth endpoint
4. **Update `js/index.js`** with the correct endpoint
5. **Rebuild zip** and test again

### Command to rebuild the zip:
```bash
python3 -c "
import zipfile, os
zip_path = '/home/himehime/Archive/portal_fresh.zip'
src_dir = '/home/himehime/Archive/portal_fresh'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f in ('.DS_Store', 'portal_fresh.zip', 'google-apps-script.js'):
                continue
            full = os.path.join(root, f)
            arcname = os.path.relpath(full, src_dir)
            zf.write(full, arcname)
print('Done:', zip_path)
"
```

---

## Key Learnings

1. **Ruijie Cloud Custom HTML** is different from **Local AP Custom HTML**
   - Cloud: page served from `cloud-as.ruijienetworks.com`
   - Local: page served from the AP's IP directly

2. **`/api/auth/general`** is a **local AP endpoint**, not a cloud endpoint
   - Works on: Ruijie EG, AP running local firmware
   - Does NOT work on: Ruijie Cloud (`cloud-as.ruijienetworks.com`)

3. **CORS with Google Apps Script**: `contentType: application/json` triggers OPTIONS preflight which GAS doesn't handle. Use `contentType: text/plain` instead.

4. **Ruijie's default template** is generic — meant for multiple deployment modes, not specifically for Cloud.

---

## Useful Links

- Ruijie Cloud: `https://noc.ruijie.com.cn/`
- Google Sheet: (your sheet where data gets saved)
- Google Apps Script Executions: Extensions → Apps Script → Clock icon ⏰
- Ruijie Help Docs: `https://noc.ruijie.com.cn/help/`
