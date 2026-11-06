/* 2026 Nov speaking quality pass: topic first, reusable stories second.
   Data-only edits; paragraph source keys remain stable for personal bold ranges. */
(()=>{
 const items=new Map((window.P2_2026Q4_GROUPS||[]).flatMap(g=>(g.topics||[]).map(t=>[t.q,t])));
 const zh=window.P2_2026Q4_ZH_TRANSLATIONS||{};
 const p=(q,i,text)=>{
   const t=items.get(q);
   if(!t?.reviewed?.[i])throw Error('Missing paragraph '+q+':'+i);
   t.reviewed[i].text=text;
 };
 const swap=(q,from,to)=>{
   const t=items.get(q);
   if(!t?.reviewed)throw Error('Missing review '+q);
   let found=false;
   for(const part of t.reviewed)if(part.text.includes(from)){part.text=part.text.replace(from,to);found=true;}
   if(!found)throw Error('Missing text '+q+': '+from);
 };
 // Keep descriptions relevant. Repeating "coffee" or "new ideas" does not add substance.
 p("Q01",1,"I first heard about K11 from a friend who likes art and design. Inside, there are artworks, colourful lights and small design displays. It feels more creative than a normal shopping centre. We sometimes visit a new exhibition together and take photos of interesting details.");
 p("Q01",3,"I enjoy K11 because I can see art in an everyday place. It gives me ideas for my own design work, even when I don't buy anything.");
 // The watch problem is rapid battery drain, not freezing with a full battery.
 p("Q09",0,"I'd like to talk about a problem with my smartwatch. Its battery suddenly started running out very quickly.");
 p("Q09",2,"One week, I noticed that the battery hardly lasted until the evening. I had to charge it much more often than before, even when I was not using it much.");
 p("Q09",3,"At first, I thought the battery might be getting old. I tried charging it fully and turning off some functions, but it still lost power too quickly. I was worried that I might need to pay for a new battery. I wanted to check the simple solutions first.");
 p("Q09",4,"Then I searched online and found people with the same problem. One comment suggested updating the system. I followed the steps and installed the update.");
 p("Q09",5,"After the update, the battery lasted much longer again. I was relieved because I could use the watch throughout the day without charging it twice.");
 // A new skill: finish on what the user learned rather than restating the same action.
 p("Q18",4,"I learnt the basic steps of shaping clay, but I also learnt to be patient when things go wrong. That's why I still remember her lesson.");
 // Emphasise fandom rather than unsupported claims of innovative design.
 p("Q24",3,"The main reason I noticed the advertisement was that I was already a fan of the singer. I first saw it on social media before the Mid-Autumn Festival, and I watched the video more than once. Because I liked her, I wanted to try making the mooncakes myself. I probably wouldn't have paid so much attention to an ordinary mooncake advertisement. It showed me how strongly a celebrity can influence fans.");
 // Listening politely: no dramatic retrospective conclusion.
 p("Q32",3,"I didn't learn much about firing temperatures, but I enjoyed seeing how interested she was in her work. For me, that was enough.");
 // Avoid complex abstract business explanations.
 p("Q50",3,"I like the AR preview because it solves a simple problem. Customers can see a painting on their wall before buying it. That makes choosing one easier. Claire also listens to feedback and fixes things that confuse customers. I think people return to the platform because it is useful and easy to understand.");
 // Natural, easy-to-speak creative story.
 p("Q57",3,"I have watched her work in the studio. She is careful with small details, even when she makes a simple cup. She also chooses the colours and glaze herself. I like the way she tries new shapes without forgetting traditional methods. Her work always feels personal.");
 // Remove repeated phrasing in high-density sentences throughout the set.
 swap("Q23","While I was buying the tickets on a second-hand platform, one seller replied quickly at first and then suddenly stopped answering when we started talking about how to send the ticket.","I was looking for tickets on a second-hand platform. One seller replied quickly at first. But when we discussed how to send the ticket, the seller suddenly stopped answering.");
 swap("Q25","While I was buying the tickets on a second-hand platform, one seller replied quickly at first and then suddenly stopped answering when we started talking about how to send the ticket.","I was looking for tickets on a second-hand platform. One seller replied quickly at first. But when we discussed how to send the ticket, the seller suddenly stopped answering.");
 swap("Q20","I did not need to buy it immediately, so I saved a fixed amount from my salary for a few months and cut down on unnecessary online shopping.","I didn't need it right away. I saved some money from my salary each month and spent less on online shopping.");
 swap("Q31","I know sequels are difficult because they have to keep old characters while introducing new ideas, but this one did not give me the same feeling of surprise.","I know it can be hard to make a sequel. Still, this one didn't surprise me as much as the first film.");
 swap("Q35","For me, Claire's home is lovely to visit because it feels personal and cosy, but I would not live there because it is small and has little storage.","Claire's home feels personal and cosy, so I love visiting her. But I wouldn't want to live there. It's small and doesn't have much storage.");
 swap("Q52","I like this tall building because the offices above the shops make it stand out, and the art exhibitions inside make it more interesting than a normal mall.","The offices above the shops make the building easy to recognise. I also like its art exhibitions. They make it more interesting than an ordinary mall.");
 swap("Q02","I'd like to talk about a short trip I often make to a large forest park with a lake in Guangzhou, although I don't really enjoy it.","I'd like to talk about a short trip to a forest park in Guangzhou. It has a large lake, but I don't always enjoy visiting it.");
 swap("Q03","I don't mind busy places when there is something special to see, but that day the crowds made the whole visit feel more stressful than enjoyable.","I don't mind a busy place if there is something special to see. But that day, the crowds made everything stressful.");
 const q03Sentence="I remember thinking that a short visit had taken much more time than I planned.";
 const q03Replacement="A short visit took much longer than I expected.";
 const q03=items.get("Q03");
 let q03Changed=false;
 for(const part of (q03?.reviewed||[])){
   if(part.text.includes(q03Sentence)){part.text=part.text.replace(q03Sentence,q03Replacement);q03Changed=true;}
 }
 if(!q03Changed)throw Error("Q03 complex sentence was not found");
 swap("Q40","I think the video was worth watching because it showed me that traditional pottery can be colourful and modern.","I liked the video because it changed my opinion of pottery. I used to think it was old-fashioned, but now I find it creative.");

 // A stable Band-6 answer should be easy to say without holding a long
 // subordinate clause in memory. Preserve the story; split the delivery.
 swap("Q01","I don't always buy anything there; sometimes I just look around and take photos of details that give me ideas for my own design work.","I don't always buy anything there. Sometimes I just look around and photograph details for my design work.");
 swap("Q11","I think this goal matters because it combines my interests in art, design and technology, and would let me build something useful for independent artists.","This goal combines my interests in art, design and technology. I hope it can also help independent artists.");
 swap("Q12","She is not expecting the work to be easy, but she likes the idea of using knowledge to make a real difference to someone's life.","She knows the work won't be easy. But she wants to use what she learns to help people.");
 swap("Q16","We normally spend an hour or two there, so it is an easy way to take a break from screens without planning a whole day.","We usually spend an hour or two there. It's an easy way to get away from screens without planning a whole day.");
 swap("Q41","I had only seen the group performing before, so hearing her talk about the difficult period made me understand the members in a different way.","Before that, I had only seen the group perform. Hearing her talk about their difficulties helped me understand them better.");
 swap("Q46","I had planned to work overtime that weekend, but my best friend and I heard our favourite K-pop group might not stay together much longer.","I had planned to work overtime that weekend. But my best friend and I heard our favourite K-pop group might not stay together much longer.");
 swap("Q52","The exhibitions change from time to time, so the building is interesting both as a tall landmark and as a place to spend an afternoon.","The exhibitions change from time to time. The building is both a tall landmark and a nice place to spend an afternoon.");
 // Q20: concrete purchasing decision, shared naturally with Q29.
 swap("Q20","I compared the prices and read a few reviews before deciding, so I did not rush into the purchase.","I compared the prices and read a few reviews. I also tried different models at the store to see which one felt comfortable. That helped me choose without rushing.");
 // Translation overrides are aligned paragraph-by-paragraph with the visible English.
 const z={
 Q01:[
 "我想介绍广州中心的 K11。这是一栋公共建筑，有几层商店、楼上的办公室，还会不定期举办艺术展览。",
 "我最早从喜欢艺术和设计的朋友那里听说 K11。里面有艺术品、彩色灯光和小型设计展陈，比普通商场更有创意。我们有时会一起看展览、拍下有趣的细节。",
 "展览内容经常变化，所以总有新东西可看。交通很方便，广州天气热时还能待在室内。我不一定会买东西，有时只是逛一逛，给自己的设计工作找灵感。",
 "我喜欢 K11，因为在日常生活中也能看到艺术。即使没有购物，我也能获得一些设计灵感。"
 ],
 Q09:[
 "我想说智能手表的一次故障：它的电池突然变得非常不耐用。",
 "我大约一年前买了它来记录运动和睡眠。下班后经常看步数，所以几乎每天都用。",
 "有一周，我发现电量连晚上都撑不到。明明没有怎么使用，却必须比以前更频繁地充电。",
 "起初我以为电池老化了。我尝试充满电、关闭部分功能，但电量还是掉得很快。我担心要花钱换电池，所以想先看看有没有简单的解决办法。",
 "后来我上网搜索，发现其他人也遇到同样的问题。有人建议更新系统，我便按照步骤安装了更新。",
 "更新后，电池又能用很久了。我松了口气，因为不用一天充两次电也能正常使用手表。"
 ],
 Q18:[
 "我想说一位教我陶艺新技能的朋友，她教我用手塑造黏土。",
 "她比我大几岁，有自己的陶艺工作室。有一天她邀请我过去，教我做一个黏土小动物。",
 "她示范怎样保持双手稳定、怎样控制力度。我本来想做兔子，结果越来越像一只熊。",
 "她没有直接替我改好，而是告诉我怎样调整，让我自己再试。成品虽然不完美，但我很开心能独立完成。她还教我留意黏土的软硬程度，耐心地一步步示范，让我不那么紧张。",
 "我学会了基础塑形，也学会了出错时保持耐心。所以我一直记得这次教学。"
 ],
 Q24:[
 "我想介绍一条中秋节广告，主角是我喜欢的 K-pop 组合里的中国成员。",
 "广告推广一套特别的月饼礼盒。她参与了创意设计，包装上有她的名字和个人标志，所以这个产品和她本人联系得很紧密。",
 "视频里她还示范如何制作冰皮月饼。我在家跟着步骤包馅、裹皮，再用模具压出花纹。",
 "真正吸引我的是我本来就是她的粉丝。我在中秋节前的社交媒体上看到广告，还反复看了视频。因为喜欢这位歌手，我也想自己试着做月饼。换成普通月饼广告，我可能不会这么关注。这让我意识到明星对粉丝的影响确实很大。"
 ],
 Q32:[
 "我想说一次听陶艺朋友讲自己并不感兴趣的话题的经历。",
 "我喜欢她做的现代陶艺，但不太懂黏土种类和烧制温度。那些专业词我很难听懂，可她讲得很兴奋，我不想显得不礼貌。",
 "快结束时她给我看了几张现代陶艺的照片。我很喜欢作品本身，却不太喜欢听复杂原理。我知道这些东西对她很重要，所以继续听，也会在她停下来时问些简单问题。即使有点不耐烦，我也尽量保持礼貌。",
 "最后我并没有学会多少烧制知识，但看到她对自己的工作这么感兴趣，我也觉得挺好。这对我来说已经足够了。"
 ],
 Q50:[
 "我想介绍经营线上艺术平台的朋友 Claire。",
 "我们十多年前在学校认识。后来她把画画的兴趣发展成小生意。平台与艺术家合作，让顾客在买画之前预览它挂在家里的效果。",
 "她从与少数艺术家合作开始，经常在社交媒体上发布内容。后来平台的关注者越来越多，也参加了一些海外展览。",
 "我喜欢平台的 AR 预览功能，因为它解决了很实际的问题。顾客买画前能先看看挂在墙上的样子，这让选择更容易。Claire 也会听取反馈，修改让顾客困惑的地方。我觉得用户愿意回来，是因为平台有用而且容易理解。",
 "我认为她的生意成功，是因为同时理解艺术家和顾客的需求。"
 ],
 Q57:[
 "我想说一位很有创造力的陶艺朋友。她经营一个小工作室，擅长手工制作有趣的作品。",
 "我先看到一条本地手工市集的视频，后来参加陶艺工作室的体验课时认识她。她喜欢研究中国陶艺的历史，包括传统的器型和图案。",
 "她不会直接照搬旧设计，而是从中汲取灵感，做出彩色杯子、小雕塑和可爱的角色造型。她用手塑形，再放进窑里烧制。",
 "我看过她在工作室里做陶艺。即使是简单的杯子，她也非常注意小细节。她会自己选择颜色和釉料。我喜欢她尝试新造型，同时又保留传统制作方法，所以作品总有个人特色。",
 "我觉得她有创造力，因为她把传统陶艺和现代想法结合起来。作为设计师，我很欣赏她的做法。"
 ],
 Q40:[
 "我想说一段在社交媒体上看到的本地陶艺市集短视频。",
 "我原来觉得陶艺有点老派，差点滑过去。不过视频只有两三分钟，很容易看完。",
 "它拍了工匠手工塑造黏土的过程，也展示了成品：彩色杯子、小雕塑和可爱的角色造型，而不只是普通的碗。",
 "几位年轻创作者希望更多年轻人关注传统手艺。我喜欢这个想法，因为老工艺也能做出现代有趣的作品。我是在下班后看到这条视频的，很好奇一团黏土怎样变成作品。看完后我甚至想找机会去现场体验。",
 "我喜欢它，因为它改变了我对陶艺的印象。我以前觉得陶艺老派，现在反而觉得它很有创造力。"
 ]
 };
 Object.entries(z).forEach(([q,arr])=>{if(items.get(q).reviewed.length!==arr.length)throw Error('Translation length mismatch '+q);zh[q]=arr.join('\n');});
 window.P2_2026Q4_ZH_PARAGRAPHS=z;
 // For remaining topics, split the existing Chinese summary at sentence boundaries.
 // These older summaries are intentionally shorter than the full spoken answers.
 // Avoid suggesting that a single giant translation paragraph matches the full script.
 function summaryParagraphs(q){
   if(z[q])return z[q];
   const raw=String(zh[q]||'').replace(/\s*（可选延展）/g,' ').trim();
   const sentences=(raw.match(/[^。！？!?；;]+[。！？!?；;]?/g)||[]).map(x=>x.trim()).filter(Boolean);
   if(!sentences.length)return [];
   const wanted=Math.min(items.get(q)?.reviewed?.length||1,sentences.length);
   if(wanted<2)return [raw];
   const result=[],per=Math.ceil(sentences.length/wanted);
   for(let i=0;i<sentences.length;i+=per)result.push(sentences.slice(i,i+per).join(''));
   return result;
 }
 for(const q of items.keys())if(!window.P2_2026Q4_ZH_PARAGRAPHS[q])window.P2_2026Q4_ZH_PARAGRAPHS[q]=summaryParagraphs(q);
 const q03Zh=[
  "我想介绍广州中心的 K11，一家位于市中心的购物中心。",
  "一个周末下午，我和朋友去了那里。扶梯和餐饮区附近非常拥挤。我们只能慢慢走，也很难找到座位。",
  "我们一层层逛，但很多店都是以前见过的连锁店。有些区域也在装修，所以能看的东西比预期少。",
  "我们待了将近两个小时，却几乎什么都没买。最后只买了咖啡就离开了。短短一次逛街却花了比预期更多的时间。连咖啡区都坐满了，我们点单前还要等。人声也让聊天变得困难。我不介意热闹的地方，但那天拥挤让整个体验充满压力。",
  "对我来说，K11 在周末下午太拥挤了，所以我更喜欢工作日早上去。"
 ];
 zh.Q03=q03Zh.join("\n");
 window.P2_2026Q4_ZH_PARAGRAPHS.Q03=q03Zh;
 // Remove any obsolete optional extension from topic data so all consumers agree.
 for(const item of items.values())item.flex={};

 // 2026-11-06 targeted corrections: story ownership, overlap and memorable identity.
 const allGroups=window.P2_2026Q4_GROUPS||[];
 const keep=(q,lines)=>{
   const item=items.get(q);
   if(!item||item.reviewed?.length!==lines.length)throw Error("Paragraph structure changed for "+q);
   item.reviewed=item.reviewed.map((part,i)=>({...part,text:lines[i]}));
 };
 const lakeRide="One weekend morning, my friend and I rented bikes near the entrance and rode along the paths beside the lake. We could stop whenever we wanted to take photos and enjoy the view.";
 const lakeView="There are green hills, tall trees and quiet paths around the water. We could hear birds and feel the cool air under the trees. The lake is my favourite part because the water reflects the trees when the weather is calm.";
 const lakeFeeling="I enjoy this place because I can exercise and enjoy nature without leaving the city. It feels much more relaxing than a busy shopping centre.";
 keep("Q16",[
   "I'd like to talk about a large forest park with a lake in Guangzhou. It is one of my favourite natural places in the city.",
   lakeRide,
   lakeView,
   "I usually go there with a close friend on free weekend mornings, when it is not too hot. She likes taking photos of the lake and little paths. We normally spend an hour or two there, so it doesn't need a whole day.",
   lakeFeeling+" There are also places to sit, so we can enjoy the view when we're tired."
 ]);
 keep("Q47",[
   "I'd like to recommend a large forest park with a lake on the outskirts of Guangzhou. I went there with a friend for a weekend day trip.",
   lakeRide,
   lakeView,
   "There are also places to sit, so people who don't want to cycle can enjoy the view. It's peaceful and different from the busy shopping areas in Guangzhou.",
   lakeFeeling,
   "I would recommend going in the morning when the weather is cooler. Friends and families can take photos, walk around and see a quieter side of Guangzhou."
 ]);
 keep("Q56",[
   "I'd like to talk about the captain of Canada's women's ice hockey team. I first noticed her at a match in Vancouver.",
   "It was Canada against the United States, and it was my first time watching women's ice hockey live. The puck moved so fast that I could hardly follow the game. My friend explained a few basic rules to me.",
   "At first, I watched the puck and tried to understand which team was attacking. Then I noticed one Canadian player who was very active. She kept giving directions to her teammates and tried to organise attacks. Even when the US scored more goals, she stayed focused and encouraged the team.",
   "Canada eventually lost, but the captain still impressed me. I later learned that she had led the national team for years. I don't know much about her life outside hockey. She did not stop supporting her teammates just because the score was against them.",
   "I admire her because she stayed calm under pressure and kept the team working together. For me, that is an important quality in a captain."
 ]);
 const parkGroup=allGroups.find(g=>g.topics.some(t=>t.q==="Q16"));
 const concertGroup=allGroups.find(g=>g.topics.some(t=>t.q==="Q30"));
 if(!parkGroup||!concertGroup||parkGroup===concertGroup)throw Error("Expected separate forest and concert groups");
 const originalGroup=allGroups.find(g=>g.topics.some(t=>t.q==="Q46"));
 if(originalGroup!==concertGroup){
   const moved=originalGroup?.topics.find(t=>t.q==="Q46");
   if(!moved)throw Error("Missing Q46 to move");
   originalGroup.topics=originalGroup.topics.filter(t=>t.q!=="Q46");
   const before=concertGroup.topics.findIndex(t=>t.q==="Q48");
   concertGroup.topics.splice(before<0?concertGroup.topics.length:before,0,moved);
 }
 parkGroup.title="广州湖边森林公园：骑行、摄影、推荐";
 parkGroup.memory="Q02 午后骑行炎热；Q16/Q47 清晨租车沿湖骑行，拍照看湖面倒影、听鸟叫；Q19 Claire 喜欢拍照。";
 if(!/改变想法/.test(concertGroup.title))concertGroup.title+=" / 改变想法";
 items.get("Q16").chain="广州湖边森林公园 → 清晨与朋友租自行车 → 湖边骑行、拍照 → 青山、高树、鸟叫、湖面倒影 → 凉爽放松 → 因为喜欢自然和运动所以常去";
 items.get("Q47").chain="广州郊外森林公园 → 周末与朋友骑车 → 湖边小路、树影倒影、拍照、鸟叫 → 可以骑车或散步 → 推荐清晨去，放松又适合朋友和家人";
 items.get("Q56").chain="温哥华看加拿大对美国女子冰球 → 第一次现场看比赛、冰球速度很快 → 注意到加拿大队长积极指挥队友 → 加拿大队最终落败 → 了解到她担任队长多年 → 欣赏她在压力下仍支持团队";
 items.get("Q56").keywords=["captain of Canada's women's ice hockey team","match in Vancouver","Canada against the United States","first time watching women's ice hockey live","puck moved so fast","giving directions to her teammates","organise attacks","stayed focused","encouraged the team","Canada eventually lost","led the national team for years","life outside hockey","calm under pressure","team working together"];
 const updates={
  Q16:[
   "我想介绍广州的一座大型森林公园，里面有一个湖。它是我在这座城市里最喜欢的自然地点之一。",
   "一个周末早上，我和朋友在入口附近租自行车，沿湖边小路骑行。我们想停下拍照、欣赏风景时就可以停。",
   "周围有绿色山坡、高树和安静的小路。我们能听见鸟叫，在树荫下感到凉爽。我最喜欢湖面，因为天气平静时水里会映出树影。",
   "我通常在不太热的周末早上和好友一起去。她喜欢拍湖面和小路。我们一般待一两个小时，不需要安排一整天。",
   "我喜欢这里，因为不用离开广州就能一边运动、一边亲近自然。比起热闹的商场，这里更让人放松。累的时候也有地方坐下来看看风景。"
  ],
  Q47:[
   "我想推荐广州郊外一座有湖的大型森林公园。我和朋友曾在周末专门去那里玩一天。",
   "一个周末早上，我和朋友在入口附近租自行车，沿湖边小路骑行。我们想停下拍照、欣赏风景时就可以停。",
   "周围有绿色山坡、高树和安静的小路。我们能听见鸟叫，在树荫下感到凉爽。我最喜欢湖面，因为天气平静时水里会映出树影。",
   "附近也有可以坐下休息的地方，不想骑车的人同样可以看风景。这里安静，和平时广州繁忙的商业区很不一样。",
   "我喜欢这里，因为不用离开广州就能一边运动、一边亲近自然。比起热闹的商场，这里更让人放松。",
   "我建议早上天气凉爽时去。朋友和家人可以拍照、散步，看看广州安静自然的一面。"
  ],
  Q56:[
   "我想介绍加拿大女子冰球队的队长。我第一次注意到她，是在温哥华看一场比赛时。",
   "那场比赛是加拿大对美国，也是我第一次现场看女子冰球。冰球移动得太快，我几乎跟不上比赛。朋友给我解释了几条基本规则。",
   "一开始，我主要看着冰球，努力弄清楚哪队在进攻。后来我注意到一位加拿大球员，她非常活跃。她不断给队友指示，努力组织进攻。即使美国队进了更多球，她仍然保持专注，并鼓励队友。",
   "加拿大队最后输了，但这位队长仍然给我留下了深刻印象。后来我了解到，她已经担任国家队队长多年。我不太了解她在冰球以外的生活。即使比分落后，她也没有停止支持队友。",
   "我钦佩她，因为她在压力下仍能保持冷静，让队伍继续合作。对我来说，这是队长很重要的品质。"
  ]
 };
 for(const [q,parts] of Object.entries(updates)){
   if(parts.length!==items.get(q).reviewed.length)throw Error("Translation count mismatch "+q);
   zh[q]=parts.join("\n");
   window.P2_2026Q4_ZH_PARAGRAPHS[q]=parts;
 }
 // Keep one source of truth; the overview already puts Q46 in the concert story.
 window.P2_2026Q4_EDITORIAL_VERSION='2026-11-06-v43';
})();