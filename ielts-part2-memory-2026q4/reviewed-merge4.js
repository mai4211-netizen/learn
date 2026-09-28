(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const set=(q,paras,chain,keywords)=>{const t=byQ[q];if(!t)return;t.reviewed=paras;t.chain=chain;t.keywords=keywords};

// Fix shared-object duplicates and keep one useful extra detail.
const k11Like=[
 {type:"shared",text:"I'd like to talk about K11 in downtown Guangzhou. It is a tall public building with several floors of shops, offices above them and art exhibitions from time to time."},
 {type:"shared",text:"I like the inside most. There are artworks, colourful lights and small design displays, so it feels more creative than a normal shopping centre. I often go there with a friend to see a new exhibition or have coffee."},
 {type:"shared",text:"The displays change quite often, so there is usually something new to look at. It is also easy to reach by public transport. I also like that I can stay indoors when Guangzhou is very hot."},
 {type:"shared",text:"For me, K11 is interesting because it mixes art with everyday activities. I can walk around, eat something and still get new design ideas, so I enjoy visiting it."}
];
for(const q of ["Q01","Q52"])byQ[q].reviewed=k11Like.map(p=>({...p}));

const claireFriendBase=[
 {type:"shared",text:"Claire and I first met at school more than ten years ago. When we were younger, we often talked after class about music and drawing, and she used to draw in the margins of her notebooks."},
 {type:"shared",text:"Now we are both busy, but she is still easy to talk to. She remembers small things about people and often helps friends when they need advice. Even when we are busy, she sends short messages and remembers small plans we made."},
 {type:"shared",text:"Outside work, she still draws, grows tomatoes on her balcony and sometimes meets friends for coffee. She has her own interests, but she also makes time for other people."}
];
set("Q28",[
 {type:"own",text:"A popular person I know is my friend Claire."},
 ...claireFriendBase.map(p=>({...p})),
 {type:"own",text:"I think people like her because she is reliable and easy to be around. She is not loud or attention-seeking, but people trust her and enjoy talking to her."}
],byQ.Q28.chain,byQ.Q28.keywords);
set("Q43",[
 {type:"own",text:"A person I would describe as happy is my friend Claire."},
 ...claireFriendBase.map(p=>({...p})),
 {type:"own",text:"I see her as happy because she has a good balance. She works seriously, but she still keeps small hobbies and spends time with people she likes."}
],byQ.Q43.chain,byQ.Q43.keywords);
set("Q51",[
 {type:"own",text:"A childhood friend I would like to talk about is Claire."},
 ...claireFriendBase.map(p=>({...p})),
 {type:"own",text:"We do not meet as often as before, but the friendship still feels easy. When we meet, we can start talking naturally because we already know each other so well."}
],byQ.Q51.chain,byQ.Q51.keywords);

// Island: Q02 + Q46 share the trip; Q19 reuses the photography part.
const islandStart={type:"shared",text:"My friend and I went to a quiet Japanese island. We missed the bus, and public transport was very limited, so we rented bikes. The weather was extremely hot, and I was not happy about cycling at first."};
const islandRide={type:"shared",text:"We followed a quiet road beside the coast and could stop whenever we wanted. My friend loves taking photos, so we stopped several times for the sea, the small roads and other details."};
set("Q02",[
 {type:"own",text:"I'd like to talk about a short island trip that I did not really enjoy."},
 {...islandStart},{...islandRide},
 {type:"own",text:"The views were beautiful, but the heat made the ride harder and harder. By the end, I was tired, sweaty and sunburnt, so I would not choose to do the same trip again in that weather."}
],"日本小岛短途 → 错过公交、改租自行车 → 天气非常热 → 沿海骑行、朋友一路拍照 → 风景漂亮但越骑越累 → 最后晒伤、整体不享受",
["Japanese island","missed the bus","public transport","rented bikes","extremely hot","coast","stop whenever","taking photos","beautiful views","tired","sunburnt"]);
set("Q46",[
 {type:"own",text:"I'd like to talk about a trip that changed my opinion about cycling."},
 {...islandStart},{...islandRide},
 {type:"own",text:"I was still tired at the end, but I understood why people enjoy cycling on trips. We could choose our own pace and stop for photos, so the journey felt more flexible than waiting for a bus."}
],"原本觉得旅行骑车又热又累 → 小岛错过公交只好租车 → 沿海骑行 → 想停就停、还能拍照 → 虽然累，但发现骑车更自由灵活 → 改变看法",
["changed my opinion","cycling","Japanese island","missed the bus","rented bikes","extremely hot","coast","stop whenever","taking photos","own pace","flexible"]);
set("Q19",[
 {type:"own",text:"The person I would like to describe is a close friend who loves taking photos."},
 {type:"shared",text:"I noticed this most clearly when we travelled to a quiet Japanese island. We rented bikes and followed a road beside the coast, so there were lots of places where she wanted to stop."},
 {...islandRide},
 {type:"own",text:"At the time, I sometimes got impatient because we stopped so often. Later, she sent me a small album from the trip, and I realised that her photos had saved many details I had already forgotten."}
],"爱拍照的朋友 → 日本小岛一起骑车 → 海岸、小路都想停下来拍 → 一路停很多次我有点不耐烦 → 回来她发相册 → 才发现很多细节被她记录下来",
["close friend","taking photos","Japanese island","rented bikes","coast","stop","sea","small roads","impatient","small album","saved many details"]);

// Art business: Q11 + Q50 share Claire's platform.
const artBizCore=[
 {type:"shared",text:"Claire turned her interest in drawing into a small online art business. The platform works with artists and lets customers preview how a painting may look in their room before they buy it."},
 {type:"shared",text:"She started with only a few artists and posted regularly on social media. Over time, more people followed the platform, and it later joined some exhibitions overseas."},
 {type:"shared",text:"I like the AR preview because it solves a simple problem. People can see the artwork in a room before spending money, so choosing a painting feels easier."}
];
set("Q11",[
 {type:"own",text:"A long-term goal I would like to achieve is to build a small online art platform similar to my friend Claire's."},
 ...artBizCore.map(p=>({...p})),
 {type:"own",text:"To do that, I would need to learn more about management, branding and working with artists. I would start small and test the idea before trying to grow it."}
],"长期目标 → 想做类似 Claire 的线上艺术平台 → 艺术家入驻、AR 预览画挂在家里的效果 → 社媒慢慢积累用户 → 我需要学管理、品牌和艺术家合作 → 先小规模测试",
["long-term goal","online art platform","Claire","artists","preview","painting","room","social media","exhibitions overseas","AR preview","management","branding","start small"]);
set("Q50",[
 {type:"own",text:"A person I know who is successful in business is my friend Claire."},
 ...artBizCore.map(p=>({...p})),
 {type:"own",text:"I think she is successful because people do not just follow the account; they actually use the service and buy art through it. The business has a clear idea and a real use for customers."}
],"Claire → 把画画兴趣做成线上艺术生意 → 艺术家入驻 → AR 预览挂画效果 → 社媒慢慢积累用户、参加海外展览 → 用户真的通过平台买画 → 生意有清楚价值",
["Claire","successful in business","online art business","artists","preview","painting","room","social media","exhibitions overseas","AR preview","buy art","clear idea","customers"]);
})();
