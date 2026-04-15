// ============================================
// CONFIGURATION - REPLACE WITH YOUR JSON WEBHOOK URL
// ============================================
const WEBHOOK_URL = "https://your-endpoint.com/webhook";

// ============================================
// Utility: get URL param by name
// ============================================
function getParam(name) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0].toLowerCase() === name.toLowerCase()) {
      return pair[1] ? decodeURIComponent(pair[1]) : "";
    }
  }
  return "";
}

// ============================================
// Utility: detect device type from user agent
// ============================================
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? "Android Phone" : "Android Tablet";
  if (/Windows/.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/.test(ua)) return "Mac";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

// ============================================
// Validation
// ============================================
function validateName(fullName) {
  const errorEl = document.getElementById("name_error");
  errorEl.textContent = "";

  if (!fullName) {
    errorEl.textContent = "Please enter your full name";
    return false;
  }
  if (fullName.length < 3) {
    errorEl.textContent = "Name must be at least 3 characters";
    return false;
  }
  if (/^(.)*$/.test(fullName)) {
    errorEl.textContent = "Please enter a valid name";
    return false;
  }
  if (!/[a-zA-Z]/.test(fullName)) {
    errorEl.textContent = "Please enter a valid name";
    return false;
  }
  if (!/\s/.test(fullName)) {
    errorEl.textContent = "Please enter your full name (first and last name)";
    return false;
  }
  if (/\d/.test(fullName)) {
    errorEl.textContent = "Please enter a valid name";
    return false;
  }

  const words = fullName.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    errorEl.textContent = "Please enter your full name (first and last name)";
    return false;
  }
  for (const word of words) {
    if (word.length < 2) {
      errorEl.textContent = "Each name must be at least 2 characters";
      return false;
    }
    if (!/^[a-zA-Z]/.test(word)) {
      errorEl.textContent = "Names must start with a letter";
      return false;
    }
  }

  const lower = fullName.toLowerCase();
  const blocked = ["test", "asdf", "qwerty", "abc", "xyz", "fake", "dummy", "guest", "user", "name", "hello", "world"];
  const allWordsBlocked = words.every(w => blocked.includes(w.toLowerCase()));
  if (allWordsBlocked && words.length >= 2) {
    errorEl.textContent = "Please enter a real name";
    return false;
  }
  if (blocked.some(b => lower === b + " " + b)) {
    errorEl.textContent = "Please enter a real name";
    return false;
  }

  return true;
}

function validateEmail(email) {
  const errorEl = document.getElementById("email_error");
  errorEl.textContent = "";

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    errorEl.textContent = "Please enter your email";
    return false;
  }
  if (!emailRegex.test(email)) {
    errorEl.textContent = "Please enter a valid email";
    return false;
  }
  return true;
}

// ============================================
// Live validation listeners
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("body_loading").classList.add("hide");
  }, 800);

  const fullNameInput = document.getElementById("full_name");
  const emailInput = document.getElementById("email_input");

  fullNameInput.addEventListener("blur", function () {
    validateName(this.value.trim());
  });
  fullNameInput.addEventListener("input", function () {
    validateName(this.value.trim());
  });

  emailInput.addEventListener("blur", function () {
    validateEmail(this.value.trim());
  });
  emailInput.addEventListener("input", function () {
    validateEmail(this.value.trim());
  });

  document.getElementById("login_btn").addEventListener("click", onLogin);
});

// ============================================
// Main login handler
// ============================================
function onLogin() {
  const fullName = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email_input").value.trim();
  const receiveOffers = document.getElementById("receive_offers").checked;

  document.getElementById("login_msg").textContent = "";
  document.getElementById("name_error").textContent = "";
  document.getElementById("email_error").textContent = "";

  if (!validateName(fullName)) return;
  if (!validateEmail(email)) return;

  const btn = document.getElementById("login_btn");
  btn.disabled = true;
  btn.textContent = "Connecting...";

  const mac = getParam("clientmac") || getParam("mac") || "";
  const deviceType = getDeviceType();

  const payload = {
    guestName: fullName,
    email: email,
    consent: receiveOffers,
    macAddress: mac,
    deviceType: deviceType,
    timestamp: new Date().toISOString()
  };

  sendPayload(payload)
    .then(() => triggerOpenNDSAuth())
    .catch((err) => {
      console.error("Webhook error:", err);
      document.getElementById("login_msg").textContent = "Unable to save. Please try again.";
      btn.disabled = false;
      btn.textContent = "Connect Now";
    });
}

// ============================================
// Send JSON payload via POST
// ============================================
async function sendPayload(payload) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }
  return response;
}

// ============================================
// openNDS Authentication Redirect
// ============================================
function triggerOpenNDSAuth() {
  const tok = getParam("tok");
  const gatewayaddress = getParam("gatewayaddress");
  const redir = getParam("redir");

  if (!tok || !gatewayaddress) {
    const fallback = redir || "https://www.instagram.com/THESEEDBALI/";
    console.warn("Missing openNDS params, falling back to:", fallback);
    window.location.href = fallback;
    return;
  }

  const authUrl = "http://" + gatewayaddress + "/opennds_auth/?tok=" + encodeURIComponent(tok);
  const finalUrl = redir ? authUrl + "&redir=" + encodeURIComponent(redir) : authUrl;

  console.log("Redirecting to openNDS auth:", finalUrl);
  window.location.href = finalUrl;
}
