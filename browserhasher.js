/**
 * DanlTech BrowserHasher
 * https://brwsrhash.danltech.xyz
 *
 * Open Source · Pure Vanilla JS · No external dependencies
 *
 * ============================================================
 *  DSGVO / GDPR WARNUNG
 * ============================================================
 *  Dieses Script dient ausschließlich zu Demonstrations-,
 *  Bildungs- und Testzwecken.
 *
 *  Die Verwendung zur Identifikation, zum Tracking oder zum
 *  Profiling von Nutzern OHNE ausdrückliche, informierte und
 *  freiwillige Einwilligung verstößt gegen die DSGVO (EU) bzw.
 *  vergleichbare Datenschutzgesetze und kann rechtliche
 *  Konsequenzen haben.
 *
 *  Nutze dieses Script NICHT 1:1 für produktives Tracking
 *  ohne Consent-Management und Rechtsprüfung.
 * ============================================================
 */
(function (global) {
  "use strict";

  // Console warning – immer sichtbar
  console.warn(
    "%c[DanlTech BrowserHasher] DSGVO/GDPR-Warnung",
    "color:#f59e0b;font-weight:bold;font-size:14px;"
  );
  console.warn(
    "Dieses Script ist nur zu Demonstrations- und Bildungszwecken gedacht.\n" +
      "Die automatisierte Identifikation von Nutzern ohne ausdrückliche Einwilligung\n" +
      "verstößt gegen die DSGVO/GDPR. Nicht für produktives Tracking ohne Consent verwenden!"
  );
  console.info(
    "%cDanlTech BrowserHasher geladen · https://brwsrhash.danltech.xyz",
    "color:#3b82f6;"
  );

  async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hashBuf = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function getCanvasFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 280;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "unsupported";

      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("DanlTech BrowserHasher 🔐", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("DanlTech BrowserHasher 🔐", 4, 17);
      ctx.beginPath();
      ctx.arc(50, 40, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#c0c";
      ctx.fill();

      return canvas.toDataURL();
    } catch (e) {
      return "error:" + (e.message || "unknown");
    }
  }

  function getWebGLInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return { vendor: "unsupported", renderer: "unsupported" };

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const vendor = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR);
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);

      return {
        vendor: vendor || "unknown",
        renderer: renderer || "unknown",
      };
    } catch (e) {
      return { vendor: "error", renderer: "error" };
    }
  }

  async function getAudioFingerprint() {
    try {
      const AudioCtx =
        window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!AudioCtx) return "unsupported";

      const ctx = new AudioCtx(1, 44100, 44100);
      const oscillator = ctx.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(10000, ctx.currentTime);

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, ctx.currentTime);
      compressor.knee.setValueAtTime(40, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);

      oscillator.connect(compressor);
      compressor.connect(ctx.destination);
      oscillator.start(0);

      const buffer = await ctx.startRendering();
      const data = buffer.getChannelData(0);
      let sum = 0;
      for (let i = 4500; i < 5000; i++) {
        sum += Math.abs(data[i]);
      }
      return sum.toString();
    } catch (e) {
      return "error:" + (e.message || "unknown");
    }
  }

  function collectPassiveSignals() {
    const nav = navigator;
    const scr = screen;
    const tz = Intl.DateTimeFormat().resolvedOptions();

    return {
      userAgent: nav.userAgent || "",
      language: nav.language || "",
      languages: Array.isArray(nav.languages) ? nav.languages.join(",") : "",
      platform: nav.platform || "",
      hardwareConcurrency: nav.hardwareConcurrency ?? "",
      deviceMemory: nav.deviceMemory ?? "",
      maxTouchPoints: nav.maxTouchPoints ?? "",
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack ?? "",
      vendor: nav.vendor || "",
      product: nav.product || "",
      productSub: nav.productSub || "",
      appVersion: nav.appVersion || "",
      screenWidth: scr.width,
      screenHeight: scr.height,
      availWidth: scr.availWidth,
      availHeight: scr.availHeight,
      colorDepth: scr.colorDepth,
      pixelDepth: scr.pixelDepth,
      devicePixelRatio: window.devicePixelRatio || 1,
      timezone: tz.timeZone || "",
      timezoneOffset: new Date().getTimezoneOffset(),
      locale: tz.locale || "",
    };
  }

  function parseUA(ua) {
    let browser = "Unknown";
    let version = "";
    let os = "Unknown";

    if (/Edg\/(\d+[\.\d]*)/.test(ua)) {
      browser = "Microsoft Edge";
      version = RegExp.$1;
    } else if (/OPR\/(\d+[\.\d]*)/.test(ua) || /Opera/.test(ua)) {
      browser = "Opera";
      version = RegExp.$1 || "";
    } else if (/Chrome\/(\d+[\.\d]*)/.test(ua) && !/Edg|OPR/.test(ua)) {
      browser = "Chrome";
      version = RegExp.$1;
    } else if (/Firefox\/(\d+[\.\d]*)/.test(ua)) {
      browser = "Firefox";
      version = RegExp.$1;
    } else if (/Safari\//.test(ua) && /Version\/(\d+[\.\d]*)/.test(ua)) {
      browser = "Safari";
      version = RegExp.$1;
    }

    if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
    else if (/Windows NT 6\.3/.test(ua)) os = "Windows 8.1";
    else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7";
    else if (/Mac OS X/.test(ua)) os = "macOS";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
    else if (/Linux/.test(ua)) os = "Linux";

    return { browser, version, os };
  }

  /**
   * Berechnet den stabilen Browser-Hash.
   * @returns {Promise<{hash: string, signals: object, payload: string}>}
   */
  async function getHash() {
    const passive = collectPassiveSignals();
    const canvas = getCanvasFingerprint();
    const webgl = getWebGLInfo();
    const audio = await getAudioFingerprint();
    const uaParsed = parseUA(passive.userAgent);

    const signals = {
      ...passive,
      canvasFingerprint: canvas,
      webglVendor: webgl.vendor,
      webglRenderer: webgl.renderer,
      audioFingerprint: audio,
      parsedBrowser: uaParsed.browser,
      parsedVersion: uaParsed.version,
      parsedOS: uaParsed.os,
    };

    // Deterministischer Payload (sortierte Keys)
    const keys = Object.keys(signals).sort();
    const payload = keys.map((k) => k + "=" + String(signals[k])).join("|");
    const hash = await sha256(payload);

    return {
      hash: hash,
      signals: signals,
      payload: payload,
    };
  }

  // Public API
  const API = {
    version: "1.0.0",
    name: "DanlTech BrowserHasher",
    getHash: getHash,
  };

  // Export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  } else {
    global.DanlTechBrowserHasher = API;
  }
})(typeof window !== "undefined" ? window : this);
