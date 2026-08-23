// iOS / mobile reliability patch.
// Keeps the existing simulator logic, but removes the two failure modes seen on iPhone:
// 1) speech synthesis starts only after an awaited microphone request, losing user activation;
// 2) when Safari never fires speech onend, the UI stays disabled forever.

let mobileSpeechPrimed = false;

function primeSpeech(){
  if (!("speechSynthesis" in window)) return false;
  try {
    speechSynthesis.cancel();
    speechSynthesis.resume();
    const warmup = new SpeechSynthesisUtterance(" ");
    warmup.volume = 0.01;
    warmup.rate = 1;
    speechSynthesis.speak(warmup);
    mobileSpeechPrimed = true;
    return true;
  } catch (e) {
    return false;
  }
}

// Prime on a real tap. This is deliberately synchronous so iOS keeps the user gesture.
document.addEventListener("pointerdown", () => {
  if (!mobileSpeechPrimed) primeSpeech();
}, {passive:true});
document.addEventListener("touchstart", () => {
  if (!mobileSpeechPrimed) primeSpeech();
}, {passive:true, once:true});

// Replace the original speak() with a Safari-safe version.
speak = function(text, after){
  stopRecognition();
  if (!("speechSynthesis" in window)) {
    $("status").textContent = "VOICE UNAVAILABLE";
    setTimeout(() => after && after(), 0);
    return;
  }

  speechSynthesis.cancel();
  speechSynthesis.resume();

  const u = new SpeechSynthesisUtterance(text);
  const allVoices = voices();
  u.voice = allVoices.find(v => v.name === $("voice").value)
    || allVoices.find(v => /en-GB/i.test(v.lang))
    || allVoices.find(v => /^en/i.test(v.lang))
    || null;
  u.lang = u.voice?.lang || "en-GB";
  u.rate = parseFloat($("rate").value) || 0.94;
  u.pitch = 1;
  u.volume = 1;

  $("status").textContent = "EXAMINER SPEAKING";
  $("bars").classList.add("on");

  let settled = false;
  let started = false;
  const finishSpeech = () => {
    if (settled) return;
    settled = true;
    clearTimeout(startWatchdog);
    clearTimeout(hardWatchdog);
    $("status").textContent = "LISTENING";
    $("bars").classList.remove("on");
    after && after();
  };

  u.onstart = () => { started = true; };
  u.onend = finishSpeech;
  u.onerror = finishSpeech;

  try {
    speechSynthesis.speak(u);
    // Safari occasionally stays paused after cancel() or after a permission sheet closes.
    setTimeout(() => { try { speechSynthesis.resume(); } catch(e){} }, 80);
    setTimeout(() => { try { speechSynthesis.resume(); } catch(e){} }, 350);
  } catch (e) {
    finishSpeech();
    return;
  }

  // If Safari silently refuses to start TTS, never leave the interface frozen.
  const startWatchdog = setTimeout(() => {
    if (!settled && !started && !speechSynthesis.speaking && !speechSynthesis.pending) {
      $("status").textContent = "TAP REPEAT FOR VOICE";
      finishSpeech();
    }
  }, 1400);

  // Long-stop safety: buttons must always recover even if Safari misses onend.
  const estimatedMs = Math.max(6500, Math.min(30000, text.trim().split(/\s+/).length * 520));
  const hardWatchdog = setTimeout(() => {
    if (!settled) finishSpeech();
  }, estimatedMs + 3500);
};

// Replace startTest(): speech is triggered immediately from the user's tap.
// Microphone permission is requested only after the first examiner question finishes,
// so it cannot consume the activation needed for speech synthesis.
startTest = function(){
  primeSpeech();
  buildQueue();
  idx = 0;
  running = true;
  paused = false;
  sessionTranscript = "";
  $("intro").classList.add("hidden");
  $("startBtn").disabled = true;
  $("end").disabled = false;
  $("pause").disabled = false;
  $("transcript").textContent = "Listening…";
  $("phase").textContent = "INTRO";
  $("sidePhase").textContent = "身份核对";
  $("question").textContent = "Can you tell me your full name, please?";
  $("hint").textContent = "身份核对";
  $("count").textContent = "—";

  speak("Good afternoon. My name is Alex. Can you tell me your full name, please?", () => {
    // Start recording after TTS has begun/finished; do not block the exam UI on permission.
    initRecorder();
    $("done").disabled = false;
    $("repeat").disabled = false;
    $("done").onclick = () => {
      $("done").onclick = next;
      speak("Thank you. Now, in this first part, I'd like to ask you some questions about yourself.", ask);
    };
  });
};

// Rebind handlers because app.js attached them before this patch replaced startTest().
$("go").onclick = () => { $("mode").value = "full"; startTest(); };
$("startBtn").onclick = startTest;

// Make setup and all test actions respond to taps as ordinary buttons on iOS.
["done","repeat","pause","end","settingsBtn","setupFirst","copy","saveAudio","resetHist"].forEach(id => {
  const el = $(id);
  if (el) el.style.touchAction = "manipulation";
});

// If Safari restores the page from bfcache with speech paused, resume it.
window.addEventListener("pageshow", () => {
  try { if ("speechSynthesis" in window) speechSynthesis.resume(); } catch(e){}
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    try { if ("speechSynthesis" in window) speechSynthesis.resume(); } catch(e){}
  }
});