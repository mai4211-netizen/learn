/* Focused alignment pass: keep word audio selection intact and improve recall cues. */
(() => {
  const groups = window.P2_2026Q4_GROUPS || [];
  const byQ = new Map(groups.flatMap(g => (g.topics || []).map(t => [t.q, t])));

  // Q56: use the role, not a hard-to-recall athlete's name; simplify the long explanation.
  const q56 = byQ.get("Q56");
  if (q56?.reviewed?.[0]) {
    q56.reviewed[0].text = q56.reviewed[0].text.replace(
      /Marie-Philip Poulin, the captain of Canada's women's ice hockey team/g,
      "the captain of Canada's women's ice hockey team"
    ).replace(/Marie-Philip Poulin/g, "the team captain");
  }
  if (q56?.reviewed?.[3]) {
    q56.reviewed[3].text =
      "She has won three Olympic gold medals. Outside matches, she supports programmes that help children try sport. I admire that she cares about young players as well as her own career. In interviews, she seems calm and focused. She often talks about the team, not just herself. I respect her because she takes responsibility for her teammates.";
  }
  if (window.P2_2026Q4_ZH_TRANSLATIONS?.Q56) {
    window.P2_2026Q4_ZH_TRANSLATIONS.Q56 =
      window.P2_2026Q4_ZH_TRANSLATIONS.Q56
        .replace(/Marie-Philip Poulin/g, "加拿大女子冰球队的队长")
        .replace(/Poulin/g, "这位队长");
  }

  // Keep recall cues tied to the actual story beats in the user's K11 sample.
  if (typeof IELTS_RECALL_CUES !== "undefined") {
    IELTS_RECALL_CUES.Q03 = [
      "crowded shopping centre","weekend afternoon","very crowded",
      "near the escalators","food area","walk slowly","hard to find a seat",
      "chain stores","closed for renovation","less to look at",
      "nearly two hours","bought almost nothing","coffee and left",
      "café area was full","wait before we could order",
      "difficult to have a proper conversation","crowds made everything stressful",
      "prefer visiting on weekday mornings"
    ];
  }

  // Q03: keep the idea, remove the unstable "remember thinking" construction.
  const q03 = byQ.get("Q03");
  if (q03?.reviewed) {
    for (const part of q03.reviewed) {
      part.text = part.text.replace(
        /I remember thinking that a short visit had taken much more time than I planned\./g,
        "A short visit took much longer than I expected."
      );
    }
  }

  // Reusable sentence openings and transitions stay visually quiet (underlined).
  window.weakReuseMarkup = function(segment) {
    const patterns = /\b(?:The person I'd like to talk about is|The person I'd like to talk about|I'd like to talk about|One thing I know is|We met|She is|She usually|One thing she does is|For example|What I remember most is|I like her because|So I think she is|It happened|I went with|It started when|I wanted to|First|Then|After that|The problem was|In the end|I felt|It taught me|It is a|There are|It feels|I usually go with|I like it because|For me|I first heard about|I chose it because|What I like is|It helps|The main reason is|I first noticed|One weekend morning|We could stop whenever we wanted to|I met at school more than ten years ago|more than ten years ago|I had originally planned|At first|After a while|I was worried|I used to think|I realised|I would recommend|It was my first time|That is why|That's why|It reminded me|I really enjoyed|I still remember|One reason is|The best part was|I enjoyed it because|I found it|I was surprised|That made me feel|I would suggest)\b/gi;
    let html = "", last = 0, match;
    while ((match = patterns.exec(segment))) {
      html += (typeof esc === "function" ? esc(segment.slice(last, match.index)) : segment.slice(last, match.index));
      const phrase = typeof esc === "function" ? esc(match[0]) : match[0];
      html += '<span class="reuse-pattern">' + phrase + '</span>';
      last = match.index + match[0].length;
    }
    return html + (typeof esc === "function" ? esc(segment.slice(last)) : segment.slice(last));
  };

  // Keep the existing phrase selection, but make sure a sentence's feeling is
  // not lost behind nouns/actions when it is useful for recalling the answer.
  const previousRanges = window.recommendedRanges;
  if (typeof previousRanges === "function" && typeof window.sentenceSpans === "function") {
    window.recommendedRanges = function(text, topic) {
      const ranges = previousRanges(text, topic) || [];
      const feelings = new Set([
        "happy","proud","excited","worried","nervous","relieved","calm","confident",
        "upset","disappointed","frustrated","anxious","stressed","embarrassed",
        "comfortable","uncomfortable","boring","bored","interesting","interested",
        "enjoyable","relaxing","relaxed","peaceful","impressed","meaningful",
        "memorable","lovely","beautiful","creative","modern","fun","difficult",
        "challenging","surprising","successful","friendly","patient","tiring",
        "tired","exhausting","inspiring","scary","afraid","pleasant","satisfied",
        "grateful","thankful","stressful","confusing","valuable","practical",
        "fascinating","awkward","old-fashioned","traditional"
      ]);
      const additions = [];
      for (const [start, end] of window.sentenceSpans(text)) {
        const sentence = text.slice(start, end);
        const words = [...sentence.matchAll(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)];
        const hasFeeling = ranges.some(([a,b]) => a >= start && b <= end &&
          [...text.slice(a,b).toLowerCase().matchAll(/[a-z]+/g)].some(m => feelings.has(m[0])));
        if (hasFeeling) continue;
        const candidate = words.find(m => feelings.has(m[0].toLowerCase()));
        if (!candidate) continue;
        const a = start + candidate.index, b = a + candidate[0].length;
        const overlaps = ranges.some(([x,y]) => a < y + 3 && x < b + 3);
        if (!overlaps) additions.push([a,b]);
      }
      return typeof window.normalizeRanges === "function"
        ? window.normalizeRanges([...ranges, ...additions], text.length)
        : [...ranges, ...additions];
    };
  }

  // Double-click still selects the word. Speak it without clearing the native
  // selection or hiding the selection toolbar.
  document.addEventListener("dblclick", event => {
    const paragraph = event.target.closest?.("#answer .answer-paragraph");
    if (!paragraph) return;
    const selected = window.getSelection();
    const word = (selected?.toString().match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/)||[])[0];
    if (!word || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    event.stopImmediatePropagation();
    event.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, true);

  if (typeof window.render === "function") window.render();
})();
