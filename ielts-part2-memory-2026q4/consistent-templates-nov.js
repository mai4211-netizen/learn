/* IELTS Part 2: November template consistency pass.
   Current approved text is backed up separately on
   backup/ielts-part2-before-templates-20261105.
   No A/B/C/D template labels are shown in the answer UI.
   Keep paragraph counts and ordering unchanged to retain personal highlight
   storage keys; personal character offsets inside changed paragraphs may shift.
*/
(() => {
  const openings={
  "Q01": "I'd like to talk about K11, a public building in downtown Guangzhou. It has several floors of shops, offices above them and art exhibitions from time to time.",
  "Q02": "I'd like to talk about a short trip to Dafu Mountain Forest Park that I often take but don't really enjoy.",
  "Q03": "I'd like to talk about K11, a crowded shopping centre in downtown Guangzhou.",
  "Q04": "The person I'd like to talk about is a pottery friend who loves learning about Chinese pottery history.",
  "Q05": "I'd like to talk about a skill I learned as a child: making snow-skin mooncakes.",
  "Q06": "The person I'd like to talk about is an older friend who runs a small pottery studio.",
  "Q07": "I'd like to talk about a very noisy K-pop concert I attended in Hong Kong.",
  "Q08": "I'd like to talk about a plastic-bottle recycling reward law that I'd introduce in my country.",
  "Q09": "I'd like to talk about a time when my smartwatch suddenly stopped working.",
  "Q10": "I'd like to talk about a short local-news video about a pottery market in my city.",
  "Q11": "I'd like to talk about my long-term goal of building a small online art platform.",
  "Q12": "The person I'd like to talk about is a former classmate who wants to become a doctor.",
  "Q13": "I'd like to talk about K11 in Guangzhou, a place I found quite boring on one visit.",
  "Q14": "I'd like to talk about a recent change in my exercise and sleep habits.",
  "Q15": "I'd like to talk about a family gathering during the Mid-Autumn Festival that I remember well.",
  "Q16": "I'd like to talk about Dafu Mountain Forest Park in Guangzhou, one of my favourite natural places in the city.",
  "Q17": "I'd like to talk about an activity I often waste time on: scrolling through social media.",
  "Q18": "The person I'd like to talk about is my pottery friend, who taught me how to shape clay by hand.",
  "Q19": "The person I'd like to talk about is a close friend who loves taking photos.",
  "Q20": "I'd like to talk about how I saved money to buy a smartwatch.",
  "Q21": "I'd like to talk about Germany's bottle-deposit system, an environmental law I learned about online.",
  "Q22": "I'd like to talk about Zootopia, an animal story I really like.",
  "Q23": "I'd like to talk about a time I waited over an hour for a reply from a concert-ticket seller.",
  "Q24": "I'd like to talk about a Mid-Autumn advertisement with a Chinese member of my favourite K-pop group.",
  "Q25": "I'd like to talk about a concert trip I organised with two friends as a small team.",
  "Q26": "I'd like to talk about a plastic-bottle recycling reward law that I'd introduce in my country.",
  "Q27": "I'd like to talk about a time I got up at three in the morning for a concert trip to Hong Kong.",
  "Q28": "The person I'd like to talk about is Claire, a popular and easy-going friend of mine.",
  "Q29": "I'd like to talk about a time I received good service at an Apple Store while buying my smartwatch.",
  "Q30": "I'd like to talk about an enjoyable evening at a K-pop concert in Hong Kong with two close friends.",
  "Q31": "I'd like to talk about a movie I didn't enjoy as much as I'd expected: Zootopia 2.",
  "Q32": "I'd like to talk about a time I listened to my pottery friend discussing technical things I wasn't very interested in.",
  "Q33": "The person I'd like to talk about is Claire, one of the most organised people I know.",
  "Q34": "The person I'd like to talk about is my younger sister, who succeeded in travelling abroad alone for the first time.",
  "Q35": "I'd like to talk about my friend Claire's apartment, which I enjoy visiting but wouldn't want to live in.",
  "Q36": "The person I'd like to talk about is my friend Claire, who is very good at learning new languages.",
  "Q37": "I'd like to talk about a women's ice hockey match I watched in Vancouver with my best friend.",
  "Q38": "I'd like to talk about a plan I changed recently so I could go to a K-pop concert.",
  "Q39": "The person I'd like to talk about is Claire, a friend who enjoys growing tomatoes on her balcony.",
  "Q40": "I'd like to talk about a short video about a local pottery market that I saw on social media.",
  "Q41": "I'd like to talk about an interview with Soyeon, the leader of (G)I-DLE, that I watched on YouTube.",
  "Q42": "The person I'd like to talk about is a pottery friend who is very good at making things by hand.",
  "Q43": "The person I'd like to talk about is Claire, a cheerful friend I've known since school.",
  "Q44": "The person I'd like to talk about is my younger sister, who managed her first trip abroad alone.",
  "Q45": "I'd like to talk about an important decision I was happy with: taking a day off to go to a concert.",
  "Q46": "I'd like to talk about a trip to a Japanese island that changed my opinion about cycling.",
  "Q47": "I'd like to talk about a mountain in Nara, Japan, that I'd recommend to other travellers.",
  "Q48": "I'd like to talk about the decision to take a day off and go to a concert in Hong Kong.",
  "Q49": "I'd like to talk about snow-skin mooncakes, a special food my family ate during the Mid-Autumn Festival.",
  "Q50": "The person I'd like to talk about is my friend Claire, who runs a successful online art platform.",
  "Q51": "The person I'd like to talk about is my childhood friend Claire, whom I met at school more than ten years ago.",
  "Q52": "I'd like to talk about K11, a public building in downtown Guangzhou. It has several floors of shops, offices above them and art exhibitions from time to time.",
  "Q53": "I'd like to talk about an illustrated storybook based on Zootopia. I first knew the story from the film, so the characters already felt familiar.",
  "Q54": "The person I'd like to talk about is Claire, a friend who has a healthy and manageable daily routine.",
  "Q55": "I'd like to talk about a time I helped my younger sister prepare for her first trip to South Korea.",
  "Q56": "The person I'd like to talk about is the captain of the Canadian women's ice hockey team, whom I first watched in Vancouver.",
  "Q57": "The person I'd like to talk about is my pottery friend, who runs a small studio and makes creative pieces by hand.",
  "Q58": "I'd like to talk about a smartwatch that I found difficult to use at first."
};
  const endings={
  "Q01": "For me, K11 is worth visiting because it combines art, design and everyday activities. I can enjoy a coffee and find new ideas in one place.",
  "Q02": "I still go because I enjoy spending time with my friend. The main reason I don't like the trip is that cycling in the afternoon heat is exhausting.",
  "Q03": "For me, K11 feels too crowded on weekend afternoons, so I prefer visiting on weekday mornings.",
  "Q04": "So I think she is a great example of someone who loves history because she uses old ideas to make modern pottery.",
  "Q05": "Looking back, I'm glad I learned this skill with my family because I still remember the steps today.",
  "Q06": "So I think she is someone I respect because she is both skilled and patient. She lets me learn from mistakes instead of doing the work for me.",
  "Q07": "Looking back, I enjoyed the noise because everyone was cheering for the same performance. Normally I would find that volume tiring.",
  "Q08": "I think this law would be popular because people could earn small rewards without losing their choice of drinks.",
  "Q09": "In the end, I felt relieved because the system update fixed the problem without a trip to the store. I also learned to check other users' advice.",
  "Q10": "I think the video was worth watching because it showed me that traditional pottery can be colourful and modern.",
  "Q11": "I think this goal matters because it combines my interests in art, design and technology. I would start with a small test before trying to grow the platform.",
  "Q12": "So I think she would suit medical work because she is patient, organised and willing to keep studying.",
  "Q13": "For me, that visit was boring because the shops felt similar and we spent almost two hours without finding anything new.",
  "Q14": "Looking back, the change was small, but I feel healthier because I take more regular walks and check my sleep.",
  "Q15": "Looking back, what made the gathering special was doing something together rather than just looking at our phones.",
  "Q16": "For me, Dafu Mountain Forest Park is special because I can enjoy nature and exercise without leaving Guangzhou.",
  "Q17": "I think scrolling wastes time because it is easy to keep going without noticing. I would rather use some of that time to exercise or practise English.",
  "Q18": "So I think she is a good teacher because she let me make mistakes and finish the piece myself.",
  "Q19": "So I think she enjoys photography because it helps her notice small details. I especially liked the album she sent me after our trip.",
  "Q20": "In the end, I felt good about buying the watch because I saved for it and still use it every day.",
  "Q21": "I think Germany's bottle-deposit system is useful because it makes returning bottles simple and gives people their deposit back.",
  "Q22": "I think Zootopia is a memorable animal story because the rabbit and fox challenge stereotypes and learn to work together.",
  "Q23": "In the end, I contacted another seller and got the ticket. I felt relieved because the wait had made me nervous.",
  "Q24": "I think the advertisement worked on me because it felt personal and taught me something practical. I even bought the collaboration coffee afterwards.",
  "Q25": "Looking back, teamwork helped because we divided the work and had a backup plan when things went wrong.",
  "Q26": "I think this new law would work because it rewards people for recycling instead of limiting their choices.",
  "Q27": "Looking back, getting up at three was hard, but I felt it was worth it once the concert began.",
  "Q28": "So I think Claire is popular because she listens to people and makes travel plans easy and fun. Her friends feel comfortable around her.",
  "Q29": "In the end, I felt well looked after because the staff member listened to me and did not push the most expensive model.",
  "Q30": "Looking back, the evening was special because we enjoyed the concert together and kept talking afterwards.",
  "Q31": "I think the sequel disappointed me because it was harder to follow than the first film and less surprising.",
  "Q32": "Looking back, I felt a little bored because the technical details were hard to follow, but I was glad I listened politely.",
  "Q33": "So I think Claire is organised because she keeps her plans simple and knows what to do next without a strict timetable.",
  "Q34": "So I think my sister succeeded because she followed the plan and was brave enough to try. She came back much more confident.",
  "Q35": "For me, Claire's home is lovely to visit because it feels personal and cosy, but I would not live there because it is small and has little storage.",
  "Q36": "So I think Claire is good at languages because she uses what she learns and is not afraid of making mistakes.",
  "Q37": "Looking back, I enjoyed the match because the atmosphere made a new sport exciting, even though the Canadian team lost.",
  "Q38": "Looking back, I felt happy with the change because the urgent work was finished and the concert was a one-time chance.",
  "Q39": "So I think she enjoys growing tomatoes because she can see small changes every week. When the first ones grew, she was really excited.",
  "Q40": "I think the video was worth watching because it showed me that traditional pottery can be colourful and modern.",
  "Q41": "Looking back, I respected Soyeon more because she spoke openly about the pressure behind the group's comeback.",
  "Q42": "So I think she is good at making things by hand because she can turn clay into neat, detailed pieces very quickly.",
  "Q43": "So I think Claire is a happy person because she enjoys small things, like growing her first tomatoes. When they appeared, she sent me a photo straight away.",
  "Q44": "So I think my sister succeeded because she followed the plan and was brave enough to try. She came back much more confident.",
  "Q45": "Looking back, I'm glad I took the day off because I didn't miss an experience that might never happen again.",
  "Q46": "Looking back, I was tired, but I changed my mind because cycling let us explore the island at our own pace. The trip felt more flexible than I expected.",
  "Q47": "For me, that mountain in Nara is worth recommending because you can see deer, green slopes and the sunset in one trip. I would go in the late afternoon.",
  "Q48": "Looking back, this decision mattered because I learned not to say no automatically to a special opportunity.",
  "Q49": "I think snow-skin mooncakes are special because making them together matters more to me than perfect shapes or taste.",
  "Q50": "So I think Claire has a successful business because her platform solves a real problem. Customers can see how art might look at home before buying it.",
  "Q51": "So I think Claire is such a good childhood friend because we know each other well and can still talk naturally even if we don't meet often.",
  "Q52": "For me, K11 is worth visiting because it combines art, design and everyday activities. I can enjoy a coffee and find new ideas in one place.",
  "Q53": "I think the illustrated story is heartwarming because Judy and Nick learn to trust each other. I first knew them from the film, and the book has the same characters.",
  "Q54": "So I think these habits help Claire stay healthy because they are simple enough to continue even when she is busy at work.",
  "Q55": "In the end, I felt happy because my sister completed the trip by herself and came home more confident.",
  "Q56": "So I think the Canadian team captain is someone I admire because she stayed focused and supported her teammates, even when they were losing.",
  "Q57": "So I think she is creative because she combines traditional pottery techniques with new ideas. As someone who works in design, I admire her approach.",
  "Q58": "I think the watch is useful now because I learned to check my activity and sleep, but it was confusing at first."
};
  const bodyEdits={
  "Q02": {
    "1": "On weekends, my friend and I often go to Dafu Mountain Forest Park. It has a large lake, and she enjoys cycling there, so she often asks me to join her. We usually go after lunch, when it is much hotter than in the morning."
  },
  "Q11": {
    "1": "I've wanted to work on an art project like this for some time. The idea became clearer after I saw how my friend Claire runs her online art business.",
    "2": "Her platform works with artists and lets customers preview how a painting might look on a wall before buying it. That showed me how design and technology could solve a simple problem.",
    "3": "For my own platform, I would first ask a few artists what they need and try the idea with a small group. I would also need to learn more about management, branding and communication."
  },
  "Q12": {
    "1": "I knew her at school. She became interested in medicine after watching a Korean medical drama. The doctors had to stay calm, make quick decisions and help people in difficult situations. That made her respect the job."
  },
  "Q14": {
    "1": "I bought my smartwatch about a year ago to track exercise and sleep. More recently, I started checking it regularly instead of forgetting about it after work."
  },
  "Q15": {
    "1": "A few close relatives came over when I was young, and my mother showed us how to make snow-skin mooncakes."
  },
  "Q16": {
    "1": "One weekend morning, I went there with a friend. We rented bikes near the entrance and rode along the paths beside the lake. It was a nice way to explore the park without rushing."
  },
  "Q23": {
    "4": "At that point, tickets were selling quickly and I was worried we would miss the show, so I started looking for another seller."
  },
  "Q31": {
    "1": "The story still follows Judy and Nick on a new case, and there are several new characters. I watched it after enjoying the first film, so I had high expectations. However, some parts spent a long time explaining the city's history."
  },
  "Q32": {
    "1": "I already liked her creative pottery, but I did not know much about different clays or firing temperatures. The technical words meant very little to me, and I found the explanation hard to follow. Still, she was clearly excited, so I did not want to be rude.",
    "2": "Near the end, she showed me a few colourful modern pieces on her phone. I liked the designs, but I still preferred looking at the final pieces to listening to technical details."
  },
  "Q36": {
    "1": "Claire and I met at school more than ten years ago. She studies English and Japanese and always looks for ways to practise speaking, not just memorise words.",
    "2": "For example, she watches Friends and chats with people online to practise English. For Japanese, she uses an app regularly. She also keeps a short to-do list on her laptop so she knows what to practise next."
  },
  "Q43": {
    "3": "Outside work, she still draws, grows tomatoes on her balcony and sometimes meets friends for coffee. For example, when her first tomatoes appeared, she immediately sent me a photo because she was so happy."
  },
  "Q53": {
    "1": "The book version follows Judy, a small rabbit who dreams of becoming a police officer. Other animals do not take her seriously because of her size. She meets a fox who is also judged by a stereotype.",
    "2": "In the story, they work together on a difficult case. At first they do not fully trust each other, but they slowly learn to cooperate. I like the way their different strengths help them solve the problem."
  },
  "Q54": {
    "1": "She usually exercises in the morning after getting up. But when work gets busy, she moves her workout to the afternoon. She does not give up just because she has a lot to do."
  },
  "Q56": {
    "1": "It was Canada against the United States, and it was my first time watching women's ice hockey live. The puck moved so fast that I could hardly follow the game.",
    "3": "After the game, my friend told me that the player was the Canadian team captain. I later learned that she had led the national team for years. I do not know much about her life outside hockey, but I liked how she encouraged her teammates."
  },
  "Q57": {
    "3": "I have watched her work in the studio, and she can make small changes very quickly. I used to think pottery was old-fashioned, but a market video and her work helped me see it differently."
  },
  "Q03": {
    "1": "I went there with a friend on a weekend afternoon. It was very crowded near the escalators and the food area. We had to walk slowly, and it was hard to find a seat."
  },
  "Q13": {
    "1": "I went there with a friend on a weekend afternoon. It was very crowded near the escalators and the food area. We had to walk slowly, and it was hard to find a seat."
  },
  "Q07": {
    "1": "We had been fans of the same K-pop group for years, so the three of us were excited long before the show started."
  },
  "Q30": {
    "1": "We had been fans of the same K-pop group for years, so the three of us were excited long before the show started."
  },
  "Q47": {
    "1": "I went there after shopping for most of the day. I was already tired and still carrying a few bags when we started going up."
  }
};
  const tweaks={
  "Q11": {
    "flex": {
      "text": "I could start with just a few paintings, so the first version would be easier to manage.",
      "zh": "我可以先只放少量画作，让第一版平台更容易管理。"
    }
  },
  "Q33": {},
  "Q36": {},
  "Q53": {
    "flex": {
      "text": "What I like most is how different animals learn to work together, even when they disagree at first.",
      "zh": "我最喜欢的是不同动物即使一开始有分歧，也能学会合作。"
    }
  },
  "Q54": {},
  "Q56": {}
};
  const chainUpdates={
  "Q02": "周末常去广州大夫山 → 午饭后骑行特别热 → 沿湖骑车、很累又出汗 → 为了陪朋友仍会去",
  "Q11": "我的长期目标：小型线上艺术平台 → 看到 Claire 的艺术业务获得灵感 → AR 预览能帮助买家 → 问艺术家需求 → 小规模试做 → 学管理与品牌",
  "Q12": "以前的一位同学 → 看韩国医疗剧对医生感兴趣 → 社区健康志愿活动 → 开始查课程 → 有耐心、有条理",
  "Q14": "约一年前买智能手表 → 最近开始规律使用 → 下班看步数与活动圆环 → 睡前查看睡眠 → 小习惯变稳定",
  "Q15": "中秋家庭小聚 → 母亲教做冰皮月饼 → 几位家人一起制作 → 压模太用力 → 大家笑、晚饭后配茶吃",
  "Q23": "三人准备演唱会行程 → 我联系二手票卖家 → 卖家突然不回复 → 等一小时、着急 → 改找另一卖家买到票",
  "Q32": "陶艺朋友讲不同黏土、烧制温度 → 我喜欢成品但不懂技术细节 → 不好意思打断 → 看现代作品 → 练习礼貌倾听",
  "Q36": "学校认识十多年的 Claire → 英语看《老友记》、网上聊天 → 日语用 App → 笔记本电脑列小清单 → 敢开口",
  "Q43": "学校认识 Claire → 旅行规划随和 → 阳台种番茄 → 第一批番茄出现就开心发照片 → 工作和兴趣有平衡",
  "Q53": "疯狂动物城故事书版 → 最早看电影了解故事 → 兔子警察与狐狸 → 克服偏见、合作破案 → 故事温暖有趣",
  "Q54": "Claire 已工作 → 早上运动、工作忙时改下午 → 睡前读书和列第二天待办 → 简单、可长期坚持",
  "Q56": "温哥华看加拿大对美国女子冰球 → 比赛很快 → 加拿大队长一直指挥与鼓励队友 → 长期领导球队 → 佩服她的坚持",
  "Q57": "先刷到现代陶艺市集视频 → 参加工作室体验课认识陶艺朋友 → 她研究传统陶艺 → 手工塑形、窑烧 → 将传统做成现代设计"
};
  const zhUpdates={
  "Q11": "我的长期目标是做一个小型线上艺术平台。我已经想做类似的艺术项目一段时间了，看到朋友 Claire 的线上艺术业务后，这个想法更清晰。她的平台与艺术家合作，买家可以在购买前预览画挂在自己墙上的样子，让我看到设计和技术能解决实际问题。对于自己的平台，我会先问一些艺术家需要什么，找少量人试做，再学习管理、品牌和沟通。我希望先做简单、可行的版本，慢慢发展，因为这结合了我喜欢的艺术、设计和技术。",
  "Q12": "我想介绍以前的一位同学，她想成为医生。我们在学校认识。她看韩国医疗剧后开始对医学感兴趣，因为医生需要在困难的情况下保持冷静、作出决定并帮助别人。后来她参加社区志愿活动，协助简单的健康项目，照顾需要帮助的人，还与志愿者安排工作。她已经开始查询课程和资格要求，知道成为医生要长期学习。我觉得她很适合医疗行业，因为她有耐心、有条理，也愿意继续学习。",
  "Q14": "我最近的改变是开始更规律地运动和睡觉。手表是大约一年前买的，当时想记录运动和睡眠；最近我才开始更认真、经常地使用它。下班后我会查看步数和活动圆环，如果一天没怎么动，就出去走一走。晚上我也会看睡眠记录，注意自己有没有睡太晚。以前忙起来常常忘记活动，现在更容易看见自己的习惯。虽然只是小改变，我还是觉得比以前更会照顾自己。",
  "Q15": "我记得一次中秋节的家庭小聚，几位家人在家里一起过节。当时我还小，妈妈教我做冰皮月饼。我们准备甜馅、包上软饼皮，再用模具压花纹。我第一次太用力，月饼形状不太整齐，妈妈提醒我要轻一点。后来大家比较月饼，笑那些形状奇怪的，晚饭后一起配茶吃。我最喜欢的不是月饼多完美，而是大家一起动手的过程。",
  "Q31": "我不太喜欢的电影是《疯狂动物城 2》。因为很喜欢第一部，所以看续集前期待很高。故事继续讲 Judy 和 Nick 破案，也加入新角色。我看完第一部后才看了第二部，但续集有些地方花了很多时间解释城市的历史。第一部让我觉得动物城市很新鲜；第二部有更多名字和背景信息，反而更难跟上。我不会说它很差，只是比预期复杂，惊喜也没有第一部多。",
  "Q32": "有一次我听做陶艺的朋友讲不同黏土、烧制温度等技术细节。我已经喜欢她做的现代陶艺作品，却对那些专业内容了解不多，觉得很难跟上。她讲得很兴奋，我不想显得不礼貌，于是继续认真听、点头并试着问简单问题。快结束时，她给我看了几件现代作品的照片。我喜欢这些成品，但比起听技术原理，我更喜欢直接欣赏它们。这件事让我记得，即使话题不感兴趣，也可以礼貌地倾听。",
  "Q36": "我想介绍擅长学语言的朋友 Claire，我们十多年前在学校认识。她学英语和日语，并且很重视实际开口。比如，她通过看《老友记》和与网友聊天练习英语，日语则经常使用 App。她还会在电脑上列简短的学习清单，知道接下来要练什么。她不怕犯错，学到实用表达就找机会说出来。我觉得她进步快，是因为一直在实际使用语言。",
  "Q43": "我觉得 Claire 是一个快乐的人。我们十多年前在学校认识，小时候喜欢聊音乐和画画。她擅长规划旅行，但也愿意听别人的建议。工作之外，她仍然画画、在阳台种番茄，也会和朋友喝咖啡。第一批番茄出现时，她马上开心地发照片给我。我觉得她快乐，是因为能享受这些小事情，也能兼顾工作、爱好和朋友。",
  "Q53": "我想讲一部以《疯狂动物城》为原型的插画故事书。我最早通过电影认识这个故事，所以已经熟悉主角。故事书里，小兔子 Judy 想当警察，却因为体型小受到轻视；她遇到一只常被认为不诚实的狐狸 Nick。两人合作调查棘手案件，慢慢克服偏见、互相信任。我喜欢动物城市的想象力，也喜欢他们从误解到合作的过程。这个故事很温暖，让我感到开心。我最初通过电影认识这个故事，所以这些角色对我已经很熟悉。",
  "Q54": "我想介绍我的朋友 Claire，我们认识十多年了。她有比较健康、容易坚持的作息。她通常早上运动，如果工作忙，就把运动改到下午，不会因为忙就完全放弃。睡前她喜欢读一会儿书，并为第二天列简短的待办清单，这样早上就更有条理。她不会制定特别严格的时间表，而是坚持几个小目标。我认为这些习惯之所以有用，是因为简单、工作忙时也能继续。",
  "Q56": "我钦佩的是加拿大女子冰球队的队长。我和好友在温哥华看加拿大对美国的比赛时注意到她。当时我第一次现场看女子冰球，冰球移动得太快，一开始都跟不上。她非常活跃，不停提醒和鼓励队友。即使美国队逐渐领先，她仍很专注地组织进攻。比赛后我知道她是加拿大队队长，并且已经领导国家队多年。我不太清楚她比赛以外的生活，但欣赏她在压力下仍然支持队友的表现。",
  "Q57": "我有一位做陶艺的朋友，她在小工作室制作很有创意的作品。我最早在网上看到现代陶艺市集的视频，后来去她的工作室参加体验课才认识她。她研究中国传统陶艺图案，却不直接复制，而是用手塑形，再放进窑里烧制，做出彩色杯子、小雕塑和可爱的角色作品。我以前觉得陶艺比较老派，但陶艺视频和她的作品改变了我的看法。我觉得她有创造力，因为她能把传统技术和现代设计结合起来。"
};
  const groups=window.P2_2026Q4_GROUPS||[];
  const byQ=new Map(groups.flatMap(g=>(g.topics||[]).map(t=>[t.q,t])));
  const questions=Array.from({length:58},(_,i)=>'Q'+String(i+1).padStart(2,'0'));
  for(const q of questions){
    const t=byQ.get(q);
    if(!t?.reviewed?.length || !openings[q] || !endings[q])
      throw Error('Missing approved answer or speaking template for '+q);
    t.reviewed[0].text=openings[q];
    for(const [key,value] of Object.entries(bodyEdits[q]||{})){
      const i=Number(key);
      if(!t.reviewed[i]||i===0||i===t.reviewed.length-1)
        throw Error('Invalid body paragraph '+q+' '+key);
      t.reviewed[i].text=value;
    }
    t.reviewed[t.reviewed.length-1].text=endings[q];
    if(chainUpdates[q])t.chain=chainUpdates[q];
    if(tweaks[q]?.flex)t.flex={...t.flex,...tweaks[q].flex};
    if(zhUpdates[q])window.P2_2026Q4_ZH_TRANSLATIONS[q]=zhUpdates[q];
  }
  // Shared concert travel story always involves three friends.
  const concert="I had originally planned to spend the weekend working overtime. Then my best friend and I heard that our favourite K-pop group might not stay together much longer. Our other friend joined the trip and helped organise the hotel, so the three of us decided to go together.";
  for(const q of ['Q27','Q38','Q45','Q48']){
    const t=byQ.get(q);
    if(!t?.reviewed?.[1])throw Error('Missing concert paragraph '+q);
    t.reviewed[1].text=concert;
  }
  // Q47 deliberately retains the user's Nara sunset story rather than
  // merging into the Japanese island; Q16 uses Dafu park in Guangzhou.
  const natural=groups.find(g=>g.id==='wakakusa');
  if(natural){
    natural.story='F · 自然地点：广州 / 奈良';
    natural.title='Q16 广州大夫山 / Q47 奈良山顶';
    natural.memory='Q16 广州大夫山湖边骑行、听鸟叫；Q47 奈良真正山顶、草坡小鹿与日落（不同故事）';
  }
  const k11=groups.find(g=>g.id==='k11');
  if(k11)k11.title='K11 商场（Q01/Q03/Q13/Q52）／社交媒体（Q17）';
  window.P2_2026Q4_TEMPLATE_REWRITE_VERSION='2026-11-05-v24';
})();
