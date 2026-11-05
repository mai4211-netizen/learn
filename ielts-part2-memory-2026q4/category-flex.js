/* IELTS Part 2 optional speaking extension: short, topic-relevant reusable sentences.
   Category defaults remain available via P2_2026Q4_CATEGORY_FLEX.
   More specific story groups replace them when a category contains different tasks.
   No reviewed[] paragraph is changed; this preserves existing personal bold marks. */
(() => {
  const templates = {
  "地点": {
    "text": "Sometimes I take a quick photo of the displays because the colours give me ideas for my own design work.",
    "zh": "有时我会拍下展览的照片，因为那些颜色能给我的设计工作带来灵感。"
  },
  "人物": {
    "text": "Even when we only have time for coffee, she always makes the conversation feel relaxed.",
    "zh": "即使我们只能简单喝杯咖啡，她也总能让聊天的气氛很轻松。"
  },
  "经历": {
    "text": "I still remember how proud I felt when I finally made one that looked almost right.",
    "zh": "我还记得终于做出一个看起来差不多像样的月饼时，自己有多自豪。"
  },
  "媒体": {
    "text": "The colours caught my attention first, and then I became curious about how the pieces were made.",
    "zh": "最先吸引我的是作品的颜色，后来我开始好奇它们是怎么做出来的。"
  },
  "法律": {
    "text": "I think the rules should be easy to understand, so people know exactly how to receive the reward.",
    "zh": "我觉得规则应该简单明了，让大家知道怎样才能得到奖励。"
  },
  "科技": {
    "text": "I spent quite a while trying to figure things out before I finally found a useful explanation online.",
    "zh": "我花了不少时间自己摸索，后来才在网上找到有用的说明。"
  },
  "购物": {
    "text": "The staff member took time to explain the differences between the watches, which made choosing one much easier.",
    "zh": "店员花时间讲清楚不同手表的区别，让我更容易做出选择。"
  },
  "目标": {
    "text": "I would ask a few artists what they need most, so the first version could solve a real problem.",
    "zh": "我会先问几位艺术家最需要什么，让第一版产品能够解决一个实际问题。"
  },
  "演唱会": {
    "text": "I remember how excited we looked when the first familiar song began.",
    "zh": "我记得第一首熟悉的歌响起时，我们脸上兴奋的表情。"
  },
  "电影": {
    "text": "I liked imagining the different parts of the city, where animals of all sizes could live together.",
    "zh": "我喜欢想象这座城市的不同区域，各种体型的动物都能在里面生活。"
  },
  "体育": {
    "text": "The cheers around us made even small moments feel important, although I was still learning the rules.",
    "zh": "虽然我还不太熟悉规则，但身边的欢呼声让比赛中很小的瞬间也变得激动人心。"
  }
};
  const defaultTopics = {
  "地点": [
    "Q01",
    "Q52"
  ],
  "人物": [
    "Q28",
    "Q43",
    "Q51"
  ],
  "经历": [
    "Q05",
    "Q15",
    "Q49"
  ],
  "媒体": [
    "Q10",
    "Q40"
  ],
  "法律": [
    "Q08",
    "Q21",
    "Q26"
  ],
  "科技": [
    "Q09",
    "Q58"
  ],
  "购物": [
    "Q20",
    "Q29"
  ],
  "目标": [
    "Q11"
  ],
  "演唱会": [
    "Q07",
    "Q30"
  ],
  "电影": [
    "Q22",
    "Q53"
  ],
  "体育": [
    "Q37"
  ]
};
  const storyVariants = [
  {
    "name": "K11-negative",
    "questions": [
      "Q03",
      "Q13",
      "Q17"
    ],
    "text": "At one point, I wondered whether we should just leave, because we still had not found anything worth staying for.",
    "zh": "有一刻我甚至想，要不干脆走吧，因为始终没发现什么值得继续逛的东西。"
  },
  {
    "name": "island-hot",
    "questions": [
      "Q02"
    ],
    "text": "At one point, I just wanted to find some shade and rest instead of getting back on the bike.",
    "zh": "骑到一半时，我只想找个阴凉的地方休息，根本不想再骑上自行车。"
  },
  {
    "name": "island-photo",
    "questions": [
      "Q19"
    ],
    "text": "She took time to choose the right angle, and I could see how much she cared about each photo.",
    "zh": "她会花时间挑选合适的角度，我能看出她对每张照片都很认真。"
  },
  {
    "name": "island-change",
    "questions": [
      "Q46"
    ],
    "text": "We found some little streets that I probably would not have noticed from the bus.",
    "zh": "我们还发现了几条小街道，如果坐公交，我可能根本不会注意到。"
  },
  {
    "name": "pottery-creative",
    "questions": [
      "Q04",
      "Q42",
      "Q57"
    ],
    "text": "Watching her work made me realise that even a small clay piece needs a lot of patience.",
    "zh": "看她工作后我才发现，即使一件小小的陶艺作品，也需要很多耐心。"
  },
  {
    "name": "pottery-teacher",
    "questions": [
      "Q06",
      "Q18"
    ],
    "text": "She asked me to look at the shape from different angles before I tried to fix it.",
    "zh": "她让我先从不同角度看看作品的形状，再试着修改。"
  },
  {
    "name": "pottery-conversation",
    "questions": [
      "Q32"
    ],
    "text": "I kept nodding and asking simple questions, even though I did not understand most of the technical words.",
    "zh": "虽然大多数专业词我都听不懂，但我还是点头，并试着问一些简单的问题。"
  },
  {
    "name": "ad-mooncake",
    "questions": [
      "Q24"
    ],
    "text": "I watched the cooking part twice because I wanted to get the steps right when I tried it myself.",
    "zh": "我把制作部分看了两遍，因为想自己动手时能记住正确步骤。"
  },
  {
    "name": "claire-routine",
    "questions": [
      "Q33",
      "Q36",
      "Q54"
    ],
    "text": "She prefers a few small daily goals because they are easier to keep up with when life gets busy.",
    "zh": "她更喜欢每天定几个小目标，因为忙起来也比较容易坚持。"
  },
  {
    "name": "claire-plants",
    "questions": [
      "Q39"
    ],
    "text": "She gets excited whenever she notices a new leaf, even if it is a very small change.",
    "zh": "即使只是多长出一片新叶子，她都会很开心。"
  },
  {
    "name": "claire-house",
    "questions": [
      "Q35"
    ],
    "text": "Her plants and art supplies make the place feel warm, but they also take up quite a lot of room.",
    "zh": "她的植物和美术用品让屋子很温馨，但也占了不少空间。"
  },
  {
    "name": "medical-career",
    "questions": [
      "Q12"
    ],
    "text": "She knows becoming a doctor will take years of study, but she seems ready to put in the effort.",
    "zh": "她知道成为医生需要学习很多年，但看起来已经做好了努力的准备。"
  },
  {
    "name": "concert-ticket",
    "questions": [
      "Q23"
    ],
    "text": "Every time my phone lit up, I hoped it was the seller, but it was usually another message.",
    "zh": "每次手机亮起来，我都希望是卖家回复了，结果往往只是其他消息。"
  },
  {
    "name": "concert-team",
    "questions": [
      "Q25"
    ],
    "text": "We kept checking the group chat, so nobody had to ask for the same information twice.",
    "zh": "我们随时查看群聊，这样就不必反复问同样的预订信息。"
  },
  {
    "name": "concert-change",
    "questions": [
      "Q27",
      "Q38",
      "Q45",
      "Q48"
    ],
    "text": "When we finally got on the early flight, I felt tired but excited about what was ahead.",
    "zh": "终于登上早班飞机时，我虽然很困，却也对接下来的演唱会很期待。"
  },
  {
    "name": "art-business-success",
    "questions": [
      "Q50"
    ],
    "text": "The AR preview made her platform different from ordinary art shops, and I think it helped attract customers.",
    "zh": "AR 预览让她的平台与普通艺术商店有所不同，我觉得这也帮助她吸引了顾客。"
  },
  {
    "name": "sister-travel",
    "questions": [
      "Q34",
      "Q44",
      "Q55"
    ],
    "text": "We saved the hotel address and the route on her phone, so she could check them by herself.",
    "zh": "我们把酒店地址和路线存在她手机里，让她能自己随时查看。"
  },
  {
    "name": "movie-dislike",
    "questions": [
      "Q31"
    ],
    "text": "I kept comparing it with the first film, which probably made the sequel harder for me to enjoy.",
    "zh": "我总忍不住把它和第一部比较，这可能也让我更难享受续集。"
  },
  {
    "name": "hockey-player",
    "questions": [
      "Q56"
    ],
    "text": "I noticed that she tried to encourage other players even when the match was not going well.",
    "zh": "我注意到，即使比赛不顺利，她还是在鼓励其他队员。"
  },
  {
    "name": "nara",
    "questions": [
      "Q16",
      "Q47"
    ],
    "text": "I stopped for a moment to watch the deer moving around on the grass before the sunset.",
    "zh": "日落前，我停下来一会儿，看着小鹿在草地上走来走去。"
  },
  {
    "name": "soyeon-interview",
    "questions": [
      "Q41"
    ],
    "text": "I remembered how uncertain the group's future had seemed, so her words felt especially meaningful to me.",
    "zh": "想到那时组合的未来曾经那么不确定，她说的话对我就格外有意义。"
  },
  {
    "name": "watch-habit",
    "questions": [
      "Q14"
    ],
    "text": "On busy days, even a short walk feels easier to manage than a big workout.",
    "zh": "忙的时候，短短散步一会儿也比安排一场很长的运动更容易做到。"
  }
];
  const all = (window.P2_2026Q4_GROUPS || []).flatMap(g => (g.topics || []).map(t => ({g,t})));
  const byQ = new Map(all.map(item => [item.t.q,item]));
  const assigned = new Set();
  const assign = (q,line,kind) => {
    const item = byQ.get(q);
    if (!item) return;
    if (assigned.has(q)) throw new Error('Duplicate speaking extension for '+q);
    const category = kind || String(item.g.category||'').split('/')[0].trim();
    item.t.flex = { text:line.text, zh:line.zh, category };
    assigned.add(q);
  };
  Object.entries(defaultTopics).forEach(([category,qs]) =>
    qs.forEach(q => assign(q, templates[category], category))
  );
  storyVariants.forEach(v => v.questions.forEach(q => assign(q,v)));
  const uncovered = all.map(item => item.t.q).filter(q => !assigned.has(q));
  if (uncovered.length) console.warn('No optional IELTS extension for',uncovered.join(', '));
  window.P2_2026Q4_CATEGORY_FLEX = templates;
})();
