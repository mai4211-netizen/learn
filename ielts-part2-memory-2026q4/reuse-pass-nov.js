/* Reuse pass: annotated November 5 comments. Apply after approved templates.
   Five-paragraph answers keep paragraph order and existing bold-selection keys.
   The Jenny exporter reads these exact final sentences. */
(() => {
  const groups=window.P2_2026Q4_GROUPS||[];
  const zh=window.P2_2026Q4_ZH_TRANSLATIONS||{};
  const byQ=new Map(groups.flatMap(g=>(g.topics||[]).map(t=>[t.q,t])));
  // Older modules reused the same paragraph objects for different topics.
  // Isolate their final text before this reuse pass to avoid cross-topic edits.
  for(const t of byQ.values())if(Array.isArray(t.reviewed))
    t.reviewed=t.reviewed.map(p=>({...p}));
  const ride="One weekend morning, we rented bikes near the entrance and rode along the paths beside the lake. We could stop whenever we wanted to take photos and enjoy the view.";
  const school="Claire and I met at school more than ten years ago. We used to draw together after class, and she often helped classmates with difficult homework.";
  const schoolHelp="If someone did not understand a question, she explained it in a simple way instead of making them feel bad.";
  const fans="We had been fans of the same K-pop group for years, so the three of us were excited long before the show started.";
  const cafe="After the concert, we met some other fans at a café near the venue. There were about twelve of us, and we shared photos, talked about our favourite songs and laughed a lot.";
  const updates={
    Q15:{
      p:[
        "I'd like to talk about a fan gathering after a K-pop concert in Hong Kong. It was a small party to celebrate the show.",
        "I went there with my two close friends. "+fans,
        cafe,
        "We compared the pictures we had taken and talked about our favourite parts of the concert. Some people had come from other cities, but everyone was friendly and easy to talk to.",
        "The gathering impressed me because we all loved the same music. I am normally quite shy around strangers, but that evening it was easy to make new friends."
      ],
      zh:"我想说一次在香港 K-pop 演唱会后参加的粉丝聚会。这是为了庆祝演出举办的小聚会。我和两位好友一起去，我们喜欢这个组合很多年，所以演唱会开始前就非常兴奋。演出结束后，我们在场馆附近的咖啡馆遇到其他粉丝，大约有十二个人。大家分享照片、聊最喜欢的歌曲和演出片段。有些人从其他城市赶来，但都非常友善。我平时和陌生人说话会害羞，可那晚因为大家都喜欢同一个组合，聊起来特别自然。这是让我难忘的原因。",
      chain:"香港演唱会结束 → 我和两位好友去附近咖啡馆 → 约 12 位粉丝分享照片和歌曲 → 与陌生粉丝自然聊天 → 聚会难忘",
      keywords:["concert","fan gathering","Hong Kong","two close friends","twelve people","café","photos","songs","friendly","memorable"],
      flex:["We also showed each other our concert photos on our phones.","我们还拿手机互相分享演唱会照片。"]
    },
    Q16:{
      p:[
        "I'd like to talk about a large forest park with a lake in Guangzhou. It is one of my favourite natural places in the city.",
        ride,
        "There are green hills, tall trees and quiet paths around the water. We could hear birds and feel the cool air under the trees.",
        "I usually go with a close friend when I have a free weekend, especially in the morning when it is not too hot. She likes taking photos of the lake and the little paths.",
        "I enjoy this place because I can exercise and enjoy nature without leaving the city. It feels much more relaxing than a busy shopping centre."
      ],
      zh:"我想介绍广州一座有湖的森林公园，它是我很喜欢的城市自然地点。一个周末早晨，我和朋友在入口附近租自行车，沿湖边小路骑行。我们可以随时停下拍照、欣赏风景。那里有绿色山坡、高树和安静的小路，还能听见鸟叫，树荫下也很凉爽。我有空的周末会和好友去，尤其喜欢不太热的早晨。她喜欢拍湖水和小路。我喜欢这座公园，因为不用离开广州，也可以一边运动一边亲近自然，比热闹的商场放松得多。",
      chain:"广州有湖的森林公园 → 周末早晨和好友租车 → 湖边小路、青山、高树、鸟叫 → 随时拍照停下 → 凉爽、放松",
      keywords:["forest park","Guangzhou","lake","green hills","trees","weekend morning","rent bikes","birds","photos","relaxing"],
      flex:["We could stop whenever we wanted, so there was no pressure to finish the ride quickly.","想停下来看风景时就停，不用赶着骑完全程。"]
    },
    Q19:{
      p:[
        "The person I'd like to talk about is my friend Claire, who really enjoys taking photos.",
        school,
        ride,
        "She stopped several times to photograph the lake, green hills and little paths. She likes natural light and can make ordinary places look beautiful. She also takes photos of art displays when we visit K11.",
        "After our trip, she sent me a small photo album. I liked it because her pictures helped me notice details that I had missed."
      ],
      zh:"我想介绍很喜欢拍照的朋友 Claire。我们十多年前在学校认识，经常课后一起画画，她也很乐意帮助同学做难题。一个周末早晨，我们去广州一座有湖的森林公园，在入口租自行车沿湖骑行，可以随时停下拍照。她会拍湖水、青山和小路，喜欢自然光，能把普通场景拍得很美。我们去 K11 时，她也会拍艺术陈列。回来后她给我发了一本小相册，让我注意到许多当时没留意的细节。我觉得她很会发现生活里的美。",
      chain:"学校认识 Claire → 喜欢拍照和画画 → 广州湖边森林公园骑行 → 拍湖、树、小路 → K11 拍艺术陈列 → 发小相册",
      keywords:["Claire","school","photos","forest park","lake","rent bikes","natural light","K11","art","photo album"],
      flex:["Her photos often make an ordinary place look more interesting.","她的照片经常能把普通地方拍得更有意思。"]
    },
    Q28:{
      p:[
        "The person I'd like to talk about is Claire, a friendly and popular classmate from school.",
        school,
        schoolHelp+" She was always patient, so other students often came to her for help.",
        "She is also organised. She makes a short to-do list, and when we travel together, she checks transport and hotels but listens to other people's ideas. We still meet for coffee from time to time.",
        "I think she is popular because she is helpful and easy-going. People feel comfortable asking her questions and spending time with her."
      ],
      zh:"我想介绍在学校很受欢迎的朋友 Claire。我们十多年前认识，常在课后一起画画，她很乐意帮助同学做难题。有人听不懂题目时，她会用简单的方法耐心解释，所以很多同学会向她请教。她做事也很有条理，会列简短待办清单。和朋友旅行时会查交通与酒店，但也愿意听取建议。我们现在偶尔仍会约咖啡。我觉得她受欢迎，是因为既乐于帮助别人，又容易相处。",
      chain:"学校认识 Claire → 一起画画 → 帮同学解题、耐心解释 → 列清单、旅行查交通酒店 → 容易相处、受欢迎",
      keywords:["Claire","school","popular","help classmates","homework","patient","to-do list","travel plans","coffee"],
      flex:["Even now, she still makes time to help her friends.","即使现在，她仍然会抽时间帮助朋友。"]
    },
    Q30:{
      p:[
        "I'd like to talk about an enjoyable evening at a K-pop concert in Hong Kong with two close friends.",
        fans+" We had dinner near the venue and talked about the songs we hoped to hear.",
        "When the lights went down, everyone started cheering and singing along. I could hardly hear my friends, but we enjoyed every minute.",
        cafe,
        "We were tired but really happy. That evening was special because I enjoyed the concert with close friends and then met other people who loved the same music."
      ],
      zh:"我想说一个和两位好友在香港看 K-pop 演唱会的愉快夜晚。我们喜欢这个组合很多年，演出开始前就非常兴奋。我们先在场馆附近吃晚饭，聊希望听到的歌曲。开场后灯光暗下来，全场欢呼合唱，我几乎听不到朋友说话。演出结束后，我们又在附近咖啡馆和其他粉丝聚会，大约十二个人分享照片、聊喜欢的歌曲，大家都笑得很开心。虽然那晚很累，但既和好友看了演唱会，又认识了喜欢同一组合的人，所以我非常享受。",
      chain:"两位好友香港看演唱会 → 晚饭、欢呼合唱 → 散场去咖啡馆 → 约 12 位粉丝分享照片和歌曲 → 愉快难忘",
      keywords:["Hong Kong","two close friends","K-pop concert","dinner","singing","café","twelve fans","photos","enjoyable"],
      flex:["We also showed each other our concert photos on our phones.","我们还拿手机互相分享演唱会照片。"]
    },
    Q33:{
      p:[
        "The person I'd like to talk about is Claire, one of the most organised people I know.",
        school,
        "At school, she made a short list of things to finish and broke difficult homework into smaller steps. "+schoolHelp,
        "She still uses a simple to-do list on her laptop. When we plan a trip, she checks transport and hotels, but she can change the plan when needed.",
        "I think being organised helps her save time and support other people. Her plans are simple enough to keep using even when she is busy."
      ],
      zh:"我想介绍很有条理的朋友 Claire。我们十多年前在学校认识，常在课后一起画画，她也经常帮助同学做难题。上学时她会列出简单任务清单，把困难作业拆成小步骤，再向同学解释。现在她仍在电脑上列待办事项。我们一起旅行时，她提前查交通与酒店，但有更好的建议也愿意调整。我觉得她有条理的原因不是把计划排得很死，而是把事情变得简单、容易完成，也能帮助别人。",
      chain:"学校认识 Claire → 帮同学解题 → 难题拆小步骤、列清单 → 现在电脑记待办、查交通酒店 → 计划灵活、有条理",
      keywords:["Claire","school","homework","help classmates","small steps","to-do list","laptop","travel plans","organised"]
    },
    Q41:{
      p:[
        "I'd like to talk about an interview with Soyeon, the leader of (G)I-DLE, that I watched on YouTube.",
        "After going to the group's concert in Hong Kong with two close friends, I wanted to learn more about them. We had been fans for years, and the show made me curious about their story.",
        "At home a few days later, I found an older interview about their 2022 comeback. Soyeon talked about the pressure after a member had left and how the remaining members prepared a new album.",
        "She said it felt almost like starting again. Even when things were difficult, she wanted the team to move forward. I liked how she spoke openly instead of pretending everything was easy.",
        "I respected her more after watching it. The concert showed me the exciting side of the group, while the interview helped me understand the hard work behind it."
      ],
      zh:"我想说一段在 YouTube 看到的 (G)I-DLE 队长 Soyeon 的采访。我和两位好友去香港看了这个组合的演唱会后，想更深入了解她们。几天后我在家找到一段关于 2022 年回归的旧采访。当时有成员离开，Soyeon 讲剩下的成员怎样承受压力、重新准备专辑。她说感觉几乎像重新出道，但仍希望团队继续前进。我喜欢她坦诚谈困难，而不是假装一切轻松。演唱会让我看到舞台精彩的一面，采访则让我理解背后的努力，因此更加欣赏她。",
      chain:"香港与两位好友看 K-pop 演唱会 → 想了解组合故事 → 在家看 Soyeon 的 2022 回归旧采访 → 成员离队、重新出发 → 欣赏她的坦诚与坚持",
      keywords:["Soyeon","(G)I-DLE","concert","Hong Kong","YouTube","2022 comeback","interview","pressure","new album","respect"],
      flex:["It also made the concert feel more meaningful to me.","这也让我觉得那场演唱会更有意义。"]
    },
    Q46:{
      p:[
        "I'd like to talk about a time when I changed my mind about cycling during a short trip.",
        "I used to think cycling was tiring and a waste of time. I usually wanted to take a bus or just walk a little.",
        ride,
        "It was a cool morning, and the trees gave us shade. We did not have to rush, and my friend could stop to take photos whenever she liked. I was surprised by how much I enjoyed it.",
        "Now I think cycling can be a great way to explore a natural place. We can move at our own pace and see things we might miss on a bus."
      ],
      zh:"我想说一次短途旅行中改变对骑车看法的经历。我以前觉得旅行骑自行车很累，也浪费时间，更愿意搭公交或走一小段。后来一个周末早晨，我和好友去广州一座有湖的森林公园，在入口租车沿湖边骑行，可以随时停下拍照、欣赏风景。那天早上很凉爽，树荫也多，我们不用赶时间。朋友想拍照就停下，我意外发现自己很享受这样的节奏。现在我认为骑自行车能让人按自己的节奏探索自然，还能看到坐车容易错过的细节。",
      chain:"原以为旅行骑车累又慢 → 广州湖边森林公园早晨租车 → 树荫、随时停下拍照 → 按自己节奏骑行 → 正面改变看法",
      keywords:["changed my mind","cycling","short trip","forest park","Guangzhou","lake","morning","shade","photos","own pace"],
      flex:["We could stop whenever we wanted, so there was no pressure to finish the ride quickly.","想停下来看风景时就停，不用赶着骑完全程。"]
    },
    Q47:{
      p:[
        "I'd like to recommend a large forest park with a lake on the outskirts of Guangzhou. I travelled there with a friend for a weekend day trip.",
        ride,
        "The park has green hills, tall trees and quiet paths. We stopped beside the lake to take photos and listen to the birds.",
        "I think visitors would enjoy it because it is peaceful and different from the busy shopping areas in Guangzhou. They can rent a bike or just walk around.",
        "I would recommend going in the morning when the weather is cooler. It is an easy way to enjoy nature and see another side of the city."
      ],
      zh:"我会推荐广州郊外一座有湖的森林公园，我和朋友曾在周末专门去那里玩一天。我们早晨在入口附近租了自行车，沿湖边小路骑行，想拍照看风景时就停下。那里有绿色山坡、高树和安静的小路，我们在湖边拍照、听鸟叫。我觉得游客会喜欢这里，因为它和平时繁忙的广州商场很不一样，也可以选择骑车或散步。我建议早上天气凉爽时去，轻松体验广州自然的一面。",
      chain:"周末去广州郊外有湖森林公园 → 早上骑行 → 青山高树、湖边小路、鸟叫 → 拍照停留 → 推荐游客早上去",
      keywords:["recommend","Guangzhou","outskirts","day trip","forest park","lake","rent bikes","trees","birds","visitors","morning"],
      flex:["We could stop whenever we wanted, so there was no pressure to finish the ride quickly.","想停下来看风景时就停，不用赶着骑完全程。"]
    },
    Q51:{
      p:[
        "The person I'd like to talk about is my childhood friend Claire.",
        school,
        "She was always patient when our classmates needed help. "+schoolHelp,
        "We still meet for coffee or plan short trips together. She checks transport and hotels and makes a simple plan, but she is happy to change it if someone has a better idea.",
        "Even though we do not meet as often now, we still talk naturally. I like her because she is kind, easy-going and has always been a good friend."
      ],
      zh:"我想介绍童年好友 Claire。我们十多年前在学校认识，课后经常一起画画。她很乐意帮同学解决难题，如果别人不理解，她会耐心用简单方式解释。现在我们仍偶尔见面喝咖啡或一起计划短途旅行。她会查交通酒店、列简单行程，别人有更好的建议也愿意改。尽管现在没有以前见得频繁，我们聊天还是很自然。我一直喜欢她善良、随和又愿意帮助别人的性格。",
      chain:"学校认识 Claire → 一起画画、帮同学解题 → 现在偶尔喝咖啡、规划旅行 → 性格随和 → 友情一直自然",
      keywords:["childhood friend","Claire","school","drawing","help classmates","homework","coffee","trips","easy-going","friendship"]
    }
  };
  function apply(q,change){
    const t=byQ.get(q);
    if(!t||!Array.isArray(t.reviewed))throw Error("Missing approved P2 paragraphs: "+q);
    if(change.p){
      const paragraphs=[...change.p];
      // Several previously approved answers use four paragraphs, not five.
      // Merge story setup into the next paragraph rather than changing the
      // paragraph count or the student's saved bold-selection keys.
      while(paragraphs.length>t.reviewed.length && paragraphs.length>2){
        paragraphs[1]+=" "+paragraphs[2];
        paragraphs.splice(2,1);
      }
      while(paragraphs.length<t.reviewed.length){
        const i=paragraphs.findIndex((text,k)=>k>0&&k<paragraphs.length-1&&text.includes(". "));
        if(i<0)throw Error("Cannot preserve paragraph count for "+q);
        const at=paragraphs[i].indexOf(". ")+1;
        paragraphs.splice(i,1,paragraphs[i].slice(0,at),paragraphs[i].slice(at).trim());
      }
      paragraphs.forEach((text,i)=>{t.reviewed[i].text=text;});
    }
    if(change.zh)zh[q]=change.zh;
    if(change.chain)t.chain=change.chain;
    if(change.keywords)t.keywords=change.keywords;
    if(change.flex)t.flex={...t.flex,text:change.flex[0],zh:change.flex[1]};
    if(change.fit)t.fit=change.fit;
  }
  Object.entries(updates).forEach(([q,c])=>apply(q,c));
  const q02=byQ.get("Q02");
  q02.reviewed[0].text="I'd like to talk about a short trip to a large forest park with a lake in Guangzhou that I often take but don't really enjoy.";
  q02.chain="广州有湖的森林公园 → 炎热午后沿湖骑车 → 累、出汗 → 虽然风景好，仍觉得太辛苦 → 为了陪朋友会再去";
  q02.keywords=["forest park","Guangzhou","lake","afternoon","heat","rent bikes","cycling","tired","sweaty","friend"];
  q02.fit="同一公园；本题重点是炎热午后骑行不愉快，Q16/Q46 则是凉爽早晨骑行的积极感受。";
  const q17=byQ.get("Q17");
  q17.reviewed[1].text="After work, my smartwatch often shows that I have hardly moved all day. I plan to go for a walk, but I pick up my phone first to relax. I check K-pop updates and short videos about art and design.";
  q17.chain="下班后手表提示活动少 → 本来准备散步 → 先看 K-pop 和设计视频 → 偶尔刷到陶艺市集内容（Q10/Q40） → 反复刷近两小时 → 错过运动与英语练习";
  q17.keywords=["after work","smartwatch","planned to walk","social media","K-pop","pottery market","two hours","exercise","English"];
  zh.Q17="我经常浪费时间的一件事是刷社交媒体。下班后手表会显示我今天活动得太少，本来计划出去散步，却先拿起手机想放松一下。我会看 K-pop 更新和艺术设计短视频。有时也会刷到有用的内容，比如介绍现代陶艺市集的视频，里面有彩色杯子、小雕塑和可爱的作品，让我改变了对陶艺的看法。但更多时候，我会反复刷相似的视频，一不注意就过去将近两个小时。我本来可以用那段时间运动或练英语，所以觉得不停刷手机很浪费时间。";
  const q36=byQ.get("Q36");
  q36.reviewed[1].text=school+" She learns English and Japanese and enjoys practising with other people.";
  q36.chain="学校认识 Claire → 以前一起画画、帮助同学 → 现在学英语与日语 → 看 Friends、在线聊天、日语 App → 用清单规划练习";
  const q54=byQ.get("Q54");
  q54.reviewed[1].text=school+" These days she also tries to keep a healthy daily routine.";
  q54.chain="学校认识 Claire → 以前一起画画、帮助同学 → 早晨运动、工作忙改下午 → 睡前阅读、列明日待办 → 作息容易坚持";
  for(const q of ["Q36","Q54"]){
    zh[q]=(q==="Q36"
      ? "我想介绍擅长学语言的朋友 Claire。我们十多年前在学校认识，课后经常画画，她也乐于帮助同学解决难题。她现在学英语和日语，喜欢通过真实交流练习。比如，看《老友记》和在线聊天来练英语，日语则定期使用 App。她还会在电脑上列简短清单，知道下一步学什么。我欣赏她敢开口、不怕犯错的态度。"
      : "我想介绍有健康作息的好友 Claire。我们十多年前在学校认识，以前常画画，她也会帮同学解决难题。现在她通常早晨运动，工作忙时改到下午，不会完全放弃。睡前会读一会儿书，再列第二天的简单任务清单，这让她早上更有条理。我觉得这些习惯不复杂，所以她可以长期坚持。");
  }
  function move(q,id){
    const to=groups.find(g=>g.id===id);
    const from=groups.find(g=>g.topics.some(t=>t.q===q));
    if(!to||!from)throw Error("Missing group for "+q);
    if(from===to)return;
    const at=from.topics.findIndex(t=>t.q===q);
    to.topics.push(from.topics.splice(at,1)[0]);
  }
  for(const q of ["Q02","Q19","Q46","Q47"])move(q,"wakakusa");
  move("Q15","concert-main");
  move("Q17","pottery-media");
  for(let i=groups.length-1;i>=0;i--)if(!groups[i].topics.length)groups.splice(i,1);
  for(const g of groups)g.topics.sort((a,b)=>a.q.localeCompare(b.q));
  const setMeta=(id,title,memory,story)=>{const g=groups.find(x=>x.id===id);if(g){g.title=title;g.memory=memory;if(story)g.story=story;}};
  setMeta("wakakusa","广州湖边森林公园：骑行、摄影、改变看法、推荐","有湖的森林公园 → Q02 午后骑行炎热难受 / Q16 早晨自然放松 → Q19 Claire 拍湖与 K11 / Q46 骑车看法变好 / Q47 推荐游客早晨来","F · 湖边森林公园");
  setMeta("concert-main","香港演唱会与粉丝聚会","三位好友去香港看 K-pop 演唱会 → 晚饭、合唱 → 散场后约 12 人粉丝聚会 → 分享照片与歌曲 → Q15 聚会 / Q30 愉快夜晚","G · 演唱会 / 粉丝聚会");
  setMeta("mooncake-family","中秋冰皮月饼：童年技能与节日食物","小时候中秋妈妈教做冰皮月饼 → 包馅、压花纹 → 全家分享（Q05/Q49）","H · 冰皮月饼");
  setMeta("pottery-media","陶艺市集短视频与刷社交媒体","Q10/Q40 本地陶艺市集短视频 → 彩色杯子、小雕塑 → Q17 下班本来想散步却刷视频近两小时","M · 陶艺 / 社交媒体");
  setMeta("k11","广州 K11：建筑、拥挤与无聊","工作日艺术陈列值得看；周末人多、连锁店重复，逛很久不买东西","E · K11 商场");
  setMeta("claire-person","Claire：学校好友、乐于助人、做事有条理","学校认识 Claire → 课后画画、耐心帮同学解题 → 做事列清单 → 学语言、安排旅行 → Q28 受欢迎 / Q33 有条理 / Q51 发小","B · Claire 学校好友");
  setMeta("concert-interview","看完演唱会再了解 Soyeon 的采访","香港演唱会 → 想深入了解组合 → 看 2022 回归采访 → 队长谈压力、重新出发 → 更佩服她");

  // Topic-fit check across all 58 Cue Cards: omit irrelevant optional padding.
  for(const q of ["Q04","Q16","Q20","Q21","Q24","Q46","Q47","Q51","Q52"])delete byQ.get(q).flex;
  byQ.get("Q17").flex={
    text:"I often tell myself I'll stop after one more video, but then another one appears.",
    zh:"我常告诉自己再看一个视频就停，但总是又刷到下一个。",
    category:"经历"
  };
  // Sharing a school acquaintance does not make homework relevant to photography,
  // language learning, or a healthy daily routine.
  const basicSchool="Claire and I met at school more than ten years ago. We used to draw together after class.";
  const metOnly="Claire and I met at school more than ten years ago, and we have stayed friends ever since.";
  const photoTopic=byQ.get("Q19");
  photoTopic.reviewed[1].text=photoTopic.reviewed[1].text.replace(
    "Claire and I met at school more than ten years ago. We used to draw together after class, and she often helped classmates with difficult homework.",
    basicSchool
  );
  photoTopic.chain="学校认识 Claire、课后画画 → 喜欢摄影 → 广州湖边森林公园骑行拍照 → K11 拍艺术陈列 → 发照片相册";
  zh.Q19="我想介绍很喜欢拍照的朋友 Claire。我们十多年前在学校认识，常在课后一起画画。一个周末早晨，我们去广州一座有湖的森林公园，在入口租自行车沿湖骑行，可以随时停下拍照。她会拍湖水、青山和小路，喜欢自然光，能把普通场景拍得很美。我们去 K11 时，她也会拍艺术陈列。回来后她给我发了一本小相册，让我注意到许多当时没留意的细节。我觉得她很会发现生活里的美。";
  const languageTopic=byQ.get("Q36");
  languageTopic.reviewed[1].text=metOnly+" She learns English and Japanese and enjoys practising with other people.";
  languageTopic.chain="学校认识 Claire → 现在学英语日语 → 看 Friends、在线聊天、日语 App → 列清单、开口练习";
  zh.Q36="我想介绍擅长学语言的朋友 Claire。我们十多年前在学校认识，至今仍是朋友。她现在学英语和日语，喜欢通过真实交流练习。比如，看《老友记》和在线聊天来练英语，日语则定期使用 App。她还会在电脑上列简短清单，知道下一步学什么。我欣赏她敢开口、不怕犯错的态度。";
  const routineTopic=byQ.get("Q54");
  routineTopic.reviewed[1].text=metOnly+" These days she also tries to keep a healthy daily routine.";
  routineTopic.chain="学校认识 Claire → 现在早上运动、工作忙改下午 → 睡前阅读、列明天待办 → 作息容易坚持";
  zh.Q54="我想介绍有健康作息的好友 Claire。我们十多年前在学校认识，至今仍是朋友。现在她通常早晨运动，工作忙时改到下午，不会完全放弃。睡前会读一会儿书，再列第二天的简单任务清单，这让她早上更有条理。我觉得这些习惯不复杂，所以她可以长期坚持。";
  // Tall-building answer: focus on the building rather than only its shops.
  const tallTopic=byQ.get("Q52");
  tallTopic.reviewed[0].text="I'd like to talk about K11, a tall building in downtown Guangzhou. It has several floors of shops, offices above them and art exhibitions from time to time.";
  tallTopic.reviewed[tallTopic.reviewed.length-1].text="I like this tall building because the offices above the shops make it stand out, and the art exhibitions inside make it more interesting than a normal mall.";
  tallTopic.chain="广州 K11 高楼 → 下层商场、上层办公室 → 艺术展示 → 与普通商场不同 → 喜欢其设计";
  zh.Q52="我想介绍广州中心城区的 K11。这是一栋高楼，下方有几层商店，上方是办公室，也不定期举办艺术展。我最喜欢室内设计，里面有艺术品、彩色灯光和小型设计展示，感觉比普通商场更有创意。我常和朋友去看新展或喝咖啡。展示经常换新，所以总能发现不一样的东西。搭公共交通去也方便，广州天气热的时候还能待在室内。有空我会先逛展区再喝咖啡。我喜欢这栋高楼，因为上面是办公室、下面是商场，与普通商场不同，里面还有很有意思的艺术展示。";

  window.P2_2026Q4_REUSE_PASS="2026-11-05-wave2";
})();