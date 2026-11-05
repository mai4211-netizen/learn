/* 2026-11-03: focused story corrections and consistency across reused Part 2 answers. */
(() => {
  const groups = window.P2_2026Q4_GROUPS || [];
  const byQ = {};
  groups.forEach(g => (g.topics || []).forEach(t => { byQ[t.q] = t; }));
  const para = (text, type = 'shared') => ({ text, type, adjusted: false });
  const set = (q, paragraphs, chain, keywords) => {
    const t = byQ[q]; if (!t) return;
    t.reviewed = paragraphs;
    if (chain) t.chain = chain;
    if (keywords) t.keywords = keywords;
  };
  const edit = (q, index, text) => {
    const t = byQ[q]; if (!t || !Array.isArray(t.reviewed) || !t.reviewed[index]) return;
    t.reviewed[index].text = text;
  };
  const append = (q, index, sentence) => {
    const t = byQ[q]; if (!t || !t.reviewed?.[index]) return;
    if (!t.reviewed[index].text.includes(sentence)) t.reviewed[index].text += ' ' + sentence;
  };
  const group = id => groups.find(g => g.id === id);
  const keywords = (q, list) => { if (byQ[q]) byQ[q].keywords = list; };

  // Claire: one shared travel-planning paragraph used in all three personal stories.
  const tripPlanning = "She is very good at planning trips. Before we travel, she checks transport and hotels and makes a simple plan. But she is easy-going and happy to change the plan when someone has a better idea.";
  for (const q of ['Q28','Q43','Q51']) edit(q, 2, tripPlanning);
  edit('Q28', 4, "I think she is popular because she makes trips easy and fun, and she listens to other people's suggestions. Everyone feels comfortable making plans with her, so friends often invite her to join them.");
  byQ.Q28.chain = "认识十多年的 Claire → 喜欢画画和旅行 → 擅长查交通酒店、规划行程 → 性格随和 → 愿意听朋友建议、调整计划 → 大家和她出去玩很轻松 → 很受欢迎";
  keywords('Q28', ['Claire','ten years','planning trips','transport','hotels','simple plan','easy-going','change the plan','suggestions','comfortable','popular']);
  byQ.Q43.chain = "Claire → 学生时代认识 → 画画和种番茄 → 喜欢组织旅行但不死板 → 愿意听建议 → 工作、兴趣和朋友之间有平衡 → 是快乐的人";
  byQ.Q51.chain = "Claire → 十多年前在学校认识 → 以前聊音乐、画画 → 现在仍一起规划旅行 → 她容易相处、愿意听建议 → 彼此了解 → 友谊一直很自然";
  for (const q of ['Q43','Q51']) keywords(q, ['Claire','school','ten years','drawing','planning trips','easy-going','change the plan','friends','comfortable','balance']);

  const claire = group('claire-person');
  if (claire) claire.memory = '认识十多年的 Claire → 做事有目标、列清单 → 学英语日语 → 擅长规划旅行又很随和 → 愿意接受朋友建议 → 画画和种植物 → 大家喜欢和她相处';

  // Japanese island: photos are a positive detail; tiring weather remains the reason Q02 was unenjoyable.
  edit('Q19', 3, "At first, I did not notice all the small things she was photographing. But I slowly started to appreciate the details too. Later, she sent me a small album from the trip, and I enjoyed seeing places through her eyes.");
  byQ.Q19.chain = "爱拍照的朋友 → 日本小岛一起骑车 → 海岸、小路、路牌和食物都拍 → 她很会发现细节 → 我也慢慢学会欣赏 → 回来收到照片相册 → 觉得旅行更有意思";
  keywords('Q19', ['close friend','taking photos','Japanese island','rented bikes','coast','natural light','small things','appreciate the details','small album','through her eyes']);
  append('Q46', (byQ.Q46.reviewed||[]).length-1, 'Her photos also helped me appreciate the small details of the journey.');
  // Q02 remains unchanged: the intense heat, not the friend's photography, made it unenjoyable.

  // Original law returns: positive public-transport rewards, emperor penguins / sea ice.
  const penguins = "I started thinking about this after reading about emperor penguins in Antarctica. Global warming is melting the sea ice they need. Young penguins have to stay on stable ice until their waterproof feathers grow, or they may not survive.";
  const transport = "My idea is to encourage more people to use buses and trains instead of driving every day. For example, people who regularly use public transport could receive a small tax benefit. They could still drive when they really need to.";
  const result = "Cars are not the only cause of global warming, but reducing unnecessary car trips can help cut carbon emissions. I prefer rewarding a good habit to charging drivers, because it gives people a positive reason to make a change.";
  const lawChain = "帝企鹅的海冰栖息地因全球变暖减少 → 幼企鹅要在稳定海冰上长出防水羽毛 → 想推出公共交通鼓励法 → 常坐公交或地铁可有税收优惠 → 少开车、减少碳排放 → 尽一点力量减缓气候变化";
  const lawKeywords = ['emperor penguins','Antarctica','global warming','sea ice','waterproof feathers','public transport','buses and trains','tax benefit','carbon emissions','rewarding a good habit'];
  set('Q08', [
    para("An environmental law I would like to introduce is the Public Transport Encouragement Law.",'own'),
    para(penguins),
    para(transport),
    para(result),
    para("One law cannot stop climate change by itself, but it could help more people make a small change in everyday life.",'own')
  ],lawChain,lawKeywords);
  set('Q21', [
    para("A law I think could help protect the environment is a Public Transport Encouragement Law.",'own'),
    para(penguins),
    para(transport),
    para(result),
    para("I think it could protect the environment in a practical way. Even small reductions in emissions matter when many people take part.",'own')
  ],lawChain,lawKeywords);
  set('Q26', [
    para("A new law I would like to introduce is the Public Transport Encouragement Law.",'own'),
    para(penguins),
    para(transport),
    para(result),
    para("It would mainly affect daily commuters. People would have another reason to take public transport, while those who really need a car could still use one.",'own')
  ],lawChain,lawKeywords);
  const law = group('law');
  if (law) {
    law.title = '企鹅与环保：公共交通鼓励法（3 题共用）';
    law.memory = '帝企鹅海冰融化 → 幼企鹅需要稳定海冰 → 公共交通鼓励法 → 经常乘公交得税收优惠 → 减少汽车碳排放';
  }

  // Smartwatch: Q14 discusses a recent healthier routine, Q09 remains the failure story.
  set('Q14', [
    para("A recent change in my life is that I have become more regular with exercise and sleep. I bought a smartwatch not long ago because I wanted to build healthier habits.",'own'),
    para("I now check my steps and activity rings after work. If I have barely moved all day, I usually go out for a short walk instead of just sitting at home."),
    para("I also use a sleep app at night, so I notice when I have been going to bed too late. The watch does not force me to exercise, but the numbers make my habits easier to see."),
    para("Before, I often lost track of time and forgot to move when I was busy. Now I try to take short walks and go to bed at a more regular time."),
    para("It is only a small change, but it helps me take better care of myself. I do not need to do everything perfectly; I just try to be more consistent.",'own')
  ],"最近买智能手表 → 想让运动与睡眠更健康 → 下班看步数和活动圆环 → 没怎么动就散步 → 晚上看睡眠数据 → 发现熬夜就调整 → 日常作息更规律",['recent change','smartwatch','exercise','sleep','steps','activity rings','short walk','sleep app','more regular','healthier habits','consistent']);
  const watch = group('smartwatch-life');
  if (watch) watch.memory = '最近买智能手表 → 用活动圆环和睡眠数据改善作息；另一个题目说手表后来遇到故障并通过系统更新解决';

  // Make the first mention of the craftsperson sound natural, not "my pottery friend".
  for(const q of ['Q06','Q18','Q32','Q42','Q57']) {
    const t=byQ[q];if(!t?.reviewed)continue;
    for(const p of t.reviewed) {
      if(typeof p.text !== 'string')continue;
      p.text = p.text
        .replace(/\bmy pottery friend\b/gi, 'a friend of mine who makes pottery')
        .replace(/\ba pottery friend\b/gi, 'a friend of mine who makes pottery');
    }
  }
  if (byQ.Q32?.reviewed?.[0]) {
    byQ.Q32.reviewed[0].text = "I'd like to talk about a time when I listened to a friend who runs a pottery studio. She was explaining different kinds of clay, firing temperatures and traditional patterns, which I was not interested in.";
  }
  // Avoid "a friend ... a friend" duplication in Q57.
  if(byQ.Q57?.reviewed?.[0]) byQ.Q57.reviewed[0].text = "One of my most creative friends runs a small pottery studio. She is a few years older than me.";

  // A single, identifiable famous interviewee instead of the whole group.
  set('Q41', [
    para("I'd like to talk about an interview with Soyeon, the leader of my favourite K-pop group, (G)I-DLE. I watched it on YouTube around the group's comeback in 2022.",'own'),
    para("Before that comeback, one member had left and the group had been away for quite a long time. Soyeon talked about how the remaining five members had to adjust and prepare the new album."),
    para("What I remember most is that she said they worked on the album as if they were debuting again. She wanted the group to move forward and make a fresh start, even though it was not easy."),
    para("I was impressed by how seriously she took her role as a leader. She talked about the difficulties directly instead of pretending everything had been fine."),
    para("The interview made me respect her more. I already liked the group's music, but her words helped me understand how much work and pressure there was behind the comeback.",'own')
  ],"Soyeon 是喜欢的组合 (G)I-DLE 的队长 → 2022 回归前后看 YouTube 采访 → 成员离队后五个人重新调整 → 她说像重新出道一样准备专辑 → 面对压力继续往前 → 我更佩服她的领导力",['Soyeon','leader','(G)I-DLE','YouTube','2022','comeback','five members','adjust','album','debuting again','fresh start','pressure','respect']);
  const interview=group('concert-interview');
  if(interview) {interview.title='Soyeon：2022 回归时的名人采访';interview.memory='(G)I-DLE 2022 回归 → YouTube 采访队长 Soyeon → 成员离队后五人重整 → 像重新出道一样准备 → 直面压力、继续往前';}

  // Women's hockey: link a standout captain on the ice to the admired-player topic.
  const q37=byQ.Q37;
  if(q37?.reviewed?.[2]) {
    append('Q37',2,"Even when the US pulled further ahead, I noticed one Canadian player who stayed active and kept directing her teammates.");
    q37.chain='在温哥华和朋友看加拿大对美国女子冰球 → 冰球小、速度快 → 美国队逐渐拉开差距 → 一位加拿大球员仍积极指挥进攻 → 加拿大输了但比赛很刺激';
    q37.keywords=['women\'s ice hockey','Vancouver','best friend','team jerseys','puck','fast','US','Canadian player','active','teammates','live atmosphere'];
  }
  set('Q56', [
    para("An athlete I admire is Marie-Philip Poulin, a Canadian women's ice hockey player. I first noticed her at a match in Vancouver with my best friend.",'own'),
    para("It was Canada against the United States, and it was my first time watching women's ice hockey live. The puck moved so fast that I could hardly follow the game."),
    para("But one Canadian player caught my eye. She was very active and kept giving directions to her teammates. Even as the US scored more goals, she stayed focused and tried to organise attacks."),
    para("After the game, my friend told me that the player was Poulin, the team captain. I later learned that she had led Canada's national team for years. I also found out that the new women's professional league only started in 2024."),
    para("I admire her because she kept leading her teammates under pressure. Her determination impressed me more than the final score.",'own')
  ],"温哥华和好友看加拿大对美国的女子冰球 → 球太快很难跟上 → 发现一位加拿大球员特别活跃 → 美国逐渐领先，她仍指挥进攻 → 赛后朋友说她是队长 Marie-Philip Poulin → 我佩服她顶住压力的领导力",
  ['Marie-Philip Poulin','Canadian','women\'s ice hockey','Vancouver','puck','active','directions','teammates','US','organise attacks','captain','2024','pressure','determination']);

  // 2026-11-05: Remove redundant coast/photo/bus descriptions within the island group.
  // Q02 and Q46 intentionally reuse the same ride paragraph; Q19 focuses on photography.
  edit('Q02',2,"We followed a quiet road beside the coast and could stop whenever we wanted. My friend loves taking photos, so we stopped several times to photograph the sea and the little streets.");
  keywords('Q02',['short island trip','Japanese island','missed the bus','public transport','rented bikes','extremely hot','coast','taking photos','tired','sweaty','sunburnt']);
  // Preserve the established Q02/Q46 shared island-riding paragraph.
  edit('Q46',2,byQ.Q02.reviewed[2].text);

  edit('Q19',1,"I noticed this most clearly when we travelled to a quiet Japanese island. We rented bikes and explored the island together.");
  edit('Q19',2,"My friend kept stopping to take pictures of the sea, signs and little streets. She likes natural light and sometimes takes several versions before choosing one.");
  byQ.Q19.chain = '爱拍照的朋友 → 日本小岛一起骑车 → 她拍海景、小路和路牌 → 为了光线多拍几张 → 我慢慢学会欣赏细节 → 收到她发来的相册';
  keywords('Q19',['close friend','taking photos','Japanese island','rented bikes','sea','signs','little streets','natural light','appreciate the details','small album','through her eyes']);

  edit('Q46',3,"I was still tired at the end, but I understood why people enjoy cycling on trips. We could explore at our own pace, and the journey felt more flexible than I expected. Her photos also helped me appreciate the small details of the journey.");
  byQ.Q46.chain = '原本觉得骑车旅行累又慢 → 日本小岛错过公交、改租自行车 → 沿海骑行、朋友拍照 → 自己掌握节奏 → 虽然累但发现旅行更自由 → 也开始欣赏旅途细节';
})();
