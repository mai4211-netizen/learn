// One-tap export: package the full-session recording + per-question transcript.
// Loaded after app.js and mobile-fix.js so it can wrap the final runtime functions.

let shareSessionRecords = [];
let shareSavedIndexes = new Set();
let shareCurrentIndex = null;
let shareStartedAt = null;
let shareFinished = false;

const SHARE_PLACEHOLDERS = new Set([
  "Listening…",
  "Listening...",
  "开始后，如果浏览器支持英语语音识别，会在这里转写。你也可以完全不看它。",
  ""
]);

function cleanTranscriptText(text) {
  const value = (text || "").trim();
  return SHARE_PLACEHOLDERS.has(value) ? "" : value;
}

function commitShareRecord() {
  if (shareCurrentIndex === null || shareSavedIndexes.has(shareCurrentIndex)) return;
  const item = queue[shareCurrentIndex];
  if (!item) return;

  const answer = cleanTranscriptText($("transcript")?.textContent || "");
  shareSessionRecords.push({
    index: shareCurrentIndex,
    part: item.part,
    question: item.q || "",
    cues: Array.isArray(item.cues) ? [...item.cues] : [],
    source: item.source || "",
    answer
  });
  shareSavedIndexes.add(shareCurrentIndex);
}

const originalDisplayItemForShare = displayItem;
displayItem = function(item) {
  // The transcript box still contains the previous answer at this point,
  // including any current interim recognition text.
  commitShareRecord();
  originalDisplayItemForShare(item);
  const transcriptEl = $("transcript");
  if (transcriptEl) transcriptEl.textContent = "Listening…";
  shareCurrentIndex = idx;
};

function resetShareSession() {
  shareSessionRecords = [];
  shareSavedIndexes = new Set();
  shareCurrentIndex = null;
  shareStartedAt = new Date();
  shareFinished = false;
  updateShareButton();
}

const originalStartTestForShare = startTest;
startTest = function() {
  resetShareSession();
  return originalStartTestForShare.apply(this, arguments);
};

const originalFinishForShare = finish;
finish = function() {
  commitShareRecord();
  shareFinished = true;
  const result = originalFinishForShare.apply(this, arguments);
  updateShareButton();
  // MediaRecorder.onstop is asynchronous. Re-check after it has had time to create audioBlob.
  [150, 500, 1200, 2500].forEach(ms => setTimeout(updateShareButton, ms));
  return result;
};

// Rebind because mobile-fix.js already attached the previous startTest reference.
$("go").onclick = () => { $("mode").value = "full"; startTest(); };
$("startBtn").onclick = startTest;

function formatLocalDate(date) {
  if (!date) return "";
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildSessionMarkdown() {
  commitShareRecord();
  const sorted = [...shareSessionRecords].sort((a,b) => a.index - b.index);
  const lines = [];
  lines.push("# IELTS Speaking 模拟记录");
  lines.push("");
  if (shareStartedAt) lines.push(`- 开始时间：${formatLocalDate(shareStartedAt)}`);
  lines.push(`- 自动转写：${sorted.some(r => r.answer) ? "已包含（可能有识别误差）" : "本次没有可用的自动转写"}`);
  lines.push("- 录音与转写冲突时，请以录音为准。");
  lines.push("");

  [1,2,3].forEach(part => {
    const records = sorted.filter(r => r.part === part);
    if (!records.length) return;
    lines.push(`## Part ${part}`);
    lines.push("");
    records.forEach((r, i) => {
      lines.push(`### ${i+1}. ${r.source ? `[${r.source}] ` : ""}${r.question}`);
      if (r.cues.length) {
        lines.push("");
        lines.push("**Cue card:**");
        r.cues.forEach(c => lines.push(`- ${c}`));
      }
      lines.push("");
      lines.push("**我的回答（自动转写）：**");
      lines.push(r.answer || "（无可用自动转写，请直接听录音）");
      lines.push("");
    });
  });

  lines.push("---");
  lines.push("");
  lines.push("请结合随附的整场录音和以上逐题文本复盘这次 IELTS Speaking。先按 Part 1 / Part 2 / Part 3 对齐题目与回答；转写有误时以录音为准。然后按 Fluency & Coherence、Lexical Resource、Grammar、Pronunciation 四项评估，并优先指出最影响分数的问题。");
  return lines.join("\n");
}

function audioExtension(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("mp4") || t.includes("m4a") || t.includes("aac")) return "m4a";
  if (t.includes("ogg")) return "ogg";
  if (t.includes("wav")) return "wav";
  return "webm";
}

function sessionStamp() {
  const d = shareStartedAt || new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function updateShareButton() {
  const btn = $("sendChatGPT");
  if (!btn) return;
  if (!shareFinished) {
    btn.disabled = true;
    btn.textContent = "完成本场后发送到 ChatGPT";
    return;
  }
  btn.disabled = false;
  btn.textContent = audioBlob
    ? "发送到 ChatGPT · 录音 + 全部逐题文本"
    : "发送到 ChatGPT · 全部逐题文本（暂无录音）";
}

async function shareToChatGPT() {
  const btn = $("sendChatGPT");
  const report = buildSessionMarkdown();
  const stamp = sessionStamp();
  const reportFile = new File([report], `IELTS-speaking-${stamp}.md`, {type:"text/markdown"});
  const files = [reportFile];

  if (audioBlob) {
    const ext = audioExtension(audioBlob.type);
    files.unshift(new File([audioBlob], `IELTS-speaking-${stamp}.${ext}`, {type:audioBlob.type || "audio/webm"}));
  }

  const shareText = "请结合我这次 IELTS Speaking 的整场录音和逐题整理文本进行复盘。录音优先，自动转写只作为辅助。";

  try {
    btn.disabled = true;
    btn.textContent = "正在准备分享…";

    if (navigator.share && navigator.canShare && navigator.canShare({files})) {
      await navigator.share({
        title: "IELTS Speaking 模拟记录",
        text: shareText,
        files
      });
    } else if (navigator.share && audioBlob) {
      const audioOnly = files[0];
      if (!navigator.canShare || navigator.canShare({files:[audioOnly]})) {
        // Some mobile share targets accept one attachment plus text but reject two files.
        await navigator.share({
          title: "IELTS Speaking 模拟记录",
          text: `${shareText}\n\n${report}`,
          files:[audioOnly]
        });
      } else {
        throw new Error("file-share-unavailable");
      }
    } else if (navigator.share) {
      await navigator.share({title:"IELTS Speaking 模拟记录", text:`${shareText}\n\n${report}`});
    } else {
      throw new Error("web-share-unavailable");
    }
  } catch (err) {
    if (err && err.name === "AbortError") {
      // User closed the share sheet; nothing is wrong.
    } else {
      try {
        await navigator.clipboard.writeText(report);
        alert("这个浏览器不能把录音和文本一起分享到 ChatGPT。逐题文本已经复制到剪贴板；录音仍可用「单独保存录音」保存。");
      } catch (_) {
        alert("当前浏览器不支持一键分享。可以先用「复制纯文本」和「单独保存录音」。");
      }
    }
  } finally {
    updateShareButton();
  }
}

$("sendChatGPT").onclick = shareToChatGPT;
updateShareButton();
