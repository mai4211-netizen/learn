(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const set=(q,paras,chain,keywords)=>{const t=byQ[q];if(!t)return;t.reviewed=paras;t.chain=chain;t.keywords=keywords};

// K11: Q01 + Q52 use the same positive story.
const k11Like=[
 {type:"shared",text:"I'd like to talk about K11 in downtown Guangzhou. It is a tall public building with several floors of shops, offices above them and art exhibitions from time to time."},
 {type:"shared",text:"I like the inside most. There are artworks, colourful lights and small design displays, so it feels more creative than a normal shopping centre. I often go there with a friend to see a new exhibition or have coffee."},
 {type:"shared",text:"The displays change quite often, so there is usually something new to look at. It is also easy to reach by public transport, which makes it convenient for a short visit after work or at the weekend."},
 {type:"shared",text:"For me, K11 is interesting because it mixes art with everyday activities. I can walk around, eat something and still get new design ideas, so I enjoy visiting it."}
];
set("Q01",k11Like,"广州 K11 → 高层公共建筑 → 商店、办公室、艺术展 → 和朋友看展喝咖啡 → 交通方便 → 像商场和画廊的结合 → 我喜欢",
["K11","downtown Guangzhou","tall public building","art exhibitions","artworks","colourful lights","design displays","friend","coffee","public transport","art","design ideas"]);
set("Q52",k11Like,"广州 K11 → 高层公共建筑 → 商店、办公室、艺术展 → 和朋友看展喝咖啡 → 交通方便 → 像商场和画廊的结合 → 我喜欢",
["K11","downtown Guangzhou","tall public building","art exhibitions","artworks","colourful lights","design displays","friend","coffee","public transport","art","design ideas"]);

// K11: Q03 + Q13 + Q17 share the same weekend visit.
const k11NegCore=[
 {type:"shared",text:"I went to K11 with a friend on a weekend afternoon. It was very crowded, especially near the escalators and the food area, so we had to walk slowly and it was hard to find a seat."},
 {type:"shared",text:"We moved from floor to floor, but many shops were chain stores we had already seen before. Some areas were also closed for renovation, so there was less to look at than we expected."},
 {type:"shared",text:"We stayed for nearly two hours, but we bought almost nothing. In the end, we just got coffee and left. I remember thinking that a short visit had taken much more time than I planned."}
];
set("Q03",[
 {type:"own",text:"One crowded place I remember clearly is K11 in downtown Guangzhou."},
 ...k11NegCore,
 {type:"own",text:"The crowd was the main problem for me. I still like the building itself, but now I prefer going on a weekday morning when I can walk around more easily."}
],"周末和朋友去 K11 → 电梯和餐饮区很挤 → 走路慢、找座位难 → 连锁店多、部分装修 → 逛近两小时几乎没买东西 → 以后改工作日去",
["K11","weekend afternoon","very crowded","escalators","food area","hard to find a seat","chain stores","renovation","nearly two hours","coffee","weekday morning"]);
set("Q13",[
 {type:"own",text:"One place I found boring was K11 in Guangzhou."},
 ...k11NegCore,
 {type:"own",text:"For me, the visit became boring because the shops felt similar and there was not much new to see. I would rather spend that time in smaller local shops."}
],"和朋友周末去 K11 → 人多 → 连锁店很多、部分装修 → 一层层逛但没什么新东西 → 近两小时几乎没买东西 → 喝咖啡就走 → 觉得无聊",
["K11","weekend afternoon","crowded","chain stores","renovation","less to look at","nearly two hours","bought almost nothing","coffee","boring","local shops"]);
set("Q17",[
 {type:"own",text:"An activity that sometimes wastes my time is window-shopping at K11."},
 ...k11NegCore,
 {type:"own",text:"I do enjoy walking around for a while, but afterwards I often feel that I spent too much time there. I could have used those two hours for exercise, study or something more useful."}
],"去 K11 window-shopping → 周末人多 → 连锁店和装修区域 → 一层层逛近两小时 → 几乎什么都没买 → 当下还可以，但事后觉得浪费时间",
["window-shopping","K11","weekend afternoon","crowded","chain stores","renovation","nearly two hours","bought almost nothing","coffee","spent too much time","exercise","study"]);

// Pottery: Q04 + Q42 share one history/handcraft story.
const potteryHistoryCore=[
 {type:"shared",text:"My friend is a pottery craftsperson and she runs a small studio. She is interested in the history of Chinese pottery, so she often looks at old bowls, shapes and patterns in museums or online."},
 {type:"shared",text:"She does not just copy old designs. She takes ideas from them and makes colourful cups, small sculptures and character-shaped pieces. She still shapes the clay by hand and fires it in a kiln."},
 {type:"shared",text:"I have watched her work in the studio, and she can make small changes very quickly. I like the way she keeps the traditional technique but makes the final pieces look modern."}
];
set("Q04",[
 {type:"own",text:"I'd like to talk about a friend who enjoys learning about history, especially the history of Chinese pottery."},
 ...potteryHistoryCore,
 {type:"own",text:"I think her way of learning history is interesting because she uses the old ideas in her own work. The history becomes something she can actually see and make."}
],"陶艺朋友 → 喜欢中国陶艺历史 → 看旧器型和图案 → 把传统元素做成彩色杯子和小雕塑 → 传统手法、现代结果 → 她把历史真正用进作品",
["pottery craftsperson","small studio","Chinese pottery","old bowls","shapes","patterns","museums","colourful cups","small sculptures","clay by hand","kiln","old ideas"]);
set("Q42",[
 {type:"own",text:"A person I know who is very good at making things by hand is my pottery friend."},
 ...potteryHistoryCore,
 {type:"own",text:"I admire her skill because the process looks difficult when I try it, but she can turn a soft piece of clay into something neat and detailed very quickly."}
],"陶艺朋友 → 自己开工作室 → 看传统器型和图案 → 手工塑形、进窑烧制 → 做彩色杯子和小雕塑 → 我亲眼看她做 → 手很稳、速度很快",
["pottery friend","small studio","old bowls","patterns","colourful cups","small sculptures","clay by hand","kiln","watched her work","small changes","neat and detailed"]);

// Pottery: Q06 + Q18 share one teaching story.
const potteryTeachCore=[
 {type:"shared",text:"She is a few years older than me and has her own small pottery studio. One day, she invited me there and taught me how to make a small animal from clay."},
 {type:"shared",text:"She showed me how to keep my hands steady and how much pressure to use. I wanted to make a rabbit, but the shape slowly turned into something closer to a bear."},
 {type:"shared",text:"She did not take the clay away and fix it for me. She explained what I could change and let me try again. The final piece was not perfect, but I was proud that I finished it myself."}
];
set("Q06",[
 {type:"own",text:"An older person I respect is my pottery friend."},
 ...potteryTeachCore,
 {type:"own",text:"I respect her because she is skilled and patient. When I make mistakes, she does not make me feel stupid; she helps me understand the problem and try again."}
],"比我年长几岁的陶艺朋友 → 自己开工作室 → 教我做小动物 → 兔子做成熊 → 她不替我重做，只教我调整 → 最后自己完成 → 我尊敬她的耐心",
["older person","pottery friend","small pottery studio","small animal","hands steady","pressure","rabbit","bear","try again","finished it myself","skilled","patient"]);
set("Q18",[
 {type:"own",text:"The person who taught me a new skill was my pottery friend."},
 ...potteryTeachCore,
 {type:"own",text:"That lesson taught me the basics of working with clay. I also liked her teaching style because she let me make mistakes and finish the piece myself."}
],"陶艺朋友 → 工作室教我做小动物 → 稳住手、控制力度 → 兔子做成熊 → 她不替我做，只教我怎么改 → 我自己完成 → 学会基础陶艺",
["taught me","pottery friend","small pottery studio","small animal","hands steady","pressure","rabbit","bear","try again","finished it myself","working with clay","teaching style"]);

// Mooncake: Q05 + Q15 + Q49 share the same family event.
const mooncakeCore=[
 {type:"shared",text:"One Mid-Autumn Festival when I was younger, my family got together at home and my mother taught me how to make snow-skin mooncakes."},
 {type:"shared",text:"We prepared the sweet filling, wrapped it in the soft mooncake skin and used a mould to press a pattern on top. My first one looked uneven because I pressed the mould too hard, so my mother showed me how to do it more gently."},
 {type:"shared",text:"Later, we compared the mooncakes, laughed at the strange-looking ones and ate them with tea after dinner. The homemade mooncakes were not perfect, but making them together was the part I remembered most."}
];
set("Q05",[
 {type:"own",text:"A skill I learned when I was young was making snow-skin mooncakes."},
 ...mooncakeCore,
 {type:"own",text:"I still remember the basic steps today. I think the skill stayed in my mind because I learned it with my family, not from a recipe or a class."}
],"小时候中秋和家人一起 → 妈妈教我做冰皮月饼 → 包馅、压花纹 → 第一次压太用力 → 妈妈教我调整 → 最后一起吃 → 这个技能一直记得",
["snow-skin mooncakes","Mid-Autumn Festival","family","mother","sweet filling","mooncake skin","mould","pressed too hard","more gently","tea","basic steps"]);
set("Q15",[
 {type:"own",text:"A gathering I remember well was a Mid-Autumn dinner with my family."},
 ...mooncakeCore,
 {type:"own",text:"It was not a huge party, but I remember it clearly because everyone was relaxed and we had something fun to do together instead of just sitting around."}
],"中秋家庭聚会 → 妈妈带大家做冰皮月饼 → 包馅、压花纹 → 比谁做得好看 → 饭后配茶一起吃 → 一边做一边笑 → 聚会很轻松",
["Mid-Autumn dinner","family","snow-skin mooncakes","mother","sweet filling","mould","uneven","laughed","tea","relaxed","do together"]);
set("Q49",[
 {type:"own",text:"A special food I remember eating was a snow-skin mooncake during the Mid-Autumn Festival."},
 ...mooncakeCore,
 {type:"own",text:"The mooncake tasted soft and slightly sweet, but what made it special was the family activity around it. We made the food ourselves and then ate it together."}
],"中秋和家人一起 → 妈妈教做冰皮月饼 → 包馅、压花纹 → 成品有好有坏 → 饭后配茶一起吃 → 特别的不只是味道，而是一起做",
["snow-skin mooncake","Mid-Autumn Festival","family","mother","sweet filling","mould","pattern","homemade","tea","soft and slightly sweet","made it together"]);

// Pottery media: Q10 + Q40 share one short local-news video.
const potteryVideoCore=[
 {type:"shared",text:"I saw a short local-news video on social media about a pottery market in my city. I almost skipped it because I used to think pottery was old-fashioned."},
 {type:"shared",text:"The video showed hands shaping clay and then showed the finished pieces. There were colourful cups, small sculptures and cute character-shaped objects, not just plain bowls."},
 {type:"shared",text:"A few young makers said they wanted younger people to notice traditional crafts. I liked that idea because the old technique could still produce something modern and fun."},
 {type:"shared",text:"After watching the video, I wanted to see the work in person and later visited a pottery studio. It completely changed the picture of pottery I had in my head."}
];
set("Q10",[
 {type:"own",text:"A piece of local news I remember was a short video about a pottery market in my city."},
 ...potteryVideoCore
],"本地新闻短视频 → 陶艺市集 → 原本觉得陶艺老派 → 看到手工塑形和彩色现代作品 → 年轻陶艺师想让传统手艺更年轻 → 我后来去工作室体验",
["local news","short video","pottery market","social media","shaping clay","finished pieces","colourful cups","small sculptures","young makers","traditional crafts","modern and fun","pottery studio"]);
set("Q40",[
 {type:"own",text:"An interesting video I watched was a short local-news clip about a pottery market."},
 ...potteryVideoCore
],"社媒刷到本地陶艺短视频 → 陶艺市集 → 手工塑形 → 彩色杯子、小雕塑和可爱角色 → 传统工艺也可以很现代 → 我后来想去体验",
["interesting video","local-news clip","pottery market","social media","shaping clay","finished pieces","colourful cups","small sculptures","young makers","traditional crafts","modern and fun","pottery studio"]);
})();
