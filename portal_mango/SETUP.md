# GL.iNet Mango Setup Guide (openNDS)

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
# or ssh root@192.168.1.1 if running pure OpenWrt
```

Update packages and install openNDS:

```bash
opkg update
opkg install opennds
```

Start and enable the service:

```bash
/etc/init.d/opennds enable
/etc/init.d/opennds start
```

---

## 3. Configure openNDS

Edit the config file:

```bash
vi /etc/config/opennds
```

Minimal working config for FAS (Forward Authentication Server):

```uci
config opennds
    option enabled '1'
    option fasremoteip '0.0.0.0'
    option fasport '80'
    option faspath '/portal/index.html'
    option fas_secure_enabled '1'
    option login_option_enabled '1'
    option whitelisted_domains 'script.google.com'
    option maxclients '250'
    option sessiontimeout '1440'
```

### If hosting the portal ON the router:

Copy your portal files to the router's web root:

```bash
mkdir -p /www/portal
cp index.html /www/portal/
cp -r css /www/portal/
cp -r js /www/portal/
cp -r img /www/portal/
```

Then set:
```uci
    option fasremoteip '0.0.0.0'
    option fasport '80'
    option faspath '/portal/index.html'
```

### If hosting the portal EXTERNALLY (e.g., GitHub Pages):

```uci
    option fasremoteip '192.168.8.1'
    option fasport '80'
    option faspath '/portal/index.html'
```

Wait — for **external FAS**, you actually use:
```uci
    option fasremoteip '0.0.0.0'
    option fasport '80'
    option faspath '/portal/index.html'
```

No, for **true external FAS**, openNDS v9+ uses:
```uci
    option fasremoteip 'your.server.ip'
    option fasport '443'
    option faspath '/ captive-portal/index.html'
```

But for simplicity, **host locally on the router** first.

---

## 4. Whitelist Google Sheets Webhook

Add to `/etc/config/opennds` so the portal can reach Google Apps Script:

```bash
uci add_list opennds.@opennds[0].whitelisted_domains='script.google.com'
uci commit opennds
/etc/init.d/opennds restart
```

Or manually add:
```uci
    list whitelisted_domains 'script.google.com'
    list whitelisted_domains 'www.instagram.com'
```

---

## 5. Restart openNDS

```bash
/etc/init.d/opennds restart
```

Check status:
```bash
ndsctl status
```

---

## 6. How openNDS Redirects Work

When a guest connects, openNDS redirects them to your FAS page with these URL parameters:

```
http://192.168.8.1/portal/index.html?
    clientmac=AA:BB:CC:DD:EE:FF
    &clientip=192.168.8.123
    &gatewayname=THESEED-GUEST
    &tok=abc123def456
    &redir=https://www.instagram.com/THESEEDBALI/
    &gatewayaddress=192.168.8.1:2050
```

Your portal page (`index.html` + `index.js`) reads these params.

After the guest submits the form:
1. Send data to Google Sheets
2. Redirect to: `http://192.168.8.1:2050/opennds_auth/?tok=abc123def456&redir=https://www.instagram.com/THESEEDBALI/`

openNDS then grants access and redirects to Instagram.

---

## 7. Port Reference

| Port | Usage |
|---|---|
| `80` | Router web server (LuCI / FAS local files) |
| `2050` | openNDS gateway (auth endpoint) |
| `443` | External HTTPS FAS |

---

## 8. Troubleshooting

### Portal not showing?
- Check `ndsctl status` — is openNDS running?
- Check `/tmp/ndslog/` for logs
- Verify the guest device is on the guest network, not main LAN
- Try accessing `http://neverssl.com` to trigger the captive portal

### Google Sheets not receiving data?
- SSH into router, run: `curl -I https://script.google.com` — should not be blocked
- Check browser console on the captive portal page for CORS/network errors
- Verify the webhook URL in `js/index.js`

### Auth redirect fails?
- Make sure you're passing the **exact** `tok` from the URL
- Verify `gatewayaddress` — should be `192.168.8.1:2050` (or your router IP)
- The auth URL format is: `http://<gatewayaddress>/opennds_auth/?tok=<tok>&redir=<redir>`

### Storage full on Mango?
- The Mango only has ~8MB free after OpenWrt install
- Consider external hosting or stripping images
- Use `opkg list-installed | wc -l` to see package count
- Remove unused packages: `opkg remove luci*` if running headless

---

## 9. Quick Test Commands

From the router itself:
```bash
# Check if openNDS is intercepting traffic
ndsctl status

# See connected clients
ndsctl json | grep client

# Deauth a specific MAC
ndsctl deauth AA:BB:CC:DD:EE:FF
```
