(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const set=(q,paras,chain,keywords)=>{const t=byQ[q];if(!t)return;t.reviewed=paras;t.chain=chain;t.keywords=keywords};

// Concert: Q07 + Q30 share the same concert night.
const concertNightCore=[
 {type:"shared",text:"I went to a K-pop concert in Hong Kong with two close friends. We had been fans of the same group for years, so we were excited long before the show started."},
 {type:"shared",text:"Before the concert, we had dinner near the venue and talked about the songs we hoped to hear. Once the lights went down, the crowd started cheering and singing along, and I could hardly hear my friends beside me."},
 {type:"shared",text:"At the end, the group performed a fan song and said, 'See you next year.' We were tired after the show, but we still bought drinks and kept talking on the way back to the hotel."}
];
set("Q07",[
 {type:"own",text:"The noisiest place I can remember is a K-pop concert in Hong Kong."},
 ...concertNightCore,
 {type:"own",text:"Normally that amount of noise would bother me, but at the concert it felt exciting because everyone was reacting to the same performance. My ears were tired afterwards, but I still enjoyed it."}
],"香港 K-pop 演唱会 → 和两个朋友去 → 开场前吃饭聊天 → 灯一暗全场尖叫合唱 → 几乎听不到朋友说话 → 最后唱 fan song → 虽然很吵但现场感很强",
["K-pop concert","Hong Kong","two close friends","dinner","songs","lights went down","cheering","singing along","hardly hear my friends","fan song","tired","exciting"]);
set("Q30",[
 {type:"own",text:"An enjoyable evening I spent with friends was the night of a K-pop concert in Hong Kong."},
 ...concertNightCore,
 {type:"own",text:"I enjoyed the evening because it felt like a small celebration with friends who understood why the group mattered to me. Even after the concert ended, none of us wanted the night to finish quickly."}
],"香港 K-pop 演唱会 → 和两个朋友去 → 演出前吃饭猜歌单 → 全场合唱 → 最后 fan song → 回酒店路上还在聊 → 像一起庆祝的一晚",
["enjoyable evening","K-pop concert","Hong Kong","two close friends","dinner","songs","singing along","fan song","drinks","hotel","small celebration"]);

// Concert decisions: Q38 + Q45 + Q48 share one plan/decision story.
const concertDecisionCore=[
 {type:"shared",text:"I had originally planned to spend the weekend working overtime. Then my best friend and I heard that our favourite K-pop group might not stay together much longer, so we started thinking about going to their concert instead."},
 {type:"shared",text:"I finished the most urgent work first, told my team in advance and asked for a day off. We made the decision quite late, so the train was already sold out and we had to book an early flight."},
 {type:"shared",text:"The new plan was more tiring and a little more expensive, but we reached the concert on time. I was glad we went because the work could still be finished later, but that concert could not be repeated."}
];
set("Q38",[
 {type:"own",text:"A plan I changed recently was my plan for one weekend."},
 ...concertDecisionCore,
 {type:"own",text:"So the main change was simple: I went from working overtime to taking a day off and travelling to the concert. It was less convenient, but I was happy with the new plan."}
],"原计划周末加班 → 听说喜欢的组合可能快结束活动 → 先处理急事并请假 → 高铁没票改早班机 → 顺利看到演唱会 → 虽然更累更贵，但很庆幸改计划",
["changed plan","weekend","working overtime","K-pop group","urgent work","team","day off","train sold out","early flight","concert on time","finished later"]);
set("Q45",[
 {type:"own",text:"An important decision I was happy with was choosing to go to a concert instead of working the whole weekend."},
 ...concertDecisionCore,
 {type:"own",text:"I was happy with the result because nothing serious happened at work, and I did not miss an experience that might only happen once."}
],"重要决定 → 加班还是去演唱会 → 先处理急事、请假 → 高铁没票改早班机 → 最后顺利看到 → 工作后来补完 → 很庆幸没有错过一次性的体验",
["important decision","concert","working overtime","urgent work","team","day off","train sold out","early flight","concert on time","work later","only happen once"]);
set("Q48",[
 {type:"own",text:"An important decision I made was to take a day off and go to a concert."},
 ...concertDecisionCore,
 {type:"own",text:"The decision mattered to me because it changed the way I look at similar situations. I still take work seriously, but I no longer say no automatically when an experience may only happen once."}
],"重要决定 → 请假去可能很难再有的演唱会 → 先把工作安排好 → 高铁没票改早班机 → 顺利去成 → 以后遇到一次性机会，不会因为工作默认放弃",
["important decision","day off","concert","working overtime","urgent work","team","train sold out","early flight","concert on time","work seriously","only happen once"]);

// Sister: Q34 + Q44 use the same answer.
const sisterStory=[
 {type:"shared",text:"I'd like to talk about my younger sister and her first trip alone. She had just finished high school, was quite shy and had never travelled by herself before."},
 {type:"shared",text:"She really wanted to attend a K-pop fan meeting, but the airport, hotel and venue all made her nervous. I helped her choose a safe hotel, check the visa process and go through the route before she left."},
 {type:"shared",text:"She still wanted to give up at one point, but having a clear plan made the trip feel possible. During the trip, she used maps on her phone and sent us a message after she reached the hotel."},
 {type:"shared",text:"In the end, she completed the whole trip alone and came back much more confident. For her, the success was not just reaching the fan meeting; it was proving that she could manage a trip by herself."}
];
set("Q34",sisterStory,"妹妹高中毕业 → 害怕第一次独自旅行 → 很想去 K-pop 见面会 → 我帮她准备酒店、签证、路线 → 中途想放弃 → 最后独自完成 → 回来更自信",
["younger sister","first trip alone","high school","fan meeting","airport","hotel","visa","route","give up","maps","reached the hotel","confident","by herself"]);
set("Q44",sisterStory,"妹妹高中毕业 → 第一次独自去见面会 → 机场、酒店、场馆都让她紧张 → 提前准备酒店、签证和路线 → 按计划完成 → 证明自己可以独立旅行",
["younger sister","first trip alone","high school","fan meeting","airport","hotel","visa","route","clear plan","maps","confident","manage a trip"]);

// Smartwatch: Q20 + Q29 share the buying scene more closely.
const watchBuyCore=[
 {type:"shared",text:"I wanted a smartwatch because I wanted to track my exercise and sleep. It was not something I had to buy immediately, so I saved a fixed amount from my salary for a few months and cut down on unnecessary online shopping."},
 {type:"shared",text:"When I had enough money, I went to an Apple Store and tried a few models. A staff member asked what I needed the watch for and showed me the exercise, heart-rate and sleep functions."},
 {type:"shared",text:"She also showed me cheaper options and did not push the most expensive model. After I chose one, she helped me set up the basic functions."}
];
set("Q20",[
 {type:"own",text:"Something special I saved money to buy was my smartwatch."},
 ...watchBuyCore,
 {type:"own",text:"I felt good about the purchase because I had planned it for a few months and could pay for it without affecting my normal expenses. I still use the watch every day."}
],"想买智能手表 → 为运动和睡眠记录 → 每月从工资存一点、减少网购 → 去 Apple Store 试几个型号 → 店员解释功能 → 最后买下 → 因为提前存钱所以没有压力",
["smartwatch","exercise","sleep","saved","salary","online shopping","Apple Store","models","staff member","heart-rate","cheaper options","set up","normal expenses","every day"]);
set("Q29",[
 {type:"own",text:"A time I received very good service was when I bought my smartwatch at an Apple Store."},
 ...watchBuyCore,
 {type:"own",text:"I thought the service was good because the staff member listened to what I needed and did not try to make me spend more. The advice felt useful, not like a sales pitch."}
],"Apple Store 买智能手表 → 店员先问需求 → 重点讲运动、心率、睡眠功能 → 也给我看便宜款 → 不强推最贵款 → 买后帮设置 → 我觉得是真正帮我选",
["good service","smartwatch","Apple Store","staff member","exercise","heart-rate","sleep functions","cheaper options","most expensive model","set up","did not try to make me spend more","useful advice"]);
})();
