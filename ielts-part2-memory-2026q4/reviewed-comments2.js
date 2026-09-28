(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const set=(q,paras,chain,keywords)=>{const t=byQ[q];if(!t)return;t.reviewed=paras;t.chain=chain;t.keywords=keywords};

set("Q41",[
 {type:"own",text:"I'd like to talk about an interview with my favourite K-pop group, (G)I-DLE. I watched it on YouTube around their 2022 comeback, after they had been away for quite a long time."},
 {type:"shared",text:"They talked about returning as five members after one member had left the group. Because of that change, they had to adjust how they worked together and prepare the new album in a different way."},
 {type:"shared",text:"One thing I remember is that Soyeon said they prepared the album as if they were debuting again. Yuqi also said being together as a team was very important. I found those comments easy to understand because the group had gone through a difficult period."},
 {type:"own",text:"The interview was memorable to me because I already liked the group, but it showed me what happened behind the comeback. They did not pretend everything had been easy. They talked about the change directly and focused on moving forward."}
],
"我本来就喜欢 (G)I-DLE → 2022 回归时在 YouTube 看采访 → 之前有成员退出、组合隔了很久才再回归 → 她们谈五个人重新适应、像重新出道一样准备新专辑 → 也强调团队要一起走下去 → 我更记得的是她们怎么面对变化再继续往前",
["favourite K-pop group","(G)I-DLE","YouTube","2022 comeback","five members","one member had left","adjust how they worked together","new album","Soyeon","debuting again","Yuqi","team","difficult period","behind the comeback","moving forward"]);

set("Q16",[
 {type:"own",text:"A natural place I really like is a mountain in Nara, Japan. I went there after shopping for most of the day. I was already tired and still carrying a few bags when we started going up the mountain."},
 {type:"shared",text:"We took a taxi most of the way up. But the best place to watch the sunset was higher, so we still had to walk uphill for a while. At first, the climb felt much harder than I expected."},
 {type:"shared",text:"What changed my mood was the scenery. The wide green grass slopes were beautiful, the area was quiet, and we saw a few deer along the way. By the time we reached the higher viewing area, there were even more deer around us."},
 {type:"own",text:"We fed a few of the deer, took photos together and watched a beautiful sunset. I was exhausted, but when I saw the view, I felt the climb was worth it."}
],
"日本奈良的一座山 → 购物一整天后已经很累、还拎着东西 → taxi 先上到较高位置 → 为看日落还要继续往上走 → 草坡和小鹿一路很治愈 → 到高处后喂鹿、合照、看日落 → 虽然累但很值得",
["mountain in Nara","Japan","shopping","tired","carrying a few bags","taxi","sunset","walk uphill","climb","scenery","green grass slopes","deer","higher viewing area","fed","photos","exhausted","worth it"]);
})();
