# GL.iNet Mango (OpenWrt) Captive Portal

A custom captive portal setup for the **GL.iNet Mango** running **OpenWrt**, using **openNDS** (or **Nodogsplash**) to capture guest data and save it to **Google Sheets**.

## Why This Is Better Than Ruijie Cloud

| Feature | Ruijie Cloud | GL.iNet Mango + openNDS |
|---|---|---|
| Control | Locked to Ruijie dashboard | Full local control |
| Auth endpoint | Cloud-specific, breaks in preview | Local gateway, always works |
| MAC capture | Unreliable (cloud parameter) | Built-in (`clientmac`) |
| Offline | Requires internet + Ruijie cloud | Router handles auth locally |
| Customization | Limited HTML upload | Full HTML/JS/CSS freedom |

---

## How It Works

1. Guest connects to Mango guest WiFi
2. `openNDS` intercepts the first HTTP request
3. Guest is redirected to the **FAS (Forward Authentication Server)** — your custom portal page
4. Guest fills name + email → data sent to **Google Sheets**
5. Portal redirects guest back to `openNDS` auth URL with the token
6. `openNDS` grants internet access
7. Guest is redirected to Instagram (`https://www.instagram.com/THESEEDBALI/`)

---

## Folder Structure

```
portal_mango/
├── README.md              # This file
├── SETUP.md               # Router configuration steps
├── index.html             # Captive portal page
├── css/
│   └── index.css          # Styling
├── js/
│   └── index.js           # Form validation + webhook + openNDS auth
├── img/                   # Logo, background, favicon
└── google-apps-script.js  # Same backend as portal_fresh
```

---

## Key Differences from `portal_fresh`

| | `portal_fresh` (Ruijie) | `portal_mango` (OpenNDS) |
|---|---|---|
| **MAC param** | `mac` or `userMac` | `clientmac` |
| **IP param** | None | `clientip` |
| **Auth token** | `sessionId` | `tok` |
| **Auth URL** | `/api/auth/general` | `http://<gateway>/opennds_auth/` |
| **Redirect after auth** | From API response | `redir` parameter |

---

## Next Steps (Tomorrow)

1. Read `SETUP.md` for router configuration
2. Install `openNDS` on the Mango
3. Copy `index.html` + assets to the router (`/www/portal/`)
4. Configure FAS URL in `openNDS`
5. Deploy Google Apps Script (or reuse existing)
6. Test on guest WiFi

---

## Notes

- The Mango has limited storage (~8-16MB free). Keep assets small.
- You can host the portal on an external server and just point FAS there if router storage is tight.
- `openNDS` is more feature-rich than `Nodogsplash`. Use `openNDS` if you need FAS level 3 (custom auth logic).
