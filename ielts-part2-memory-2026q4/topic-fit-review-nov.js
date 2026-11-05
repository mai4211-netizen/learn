/* Topic-fit review of all 58 approved Cue Cards, 2026-11-06.
   Only the titles listed below needed edits. Keep the existing paragraph count,
   type, order and per-paragraph bold storage keys, and do not change the Cue Cards.
   This runs after the story reuse pass; Jenny exports the same final answers. */
(() => {
  const groups=window.P2_2026Q4_GROUPS||[];
  const byQ=new Map(groups.flatMap(g=>(g.topics||[]).map(t=>[t.q,t])));
  const zh=window.P2_2026Q4_ZH_TRANSLATIONS||{};
  const moonIntro="One Mid-Autumn Festival when I was little, my mother taught me to make snow-skin mooncakes at home. She wanted us to make something together instead of buying everything from a shop.";
  const moonSteps="First, she showed me how to wrap sweet filling inside soft dough. Then we pressed the dough into a mould to make a pattern on top. It looked easy when she did it.";
  const moonMistake="But I pressed mine too hard, and it came out in a strange shape. My mother laughed and showed me how to press more gently. After a few tries, I finally made one that looked right.";
  const fixes={
    Q01:{edit:{
      1:"I first heard about K11 from a friend who likes art and design. When I visited, I liked the inside most. There were artworks, colourful lights and small design displays, so it felt more creative than a normal shopping centre. We often go there for an exhibition or coffee."
    },zh:"我想说广州中心的 K11，一栋有商店、办公楼和艺术展览的公共建筑。我最早从一位喜欢艺术设计的朋友那里听说它。第一次去时，我很喜欢里面的艺术品、彩色灯光和设计陈列。展品经常变化，交通方便，天气热时也可以待在室内。我有时会和朋友去看展、喝咖啡。它把艺术设计和日常活动结合起来，因此我很喜欢去。"},
    Q05:{p:[
      "I'd like to talk about a skill I learned as a child: making snow-skin mooncakes.",
      moonIntro,moonSteps,moonMistake,
      "I felt proud when we ate the mooncakes together that evening. It was a simple skill, but I still remember the steps and how patient my mother was."
    ],zh:"我小时候学过的技能是做冰皮月饼。有一年中秋节，妈妈在家教我做月饼，因为她希望我们一起动手，而不是什么都在店里买。她先教我把甜馅包进柔软的饼皮，再用模具压出图案。她做得很轻松，我却第一次压得太用力，月饼形状变得奇怪。妈妈笑着教我轻一点。练习几次后，我终于做出了像样的月饼。那天晚上大家一起吃，我很自豪，也一直记得妈妈耐心教我的过程。",chain:"小时候中秋节 → 妈妈教做冰皮月饼 → 包馅、用模具压花 → 我压得太用力 → 练几次成功 → 和家人吃月饼，很自豪"},
    Q07:{edit:{
      3:"During the concert, I could feel the loud music through the floor. When the singers asked everyone to sing along, the whole venue became even louder. My friends and I shouted the lyrics together."
    },zh:"我想介绍香港的一场 K-pop 演唱会，那里非常吵。我和两位好友都喜欢这个组合很多年，演出前在场馆附近吃饭，一直讨论想听的歌曲。灯光暗下后，全场开始尖叫和合唱，我几乎听不见朋友说话。音乐很响，甚至能感觉地板在震动；歌手让大家一起唱时，整个场馆声音更大，我们也跟着大声唱。平时我不喜欢太吵的地方，但那天所有人都因为音乐而兴奋，我反而很享受。"},
    Q09:{p:[
      "I'd like to talk about a time when my smartwatch suddenly stopped working properly.",
      "I bought it about a year ago to track my exercise and sleep. I usually check my steps after work, so I use it almost every day.",
      "One evening, the watch froze and turned off even though the battery was almost full. I could turn it on again, but the same problem kept happening.",
      "I tried charging it and restarting it several times, but the problem did not go away. I was worried that I would have to take it back to the shop.",
      "Then I looked online and found someone with the same problem. A comment suggested updating the system, so I followed the instructions and installed the update.",
      "After that, the watch worked normally again. I felt relieved, and I learned to check for software problems before asking for a repair."
    ],zh:"我想说一次智能手表突然出问题的经历。手表大约一年前买来记录运动和睡眠，我几乎每天都会用。有天晚上它突然卡住并关机，虽然电量还很多。重新开机后同样的问题仍不断出现。我试过充电和重启好几次，都没解决，担心需要拿去维修。后来我上网搜索，看到有其他用户遇到类似问题，评论建议更新系统。我按照步骤安装更新后，手表终于恢复正常。我松了口气，也学会了遇到设备故障先检查软件问题。",chain:"日常使用智能手表 → 晚上卡住自动关机 → 重启、充电都没解决 → 搜到其他用户建议更新 → 更新系统恢复 → 松了口气"},
    Q10:{edit:{
      3:"Some young makers said they wanted more local people to visit the market and discover traditional crafts. The event also gave local artists a chance to sell their work. I liked that idea because their pottery looked modern and fun."
    }},
    Q22:{edit:{
      1:"The main character is Judy, a small rabbit who dreams of becoming a police officer. Other animals do not take her seriously because of her size. She meets Nick, a fox who is also judged unfairly."
    }},
    Q24:{edit:{
      3:"I liked the advertisement because she did more than just show the product. She taught people a simple skill, and the colourful mooncake box made the campaign feel special."
    },zh:"我想介绍一则中秋节广告，主角是我喜欢的 K-pop 组合里的中国成员，我在网上看到了这条视频。广告推广的是一套特别设计的月饼礼盒，上面有她的名字和个人标志。她还在视频里教大家做简单的冰皮月饼。我照着步骤做了，包甜馅、放入模具压图案。我喜欢这条广告，因为她不只是展示产品，还教人做有趣的事情，礼盒设计也很有特色。"},
    Q29:{edit:{
      1:"I went to an Apple Store in Guangzhou about a year ago because I wanted a smartwatch to track my exercise and sleep. I was not sure which model would be best for me.",
      2:"At the store, I tried a few models. A staff member asked what I needed the watch for and showed me the exercise, heart-rate and sleep functions."
    },zh:"我想说大约一年前在广州一家 Apple Store 买智能手表时获得的好服务。我想用手表记录运动和睡眠，但不知道选哪个型号。店员先问我的需要，再让我试戴几个型号，讲解运动、心率和睡眠功能。她还介绍了便宜一些的选择，并没有一直推荐最贵的款式。决定购买后，她帮我设置基础功能。我觉得服务很好，因为她真的听了我的需要，让我可以轻松做决定。"},
    Q31:{edit:{
      0:"I'd like to talk about a movie I didn't enjoy as much as I'd expected: Zootopia 2. I watched it at home one weekend evening after enjoying the first film."
    }},
    Q33:{edit:{
      1:"Claire and I met at school more than ten years ago. I first noticed how organised she was when we had class projects and homework to finish together."
    },zh:"我想介绍做事很有条理的朋友 Claire。我们十多年前在学校认识，一起完成学校项目时我就发现她很会安排事情。她会把任务列成简单清单，把困难作业拆成小步骤；如果同学不懂，她也会耐心解释。现在她仍在电脑上列待办清单，我们一起旅行时也会提前查交通酒店，但愿意根据情况调整计划。我认为她有条理，是因为能省时间、帮助别人，而且她的方法简单，忙时也能坚持。"},
    Q36:{p:[
      "The person I'd like to talk about is my friend Claire, who is very good at learning new languages.",
      "Claire and I met at school more than ten years ago. She speaks English and has also been learning Japanese for several years.",
      "To practise English, she watches Friends and chats with people online. Instead of only memorising words, she tries to use simple expressions in real conversations.",
      "For Japanese, she uses a learning app regularly and keeps a short list of useful phrases on her laptop. She does not mind making mistakes, so she speaks whenever she has a chance.",
      "So I think Claire is good at languages because she uses what she learns and is not afraid of making mistakes."
    ],zh:"我想介绍很擅长学语言的朋友 Claire，我们十多年前在学校认识。她会说英语，也学日语好几年了。练习英语时，她会看《老友记》和在线与人聊天，不只是背单词，而是尽量在真实对话中用简单表达。学习日语时，她经常使用 App，并在电脑上列出一些实用短语。她不害怕犯错，有机会就开口练习。我觉得她学语言很厉害，因为她把学过的东西真正用出来。",chain:"学校认识 Claire → 会英语、学日语 → 看《老友记》与网上聊天练英语 → 日语 App、电脑短语清单 → 不怕犯错，主动开口"},
    Q43:{edit:{
      2:"When we meet, she usually smiles and asks me about my week. She enjoys simple plans like getting coffee or taking a short trip, and she does not get upset when plans change.",
      4:"I think Claire is a happy person because she finds joy in small things and makes other people feel relaxed around her."
    },zh:"我想介绍一位很快乐的朋友 Claire。我们十多年前在学校认识，以前经常课后聊音乐和画画。现在每次见面，她通常都笑着问我这一周过得怎样。她喜欢喝咖啡、短途旅行这类简单活动，计划改变时也不会不开心。工作以外，她还画画、在阳台种番茄。第一次结出番茄时，她兴奋地发照片给我。我觉得她快乐，是因为她会享受生活中的小事情，也让周围的人感到轻松。"},
    Q49:{p:[
      "I'd like to talk about snow-skin mooncakes, a special food my family ate during the Mid-Autumn Festival.",
      moonIntro,moonSteps,moonMistake,
      "Families eat mooncakes at the Mid-Autumn Festival because it is a time to get together. I like these mooncakes because they are soft and a little sweet, and making them with my family made the occasion special."
    ],zh:"我想说中秋节吃的冰皮月饼，这是一种口感柔软、略甜的节日食物。小时候有一年中秋节，妈妈在家教我们做，因为她希望大家一起动手。她先教我把甜馅包入柔软的饼皮，再放入模具压出花纹。我第一次压得太用力，形状变得奇怪，妈妈笑着提醒我轻一点。后来我终于做出了好看的月饼。中秋节吃月饼是因为家人会团聚，一起制作、分享食物，让这个节日更特别。",chain:"中秋节吃冰皮月饼 → 妈妈教包甜馅、用模具压花 → 第一次太用力 → 终于成功 → 家人团聚一起吃"},
    Q50:{edit:{
      1:"Claire and I met at school more than ten years ago. She later turned her interest in drawing into a small online art business. Her platform works with artists and lets customers preview how paintings might look in their rooms before buying them."
    }},
    Q51:{edit:{
      3:"These days, we sometimes meet for coffee and talk about school, drawing and how different our lives are now. We do not meet as often as before, but we can still laugh about old memories."
    },zh:"我想介绍童年好友 Claire。我们十多年前在学校认识，课后常一起画画。她很乐意帮同学做困难的题目；有人不懂时，她会耐心用简单方式解释，所以我一直很喜欢她的善良。现在我们偶尔见面喝咖啡，聊学校、画画和现在的生活。虽然不像以前那样经常见面，但说起老回忆还是会笑，聊天也一直很自然。"},
    Q52:{edit:{
      1:"From outside, K11 looks tall and modern, with glass walls and office floors above the shopping centre. Inside, there are artworks, colourful lights and small design displays, so it feels more creative than a normal mall.",
      2:"I often visit with a friend to see new displays or have coffee. The exhibitions change from time to time, so the building is interesting both as a tall landmark and as a place to spend an afternoon."
    },zh:"我想介绍广州中心的 K11，一栋我喜欢的高层建筑。它下面几层是购物中心，上面有办公楼。从外面看，整栋楼很高、很现代，有玻璃外墙；内部也有艺术品、彩色灯光和设计陈列。我有时和朋友去看展、喝咖啡，展览也会不时更新。我喜欢它，不只是因为建筑高大、在周围很显眼，也因为里面有艺术和日常活动，不像普通商场。"},
    Q53:{edit:{
      0:"I'd like to talk about an illustrated storybook based on Zootopia. I picked it up because I had enjoyed the film and wanted to see the pictures in the book.",
      3:"I think the story is heartwarming because Judy and Nick learn to trust each other. The colourful illustrations also made the book enjoyable to read."
    },zh:"我想介绍一本以《疯狂动物城》为基础的插画故事书。我看过电影，喜欢里面的角色，因此想看看书里的插图。故事讲小兔子 Judy 梦想当警察，却因为体型小受到轻视；她遇见了也常被别人误解的狐狸 Nick。两人合作调查案件，起初不信任对方，后来逐渐学会合作。我喜欢他们用不同的长处解决问题，也喜欢书里色彩丰富的插图。故事既温暖又有趣，让我读完很开心。"},
    Q54:{p:[
      "The person I'd like to talk about is Claire, a friend who has a healthy and manageable daily routine.",
      "Claire and I met at school more than ten years ago. She usually exercises in the morning, but if work gets busy, she moves her workout to the afternoon instead of skipping it.",
      "Before going to bed, she reads a little and makes a short to-do list for the next day. It helps her relax, and she does not have to worry about what to do in the morning.",
      "So I think these habits help Claire stay healthy because they are simple enough to continue even when she is busy at work."
    ],zh:"我想介绍有健康作息的朋友 Claire。我们十多年前在学校认识。她通常早上运动，如果工作忙，就把运动改到下午，而不是直接放弃。睡前她会读一会儿书，再列第二天的简短待办清单，这让她更放松，早上也不会慌乱。我觉得她的习惯很好，因为不复杂、容易坚持，即使工作繁忙也能照顾自己。",chain:"学校认识 Claire → 早晨运动、忙时改下午 → 睡前阅读、列明日简短清单 → 简单、放松、容易长期坚持"},
    Q56:{p:[
      "The athlete I'd like to talk about is Marie-Philip Poulin, the captain of Canada's women's ice hockey team. I first noticed her when I watched a match in Vancouver.",
      "It was Canada against the United States, and it was my first time watching women's ice hockey live. The puck moved so fast that I could hardly follow the game.",
      "Poulin was very active and kept giving directions to her teammates. Even as the US scored more goals, she stayed focused and tried to organise attacks.",
      "Later, I learned that she has won three Olympic gold medals. Outside matches, she supports programmes that help children try sport. I admire that she cares about young players as well as her own career.",
      "I admire Poulin because she stays calm under pressure and encourages her teammates, even when they are losing."
    ],zh:"我想介绍我钦佩的加拿大女子冰球运动员 Marie-Philip Poulin，她是加拿大女队的队长。我第一次在温哥华看加拿大对美国的比赛时注意到她。那是我第一次现场看女子冰球，冰球移动很快，我几乎跟不上。但她一直活跃，提醒队友、组织进攻。后来我了解到，她获得过三枚奥运金牌，比赛以外还支持帮助儿童接触体育的项目。我钦佩她，不只是因为成绩好，还因为她在压力下保持冷静，愿意鼓励队友。",chain:"温哥华看加拿大对美国女冰 → 注意到队长 Poulin → 场上指挥鼓励 → 三枚奥运金牌、支持儿童体育项目 → 佩服她的专注和领导力"},
    Q57:{edit:{
      1:"I met her at a pottery workshop after seeing a short video about a local craft market. She runs a small studio and enjoys learning about Chinese pottery history, including traditional shapes and patterns.",
      3:"I have watched her work in the studio and seen how carefully she makes small details. She can turn a simple piece of clay into a colourful cup or a cute animal, which always impresses me."
    },zh:"我想介绍一位很有创造力的陶艺朋友。我先看了一条本地手工市集的视频，后来参加陶艺工作室体验课时认识她。她经营一间小工作室，也喜欢研究中国传统陶艺的造型和图案，但不会直接照搬。她手工塑形，再放进窑里烧制，做出彩色杯子、小雕塑和可爱的动物造型。我看过她认真制作细节的过程，很佩服她能把简单的黏土变成有趣的作品。我认为她有创造力，是因为能把传统工艺和现代设计结合起来。"}
  };
  let changed=0;
  for(const [q,fix] of Object.entries(fixes)){
    const t=byQ.get(q);
    if(!t?.reviewed?.length)throw Error("Missing final answer "+q);
    if(fix.p){
      if(fix.p.length!==t.reviewed.length)throw Error("Paragraph count changed for "+q);
      fix.p.forEach((s,i)=>{t.reviewed[i].text=s;});
    }
    for(const [k,v] of Object.entries(fix.edit||{})){
      if(!t.reviewed[Number(k)])throw Error("Missing paragraph "+q+":"+k);
      t.reviewed[Number(k)].text=v;
    }
    if(fix.zh)zh[q]=fix.zh;
    if(fix.chain)t.chain=fix.chain;
    changed++;
  }
  if(byQ.size!==58||changed!==20)throw Error("Review expected 58 topics and 20 repairs; found "+byQ.size+"/"+changed);
  window.P2_2026Q4_TOPIC_FIT_REVIEW="2026-11-06";
})();