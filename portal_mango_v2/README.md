# GL.iNet Mango (OpenWrt) Captive Portal v2 — POST JSON

This is an **alternative version** of `portal_mango` that sends data to your webhook using a **proper JSON POST request** instead of GET query parameters.

## When to use this

Use `portal_mango_v2` when your backend endpoint supports:
- `POST` requests
- `Content-Type: application/json`
- CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`)

## Differences from `portal_mango`

| | `portal_mango` | `portal_mango_v2` |
|---|---|---|
| **HTTP method** | `GET` with URL params | `POST` with JSON body |
| **Payload format** | Query string | Structured JSON |
| **Error handling** | Fire-and-forget | Catches HTTP errors, shows user message |
| **Backend example** | Google Apps Script | Custom API endpoint, webhook.site, n8n, Make.com, etc. |

## JSON Payload Structure

```json
{
  "guestName": "John Doe",
  "email": "john@example.com",
  "consent": true,
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "deviceType": "iOS",
  "timestamp": "2025-06-12T14:30:25.000Z"
}
```

## Setup

See `SETUP.md` for router configuration. The openNDS setup is identical to `portal_mango`.

## Important

Replace the `WEBHOOK_URL` in `js/index.js` with your actual endpoint before deploying.

```javascript
const WEBHOOK_URL = "https://your-endpoint.com/webhook";
```
