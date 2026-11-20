/**
 * DanlTech BrowserHasher v1.1
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
    "%cDanlTech BrowserHasher v1.1 geladen · https://brwsrhash.danltech.xyz",
    "color:#3b82f6;"
  );

  /* ------------------------------------------------------------------
   * Pure JS SHA-256 Fallback
   * ------------------------------------------------------------------ */
  function sha256Pure(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = "length";
    var i, j;
    var result = "";
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = (sha256Pure.h = sha256Pure.h || []);
    var k = (sha256Pure.k = sha256Pure.k || []);
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += "\x80";
    while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return "";
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;
    for (j = 0; j < words[lengthProperty]; ) {
      var w = words.slice(j, (j += 16));
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
        var temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? "0" : "") + b.toString(16);
      }
    }
    return result;
  }

  async function sha256(str) {
    if (
      typeof crypto !== "undefined" &&
      crypto.subtle &&
      typeof crypto.subtle.digest === "function"
    ) {
      try {
        const buf = new TextEncoder().encode(str);
        const hashBuf = await crypto.subtle.digest("SHA-256", buf);
        return Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      } catch (e) {}
    }
    return sha256Pure(str);
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
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return { vendor: "unsupported", renderer: "unsupported" };
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const vendor = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR);
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
      return { vendor: vendor || "unknown", renderer: renderer || "unknown" };
    } catch (e) {
      return { vendor: "error", renderer: "error" };
    }
  }

  async function getAudioFingerprint() {
    try {
      const AudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
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
      for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
      return sum.toString();
    } catch (e) {
      return "error:" + (e.message || "unknown");
    }
  }

  function collectPassiveSignals() {
    const nav = navigator;
    const scr = screen;
    let tz = { timeZone: "", locale: "" };
    try { tz = Intl.DateTimeFormat().resolvedOptions(); } catch (e) {}
    return {
      userAgent: nav.userAgent || "",
      language: nav.language || "",
      languages: Array.isArray(nav.languages) ? nav.languages.join(",") : "",
      platform: nav.platform || "",
      hardwareConcurrency: nav.hardwareConcurrency ?? "",
      deviceMemory: nav.deviceMemory ?? "",
      maxTouchPoints: nav.maxTouchPoints ?? "",
      cookieEnabled: !!nav.cookieEnabled,
      doNotTrack: nav.doNotTrack ?? "",
      vendor: nav.vendor || "",
      product: nav.product || "",
      productSub: nav.productSub || "",
      appVersion: nav.appVersion || "",
      screenWidth: scr.width || 0,
      screenHeight: scr.height || 0,
      availWidth: scr.availWidth || 0,
      availHeight: scr.availHeight || 0,
      colorDepth: scr.colorDepth || 0,
      pixelDepth: scr.pixelDepth || 0,
      devicePixelRatio: window.devicePixelRatio || 1,
      timezone: tz.timeZone || "",
      timezoneOffset: new Date().getTimezoneOffset(),
      locale: tz.locale || "",
    };
  }

  function parseUA(ua) {
    let browser = "Unknown", version = "", os = "Unknown";
    if (/Edg\/(\d+[\.\d]*)/.test(ua)) { browser = "Microsoft Edge"; version = RegExp.$1; }
    else if (/OPR\/(\d+[\.\d]*)/.test(ua) || /Opera/.test(ua)) { browser = "Opera"; version = RegExp.$1 || ""; }
    else if (/Chrome\/(\d+[\.\d]*)/.test(ua) && !/Edg|OPR/.test(ua)) { browser = "Chrome"; version = RegExp.$1; }
    else if (/Firefox\/(\d+[\.\d]*)/.test(ua)) { browser = "Firefox"; version = RegExp.$1; }
    else if (/Safari\//.test(ua) && /Version\/(\d+[\.\d]*)/.test(ua)) { browser = "Safari"; version = RegExp.$1; }
    if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
    else if (/Windows NT 6\.3/.test(ua)) os = "Windows 8.1";
    else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7";
    else if (/Mac OS X/.test(ua)) os = "macOS";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
    else if (/Linux/.test(ua)) os = "Linux";
    return { browser, version, os };
  }

  function toPayload(obj) {
    return Object.keys(obj).sort().map((k) => k + "=" + String(obj[k])).join("|");
  }

  async function getHash() {
    const passive = collectPassiveSignals();
    const canvasRaw = getCanvasFingerprint();
    const webgl = getWebGLInfo();
    const audioRaw = await getAudioFingerprint();
    const uaParsed = parseUA(passive.userAgent);

    const screenGroup = {
      screenWidth: passive.screenWidth,
      screenHeight: passive.screenHeight,
      availWidth: passive.availWidth,
      availHeight: passive.availHeight,
      colorDepth: passive.colorDepth,
      pixelDepth: passive.pixelDepth,
      devicePixelRatio: passive.devicePixelRatio,
    };
    const navigatorGroup = {
      userAgent: passive.userAgent,
      language: passive.language,
      languages: passive.languages,
      platform: passive.platform,
      hardwareConcurrency: passive.hardwareConcurrency,
      deviceMemory: passive.deviceMemory,
      maxTouchPoints: passive.maxTouchPoints,
      cookieEnabled: passive.cookieEnabled,
      doNotTrack: passive.doNotTrack,
      vendor: passive.vendor,
      product: passive.product,
      timezone: passive.timezone,
      timezoneOffset: passive.timezoneOffset,
      locale: passive.locale,
    };
    const webglGroup = {
      webglVendor: webgl.vendor,
      webglRenderer: webgl.renderer,
    };

    const [canvasHash, webglHash, audioHash, screenHash, navigatorHash] = await Promise.all([
      sha256(canvasRaw),
      sha256(toPayload(webglGroup)),
      sha256(String(audioRaw)),
      sha256(toPayload(screenGroup)),
      sha256(toPayload(navigatorGroup)),
    ]);

    const signals = {
      ...passive,
      canvasFingerprint: canvasRaw,
      webglVendor: webgl.vendor,
      webglRenderer: webgl.renderer,
      audioFingerprint: audioRaw,
      parsedBrowser: uaParsed.browser,
      parsedVersion: uaParsed.version,
      parsedOS: uaParsed.os,
    };

    const fullPayload = toPayload(signals);
    const hash = await sha256(fullPayload);

    const components = {
      canvas: canvasHash,
      webgl: webglHash,
      audio: audioHash,
      screen: screenHash,
      navigator: navigatorHash,
    };

    return {
      hash: hash,
      components: components,
      signals: signals,
      payload: fullPayload,
    };
  }

  function compareWithDb(currentComponents, entries) {
    const keys = ["canvas", "webgl", "audio", "screen", "navigator"];
    return entries
      .map(function (entry) {
        var matches = 0;
        var details = {};
        keys.forEach(function (k) {
          var same = entry.components && entry.components[k] === currentComponents[k];
          details[k] = same;
          if (same) matches++;
        });
        var percent = Math.round((matches / keys.length) * 100);
        return {
          id: entry.id,
          hash: entry.hash,
          meta: entry.meta || {},
          matches: matches,
          total: keys.length,
          percent: percent,
          details: details,
        };
      })
      .sort(function (a, b) {
        return b.percent - a.percent || a.id.localeCompare(b.id);
      });
  }

  function makeEntryId(fullHash) {
    return fullHash.slice(0, 8);
  }

  function buildHashDbEntry(result, comment) {
    var id = makeEntryId(result.hash);
    return {
      id: id,
      hash: result.hash,
      components: result.components,
      meta: {
        browser: (result.signals.parsedBrowser || "") + (result.signals.parsedVersion ? " " + result.signals.parsedVersion : ""),
        os: result.signals.parsedOS || "",
        comment: comment || "",
        submittedAt: new Date().toISOString().slice(0, 10),
      },
    };
  }

  var API = {
    version: "1.1.0",
    name: "DanlTech BrowserHasher",
    getHash: getHash,
    compareWithDb: compareWithDb,
    buildHashDbEntry: buildHashDbEntry,
    makeEntryId: makeEntryId,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  } else {
    global.DanlTechBrowserHasher = API;
  }
})(typeof window !== "undefined" ? window : this);
