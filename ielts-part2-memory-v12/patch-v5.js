(function(){
const P=window.P2_DATA_PARTS||[];
const get=id=>P.find(x=>x.id===id);
const topic=(t,q)=>t.topics.find(x=>x.q===q);
const takeTopic=(t,q)=>{const i=t.topics.findIndex(x=>x.q===q);return i>=0?t.topics.splice(i,1)[0]:null};

// Q04 / Q22: restore Claire's actual helping behaviour from the older version.
{
  const t=get('concert-volunteer');
  t.title='Claire 帮人 + 演唱会志愿者';
  t.memory='韩国演唱会迷路 → Claire 主动带路 → 她在现场做志愿者 → 平时也帮助别人';
  t.shared=[
    "I first learned about this kind of work through my friend Claire. We met at a K-pop concert in Korea. It was my first time there, and I couldn't understand the public transport system. She noticed that I looked confused at a bus station and showed me the way to the venue.",
    "Later I met her again inside the concert and found out that she was a volunteer there. She helped foreign fans who had problems, kept the fan queues in order, helped the staff sell merchandise and guided people to different areas.",
    "She told me that volunteers apply by giving some information, such as how long they have been fans and which languages they can speak. She also does volunteer work in her community and sometimes helps children with sports at weekends."
  ];
  topic(t,'Q04').ending="I would really like to try this job because I could help other fans and experience a concert in a different way.";
  topic(t,'Q22').ending="That is why I think Claire is genuinely helpful. Helping other people is something she does naturally.";
}

// Q39: separate from ticket/hotel logistics and restore the actual smiling moment.
{
  const team=get('concert-team');
  takeTopic(team,'Q39');
  const smile={
    id:'concert-smile', title:'演唱会最后大家都笑了', category:'演唱会',
    memory:'担心组合解散 → 去演唱会 → 回顾过去很感动 → 宣布还会发新专辑 → 大家又哭又笑',
    shared:[
      "My best friend and I have been fans of the same K-pop group for about five years, and we attended their concert last year. Before the concert, we were worried that the group might disband when their contract ended.",
      "During the show, everyone sang along and enjoyed the performances. Later, the group talked about their early years and achievements, which made many fans emotional.",
      "In the end, they announced that they would release another album. When we heard the news, everyone around me smiled, and some fans even cried at the same time."
    ],
    topics:[{
      q:'Q39', zh:'微笑的场合', en:'Describe an occasion when many people were smiling',
      intro:"The occasion when many people were smiling was the end of a concert I attended with my best friend.", middle:'',
      ending:"The main reason everyone was smiling was that we had thought this might be their last concert, but suddenly we knew that the group would continue."
    }],
    note:'恢复旧版的核心事件：重点放在为什么大家笑，不再混入买票和酒店。'
  };
  P.splice(P.indexOf(team)+1,0,smile);
}

// Q40 / Q57: phone rule is the shared event; rain is only for the bad-event question.
{
  const t=get('bad-concert');
  t.title='户外音乐节：禁用手机 / 下雨';
  t.memory='户外音乐节 → 现场禁止拍摄 → 收起手机专心看演出｜Q57 再加突然下雨';
  t.shared=[
    "My best friend and I have known each other for over ten years, and last year we went to an outdoor music festival in Japan because a K-pop group we liked was performing there.",
    "Just before the show, we saw a volunteer lead someone to the exit. Another fan explained that recording was not allowed because of copyright rules. At first I felt disappointed because I wanted to keep a few special moments on my phone, but we respected the rule and put our phones away.",
    "The group performed more than a dozen songs, and the fans around me sang along. Without a screen in my hand, I could focus much more on the music and the stage."
  ];
  topic(t,'Q40').ending="In the end, I understood the rule, and I actually enjoyed watching the performance without checking my phone all the time.";
  topic(t,'Q57').middle="However, it suddenly started pouring before the performance. The grass turned to mud, we had not brought umbrellas, and I was wearing white shoes, so I felt completely hopeless.";
  topic(t,'Q57').ending="The music itself was fine, but the heavy rain made the whole event difficult to enjoy. Next time I will bring an umbrella and wear casual shoes.";
}

// Q02 / Q03 / Q23: Claire is the person who solved the smartwatch problem.
{
  const t=get('watch-problem');
  t.title='Claire 帮我解决智能手表故障';
  t.memory='手表突然关机 → Apple Support 没解决 → 问 Claire → 她换到社交媒体搜 → 更新系统后恢复';
  t.shared=[
    "About a week ago, my smartwatch suddenly shut down when I wanted to check my activity rings. It was only about one year old, so I felt quite annoyed.",
    "I tried to find an answer through Apple Support, but I couldn't solve it. Then I asked my friend Claire if I needed to go to an Apple Store. She first checked an AI tool, but it also told us to visit the store.",
    "Instead of stopping there, Claire searched social media to see if other people had the same problem. She found a comment saying that I should update the system. I tried it, and the watch started working again."
  ];
  topic(t,'Q02').ending="In the end I solved the problem at home, and I was relieved that I did not need to take the watch to the store.";
  topic(t,'Q03').ending="In the end the watch worked normally again, and I did not need to pay for a repair.";
  Object.assign(topic(t,'Q23'),{
    intro:"I'd like to talk about my friend Claire, who solved a problem with my smartwatch in a smart way.",
    middle:'',
    ending:"I thought her idea was smart because she did not just follow the first answer. She tried another way and found a simple solution."
  });
}

// Q55 no longer uses the Apple Watch story.
const q55=takeTopic(get('watch-life'),'Q55');

// Q56 / Q58 / Q59: keep Claire's drawing as the common base, but restore cake and fame-specific evidence.
{
  const t=get('claire-drawing');
  t.title='Claire 的画、蛋糕与线上知名度';
  t.memory='高中好友 Claire → 从小喜欢画画 → Q56 她把画画能力用在蛋糕上｜Q59 后来成为线上知名画家';
  t.shared=[
    "My best friend Claire and I have known each other for over ten years, because we were high school classmates. She has loved drawing since she was very young.",
    "She started drawing when she was five and once won a prize in a competition. Even now she often sketches landscapes or people passing by, and she is good at turning ordinary scenes into something interesting.",
    "She also likes visiting art exhibitions and keeps drawing in her free time."
  ];
  Object.assign(topic(t,'Q56'),{
    middle:"Last year, we booked a restaurant to celebrate our friendship. When I arrived, she was sitting beside a large box. Inside was a beautiful cake that looked almost like a painting. There were mountains on it, a small house beside a lake and a blue sea at the bottom. We took lots of photos before eating it.",
    ending:"Then she told me it was the first cake she had ever made. She had spent a lot of time making it just for me, so that made it even more special."
  });
  Object.assign(topic(t,'Q59'),{
    intro:"I'd like to talk about a well-known online artist called Claire. She was one of my close friends in high school.",
    middle:"A few years ago, she started sharing her work on social media. Her drawings attracted thousands of followers, and she gradually became a popular online artist. She now works with brands and takes part in exhibitions.",
    ending:"We have not seen each other for several years, so I would really like to meet her again and hear how she turned drawing into a real career."
  });
}

// Pottery: personal making remains one template; media/news/video become one separate shared report.
{
  const t=get('pottery');
  const q14=takeTopic(t,'Q14');
  const q51=takeTopic(t,'Q51');
  const q52=takeTopic(t,'Q52');
  t.title='亲手做陶艺：兔子最后变成熊';
  t.memory='朋友带我去陶艺工作室 → 传统陶艺其实可以很现代 → 想做兔子 → 控制不好变成熊 → 顺势完成';
  t.shared=[
    "My friend is a pottery craftsperson and once invited me to her studio. China has a long history of pottery-making, but before that day I used to think pottery was old-fashioned and mostly yellow or brown.",
    "She showed me how to shape the clay and add colours and patterns. I wanted to make a small rabbit, but the machine was hard to control and the shape slowly turned into a bear.",
    "My friend told me not to follow the sketch too closely, so I changed the plan and finished it as a bear. I still keep it in the cabinet near my front door."
  ];
  Object.assign(topic(t,'Q50'),{
    intro:"I'm going to talk about traditional Chinese pottery, which is a product I really like.",
    ending:"What I like about pottery is that it uses a traditional way of making things, but people can still create modern designs with it."
  });
  const media={
    id:'pottery-media', title:'本地陶艺报道 / 视频', category:'故事与媒体',
    memory:'晚上无聊看到本地陶艺报道 → 原以为陶艺老土 → 看到彩色现代作品 → 改变旧印象',
    shared:[
      "One evening, I was bored and found a short local report about a pottery market in my city. It showed young artists selling their handmade ceramic works.",
      "At first, the report talked about the long history of pottery-making in China. I almost lost interest because I used to think pottery was old-fashioned and mostly yellow or brown.",
      "Later, it showed colourful cups, small sculptures and decorations with cute patterns. The artists still shaped the clay by hand, but their designs looked much more modern.",
      "It changed my old impression of pottery. I realised that a traditional craft could still feel fresh and interesting to young people."
    ],
    topics:[q14,q51,q52],
    note:'Q14 / Q51 / Q52 共用同一个“本地陶艺报道”，正文不再跳到个人陶艺体验。'
  };
  Object.assign(q14,{
    intro:"I'd like to talk about a pottery programme I recently saw online. It was a short local report about a pottery market in my city.",
    middle:"I do not watch this kind of programme very often. I found this one by chance, but I watched it until the end because the modern pottery looked interesting.",
    ending:"It changed my view of traditional crafts and made me want to learn more about pottery."
  });
  Object.assign(q51,{
    intro:"An interesting video I watched recently was a short video about a local pottery market.",
    middle:"I saw it on a local video account while I was scrolling because I felt bored, and the colourful ceramic works caught my attention.",
    ending:"I found it interesting because it completely changed my old impression of pottery and made me want to try making one myself."
  });
  Object.assign(q52,{
    intro:"I'd like to talk about a piece of local news I saw online. It was about a pottery market in my city.",
    middle:'',
    ending:"I felt inspired by the news because it showed that a traditional local craft could still attract young people today."
  });
  P.splice(P.indexOf(t)+1,0,media);
}

// Q09: keep K11, but make the home itself visible in the story.
{
  const t=get('k11');
  t.memory='姐姐住在 K11 楼上 → 下楼就是商场 → 去看姐姐时一起喝咖啡逛逛 → 周末人多又吵所以不想住';
  t.shared=[
    "My older sister lives in an apartment above K11 in downtown Guangzhou. The lower floors are a shopping mall, while the upper floors are offices and apartments. Her home is unusual because she can go downstairs and immediately enter the mall.",
    "The mall has art exhibitions, a food court and many clothing and design shops. When I visit my sister, we usually have coffee or walk around the mall together.",
    "However, most of the shops are chain stores and the prices are too high for me, so I usually just go window-shopping. The building is also very crowded and noisy at weekends."
  ];
  Object.assign(topic(t,'Q09'),{
    middle:"That is the main reason I enjoy visiting her home: we can spend time together without making a complicated plan.",
    ending:"However, I would not want to live there every day because I think I would get tired of the crowds and noise."
  });
}

// Q11 / Q16 stay with the island cycling story; Q27 becomes a traffic-jam answer.
{
  const t=get('island-bike');
  const q27=takeTopic(t,'Q27');
  t.memory='去日本小岛 → 公交少又错过车 → 临时改租自行车 → 海边骑行 → 发现意外改变也可以让旅行更好';
  Object.assign(topic(t,'Q11'),{
    intro:"I'd like to talk about a cycling trip I would like to take again with my friend. We went to a quiet Japanese island last year, and I really enjoyed cycling there.",
    ending:"That is why I want to go by bicycle again. A bike lets me enjoy the scenery slowly, and I do not need to worry so much about the bus schedule."
  });
  Object.assign(topic(t,'Q16'),{
    intro:"I'd like to talk about a trip that changed my opinion about what makes a good journey.",
    middle:"I used to think that a good trip needed a clear plan and convenient transport. If something went wrong, I thought the whole trip would become worse.",
    ending:"That experience changed my opinion. I realised that a trip does not always need to follow the original plan. Sometimes an unexpected change can make it even better."
  });
  const traffic={
    id:'island-traffic', title:'日本小岛路上的两小时堵车', category:'旅行',
    memory:'去日本小岛 → 前方发生车祸 → 公交堵了约两小时 → 一直看时间很焦躁 → 最后还是到达',
    shared:[
      "Last year, my friend and I were travelling to a quiet Japanese island that is famous as a filming location for Korean dramas.",
      "On the way there, a serious car accident happened in front of us, and our bus was stuck on the road for about two hours. Almost nothing was moving because we had to wait for the police to deal with the accident.",
      "At first, I thought it would only take a short time, but after an hour we were still in the same place. I kept checking the time and became quite impatient because our travel plan had already been delayed.",
      "When the road finally reopened, we continued the journey. We arrived much later than planned, but luckily the traffic jam did not ruin the whole trip."
    ],
    topics:[q27],
    note:'交通拥堵本身是主线，不再用大部分篇幅讲后面的骑车。'
  };
  Object.assign(q27,{
    intro:"I'd like to talk about a traffic jam I experienced during a trip with my friend last year.",
    middle:'',
    ending:"The traffic jam was really annoying, especially because we could not do anything except wait, but I was relieved when we finally started moving again."
  });
  P.splice(P.indexOf(t)+1,0,traffic);
}

// Q25: explain why the Yellow River is important, not mainly how we travelled there.
{
  const t=get('yellow-river');
  t.memory='和朋友去黄河 → 中国历史和文化的重要部分 → 过去承担交通作用 → 看到宽阔河面和历史雕塑 → 理解它为什么重要';
  t.shared=[
    "I visited the Yellow River with a friend last year. We stayed in a rural village near the river because we wanted a break from our busy lives.",
    "I think the Yellow River is important mainly because it has a long history and is closely connected with Chinese culture. In the past, people used it as a transport route between different places. Today, many places along the river have become tourist attractions where people can learn about local history.",
    "The river was very wide, and the water looked powerful. When we walked beside it, we also saw a large sculpture built to remember a historical hero.",
    "Later, we rented bikes and rode along the river for a while. It was hot, but the view was beautiful and I could feel the wind on my face."
  ];
  topic(t,'Q25').ending="For me, it is not only a beautiful river. It also carries a lot of history, and that is why I think it is important.";
}

// Q54 / Q55: use the penguin/environment story for both; Q55 gets a concrete public-transport law.
{
  const t=get('penguin');
  t.title='帝企鹅与公共交通环保法';
  t.memory='对帝企鹅感兴趣 → 海冰减少威胁幼鸟 → 想进一步了解｜Q55 因此想到鼓励公共交通的法律';
  t.shared=[
    "Emperor penguins caught my attention because they look cute and fluffy, and I recently started reading more about them.",
    "I learned that their habitat is shrinking because global warming is melting the sea ice around Antarctica. Young penguins need stable ice while they grow their waterproof feathers. If the ice disappears too early, they may fall into the water before they are ready.",
    "This made me realise that environmental problems can affect animals very directly."
  ];
  Object.assign(topic(t,'Q54'),{
    middle:"I still know very little about them, so my friend and I are planning to visit a penguin exhibition at a zoo. It explains how they live, what they eat and how they raise their babies.",
    ending:"I would like to see them in person and learn more about how they live and survive in such a difficult environment."
  });
  Object.assign(q55,{
    intro:"I'd like to introduce a law that encourages people to use public transport. People who regularly use buses or the subway could get a small tax benefit.",
    middle:"Cars are not the only cause of global warming, but reducing car use is something ordinary people can do in daily life.",
    ending:"I think the law would be quite popular because people would get something in return for changing a simple habit. If more people used public transport, we could reduce emissions and also help protect animals such as penguins."
  });
  t.topics.push(q55);
}

// Keep the visible count aligned with the actual number of templates after the fixes.
const stats=document.querySelectorAll('.stat b');
if(stats.length>1) stats[1].textContent=String(P.length);
const foot=document.querySelector('.foot');
if(foot) foot.textContent='GitHub 修正版 v5 · 中文记忆链 · 扣题检查后更新';
})();
