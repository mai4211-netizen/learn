/* IELTS Part 2 optional reusable expansion: one lightweight sentence per primary category.
   The optional paragraph is injected by app.js before the original closing paragraph.
   Do not splice reviewed[]; its indexes are used by personal bold-range keys. */
(() => {
  const templates = {
    "地点": {
      text: "Another thing I remember is the atmosphere, which felt different from an ordinary day.",
      zh: "我还记得那里的氛围，感觉和平常不太一样。"
    },
    "人物": {
      text: "To me, these small details say a lot about the kind of person they are.",
      zh: "对我来说，这些小细节很能体现这个人的特点。"
    },
    "经历": {
      text: "What I remember most is how I felt at that moment, not just what happened.",
      zh: "我最记得的不只是发生了什么，还有当时自己的感受。"
    },
    "媒体": {
      text: "I also noticed a few small details that I would not normally pay attention to.",
      zh: "我还留意到一些平时不会特别注意的小细节。"
    },
    "法律": {
      text: "It also made me think about how small changes in daily life can make a difference.",
      zh: "这也让我想到，日常生活中的小改变其实也能带来影响。"
    },
    "科技": {
      text: "After that, I started paying more attention to how I used it every day.",
      zh: "从那以后，我开始更留意自己每天是怎么使用它的。"
    },
    "购物": {
      text: "I still remember how I felt when I finally got it, because I had thought about it for a while.",
      zh: "我仍然记得终于拿到它时的感受，因为此前我已经考虑了好一阵子。"
    },
    "目标": {
      text: "I know this will take time, so I just try to make progress one step at a time.",
      zh: "我知道这需要时间，所以会尽量一步一步往前走。"
    },
    "演唱会": {
      text: "Even now, I can still remember the excitement in the crowd and how it made me feel.",
      zh: "直到现在，我还记得现场人群兴奋的气氛，以及那带给我的感受。"
    },
    "电影": {
      text: "I also noticed how small details could change the way I felt about the story.",
      zh: "我还注意到，一些小细节会改变我对这个故事的感受。"
    },
    "体育": {
      text: "The atmosphere around me made the match feel much more exciting than watching it on a screen.",
      zh: "现场气氛让我觉得这场比赛比在屏幕上看更激动人心。"
    }
  };
  const groups = window.P2_2026Q4_GROUPS || [];
  groups.forEach(g => {
    const primary = String(g.category || '').split('/')[0].trim();
    const line = templates[primary];
    if (!line) return;
    (g.topics || []).forEach(t => {
      // Keep the original answer intact. The renderer handles insertion position.
      t.flex = {text:line.text,zh:line.zh,category:primary};
    });
  });
  // Q19 describes a photographer even though its reused story is filed under
  // "地点 / 旅行". Reuse the 人物 sentence instead of an unrelated place-atmosphere line.
  const photoFriend = groups.flatMap(g => g.topics || []).find(t => t.q === 'Q19');
  if (photoFriend) photoFriend.flex = {...templates["人物"],category:"人物"};
  window.P2_2026Q4_CATEGORY_FLEX = templates;
})();
