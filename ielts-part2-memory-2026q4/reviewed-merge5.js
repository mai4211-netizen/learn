(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const set=(q,paras,chain,keywords)=>{const t=byQ[q];if(!t)return;t.reviewed=paras;t.chain=chain;t.keywords=keywords};

// 1) Q16 + Q47: same Nara mountain story, only the final angle changes.
const naraCore=[
 {type:"shared",text:"I went to a mountain in Nara, Japan, after shopping for most of the day. I was already tired and still carrying a few bags when we started going up."},
 {type:"shared",text:"We took a taxi most of the way, but the best place to watch the sunset was higher, so we still had to walk uphill for a while."},
 {type:"shared",text:"The wide green grass slopes were beautiful and the area was very quiet. We saw a few deer along the way, and there were even more near the higher viewing area."},
 {type:"shared",text:"We fed a few of the deer, took photos together and watched the sunset. I was exhausted, but the view made the climb feel worth it."}
];
set("Q16",[
 {type:"own",text:"A natural place I really like is a mountain in Nara, Japan."},
 ...naraCore,
 {type:"own",text:"I like this place because it feels peaceful and very different from the busy city. The grass, the deer and the sunset made the whole trip feel special."}
],"奈良的一座山 → 购物一天后已经很累、还拿着东西 → taxi 先上到较高位置 → 为看日落继续往上走 → 草坡、安静、小鹿 → 到高处喂鹿、拍照、看日落 → 虽然累但很喜欢",
["mountain in Nara","shopping","tired","carrying a few bags","taxi","sunset","walk uphill","green grass slopes","quiet","deer","higher viewing area","fed","photos","worth it","peaceful"]);
set("Q47",[
 {type:"own",text:"A place I have visited and would recommend is a mountain in Nara, Japan."},
 ...naraCore,
 {type:"own",text:"I would recommend going in the late afternoon, so you can reach the higher area before sunset. The walk is a little tiring, but you can see grass slopes, deer and a beautiful view in one trip."}
],"推荐奈良的一座山 → 下午去比较合适 → taxi 先上到较高位置 → 再往上走看日落 → 一路草坡和小鹿 → 高处喂鹿、拍照 → 日落很漂亮 → 虽然要走一段但很值得推荐",
["recommend","mountain in Nara","late afternoon","taxi","sunset","walk uphill","green grass slopes","deer","higher viewing area","fed","photos","beautiful view","tiring","worth it"]);

// Move Q47 into the Nara-mountain group and remove the old Tokyo-only group.
const naraGroup=groups.find(g=>g.id==="wakakusa");
const tokyoGroup=groups.find(g=>g.id==="tokyo");
if(naraGroup&&tokyoGroup){
  const q47=tokyoGroup.topics.find(t=>t.q==="Q47");
  if(q47&&!naraGroup.topics.some(t=>t.q==="Q47"))naraGroup.topics.push(q47);
  const idx=groups.indexOf(tokyoGroup);
  if(idx>=0)groups.splice(idx,1);
  naraGroup.title="奈良山：城市自然地 / 推荐旅行地";
  naraGroup.memory="奈良购物一天 → taxi 先上山 → 为看日落继续往高处走 → 草坡和小鹿一路很治愈 → 高处喂鹿、拍照、看日落 → Q16 说喜欢自然地，Q47 说为什么值得推荐";
}

// 2) Q23 + Q25: same concert-planning event.
const planCore=[
 {type:"shared",text:"For one concert trip, two friends and I made a group chat and divided the work. I looked for tickets, while one friend handled the hotel and transport."},
 {type:"shared",text:"We kept the booking details and meeting times in the same chat, so everyone knew what had already been arranged."},
 {type:"shared",text:"While I was buying the tickets on a second-hand platform, one seller replied quickly at first and then suddenly stopped answering when we started talking about how to send the ticket."},
 {type:"shared",text:"Later, our hotel booking was cancelled as well. Luckily, the friend responsible for the hotel already had a backup option, so we changed places without too much trouble."}
];
set("Q23",[
 {type:"own",text:"A time I did not receive a reply for a long time happened while I was organising a concert trip with friends."},
 ...planCore,
 {type:"own",text:"I waited for more than an hour and kept checking my phone because tickets were selling quickly. In the end, I contacted another seller and got the ticket from that person instead."}
],"和两个朋友筹备演唱会 → 建群分工 → 我负责买票、朋友负责酒店和交通 → 二手卖家一开始秒回，谈到发票时突然失联 → 等一个多小时一直看手机 → 最后换卖家",
["concert trip","group chat","divided the work","tickets","hotel","transport","second-hand platform","seller","stopped answering","more than an hour","checking my phone","another seller"]);
set("Q25",[
 {type:"own",text:"I'd like to talk about a concert trip that I organised with two friends as a small team."},
 ...planCore,
 {type:"own",text:"The trip showed me why teamwork is useful. Each person was responsible for one part, so when the ticket seller or the hotel caused a problem, we did not all have to solve everything at the same time."}
],"三个人筹备演唱会 → 建群分工 → 我买票、朋友订酒店和交通 → 卖家失联时我换卖家 → 酒店取消时朋友启用备用方案 → 每个人负责一块，所以出问题也不乱",
["concert trip","two friends","small team","group chat","divided the work","tickets","hotel","transport","seller","stopped answering","backup option","teamwork","responsible for one part"]);

// 3) Q27 + Q38 + Q45 + Q48: one overtime-to-concert story.
const decisionCore=[
 {type:"shared",text:"I had originally planned to spend the weekend working overtime. Then my best friend and I heard that our favourite K-pop group might not stay together much longer, so we started thinking about going to their concert."},
 {type:"shared",text:"I finished the most urgent work first, told my team in advance and asked for a day off. We made the decision quite late, so the train was already sold out and we had to book an early flight."},
 {type:"shared",text:"The flight meant getting up at about three in the morning. I had packed the night before, but I was still very sleepy when I left home and went to the airport."},
 {type:"shared",text:"The trip was more tiring and a little more expensive than our original plan, but we reached the concert on time. I was glad we went because the work could still be finished later, but that concert could not be repeated."}
];
set("Q27",[
 {type:"own",text:"The clearest time I remember getting up early was for a concert trip to Hong Kong."},
 ...decisionCore,
 {type:"own",text:"Getting up at three was painful, but once the concert started I stopped thinking about how tired I was. In the end, the early start felt worth it."}
],"原计划周末加班 → 决定改去香港演唱会 → 先处理急事并请假 → 高铁没票、改早班机 → 凌晨三点起床 → 到机场很困 → 顺利看到演唱会 → 觉得值得",
["got up early","concert trip","Hong Kong","working overtime","urgent work","day off","train sold out","early flight","three in the morning","airport","concert on time","worth it"]);
set("Q38",[
 {type:"own",text:"A plan I changed recently was my plan for one weekend."},
 ...decisionCore,
 {type:"own",text:"The main change was simple: I went from working overtime to taking a day off and travelling to the concert. It was less convenient, but I was happy with the new plan."}
],"原计划周末加班 → 听说喜欢的组合可能快结束活动 → 先处理急事、请假 → 高铁没票改早班机 → 凌晨三点起床 → 顺利看到演唱会 → 虽然更累但庆幸改计划",
["changed plan","weekend","working overtime","urgent work","day off","train sold out","early flight","three in the morning","concert on time","new plan"]);
set("Q45",[
 {type:"own",text:"An important decision I was happy with was choosing to go to a concert instead of working the whole weekend."},
 ...decisionCore,
 {type:"own",text:"I was happy with the result because nothing serious happened at work, and I did not miss an experience that might only happen once."}
],"重要决定 → 加班还是去演唱会 → 先把急事处理好、请假 → 高铁没票改早班机 → 凌晨三点起床 → 最后顺利看到 → 工作后来补完 → 很庆幸没错过",
["important decision","concert","working overtime","urgent work","day off","train sold out","early flight","three in the morning","concert on time","work later","only happen once"]);
set("Q48",[
 {type:"own",text:"An important decision I made was to take a day off and go to a concert."},
 ...decisionCore,
 {type:"own",text:"The decision changed the way I look at similar situations. I still take work seriously, but I no longer say no automatically when an experience may only happen once."}
],"重要决定 → 请假去可能很难再有的演唱会 → 先安排好工作 → 高铁没票改早班机 → 凌晨三点起床 → 顺利去成 → 以后遇到一次性机会不会默认因为工作放弃",
["important decision","day off","concert","working overtime","urgent work","train sold out","early flight","three in the morning","concert on time","work seriously","only happen once"]);

// 4) Q09 + Q14: one smartwatch-use story, split at problem vs lifestyle change.
const watchUseCore=[
 {type:"shared",text:"I started using my smartwatch more seriously because I wanted to improve my exercise and sleep. I check my steps and activity rings after work, and if I have barely moved, I usually go out for a short walk."},
 {type:"shared",text:"I also use a sleep app at night, so I notice when I have been going to bed too late. The watch does not force me to exercise, but the numbers make my habits easier to see."},
 {type:"shared",text:"After I had used it for a while, the watch suddenly shut down even though it was only about a year old. I tried charging and restarting it, but both attempts failed."},
 {type:"shared",text:"I searched online and found someone with the same problem. A comment suggested updating the system, and after I tried that, the watch started working normally again."}
];
set("Q09",[
 {type:"own",text:"A technological problem I faced happened with my smartwatch."},
 ...watchUseCore,
 {type:"own",text:"I felt relieved because I fixed it without going to a store. It also taught me that checking other users' experiences online can sometimes save a lot of time."}
],"开始认真用智能手表记录运动和睡眠 → 下班看步数和活动圆环 → 晚上看睡眠 → 用了一段时间后手表突然关机 → 充电、重启都没用 → 网上搜到同样问题 → 更新系统后恢复",
["smartwatch","exercise","sleep","steps","activity rings","short walk","sleep app","shut down","charging","restarting","searched online","same problem","updating the system","working normally"]);
set("Q14",[
 {type:"own",text:"A recent change in my life is that I have become more regular with exercise and sleep."},
 ...watchUseCore,
 {type:"own",text:"The biggest change is that I now notice my habits earlier. If I have been sitting all day or sleeping too late, the watch gives me a simple reminder to adjust."}
],"近期开始更认真用智能手表 → 看步数和活动圆环 → 没完成就出去走一走 → 晚上看睡眠 → 手表坏过一次、网上更新解决 → 现在更早发现自己久坐或晚睡 → 生活更规律",
["recent change","exercise","sleep","smartwatch","steps","activity rings","short walk","sleep app","habits","sitting all day","sleeping too late","adjust"]);
})();
