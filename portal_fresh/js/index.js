// ============================================
// CONFIGURATION - SET YOUR GOOGLE SHEETS WEBHOOK URL HERE
// ============================================
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyl-baDhQhyQ1kw5r7l5deI3kHwYbnCCSshSyTuWUEHq0zn0Hni6fbCRIWpKwu_bpLyAg/exec";

// ============================================
function loadConfig(data) {
  IndexObj.init(data);
}

const IndexObj = {
  currentOption: "",
  loginOptions: [],

  LOGIN_OPTION: {
    VOUCHER: "voucher",
    FIXACCOUNT: "fixaccount",
    PASS: "pass",
  },

  init: function (data) {
    this.loadJson(data);
    setTimeout(function () {
      $("#body_loading").addClass("hide");
    }, 1000);

    this.initEvent();
  },

  loadJson: function (data) {
    I18nObj.init(data);
    this.renderHtml(data);
  },

  initEvent: function () {
    const self = this;
    $("#login_btn").on("click", function () {
      self.onLogin();
    });
  },

  renderHtml: function (data) {
    const loginOptions = data?.custom_html?.login_options;
    this.loginOptions = loginOptions;

    if (!loginOptions) {
      return false;
    }

    const priorityOrder = [
      this.LOGIN_OPTION.VOUCHER,
      this.LOGIN_OPTION.FIXACCOUNT,
      this.LOGIN_OPTION.PASS,
    ];
    let currentOption = null;

    for (const option of priorityOrder) {
      if (loginOptions.includes(option)) {
        currentOption = option;
        this.currentOption = currentOption;
        break;
      }
    }

    if (!currentOption) {
      return false;
    }

    I18nObj.renderHtmlLang();
    this.renderLoginHtml(loginOptions);
    this.renderCurrentLogin(currentOption);
  },

  renderHtmlLang: function () {},

  renderLoginHtml: function (loginOptions) {
    const allOptions = [
      this.LOGIN_OPTION.VOUCHER,
      this.LOGIN_OPTION.FIXACCOUNT,
      this.LOGIN_OPTION.PASS,
    ];
    const missOptions = allOptions.filter(
      (option) => !loginOptions.includes(option)
    );

    missOptions.forEach((item) => {
      $(`.login-item-${item}`).remove();
    });
  },

  renderCurrentLogin(currentOption) {
    switch (currentOption) {
      case this.LOGIN_OPTION.PASS:
        $(".login-form-title").text(I18nObj.$t("one_click_login"));
        $('.login-form-title').attr('data-i18n', 'one_click_login')
        break;
      case this.LOGIN_OPTION.FIXACCOUNT:
        $(".login-form-title").text(I18nObj.$t("account_login"));
        $('.login-form-title').attr('data-i18n', 'account_login')
        break;
      case this.LOGIN_OPTION.VOUCHER:
      default:
        $(".login-form-title").text(I18nObj.$t("voucher_login"));
        $('.login-form-title').attr('data-i18n', 'voucher_login')
    }

    const loginOptions = this.loginOptions;
    $(".login-form-wrapper .login-item").addClass("hide");
    $(".login-form-wrapper .login-item-" + currentOption).removeClass("hide");
  },

  validateName: function (fullName) {
    const $error = $("#name_error");
    $error.text("");

    if (!fullName) {
      $error.text(I18nObj.$t("please_enter_full_name"));
      return false;
    }
    if (fullName.length < 3) {
      $error.text("Name must be at least 3 characters");
      return false;
    }
    if (/^(.)\1*$/.test(fullName)) {
      $error.text("Please enter a valid name");
      return false;
    }
    if (!/[a-zA-Z]/.test(fullName)) {
      $error.text("Please enter a valid name");
      return false;
    }
    if (!/\s/.test(fullName)) {
      $error.text("Please enter your full name (first and last name)");
      return false;
    }
    if (/\d/.test(fullName)) {
      $error.text("Please enter a valid name");
      return false;
    }

    const words = fullName.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) {
      $error.text("Please enter your full name (first and last name)");
      return false;
    }
    for (const word of words) {
      if (word.length < 2) {
        $error.text("Each name must be at least 2 characters");
        return false;
      }
      if (!/^[a-zA-Z]/.test(word)) {
        $error.text("Names must start with a letter");
        return false;
      }
    }

    const lower = fullName.toLowerCase();
    const blocked = ["test", "asdf", "qwerty", "abc", "xyz", "fake", "dummy", "guest", "user", "name", "hello", "world"];
    const allWordsBlocked = words.every(w => blocked.includes(w.toLowerCase()));
    if (allWordsBlocked && words.length >= 2) {
      $error.text("Please enter a real name");
      return false;
    }
    if (blocked.some(b => lower === b + " " + b)) {
      $error.text("Please enter a real name");
      return false;
    }

    return true;
  },

  validateEmail: function (email) {
    const $error = $("#email_error");
    $error.text("");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      $error.text(I18nObj.$t("please_enter_email"));
      return false;
    }
    if (!emailRegex.test(email)) {
      $error.text("Please enter a valid email");
      return false;
    }
    return true;
  },

  onLogin() {
    const fullName = $("#full_name").val().trim();
    const email = $("#email_input").val().trim();
    const receiveOffers = $("#receive_offers").is(":checked");

    // Clear all errors first
    $("#login_msg").text("");
    $("#name_error").text("");
    $("#email_error").text("");

    // Validate name
    const nameValid = this.validateName(fullName);
    if (!nameValid) {
      return false;
    }

    // Validate email
    const emailValid = this.validateEmail(email);
    if (!emailValid) {
      return false;
    }

    // Disable button during processing
    const $btn = $("#login_btn");
    $btn.prop("disabled", true).text("Connecting...");

    // Send data to Google Sheets via GET (avoid CORS/POST redirect issues)
    const mac = this._getParamVal("mac") || this._getParamVal("userMac") || "";
    const deviceType = this._getDeviceType();
    const params = new URLSearchParams({
      guestName: fullName,
      email: email,
      consent: receiveOffers.toString(),
      macAddress: mac,
      deviceType: deviceType
    });

    const webhookUrl = WEBHOOK_URL + "?" + params.toString();

    // iOS Safari workaround: use hidden image + sendBeacon for reliability
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    if (isIOS || isSafari) {
      var img = new Image();
      img.src = webhookUrl;
      setTimeout(() => this._doAuth(), 1000);
    } else if (navigator.sendBeacon) {
      navigator.sendBeacon(webhookUrl);
      setTimeout(() => this._doAuth(), 500);
    } else {
      fetch(webhookUrl, { method: "GET", mode: "no-cors" })
        .catch(() => {})
        .finally(() => this._doAuth());
    }
  },

  _doAuth() {
    let paramObj = {};

    switch (this.currentOption) {
      case this.LOGIN_OPTION.FIXACCOUNT:
        paramObj.account = $("#account_input").val();
        paramObj.password = $("#account_password").val();
        break;
      case this.LOGIN_OPTION.VOUCHER:
        paramObj.account = $("#voucher_code").val();
      case this.LOGIN_OPTION.PASS:
        break;
    }

    paramObj = {
      lang: I18nObj.currentLang,
      authType: this.currentOption,
      sessionId: this._getParamVal("sessionId"),
      ...paramObj,
    };

    $.post({
      url: "/api/auth/general",
      data: JSON.stringify(paramObj),
      contentType: "application/json",
      success: function (response) {
        console.log("Server Response:", response);
        if (response.success) {
          location.href = response.result.logonUrl;
        } else {
          $("#login_msg").text(response.message);
          $("#login_btn").prop("disabled", false).text(I18nObj.$t("login"));
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        $("#login_msg").text("Connection error. Please try again.");
        $("#login_btn").prop("disabled", false).text(I18nObj.$t("login"));
      },
    });
  },

  _getDeviceType() {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
    if (/Android/.test(ua)) {
      return /Mobile/.test(ua) ? "Android Phone" : "Android Tablet";
    }
    if (/Windows/.test(ua)) return "Windows";
    if (/Macintosh|Mac OS X/.test(ua)) return "Mac";
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown";
  },

  _getParamVal(paras) {
    try {
      const topUrl = decodeURI(window.top.location.href);
      const queryString = topUrl.split('?')[1];
      if (!queryString) {
        return null;
      }
  
      const paraString = queryString.split('&');
      const paraObj = {};
      for (var i = 0; i < paraString.length; i++) {
        const pair = paraString[i].split('=');
        if (pair.length === 2) {
          paraObj[pair[0].toLowerCase()] = pair[1];
        }
      }
  
      const returnValue = paraObj[paras.toLowerCase()];
      return returnValue !== undefined ? returnValue : null;
    } catch (e) {
      console.error("Error accessing top window URL:", e);
      return null;
    }
  },
};