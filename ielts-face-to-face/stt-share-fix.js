// Robust long-session speech recognition + finish/share rebinding.
// Loaded after app.js, mobile-fix.js and share-chatgpt.js.

let sttWanted = false;
let sttRestartTimer = null;
let sttConsecutiveFailures = 0;
let sttInstanceSerial = 0;
let sttActiveSerial = 0;
let sttIsActive = false;

function sttSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function setSttRecoveryVisible(visible, message) {
  const btn = $("restartStt");
  if (!btn) return;
  btn.style.display = visible ? "block" : "none";
  if (message) btn.textContent = message;
}

function shouldKeepSttRunning() {
  return sttWanted && running && !paused && $("status")?.textContent === "LISTENING";
}

function clearSttRestart() {
  if (sttRestartTimer) clearTimeout(sttRestartTimer);
  sttRestartTimer = null;
}

function disposeRecognizer() {
  clearSttRestart();
  if (!recognizer) return;
  try {
    recognizer.onstart = null;
    recognizer.onresult = null;
    recognizer.onerror = null;
    recognizer.onend = null;
    recognizer.abort();
  } catch (_) {}
  recognizer = null;
  sttIsActive = false;
}

function appendRecognitionResult(e) {
  let interim = "";
  let finalText = "";
  for (let i = e.resultIndex; i < e.results.length; i++) {
    const text = e.results[i][0].transcript;
    if (e.results[i].isFinal) finalText += text + " ";
    else interim += text;
  }
  if (finalText) {
    itemTranscript += finalText;
    sessionTranscript += finalText;
  }
  const transcriptEl = $("transcript");
  if (transcriptEl) transcriptEl.textContent = (itemTranscript + interim).trim() || "Listening…";
}

function scheduleSttRestart(reason) {
  clearSttRestart();
  if (!shouldKeepSttRunning()) return;

  sttConsecutiveFailures += 1;
  const delay = Math.min(1800, 220 + sttConsecutiveFailures * 260);

  if (sttConsecutiveFailures >= 3) {
    setSttRecoveryVisible(true, "转写中断 · 点这里恢复");
  }

  sttRestartTimer = setTimeout(() => {
    if (!shouldKeepSttRunning()) return;
    startRecognition(true);
  }, delay);
}

function createFreshRecognizer() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const r = new SR();
  const serial = ++sttInstanceSerial;
  sttActiveSerial = serial;
  r.lang = "en-GB";
  r.continuous = true;
  r.interimResults = true;
  r.maxAlternatives = 1;

  r.onstart = () => {
    if (serial !== sttActiveSerial) return;
    sttIsActive = true;
    sttConsecutiveFailures = 0;
    setSttRecoveryVisible(false);
  };

  r.onresult = e => {
    if (serial !== sttActiveSerial) return;
    appendRecognitionResult(e);
  };

  r.onerror = e => {
    if (serial !== sttActiveSerial) return;
    sttIsActive = false;
    const code = e?.error || "unknown";

    if (code === "not-allowed" || code === "service-not-allowed" || code === "audio-capture") {
      sttWanted = false;
      setSttRecoveryVisible(true, "无法转写 · 点这里重新授权");
      return;
    }

    scheduleSttRestart(code);
  };

  r.onend = () => {
    if (serial !== sttActiveSerial) return;
    sttIsActive = false;
    if (shouldKeepSttRunning()) scheduleSttRestart("ended");
  };

  return r;
}

initRecognition = function() {
  disposeRecognizer();
  if (!sttSupported()) {
    setSttRecoveryVisible(false);
    return;
  }
  recognizer = createFreshRecognizer();
};

startRecognition = function(forceFresh = false) {
  if (!sttSupported()) return;
  sttWanted = true;
  clearSttRestart();

  if (forceFresh || !recognizer) {
    disposeRecognizer();
    recognizer = createFreshRecognizer();
  }
  if (!recognizer || sttIsActive) return;

  try {
    recognizer.start();
  } catch (_) {
    disposeRecognizer();
    recognizer = createFreshRecognizer();
    try {
      recognizer.start();
    } catch (_) {
      scheduleSttRestart("start-failed");
    }
  }
};

stopRecognition = function() {
  sttWanted = false;
  clearSttRestart();
  sttConsecutiveFailures = 0;
  if (!recognizer) return;
  try { recognizer.abort(); } catch (_) {}
  sttIsActive = false;
};

try {
  if (recognizer) {
    recognizer.onend = null;
    recognizer.onerror = null;
    recognizer.onresult = null;
    try { recognizer.abort(); } catch (_) {}
  }
} catch (_) {}
recognizer = null;
initRecognition();

const restartSttButton = $("restartStt");
if (restartSttButton) {
  restartSttButton.onclick = () => {
    sttWanted = true;
    sttConsecutiveFailures = 0;
    setSttRecoveryVisible(false);
    if (running && !paused) startRecognition(true);
  };
  restartSttButton.style.touchAction = "manipulation";
}

// share-chatgpt.js wraps finish(), but app.js bound the End button before that wrap.
// Rebind it so a manual/early finish also marks the session shareable.
const shareAwareFinish = finish;
finish = function() {
  sttWanted = false;
  clearSttRestart();
  const result = shareAwareFinish.apply(this, arguments);
  const recEl = $("rec");
  if (recEl) recEl.textContent = "已停止";
  return result;
};
$("end").onclick = finish;

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && shouldKeepSttRunning() && !sttIsActive) {
    startRecognition(true);
  }
});
