# portal_fresh — Fix Notes

## Changes Made

### 1. Removed "One-click Login" header
- Removed `<div class="login-form-title"></div>` from `index.html`
- The header was redundant for the "pass" (one-click) login flow

### 2. Restored `onerror` fallback on `loadConfig.json`
- `index.html` script tag restored to:
  ```html
  <script src="./loadConfig.json" onerror="loadConfig({})"></script>
  ```
- The `onerror="loadConfig({})"` is critical — when the preview environment can't load the config file, it initializes the portal with empty defaults instead of hanging on the loading spinner

### 3. i18n fallback fix (`i18n.js`)
- Added `this.activedObj = LandObj[this.currentLang] || LandObj['en_US']` when lang config is empty
- Prevents a crash in `$t()` when `activedObj` is undefined

## Deployment Notes

### Zip structure
- Files must be at the **root** of the zip, not inside a subfolder
- Only include: `index.html`, `loadConfig.json`, `css/`, `img/`, `js/`

### Ruijie CDN (CloudFront) caching issue
- If a template upload fails or is invalidated, CloudFront caches the 404 for that URL path
- Uploading a new zip to the same template will not fix this — the cached 404 persists
- **Fix:** Delete the template and create a new one to get a fresh CDN path

### Preview behavior
- The Ruijie preview URL only works when accessed via a router redirect (with `sessionId`, `mac`, etc.)
- Accessing it directly in a browser will sometimes show "Incomplete parameters" — this is normal
- The `onerror` fallback ensures the portal still renders even without the config
