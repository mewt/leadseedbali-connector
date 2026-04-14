// ============================================
// CONFIGURATION - SET YOUR GOOGLE SHEETS WEBHOOK URL HERE
// ============================================
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzjiTbMIWjAjTvzpqX8QvXhGNDbOIKJms5ueBcOAMPCzmrMA5gAUmfjYpDKpUfgDupF3g/exec";

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
      this.LOGIN_OPTION.PASS,
      this.LOGIN_OPTION.VOUCHER,
      this.LOGIN_OPTION.FIXACCOUNT,
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
        $(".login-form-title").text("Connect to WiFi");
        break;
      case this.LOGIN_OPTION.FIXACCOUNT:
        $(".login-form-title").text(I18nObj.$t("account_login"));
        break;
      case this.LOGIN_OPTION.VOUCHER:
      default:
        $(".login-form-title").text(I18nObj.$t("voucher_login"));
    }

    const loginOptions = this.loginOptions;
    $(".login-form-wrapper .login-item").addClass("hide");
    $(".login-form-wrapper .login-item-" + currentOption).removeClass("hide");
  },

  onLogin() {
    const fullName = $("#full_name").val().trim();
    const email = $("#email_input").val().trim();
    const receiveOffers = $("#receive_offers").is(":checked");

    // Validate
    $("#login_msg").text("");
    if (!fullName) {
      $("#login_msg").text(I18nObj.$t("please_enter_full_name"));
      return;
    }
    if (!email) {
      $("#login_msg").text(I18nObj.$t("please_enter_email"));
      return;
    }

    // Disable button during processing
    const $btn = $("#login_btn");
    $btn.prop("disabled", true).text("Connecting...");

    // Send data to Google Sheets via GET (avoid CORS/POST redirect issues)
    const params = new URLSearchParams({
      fullName: fullName,
      email: email,
      receiveOffers: receiveOffers.toString(),
      timestamp: new Date().toISOString()
    });

    const webhookUrl = WEBHOOK_URL + "?" + params.toString();

    // iOS Safari workaround: use hidden image + sendBeacon for reliability
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    if (isIOS || isSafari) {
      // iOS Safari: use hidden image trick (most reliable)
      var img = new Image();
      img.src = webhookUrl;
      // Longer delay for iOS Safari
      setTimeout(() => IndexObj.triggerRuijieAuth(), 1000);
    } else if (navigator.sendBeacon) {
      navigator.sendBeacon(webhookUrl);
      setTimeout(() => IndexObj.triggerRuijieAuth(), 500);
    } else {
      // Fallback: fetch with no-cors
      fetch(webhookUrl, { method: "GET", mode: "no-cors" })
        .catch(() => {})
        .finally(() => IndexObj.triggerRuijieAuth());
    }
  },

  triggerRuijieAuth() {
    $.post({
      url: "/api/auth/general",
      data: JSON.stringify({
        lang: I18nObj.currentLang,
        authType: this.currentOption,
        sessionId: this._getParamVal("sessionId")
      }),
      contentType: "application/json",
      success: function (response) {
        console.log("Server Response:", response);
        if (response.success) {
          location.href = response.result.logonUrl;
        } else {
          $("#login_msg").text(response.message);
          $("#login_btn").prop("disabled", false).text("Connect Now");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        $("#login_msg").text("Connection error. Please try again.");
        $("#login_btn").prop("disabled", false).text("Connect Now");
      },
    });
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
