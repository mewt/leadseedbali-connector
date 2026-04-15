# GL.iNet Mango Setup Guide (openNDS) — v2 POST JSON

This guide covers configuring the **GL.iNet Mango** router to run a captive portal that sends guest data via **POST JSON** to a custom webhook endpoint.

The router-side setup is identical to `portal_mango`. The only difference is the portal code (`js/index.js`) uses `fetch POST` with a JSON body instead of `GET` query parameters.

---

## 1. Router Prerequisites

- GL.iNet Mango (GL-MT300N-V2) with stock firmware or OpenWrt
- SSH access enabled
- Internet connection for package installation
- Guest WiFi network configured (e.g., `THESEED-GUEST`)

---

## 2. Install openNDS

SSH into your Mango:

```bash
ssh root@192.168.8.1
```

Install openNDS:

```bash
opkg update
opkg install opennds
/etc/init.d/opennds enable
/etc/init.d/opennds start
```

---

## 3. Configure openNDS

Edit `/etc/config/opennds`:

```uci
config opennds
    option enabled '1'
    option fasremoteip '0.0.0.0'
    option fasport '80'
    option faspath '/portal/index.html'
    option fas_secure_enabled '1'
    option login_option_enabled '1'
    option whitelisted_domains 'your-endpoint.com'
    option maxclients '250'
    option sessiontimeout '1440'
```

> Replace `your-endpoint.com` with the domain of your webhook endpoint so the portal can reach it.

Copy portal files to the router:

```bash
mkdir -p /www/portal
cp index.html /www/portal/
cp -r css /www/portal/
cp -r js /www/portal/
cp -r img /www/portal/
```

Restart openNDS:

```bash
/etc/init.d/opennds restart
```

---

## 4. Update Webhook URL

Before copying files to the router, edit `js/index.js`:

```javascript
const WEBHOOK_URL = "https://your-endpoint.com/webhook";
```

Your endpoint must:
- Accept `POST`
- Accept `Content-Type: application/json`
- Respond with CORS headers:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Headers: Content-Type
  Access-Control-Allow-Methods: POST, OPTIONS
  ```

---

## 5. How openNDS Redirects Work

When a guest connects, openNDS redirects them to:

```
http://192.168.8.1/portal/index.html?
    clientmac=AA:BB:CC:DD:EE:FF
    &clientip=192.168.8.123
    &gatewayname=THESEED-GUEST
    &tok=abc123def456
    &redir=https://www.instagram.com/THESEEDBALI/
    &gatewayaddress=192.168.8.1:2050
```

After form submission:
1. Portal sends JSON POST to your webhook
2. On success, redirects to `http://192.168.8.1:2050/opennds_auth/?tok=...&redir=...`
3. openNDS grants internet access
4. Guest lands on Instagram

---

## 6. Troubleshooting

### CORS errors in browser console?
- Your webhook endpoint must handle the `OPTIONS` preflight request
- Ensure `Access-Control-Allow-Origin: *` is returned on both `OPTIONS` and `POST`

### Data not reaching endpoint?
- Check browser Network tab — is the POST request returning 200?
- Verify `WEBHOOK_URL` is correct in `js/index.js`
- Whitelist your endpoint domain in `/etc/config/opennds`

### Storage full?
- The Mango has limited flash. Keep images small or host externally
- Consider removing unused LuCI packages if running headless

---

## 7. Example Webhook Response

Your endpoint should respond with HTTP 200 (body can be empty or JSON):

```json
{ "status": "ok" }
```

If the endpoint returns 4xx/5xx, the portal shows:
> "Unable to save. Please try again."

And the Connect button becomes clickable again.
