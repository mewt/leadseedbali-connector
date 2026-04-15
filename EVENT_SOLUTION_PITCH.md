# Event Lead Capture Solution — Executive Summary

## The Opportunity

Every local event we attend is filled with potential customers walking by our booth. Today, we have **no systematic way** to capture their contact information. Business cards get lost. Instagram follows are anonymous. Manual sign-up sheets are slow and create data entry work later.

**We can solve this with a portable WiFi system that turns internet access into qualified leads.**

---

## What This Solution Does

Guests connect to our free branded WiFi. Before they get online, they see a custom portal asking for:
- **Full Name**
- **Email Address**
- **Marketing Consent** (checked by default)

Once submitted, their data instantly appears in a **Google Sheet** with:
- Date & Time
- Name & Email
- Consent status
- Device MAC address
- Device type (iPhone, Android, etc.)

Then they are granted internet access and redirected to **our Instagram page**.

---

## The Hardware Kit

### For Small Events (Booth / Pop-up)

| Item | Purpose | Price |
|---|---|---|
| 1x GL.iNet Opal (MT1300) | Router + captive portal software | ~$35 |
| 1x USB 4G Modem or phone tether | Internet connection | ~$0-50 |

**Total: ~$35-85** | Covers ~50 sqm | Handles ~20 simultaneous users

### For Medium Events (Large Booth / Small Hall)

| Item | Purpose | Price |
|---|---|---|
| 1x GL.iNet Opal (Main) | Primary router + portal | ~$35 |
| 2x GL.iNet Opal (Nodes) | Extend WiFi coverage | ~$70 |
| 1x USB 4G Modem | Internet source | ~$0-50 |
| Ethernet cables (optional) | Stable backhaul between routers | ~$10 |

**Total: ~$115-165** | Covers ~200 sqm | Handles ~60 simultaneous users

### For Large Events (Conference Hall / Festival)

| Item | Purpose | Price |
|---|---|---|
| 1x GL.iNet Opal (Main) | Primary router + portal | ~$35 |
| 4x GL.iNet Opal (Nodes) | Full coverage extension | ~$140 |
| 1x USB 4G Modem | Internet source | ~$0-50 |
| Ethernet cables | Stable wired connections | ~$20 |

**Total: ~$195-245** | Covers ~500 sqm | Handles ~120 simultaneous users

---

## How The Network Works

```
INTERNET SOURCE
      │
      ▼
┌─────────────────┐
│   4G Modem      │  ← Phone hotspot or USB modem
│  (Internet IN)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Main Opal      │  ← Runs the captive portal
│  (Master Router)│    Collects all lead data
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
    ▼         ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ Node 1│ │ Node 2│ │ Node 3│ │ Node 4│  ← Extend WiFi signal
│       │ │       │ │       │ │       │     Can use WiFi or ethernet
└───────┘ └───────┘ └───────┘ └───────┘
```

### Two Ways to Connect Nodes

1. **Ethernet (Recommended for events)**
   - Run a cable from Main Opal LAN port → Node WAN port
   - Most stable. No WiFi congestion issues.

2. **Wireless Repeater**
   - Nodes connect to Main Opal via WiFi
   - No cables needed. Slightly less stable in crowded venues.

---

## Why This Is Better Than Our Current Ruijie Cloud Setup

| Feature | Ruijie Cloud | Opal Event Kit |
|---|---|---|
| **Monthly cost** | Subscription fees | **$0** |
| **Requires internet** | Yes + must reach Ruijie servers | Yes, but works **locally** |
| **Portability** | Fixed installation at venue | **Fits in a backpack** |
| **Custom branding** | Limited HTML upload | **Full design control** |
| **Data ownership** | Locked in Ruijie dashboard | **Direct to Google Sheets** |
| **Offline capability** | No | **Yes** — auth still works |
| **Cost per lead** | Subscription + data fees | **$0 after hardware purchase** |

---

## Data We Collect (Example)

| Date | Time | Guest Name | Email | Consent | MAC Address | Device |
|---|---|---|---|---|---|---|
| 2025-06-15 | 14:32:10 | Sarah Chen | sarah@email.com | TRUE | A1:B2:C3:D4:E5:F6 | iOS |
| 2025-06-15 | 14:35:22 | Mike Ross | mike@email.com | TRUE | G7:H8:I9:J0:K1:L2 | Android Phone |
| 2025-06-15 | 14:38:05 | Emma Davis | emma@email.com | FALSE | M3:N4:O5:P6:Q7:R8 | Windows |

**All data is owned by us.** No third-party platform lock-in.

---

## Deployment Options

We have **three versions** of the portal code ready to use:

1. **`portal_fresh`** — For Ruijie Cloud venues (our existing setup)
2. **`portal_mango`** — For GL.iNet routers using Google Sheets backend
3. **`portal_mango_v2`** — For GL.iNet routers using a **custom JSON webhook** (e.g., our own CRM, n8n, Zapier)

For events, we recommend starting with **`portal_mango`** because it uses the same Google Sheets backend we already know works.

---

## Recommended Pilot Plan

### Phase 1: Proof of Concept
- **Investment:** ~$85 (1x Main Opal + modem)
- **Test at:** Next small pop-up or market
- **Goal:** Capture 20-50 leads, test stability

### Phase 2: Scale Up
- **Investment:** ~$165 (add 2 nodes)
- **Use at:** Medium events, co-working open days
- **Goal:** Capture 50-150 leads per event

### Phase 3: Full Deployment
- **Investment:** ~$245 (add 4 nodes total)
- **Use at:** Large festivals, conference halls
- **Goal:** Capture 150-300 leads per event

---

## Return on Investment

| Metric | Value |
|---|---|
| **One-time hardware cost** | ~$85-245 |
| **Monthly software cost** | $0 |
| **Cost per lead** | ~$0 (after hardware) |
| **Average leads per event** | 50-300 depending on size |
| **Value per email** | Depends on conversion rate, but email marketing typically returns $36-42 per $1 spent |

**Compared to paid ads:** This captures leads from people who have already shown physical interest in our brand — higher intent than cold traffic.

---

## What We Need to Proceed

1. **Approval** to purchase the hardware kit (~$85 for pilot)
2. **One event** to test the pilot (small market or pop-up)
3. **30 minutes** of staff training — just plug in power and check the Google Sheet

---

## Key Takeaways

- **Portable:** Everything fits in a small bag. No venue installation needed.
- **Affordable:** One-time hardware cost. No subscriptions.
- **Branded:** Guests see THE SEED logo and messaging.
- **Actionable:** Leads go straight into a Google Sheet we own.
- **Scalable:** Add more $35 routers for bigger events.

---

## Next Step

**Approve the $85 pilot kit** so we can test it at the next event and start capturing leads we are currently walking away from.
