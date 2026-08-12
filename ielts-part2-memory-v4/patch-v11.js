(function(){
const P=window.P2_DATA_PARTS||[];
const get=id=>P.find(x=>x.id===id);
const topic=(t,q)=>t&&t.topics.find(x=>x.q===q);
const take=(id,q)=>{const t=get(id);if(!t)return null;const i=t.topics.findIndex(x=>x.q===q);return i<0?null:t.topics.splice(i,1)[0]};
const add=(template)=>P.push(template);
const resetTopic=(q,changes={})=>Object.assign(q,{middle:'',ending:'',omitSharedIndexes:[]},changes);

// Q02 / Q03 return to the original self-solved smartwatch story. Q23 keeps the
// Claire branch because that question specifically asks for a smart person.
{
  const t=get('watch-problem');
  const q23=take('watch-problem','Q23');
  t.title='智能手表突然关机：自己查到解决方法';
  t.memory='手表突然关机 → Apple Support 找不到答案 → 社交媒体查同类问题 → 更新系统后恢复';
  t.shared=[
    "I bought the watch mainly to track my sleep because I wasn't sleeping well. I also use it to check my heart rate, steps and fitness progress.",
    "About a week ago, I wanted to check my activity rings, but the watch had already shut down. It was only about a year old, so I felt annoyed. The problem was challenging because I could not get help easily.",
    "At first, I tried Apple Support, but I could not find the right support option. Visiting an Apple Store might mean taking a day off, so I searched social media first. I found a post from someone with the same problem, and one comment suggested updating the system. I tried it, and it worked.",
    "It turned out that a recent update had caused the battery problem. I did not need to visit the store, and the online advice saved me a lot of time."
  ];
  resetTopic(topic(t,'Q02'),{intro:"I'd like to talk about a challenging problem I had with my smartwatch."});
  resetTopic(topic(t,'Q03'),{intro:"I'd like to talk about a problem I had while using my smartwatch."});
  add({
    id:'smart-claire-v11',title:'Claire 机智解决智能手表故障',category:'智能手表',
    memory:'手表突然关机 → AI 只建议去门店 → Claire 改搜社交媒体 → 更新系统后恢复',
    shared:[
      "I had bought the watch mainly to track my sleep and fitness progress. About a week ago, it suddenly shut down when I wanted to check my activity rings. It was only about a year old, so I felt annoyed.",
      "I tried Apple Support but could not find the right page. I asked Claire whether I should go to an Apple Store. She first checked an AI tool, but it also suggested visiting the store.",
      "Instead of giving up, Claire searched social media. She found a post about the same problem, and one comment suggested updating the system. I followed the advice, and the watch started working again.",
      "It turned out that a recent update had caused the battery problem. I thought Claire's idea was clever because she tried another source and found a simple solution."
    ],topics:[resetTopic(q23,{intro:"I'd like to talk about my friend Claire and how she solved a problem with my smartwatch in a smart way."})],
    note:'与 Q02/Q03 同一故障背景，但此题的主角必须是 Claire。'
  });
}

// Q04 and Q22 stay in one tab but use their original, different timelines.
{
  const t=get('concert-volunteer');
  const q4=take('concert-volunteer','Q04');
  t.title='Claire 在演唱会和社区帮助别人';
  t.memory='韩国车站看不懂交通 → Claire 主动帮忙 → 场馆里帮助外国粉丝 → 社区继续做志愿者';
  t.shared=[
    "Claire is willing to help others even when she has never met them before. One time, I went to a K-pop concert in Korea. It was my first time there, and I could not understand the public transport system. Claire noticed that I looked confused at a bus station and asked if I needed help. She recognized the decoration of the group on my bag and showed me the way to the venue.",
    "At the concert, she worked as a volunteer and helped foreign fans who had problems. She also volunteers in her community and helps children with sports at weekends.",
    "She once told me that helping other people gives her a sense of peace. That is why I think she is one of the most helpful people I know."
  ];
  resetTopic(topic(t,'Q22'),{intro:"I'd like to talk about my friend Claire, who is one of the most helpful people I know."});
  add({
    id:'concert-job-v11',title:'想申请韩国演唱会短期志愿工作',category:'演唱会',
    memory:'想看韩国演唱会 → 看到志愿者机会 → 准备申请资料 → 帮助现场粉丝 → 期待获选',
    shared:[
      "My best friend and I have been fans of a K-pop group for five years, and we both want to see their latest concert in Korea. Recently, the fan club announced a chance to volunteer at the concert.",
      "We really want the opportunity because we could see the show for free and might even see the group backstage. To apply, we need to give information such as how long we have been fans, where we come from and which languages we can speak.",
      "The volunteers will keep the fan queues in order, help the staff sell merchandise and guide fans to different areas when the concert starts.",
      "I think the work would be great fun. I am keen to get the chance, and I also hope to take a short trip while I am in Korea."
    ],topics:[resetTopic(q4,{intro:"The short-term job I would like to do abroad is concert volunteering in Korea."})]
  });
}

// Q05, Q07 and Q44 share one concert-trip tab, but each returns to its own
// original main line.
{
  const q5=take('concert-team','Q05');
  const q7=take('concert-team','Q07');
  const t=get('concert-team');
  t.title='三人演唱会旅行分工';
  t.memory='三人去香港 → 分工订酒店和找票 → 补买第三张票 → 酒店取消启用备案 → 更信任团队';
  t.shared=[
    "My best friend, her younger sister and I decided to go to a K-pop concert in Hong Kong last month. We divided the tasks based on what we were good at. My friend booked the hotel and transport, while I searched for tickets on second-hand platforms.",
    "At first, I could only find two tickets. I kept refreshing the page and messaging new sellers until I finally managed to buy the last one.",
    "On the day of the trip, the hotel suddenly cancelled our booking. Luckily, my friend had a backup plan and quickly found another hotel, although it was a little far from the venue.",
    "There were too many things for one person to handle alone, so dividing the tasks made everything easier. We still had a great time, and the experience made me trust our teamwork even more."
  ];
  resetTopic(topic(t,'Q44'),{intro:"I'd like to talk about a concert trip I planned with my best friend and her younger sister."});
  add({
    id:'ticket-reply-v11',title:'买演唱会票时久等卖家回复',category:'演唱会',
    memory:'二手平台找票 → 卖家久不回复 → 临时要求加价 → 换另一个卖家 → 最终看到演出',
    shared:[
      "My best friend and I decided to go to a K-pop concert in Hong Kong last month. We were late buying the tickets, so I tried to find a reliable seller on a second-hand platform.",
      "I chose two sellers and asked them for more information. The first one had many comments from buyers and replied quickly, so I was close to paying. However, when we discussed how to send the tickets, he stopped replying.",
      "I became angry because I thought his behaviour was impolite. An hour later, he finally replied and said that someone else had offered a higher price. I was speechless, so I turned to the other seller.",
      "In the end, we managed to attend the concert and had a great time. I hope I never meet that kind of seller again."
    ],topics:[resetTopic(q5,{intro:"I'd like to talk about a time when I sent a message to a ticket seller but received no reply for a long time."})]
  });
  add({
    id:'happy-event-v11',title:'组织朋友一起开心看演唱会',category:'演唱会',
    memory:'邀请朋友看演出 → 建群确认时间并订行程 → 现场一起合唱 → 朋友成为新粉丝 → 最开心的活动',
    shared:[
      "My best friend and I had been fans of a K-pop group for five years. Last year, we invited a few other friends to attend the group's concert with us. It was their first time seeing the group in person.",
      "We created a group chat, made sure everyone was available and booked the flights and hotel in advance. We got up early on the day and arrived at the concert smoothly.",
      "When the show started, everyone sang along. Later, the group talked about their past and achievements, which moved our friends. At the end, they played a fan song, and we all smiled.",
      "My best friend and I were very happy that our friends became new fans of our favourite group. It was one of the happiest events we had organized together."
    ],topics:[resetTopic(q7,{intro:"I'd like to talk about a happy concert trip that my best friend and I organized successfully."})]
  });
}

// Q06 / Q42 share the original changed-plan story. Q43 keeps its own early-
// morning main line in the same tab.
{
  const t=get('concert-change');
  const q43=take('concert-change','Q43');
  t.title='周末加班计划改成去演唱会';
  t.memory='原计划周末加班 → 听说可能是最后一场 → 请假改去香港 → 火车没票改巴士 → 开场时赶到';
  t.shared=[
    "My best friend and I now work at the same company. We were extremely busy because of a sales festival and had planned to work overtime at the weekend to finish an important proposal.",
    "Then we heard that the K-pop group we loved might disband soon and that the concert could be their last show. We were afraid of missing the chance, so we changed our minds and asked our boss for a day off.",
    "At first, we planned to go to Hong Kong by high-speed rail. We decided too late, so we had to take a bus instead. We arrived just as the show began and could hardly find our seats in the dark, but fortunately we still caught it in time.",
    "At the end, the group said, 'See you next year.' I was grateful that we had changed the plan and attended the concert."
  ];
  resetTopic(topic(t,'Q06'),{intro:"An important decision I made was to attend a concert instead of working overtime that weekend."});
  resetTopic(topic(t,'Q42'),{intro:"A plan I had to change recently was working overtime with my best friend at the weekend."});
  add({
    id:'early-concert-v11',title:'凌晨三点起床去香港看演出',category:'演唱会',
    memory:'为看演唱会凌晨三点起床 → 四点去机场 → 困到睁不开眼 → 到香港直奔现场 → 为偶像值得',
    shared:[
      "My best friend and I had been fans of a K-pop group for five years, and we attended their concert in Hong Kong last weekend.",
      "To catch a cheap flight, we had to get up at three in the morning, pack our luggage in a hurry and leave for the airport at four. I am a night owl, so I could hardly open my eyes and felt sleepy on the way.",
      "At the same time, I felt excited because I knew I was going to see my favourite group. After arriving in Hong Kong, we went straight to the concert. The show was perfect, and we had a great time.",
      "Although getting up so early was difficult, we arrived on time. For my favourite K-pop group, it was totally worth it."
    ],topics:[resetTopic(q43,{intro:"I'd like to talk about a time when I got up much earlier than usual for a concert trip."})]
  });
}

// Pottery: Q08 keeps the imagination story; Q50 uses its original traditional-
// product experience instead of borrowing the rabbit-to-bear ending.
{
  const t=get('pottery');const q50=take('pottery','Q50');
  t.title='做陶艺时把兔子改成熊';
  t.memory='想做陶瓷兔子 → 机器难控制 → 造型变成熊 → 加上棕色完成 → 提醒自己发挥想象';
  t.shared=[
    "It was my first time seeing pottery-making up close. I used to think pottery was always yellow and old-fashioned, but I was surprised by its modern look, colours and shapes.",
    "I wanted to make a rabbit, so I drew a sketch first. Shaping the clay was difficult, and I could not control the machine well. The round shape slowly began to look more like a bear.",
    "My friend told me not to follow the sketch too closely and encouraged me to use my imagination. I added brown to its face and made a lovely bear instead.",
    "I still keep it near my front door. It reminds me to be creative and try the things I like."
  ];
  resetTopic(topic(t,'Q08'),{intro:"I'd like to talk about a ceramic piece I made at my friend's studio when I needed to use my imagination."});
  add({
    id:'traditional-pottery-v11',title:'传统陶艺与我的第一件陶瓷作品',category:'故事与媒体',
    memory:'中国传统陶艺 → 去朋友工作室 → 现代彩色造型改变印象 → 朋友逐步指导完成 → 保留作品',
    shared:[
      "China has had skilful pottery-making techniques for thousands of years. My friend is a pottery craftsperson, and she once invited me to her studio. That was the first time I had seen pottery-making up close.",
      "I was fascinated by the pottery's texture and modern look. It was different from the yellow pottery I had imagined. Modern pottery can have many colours and can be shaped into small sculptures as well as containers.",
      "For my first attempt, I wanted to make a ceramic piece featuring my favourite cartoon character. Controlling the machine was difficult, but my friend taught me step by step, and I finally completed it.",
      "I felt a strong sense of achievement and still keep the piece near my front door. I like pottery because it keeps a traditional way of making things while allowing modern designs."
    ],topics:[resetTopic(q50,{intro:"I'm going to talk about traditional Chinese pottery, which is a product made in my country that I really like."})]
  });
}

// K11: same tab, but home, cheap/boring outing and tall-building questions use
// their own original viewpoints.
{
  const t=get('k11');const q9=take('k11','Q09');const q26=take('k11','Q26');const q34=take('k11','Q34');
  t.title='喜欢的高建筑 K11';
  t.memory='市中心高楼 → 商场、办公与艺术展 → 喝咖啡逛设计店 → 大多只橱窗购物 → 比普通商场有趣';
  t.shared=[
    "K11 is a tall shopping mall in downtown Guangzhou and one of my favourite buildings. It has eight floors of shops, while the upper floors are used as offices. It also holds art exhibitions from time to time.",
    "There is an underground food court where I usually buy coffee, and I enjoy looking around the clothing and design shops. I like being able to see exhibitions and shop in the same place.",
    "Most things are expensive, so I usually go window-shopping. However, there is an independent design shop that is hard to find but worth visiting.",
    "For me, K11 is more interesting than an ordinary mall, so I look forward to visiting it again."
  ];
  resetTopic(topic(t,'Q33'),{intro:"I'd like to talk about K11, a tall building in Guangzhou that I like. It combines shopping, offices and art in one place."});
  add({
    id:'sister-home-v11',title:'姐姐住在商场楼上的家',category:'旅行',
    memory:'姐姐住商场楼上 → 楼下逛店看展 → 拜访时很方便 → 环境人多吵闹 → 仍想回自己家',
    shared:[
      "My older sister's home is in a tall building above a large shopping mall. The building includes six levels of shops, while the other floors contain apartments, including hers.",
      "The mall is famous for art exhibitions and regularly works with different brands. It has colourful artworks, an underground food court and many clothing shops. That is why I enjoy visiting my sister: we can have coffee and walk around downstairs.",
      "However, the building is very crowded and noisy. If I lived there, I would face crowds whenever I went outside and might also meet heavy traffic in the morning.",
      "I look forward to visiting my sister again, but afterwards I still want to return to my quieter home."
    ],topics:[resetTopic(q9,{intro:"I'd like to talk about my older sister's home, which I enjoy visiting but would not want to live in."})]
  });
  add({
    id:'k11-boring-v11',title:'K11：花钱少但很无聊的一天',category:'旅行',
    memory:'和朋友去 K11 打发时间 → 连锁店多又贵 → 商场装修人又多 → 只买咖啡 → 更想逛独立设计店',
    shared:[
      "I went to K11 in downtown Guangzhou with my best friend last weekend because we wanted to kill time. It is a tall mall with eight levels of shops and sometimes holds exhibitions.",
      "The shops were not really my type. There were many chain clothing stores, and the prices were too high, so I only did some window-shopping. As a designer, I would rather look for independent design shops.",
      "The mall was crowded, and several shops were closed for renovation, so we could not explore much and felt disappointed. In the end, we only bought coffee and then left.",
      "Next time, I would rather explore some local lanes and look for independent designer shops instead of chain stores."
    ],topics:[
      resetTopic(q26,{intro:"I'd like to talk about a day out at K11 when I spent very little money.",ending:"Coffee was the only thing I bought, so the day cost me very little."}),
      resetTopic(q34,{intro:"I'd like to talk about K11, one of the most boring places I have visited.",ending:"The chain stores, renovation and crowds made the visit much more boring than I expected."})
    ]
  });
}

// Tokyo: Q10/Q35 keep the past trip; Q36 restores the future itinerary.
{
  const t=get('tokyo');const q36=take('tokyo','Q36');
  add({
    id:'tokyo-future-v11',title:'下次有空再去东京的计划',category:'旅行',
    memory:'想再去东京 → 待三天 → 玩哈利波特景点 → 逛独立设计店 → 放松又找灵感',
    shared:[
      "I went to Tokyo with my best friend four years ago, but there are still many places I want to explore. The city mixes traditional and modern life, and it has a well-known Harry Potter attraction that we both like.",
      "If we go again, we will probably stay for three days. We want to spend a full day at the attraction, visit the gift shop and have a meal in the themed restaurant.",
      "I also want to visit independent design shops because Tokyo has a strong influence on Japanese fashion. As a designer, I think those shops could give me new ideas.",
      "The trip would be both relaxing and inspiring, so Tokyo is the first place I would choose for my next holiday."
    ],topics:[resetTopic(q36,{intro:"I'd like to visit Tokyo again when I have enough free time."})]
  });
}

// Island: Q11/Q16 share the original cycling event with only the required tense
// and opinion adjustment. Q27 keeps the traffic jam as the centre.
{
  const t=get('island-bike');
  t.title='日本小岛错过公交后改骑自行车';
  t.memory='去安静小岛 → 错过公交 → 临时租自行车 → 沿乡间道路骑行 → 意外更放松';
  t.shared=[
    "The destination was a quiet Japanese island. Getting there was difficult because only a few ships went to the island, so my friend spent several days working out the route.",
    "Public transport on the island was limited, and we missed our bus. The next one would take a long time, so we rented bikes instead.",
    "At first, I thought cycling was a bad idea because the weather was very hot. Once we started riding, I changed my mind. I could see the open view, feel the wind on my face and follow a quiet country road.",
    "The ride was much more relaxing than I expected, and cycling allowed me to enjoy the island slowly."
  ];
  resetTopic(topic(t,'Q11'),{intro:"I'd like to talk about a cycling trip I would like to take again with my friend.",ending:"I would like to repeat this trip because a bicycle lets me enjoy the island slowly without worrying so much about the bus schedule."});
  resetTopic(topic(t,'Q16'),{intro:"I'd like to talk about a trip that changed an important opinion of mine.",middle:"It was very hot, so I initially did not think we should go. My friend persuaded me, although I still had some doubts.",ending:"It was a surprisingly relaxing trip, and I was lucky that my friend had changed my mind."});
  const traffic=get('island-traffic');
  traffic.title='前往日本小岛时堵车两小时';
  traffic.memory='去日本小岛 → 车祸导致公交堵两小时 → 等警察处理 → 改骑车离开堵点 → 旅行没有被毁掉';
  traffic.shared=[
    "My friend and I were travelling to a Japanese island that is famous as a filming location for Korean dramas. It was difficult to reach because only a few ships went there, and my friend spent days working out the route.",
    "On the way, a serious car accident happened, and our bus was stuck for about two hours. Nothing could move because we had to wait for the police to deal with the situation.",
    "I became impatient because our plan had already been delayed. After we finally reached the island, we rented bikes instead of relying on another bus and left the traffic behind.",
    "Once we started riding, I could see the open view and feel the wind on my face. The coastline was gorgeous, and the sea was deep blue. The long wait was frustrating, but luckily it did not ruin the whole trip."
  ];
  resetTopic(topic(traffic,'Q27'),{intro:"I'd like to talk about a traffic jam I experienced during a trip with my friend last year."});
}

// Pottery media: Q14/Q52 share the original report; Q51 restores the TikTok
// character-sculpture video.
{
  const t=get('pottery-media');const q51=take('pottery-media','Q51');
  t.title='本地陶艺市场的电视节目 / 新闻';
  t.memory='电视看到本地陶艺市场 → 原以为陶艺老气 → 看到彩色现代作品 → 传统手工结合设计 → 改变旧印象';
  t.shared=[
    "It introduced a local pottery market where young artists were making traditional ceramics look more modern. At first, it discussed the long history of pottery-making in China, and I almost lost interest because I used to think pottery was old-fashioned and mostly yellow or brown.",
    "Later, it showed colourful cups, small sculptures and decorations with cute patterns. They looked very different from the traditional pottery I had imagined.",
    "What impressed me most was the mix of traditional skills and modern design. The artists still shaped the clay by hand and fired it in a kiln, but the final products looked creative and attractive to young people.",
    "It changed my view of traditional crafts and showed me that an old craft can still fit into modern life."
  ];
  resetTopic(topic(t,'Q14'),{intro:"I'd like to talk about a pottery programme I recently saw on TV while I was switching channels because I felt bored."});
  resetTopic(topic(t,'Q52'),{intro:"I'd like to talk about a local news report about a pottery market in my city that I saw on TV.",ending:"I felt inspired because the report showed that a traditional local craft can still be relevant in modern life."});
  add({
    id:'pottery-video-v11',title:'TikTok 上的卡通陶瓷视频',category:'故事与媒体',
    memory:'无聊刷 TikTok → 卡通雕塑标题吸引 → 看到现代彩色陶艺 → 改变传统容器印象 → 想自己制作',
    shared:[
      "One day, I was scrolling through TikTok because I felt bored. Then I saw a title about getting a sculpture of your favourite character for almost free, which caught my attention immediately.",
      "The video first introduced the long history of pottery in China, and I almost skipped it. Later, it showed modern ceramic works, especially sculptures of Japanese characters.",
      "I used to think pottery only came in simple yellow or brown colours and was mainly used for containers. The video showed that it can also be colourful and can become detailed sculptures and art pieces.",
      "It made me want to try making ceramics in the future and decorate my home with ceramic figures of my favourite characters."
    ],topics:[resetTopic(q51,{intro:"I'd like to talk about an interesting ceramic-making video I saw on TikTok. It was very inspiring for me."})]
  });
}

// Art business: future goal/job can share; owner and employee answers return to
// their original roles and evidence.
{
  const t=get('claire-art-business');const q31=take('claire-art-business','Q31');const q32=take('claire-art-business','Q32');
  t.title='我未来想做的线上绘画生意';
  t.memory='线上卖画 → 手机购买 → AR 预览 → 学沟通、艺术与管理 → 把兴趣变成职业';
  t.shared=[
    "Customers could buy paintings on their phones and use AR technology to see how a painting might look in their home before buying it.",
    "Technology could make art easier to buy and attract more users. In the future, the business might even hold exhibitions overseas and reach more customers.",
    "I have been interested in paintings since I was a child, so turning this interest into a career would be meaningful to me."
  ];
  resetTopic(topic(t,'Q17'),{intro:"I'd like to talk about a long-term goal I have had for several years. I want to start my own online business selling paintings.",middle:"To start it, I would need to raise money, improve my communication skills and learn more about art and different painting styles.",ending:"I would be very happy if I could turn this long-term interest into my own business."});
  resetTopic(topic(t,'Q18'),{intro:"I'd like to talk about my dream job. I would like to run an online business that sells paintings. I have seen similar businesses on social media, so the idea feels possible to me.",middle:"The job would require communication skills because I would work with painters and a design team. I would also need to learn about art, business management, design and branding. These skills would help me present each painting clearly online."});
  add({
    id:'art-business-owner-v11',title:'Claire 的成功线上绘画生意',category:'Claire',
    memory:'发现画家缺少客户 → 联系画家合作 → 建线上卖画平台 → 社媒获得年轻客户 → 用新方式卖艺术',
    shared:[
      "After university, Claire wanted to open her own painting shop. She noticed that some talented artists had unique styles but found it difficult to reach enough people. She contacted several artists, explained her plan, and they agreed to work with her.",
      "She created an online platform where customers can buy paintings on their phones and have them delivered.",
      "The business has gained many followers on social media, and the paintings are especially popular with young people. Claire has also worked with a famous brand to reach more customers.",
      "She has a clear idea of what customers want and is willing to try a different way of selling art."
    ],topics:[resetTopic(q31,{intro:"I'd like to talk about my best friend Claire, who runs a successful online painting business. We have known each other since high school."})]
  });
  add({
    id:'art-company-worker-v11',title:'Claire 在成功的线上艺术公司工作',category:'Claire',
    memory:'线上艺术公司 → Claire 任项目经理 → 与画家和设计团队沟通 → AR 吸引用户 → 海外展览获好评',
    shared:[
      "The company sells paintings online. Customers can buy a painting on their phones and use AR technology to see how it would look in their home before buying it.",
      "Claire works there as a project manager. She communicates with painters and the design team. Her job keeps her busy, but she enjoys the work.",
      "I think the company is successful for more than just its profit. The AR feature has attracted many users and helped the company build a strong image. It has also held exhibitions overseas, received good reviews and gained loyal customers.",
      "I am proud of Claire because the job is a good step in her career and allows her to work in a field she likes."
    ],topics:[resetTopic(q32,{intro:"I'd like to talk about my best friend Claire, who works for a successful e-commerce company."})]
  });
}

// Claire learning/friendship: Q20/Q24 share the original study-planning core;
// Q28 keeps the original friendship and concert-trip evidence.
{
  const t=get('claire-learning');const q28=take('claire-learning','Q28');
  t.title='Claire 按计划自学语言';
  t.memory='Claire 很会做计划 → 拆分每日任务 → 网聊与看美剧学英语 → 规律练习 → 兴趣与计划都重要';
  t.shared=[
    "Claire and I have known each other for over ten years because we were high school classmates. She is the most organized person I know and is very good at making study plans.",
    "She sets a final goal, works out what to do each day, writes a to-do list on her MacBook and follows it step by step.",
    "When she was younger, she spoke with foreigners online every weekend. She also watched Friends once a week and learned natural English from it. These activities were all part of her own study plan."
  ];
  resetTopic(topic(t,'Q20'),{intro:"I'd like to talk about my best friend Claire, who is good at learning and speaking new languages.",ending:"Recently, she started learning Japanese and now practises with an app every day. Her success comes from planning, patience and regular practice."});
  resetTopic(topic(t,'Q24'),{intro:"I'd like to talk about my best friend Claire, who taught herself English without a teacher.",ending:"I think both a clear plan and real interest helped her learn by herself. A teacher can help, but she was able to stay focused on her own."});
  add({
    id:'best-friend-v11',title:'高中好友 Claire 与演唱会旅行',category:'Claire',
    memory:'高中同学 Claire → 演唱会后变亲近 → 她擅长做计划 → 香港行程顺利 → 我想向她学习',
    shared:[
      "Claire and I have known each other for over ten years because we were high school classmates. We both love K-pop, and a concert brought us closer. After that, we found that we had similar personalities and endless topics to talk about.",
      "She is the most organized person I know. She writes a to-do list on her MacBook and is especially good at planning trips.",
      "Last summer, we went to Hong Kong for a Coldplay concert. She researched local attractions, booked the hotel in advance and made a schedule for each day. We enjoyed the city and arrived at the concert on time.",
      "I think she is reliable, and I feel lucky to have learned so much from her. I also hope I can plan my own work and life better."
    ],topics:[resetTopic(q28,{intro:"I'd like to talk about Claire, my best friend from high school."})]
  });
}

// Nature/gardening: same tab, original but separate motivations.
{
  const t=get('claire-garden');const q29=take('claire-garden','Q29');
  t.title='Claire 种植和参加环保志愿活动';
  t.memory='阳台种番茄 → 周末社区种植 → 每天浇水检查 → 海边捡垃圾 → 放松又保护自然';
  t.shared=[
    "Claire grows tomatoes on the balcony of her small apartment. She is a busy university student, so she wanted a relaxing hobby away from screens.",
    "She also volunteers at weekends. Recently, she helped with planting in her community. She bought pots, soil and seeds, and now waters the plants and checks their leaves every day.",
    "She has also gone to the seaside to collect rubbish for recycling. This work helps her slow down and forget her study pressure for a while.",
    "The work sounds simple, but it requires patience. I admire her because she uses her free time to protect nature even when the work is tiring. She still wants to do more and may even join a nature-protection club."
  ];
  resetTopic(topic(t,'Q21'),{intro:"I'd like to talk about my best friend Claire, who cares about the natural world."});
  add({
    id:'claire-vegetables-v11',title:'Claire 在阳台种番茄并梦想开温室',category:'Claire',
    memory:'梦想拥有温室 → 阳台先种番茄 → 种菜缓解压力 → 未来开蔬菜店 → 已经开始行动',
    shared:[
      "Claire's long-term dream is to own a greenhouse. She is a university student and lives in an apartment, so she started by growing tomatoes on her balcony because they seemed manageable for a beginner.",
      "She is often busy with her studies. Taking care of the tomatoes helps her relax, feel closer to nature and learn more about agriculture. For her, this is a small first step towards the greenhouse dream.",
      "In the future, she would like to run a vegetable shop. She cares about healthy food, so eating vegetables she has grown herself makes her happy.",
      "I admire her because she has already taken action instead of only talking about her dream. I hope I can buy vegetables from her shop one day."
    ],topics:[resetTopic(q29,{intro:"I'd like to talk about my best friend Claire, who enjoys growing vegetables at home."})]
  });
}

// Medical, Yellow River and smile answers return closer to their old wording.
{
  const t=get('claire-medical');
  t.title='Claire 想成为医生';
  t.memory='医疗剧产生兴趣 → 社区志愿活动 → 决定学医 → 大学努力学习 → 相信她会成为好医生';
  t.shared=[
    "Claire has wanted to become a doctor since high school. Her interest began with a Korean TV series that showed doctors' daily lives and how they saved people. The programme was only the starting point.",
    "Later, she did volunteer work in her community and enjoyed helping others. That experience made her decide to study medicine. She is warm-hearted and patient, so the career suits her.",
    "She is now studying medicine at university and works very hard. In fact, she is one of the most hardworking people I know. Her studies are teaching her how to deal with difficult situations.",
    "She has already taken real steps towards her dream. I believe her patience and warm personality will help her become a good doctor."
  ];
  resetTopic(topic(t,'Q30'),{intro:"I'd like to talk about my best friend Claire, who would like to choose a career in the medical field."});

  const river=get('yellow-river');
  river.shared=[
    "I visited the Yellow River with a friend last year. We stayed in a rural village near it because we wanted a break from our busy lives.",
    "The Yellow River is important because it has a long history, used to be an important transport route and remains an important part of Chinese culture. Today, many places beside it are tourist attractions where people can learn about local history.",
    "The river was so wide that it was difficult to see the opposite bank. The water looked powerful, and we also saw a large sculpture built in memory of a historical hero.",
    "Later, we rented bikes and rode beside the river. The trip helped me relax and taught me something about history."
  ];
  resetTopic(topic(river,'Q25'),{intro:"I'd like to talk about the Yellow River, one of the most important rivers in China."});

  const smile=get('concert-smile');
  smile.shared=[
    "My best friend and I had been fans of the same K-pop group for five years, and we attended their concert last year. We were worried that the group might disband when their contract ended.",
    "When the show started, the atmosphere changed at once. They performed more than a dozen songs, and all the fans sang along. Later, they talked about their past, which moved everyone.",
    "In the end, they played a fan song and announced that they would release a new album. Everyone around me smiled, and some fans cried at the same time.",
    "We had thought it might be their last concert, but suddenly we knew we would see them again. That was what made everyone smile."
  ];
  resetTopic(topic(smile,'Q39'),{intro:"I'd like to talk about an occasion when many people were smiling at a concert."});
}

// Q37 and Q38 return to the original best-friend versions. Q19/Q41 share the
// original younger-sister success story.
{
  const t=get('sister-trip');const q37=take('sister-trip','Q37');const q38=take('sister-trip','Q38');
  t.title='妹妹第一次独自参加见面会';
  t.memory='内向妹妹想去见面会 → 家人无法陪同 → 我帮订酒店机票并准备发言 → 她独自完成旅行 → 变得自信',
  t.shared=[
    "My younger sister was eighteen and had just finished high school. She is shy and had never travelled alone, but she wanted to attend a fan meeting for a K-pop group she liked.",
    "All the adults in our family were too busy to go with her, so I encouraged her and helped plan the trip. I showed her how to book a safe hotel and buy flight tickets. I also reminded her to prepare what she wanted to say to the group.",
    "She followed the plan, arrived on her own, had a great time and bought some gifts for our family. The experience made her more confident and proud of herself.",
    "I did not expect her to grow up so quickly and complete a trip alone. It was a brave thing for her to do."
  ];
  resetTopic(topic(t,'Q19'),{intro:"I'd like to talk about my younger sister, who faced the difficulty of travelling alone but succeeded."});
  resetTopic(topic(t,'Q41'),{intro:"I'd like to talk about a time when I felt proud of my younger sister."});
  add({
    id:'encourage-friend-v11',title:'鼓励害羞的朋友参加见面会',category:'演唱会',
    memory:'朋友害羞不敢去见面会 → 我帮查地点和准备发言 → 提醒机会可能消失 → 她决定去 → 希望她更勇敢',
    shared:[
      "My best friend had loved a K-pop group for ten years but had never attended one of their fan meetings. She was too shy to take the first step and found it hard to plan the trip by herself.",
      "I had felt the same way before my first concert trip, so I understood her. I helped her check the location and prepare what she wanted to say because she would only have a few seconds with the group.",
      "At first, she wanted to refuse. I told her that the group might not stay together forever and that she could regret missing the chance. In the end, she decided to go.",
      "I encouraged her because I wanted her to become braver and learn to handle things on her own."
    ],topics:[resetTopic(q37,{intro:"I'd like to talk about a time when I encouraged my best friend to attend a fan meeting."})]
  });
  add({
    id:'advice-friend-v11',title:'给朋友演唱会旅行建议',category:'演唱会',
    memory:'朋友不会安排行程 → 订场馆附近酒店 → 找可靠旅行社办签证 → 提早到场 → 希望她更独立',
    shared:[
      "My best friend wanted to attend a K-pop concert but found it difficult to plan the trip. She needed to apply for a visa, buy flights and book a hotel. Because I travel often, I offered to help.",
      "First, I advised her to choose a hotel near the venue so she could return easily after the show. Second, I recommended reliable travel agencies that could help with the visa.",
      "Finally, I told her to arrive early because she wanted to buy fan merchandise, and the sales area opened in the afternoon.",
      "I gave the advice because I believed she could complete the trip by herself. I also hoped it would make her more organized and independent."
    ],topics:[resetTopic(q38,{intro:"I'd like to talk about some travel advice I gave my best friend."})]
  });
}

// Q40 returns to the original phone-ban concert. Q57 restores both rain and the
// phone rule because both were in the user's old final answer.
{
  const t=get('bad-concert');const q57=take('bad-concert','Q57');
  t.title='日本演唱会现场禁止录像';
  t.memory='去日本看演唱会 → 版权规则禁止录像 → 失望但收起手机 → 更专注音乐舞台 → 学会直接感受';
  t.shared=[
    "My best friend and I attended a K-pop concert in Japan last year. Just before the show, we saw a volunteer lead someone to the exit. Another person explained that the audience was not allowed to record because of copyright rules.",
    "At first, I felt disappointed because we had prepared for a long time and I wanted to keep a few special moments on my phone. However, we respected the rule and put our phones away.",
    "Without a phone in my hand, I could focus completely on the music, the stage and the atmosphere. The experience was better than I expected.",
    "I learned that recording is not always necessary. Sometimes it is better to enjoy an important moment with your own eyes instead of through a screen."
  ];
  resetTopic(topic(t,'Q40'),{intro:"I'd like to talk about an occasion when I was not allowed to use my mobile phone."});
  add({
    id:'bad-music-v11',title:'大雨和禁拍让我没享受音乐节',category:'演唱会',
    memory:'去音乐节看喜欢的组合 → 大雨让草地泥泞 → 没伞又穿白鞋 → 现场还禁止手机 → 学会做准备',
    shared:[
      "My best friend and I attended a music festival where our favourite K-pop group performed. We booked a hotel, bought flights and arrived early to buy merchandise and talk with other fans.",
      "However, it suddenly started pouring, and the grass became muddy. We had not brought umbrellas, and I was wearing white shoes, so I felt completely hopeless.",
      "Another problem was that phones were not allowed because of filming-rights rules. I was disappointed because I had looked forward to the festival and wanted to record part of it.",
      "It was not a good experience even though I liked the group. Next time, I will wear casual clothes, bring an umbrella and check the rules in advance."
    ],topics:[resetTopic(q57,{intro:"I'd like to talk about a music festival that I did not enjoy."})]
  });
}

// Smartwatch daily-life tab: current-use questions share the health core with
// relevant omissions; Q48 returns to the original future purchase.
{
  const t=get('watch-life');const q48=take('watch-life','Q48');
  t.title='智能手表与 Health App 的日常健康记录';
  t.memory='运动容易放弃 → 手表和 Health 记录数据 → 运动圆环提醒走路 → AutoSleep 记录睡眠 → 改善习惯';
  t.shared=[
    "Exercise is difficult for me, and I often want to stop after about twenty minutes.",
    "My smartwatch and the Health app track my heart rate, steps and fitness progress. I check my activity rings every day and try not to break my streak. If the rings are still open, I go out for a walk.",
    "I also use AutoSleep and wear the watch at night. The sleep data helps me understand my habits and adjust my sleeping time."
  ];
  resetTopic(topic(t,'Q46'),{intro:"I'd like to talk about a smartwatch that my best friend gave me for my birthday a few years ago. It has become an important part of my daily life and something I cannot live without.",ending:"Without it, I would probably lie on the sofa and give up exercising early. It helps me follow my plans, manage my routine and live a healthier life."});
  resetTopic(topic(t,'Q47'),{intro:"I'd like to talk about a smartwatch that I bought a week ago and that cost much more than I expected.",middle:"I planned to spend about 300 yuan on a Xiaomi watch, but an Apple advertisement caught my attention. After trying the latest model, I paid 1,500 yuan, five times my budget. I stood in the shop for a long time before I paid, and I have now started making workout plans with it.",ending:"Although it cost much more than planned, it is useful and helps me exercise, so I do not regret buying it.",omitSharedIndexes:[2]});
  resetTopic(topic(t,'Q49'),{intro:"I'd like to talk about the Health app on my iPhone. It came with the phone, so I did not need to download it. I started using it more after I got my smartwatch.",ending:"The data shows whether I am making progress or falling behind my fitness goals. The app helps me see my exercise and sleep clearly, stay focused on my goals and get rid of some bad habits."});
  add({
    id:'watch-want-v11',title:'想买一块帮助健康管理的智能手表',category:'智能手表',
    memory:'想买 1500 元手表 → 跟踪运动与目标 → 圆环提醒走路 → AutoSleep 改善睡眠 → 生活更健康',
    shared:[
      "The watch costs about 1,500 yuan. Exercise is difficult for me, and I often feel like giving up after about twenty minutes. That is why I want to use it to track workouts, heart rate, steps and other fitness data.",
      "I often want to know whether I am making progress or falling behind my fitness goals. When I am lying on the sofa feeling lazy, the activity rings might persuade me to go out for a walk.",
      "I also want to use an app called AutoSleep. My sleep has become worse because of work and study pressure, so the app could help me understand and improve my sleeping habits.",
      "I think the watch would help me stay focused on my goals, manage my routine and become healthier."
    ],topics:[resetTopic(q48,{intro:"I'd like to talk about a smartwatch that I have wanted to buy for a long time."})]
  });
}

// Q51 already split above. Q54/Q55 return to the original animal and law
// answers while remaining in one tab.
{
  const t=get('penguin');const q54=take('penguin','Q54');
  t.title='鼓励公共交通以保护企鹅的法律';
  t.memory='帝企鹅海冰减少 → 幼鸟需要稳定海冰 → 减少汽车排放 → 公交用户获税收优惠 → 降排保护动物';
  t.shared=[
    "The idea came from learning about emperor penguins. Their habitat is shrinking because global warming is melting the sea ice around Antarctica. Young penguins need stable ice while they grow waterproof feathers. If the ice disappears too early, they may fall into the water and drown.",
    "Cars are not the only cause of global warming, but reducing car use is something ordinary people can do. Burning waste and factory emissions also make the problem worse. The law could offer a tax benefit to people who regularly use public transport.",
    "I think many people would support it because it rewards a simple change in daily life. If more people joined, it could cut emissions and help protect animals such as penguins."
  ];
  resetTopic(topic(t,'Q55'),{intro:"I'd like to introduce a Public Transport Encouragement law that could help reduce carbon emissions."});
  add({
    id:'penguin-learn-v11',title:'想去展览进一步了解企鹅',category:'故事与媒体',
    memory:'被企鹅外形吸引 → 发现自己了解很少 → 想去动物园展览 → 学生活食物与育儿 → 了解如何保护',
    shared:[
      "Penguins caught my attention because they look cute and fluffy. I also find the way they walk funny because they look like people wearing shoes that are too large. Their small heads and round bodies make them even more interesting to watch.",
      "I know very little about them apart from their appearance, so my friend and I are planning to visit a penguin exhibition at a zoo. We want to relax and get closer to animals. The area is air-conditioned and is not usually crowded.",
      "The exhibition explains how penguins live, what they eat and how they raise their babies. Seeing them in person would make the information easier to remember.",
      "While searching for the exhibition, I learned that some penguin species are endangered. That made me want to understand them better and learn how people can protect them."
    ],topics:[resetTopic(q54,{intro:"I'd like to learn more about penguins, which are the wild animals I am most interested in."})]
  });
}

// Claire art: Q58/Q59 share only the genuine drawing biography. Q56 remains a
// separate cake core in the same tab.
{
  const t=get('claire-drawing');
  t.title='Claire 从小画画并成为线上艺术家';
  t.memory='高中好友 Claire → 五岁学画并获奖 → 坚持画日常场景 → 根据题目讲艺术影响或线上成名';
  t.shared=[
    "Claire was one of my best friends in high school. She has loved drawing since she was five and once won a prize in a competition.",
    "Even now, she often finds a comfortable place and sketches landscapes or people passing by. She is good at capturing ordinary moments and turning them into something interesting."
  ];
  resetTopic(topic(t,'Q58'),{intro:"I'd like to talk about my best friend Claire, who really loves drawing.",middle:"She is hardworking and keeps drawing in her free time. For example, she may draw an old chair, a small flower shop or a person reading by the window. She also visits art exhibitions and explains the colours and emotions behind the paintings to me.",ending:"Because of her, I understand art better. I think she loves drawing because it helps her express feelings that are hard to explain in words. I am proud to have such a creative and talented friend."});
  resetTopic(topic(t,'Q59'),{intro:"I'd like to talk about Claire, a well-known online artist I would like to meet again.",middle:"A few years ago, she started sharing her work on social media. Her drawings attracted thousands of followers, and she became popular. She now works with brands, holds exhibitions and plans to publish a drawing book for beginners.",ending:"We have not seen each other for several years. I would feel nervous but proud if we met again, and I would like to celebrate her success and have a long conversation."});
}

// Visible metadata reflects the safer structure: tabs matter more than the
// number of internal branches, so do not market an artificially small number.
const foot=document.querySelector('.foot');
if(foot)foot.textContent='v11 · 原稿优先 · 扣题优先 · 高相似内容同 tab · 59 题逐题复查';
})();
