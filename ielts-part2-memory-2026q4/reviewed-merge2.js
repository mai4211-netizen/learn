(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const set=(q,paras,chain,keywords)=>{const t=byQ[q];if(!t)return;t.reviewed=paras;t.chain=chain;t.keywords=keywords};

// Claire: Q33 + Q36 share one organised language-learning story.
const claireLangCore=[
 {type:"shared",text:"Claire is one of my closest friends, and we have known each other for more than ten years. She is very organised and usually starts with a clear goal."},
 {type:"shared",text:"She makes a short to-do list on her laptop and decides what she needs to do each day. She uses the same method for languages. For English, she watched Friends and talked with people online. For Japanese, she uses an app regularly."},
 {type:"shared",text:"She is also not afraid of making mistakes. If she learns a useful phrase, she tries to use it in a real conversation instead of only writing it down."}
];
set("Q33",[
 {type:"own",text:"The most organised person I know is my friend Claire."},
 ...claireLangCore,
 {type:"own",text:"I think her system works because it is simple. She does not make a very strict timetable; she just knows the next few things she needs to finish."}
],"Claire → 十多年朋友 → 先定清楚目标 → 每天短清单 → 学英语看 Friends、找人聊天 → 学日语用 App → 新词尽量马上用 → 她的计划简单但能长期坚持",
["Claire","ten years","clear goal","to-do list","laptop","each day","Friends","people online","Japanese","app","making mistakes","real conversation","simple"]);
set("Q36",[
 {type:"own",text:"A person I know who is good at learning languages is my friend Claire."},
 ...claireLangCore,
 {type:"own",text:"I think she improves quickly because she actually uses the language. She does not only study vocabulary or grammar; she tries to speak whenever she gets the chance."}
],"Claire → 十多年朋友 → 用清单安排学习 → 英语看 Friends、和别人聊天 → 日语用 App → 不怕犯错 → 学到短语就实际开口用 → 所以口语进步快",
["Claire","learning languages","clear goal","to-do list","Friends","people online","Japanese","app","making mistakes","useful phrase","real conversation","vocabulary","grammar","speak"]);

// Claire: Q28 + Q43 + Q51 share one childhood-friend story.
const claireFriendCore=[
 {type:"shared",text:"Claire and I first met at school more than ten years ago. When we were younger, we often talked after class about music and drawing, and she used to draw in the margins of her notebooks."},
 {type:"shared",text:"Now we are both busy, but she is still easy to talk to. She remembers small things about people and often helps friends when they need advice."},
 {type:"shared",text:"Outside work, she still draws, grows tomatoes on her balcony and sometimes meets friends for coffee. She has her own interests, but she also makes time for other people."}
];
set("Q28",[
 {type:"own",text:"A popular person I know is my friend Claire."},
 ...claireFriendCore,
 {type:"own",text:"I think people like her because she is reliable and easy to be around. She is not loud or attention-seeking, but people trust her and enjoy talking to her."}
],"Claire → 学生时代认识 → 以前一起聊音乐和画画 → 现在仍很好聊 → 会记住别人的小事、愿意帮朋友 → 也有自己的兴趣 → 因为可靠又舒服，所以很受欢迎",
["Claire","school","ten years","music","drawing","easy to talk to","small things","advice","tomatoes","coffee","reliable","trust"]);
set("Q43",[
 {type:"own",text:"A person I would describe as happy is my friend Claire."},
 ...claireFriendCore,
 {type:"own",text:"I see her as happy because she has a good balance. She works seriously, but she still keeps small hobbies and spends time with people she likes."}
],"Claire → 学生时代认识 → 现在工作忙但仍保留画画、种番茄、和朋友喝咖啡 → 她会照顾工作，也会给自己留时间 → 所以我觉得她生活比较平衡、快乐",
["Claire","school","drawing","tomatoes","coffee","work","small hobbies","friends","balance","happy"]);
set("Q51",[
 {type:"own",text:"A childhood friend I would like to talk about is Claire."},
 ...claireFriendCore,
 {type:"own",text:"We do not meet as often as before, but the friendship still feels easy. When we meet, we can start talking naturally because we already know each other so well."}
],"Claire → 学生时代认识 → 十多年朋友 → 以前下课聊音乐和画画 → 现在都忙但仍联系 → 见面不用重新熟悉 → 因为认识彼此太久",
["Claire","school","ten years","after class","music","drawing","busy","friendship","talking naturally","know each other"]);

// Claire home: Q35 + Q39 share one apartment/tomato story.
const claireHomeCore=[
 {type:"shared",text:"Claire lives in a small apartment, and my favourite part is her balcony. She grows tomatoes there in a few pots because she wanted something simple to care for at home."},
 {type:"shared",text:"She bought the soil and seeds herself. She waters the plants, checks the leaves and moves the pots when they need more sunlight. When the first tomatoes appeared, she sent me photos because she was really excited."},
 {type:"shared",text:"When I visit, we often sit near the balcony, have a drink and talk. The apartment feels personal because there are plants, drawings and art supplies around the room."}
];
set("Q35",[
 {type:"own",text:"A home I like visiting but would not want to live in is Claire's apartment."},
 ...claireHomeCore,
 {type:"own",text:"I enjoy visiting because it feels cosy, but I would not want to live there. The space is small and there is not much storage, so it can feel crowded very quickly."}
],"Claire 小公寓 → 阳台种番茄 → 自己买土和种子、每天照顾 → 我去时坐阳台附近聊天 → 家里很有个人感 → 但空间小、收纳少 → 喜欢去但不想住",
["Claire's apartment","small apartment","balcony","tomatoes","pots","soil","seeds","sunlight","photos","drawings","art supplies","cosy","storage","crowded"]);
set("Q39",[
 {type:"own",text:"The person I know who enjoys growing vegetables at home is my friend Claire."},
 ...claireHomeCore,
 {type:"own",text:"She likes this hobby because she can see the plants change week by week. When she finally gets a few tomatoes, she feels that all the watering and waiting were worth it."}
],"Claire 小公寓 → 阳台几盆番茄 → 土、种子、浇水、晒太阳 → 第一批番茄出现就发照片 → 一周周看到变化 → 最后收成让她很有成就感",
["Claire","small apartment","balcony","tomatoes","pots","soil","seeds","waters","sunlight","first tomatoes","photos","week by week","worth it"]);

// Law: Q08 + Q21 + Q26 share one simple law.
const lawCore=[
 {type:"shared",text:"The law would make private cars pay a small fee when they enter the busiest parts of a city during peak hours. People who really need to drive could still use a car, but unnecessary trips would cost more."},
 {type:"shared",text:"The money would be used to make buses and other public transport cheaper and better. If buses were easy to use, more people might leave the car at home."},
 {type:"shared",text:"I like this idea because it does not completely ban cars. It simply gives people a reason to drive less, so traffic and emissions could both go down."}
];
set("Q08",[
 {type:"own",text:"An environmental law I would like to introduce is a city-centre congestion fee."},
 ...lawCore,
 {type:"own",text:"I started thinking about this after reading about climate change and animals such as penguins losing their habitat. I know one city law cannot solve that problem, but reducing traffic is still a practical start."}
],"环保法 → 市中心高峰期收拥堵费 → 真正需要开车的人仍可开 → 收入改善公交 → 公交好用就少开车 → 减少堵车和排放 → 从城市日常行为开始",
["environmental law","congestion fee","private cars","busiest parts","peak hours","unnecessary trips","buses","public transport","leave the car at home","drive less","traffic","emissions","penguins"]);
set("Q21",[
 {type:"own",text:"A law that I think can protect the environment is a city-centre congestion fee."},
 ...lawCore,
 {type:"own",text:"The main environmental benefit is simple: fewer unnecessary car trips mean less fuel is used and less pollution is produced in busy areas."}
],"环保交通法 → 市中心高峰期收拥堵费 → 不完全禁车 → 收入改善公交 → 更多人改坐公交 → 少开车 → 少用油、少污染",
["protect the environment","congestion fee","private cars","busiest parts","peak hours","unnecessary trips","buses","public transport","leave the car at home","drive less","fuel","pollution"]);
set("Q26",[
 {type:"own",text:"A new law I would like to introduce is a city-centre congestion fee."},
 ...lawCore,
 {type:"own",text:"I think it would be easy for people to understand because the rule is clear: if you choose to drive into the busiest area at the busiest time, you pay a small extra fee."}
],"新法律 → 市中心高峰期拥堵费 → 需要开车的人仍可开 → 钱用于改善公交 → 给大家一个少开车的理由 → 规则简单清楚",
["new law","congestion fee","private cars","busiest parts","peak hours","unnecessary trips","buses","public transport","leave the car at home","drive less","rule is clear","extra fee"]);

// Medical: rebuild logic from the user's story.
set("Q12",[
 {type:"own",text:"The person I know who would like to work in the medical field is my friend Claire."},
 {type:"shared",text:"She became interested in being a doctor after watching a Korean medical drama. The doctors had to stay calm, make quick decisions and help people in difficult situations, and that made her respect the job a lot."},
 {type:"shared",text:"Later, she did some volunteer work in her community. She helped with simple health activities, looked after people who needed help and organised small tasks with the other volunteers."},
 {type:"shared",text:"She thinks that experience taught her how to care for people and how to handle practical work. She believes those skills will help her become a more professional doctor in the future."},
 {type:"own",text:"She has started checking courses and qualifications, so it is not just a casual idea. I think the job suits her because she is patient, organised and willing to keep learning."}
],"Claire → 看韩国医疗剧 → 很尊重医生在压力下帮助病人的职业 → 去社区做健康志愿活动 → 学会照顾人、安排实际事项 → 她觉得这些经验能帮助她以后成为更专业的医生 → 开始查课程和资格",
["Claire","medical field","Korean medical drama","stay calm","quick decisions","respect the job","volunteer work","health activities","care for people","organised small tasks","professional doctor","courses","qualifications","patient","organised"]);
})();
