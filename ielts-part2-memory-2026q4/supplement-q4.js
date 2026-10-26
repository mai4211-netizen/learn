/* Q4 supplemental cards: reuse existing story groups, leave Q01–Q52 intact. */
(function(){
  const groups=window.P2_2026Q4_GROUPS||[];
  const added=[
  {
    "after": "Q22",
    "q": "Q53",
    "zh": "读起来开心的书",
    "en": "Describe a book that made you happy",
    "chain": "Zootopia 这本书 → 动物城市很新奇 → 兔子想当警察却被看不起 → 狐狸也受到刻板印象影响 → 两人一起查案 → 从互不信任到合作 → 友谊有趣又温暖 → 读完很开心",
    "cue": [
      "what the book is",
      "what the story is about",
      "why you chose to read it",
      "and explain why reading it made you happy"
    ],
    "keywords": [
      "Zootopia",
      "animals live together",
      "rabbit",
      "police officer",
      "fox",
      "stereotype",
      "cooperate",
      "different strengths",
      "fresh and imaginative",
      "friendship",
      "heartwarming"
    ],
    "reviewed": [
      {
        "text": "One book that made me happy is Zootopia. It takes place in a city where many kinds of animals live together. The main character is a small rabbit who dreams of becoming a police officer.",
        "type": "own",
        "adjusted": false
      },
      {
        "text": "Other animals do not take her seriously because of her size. At work, she meets a fox who is also judged by a stereotype, because many animals assume foxes are dishonest.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "The two characters end up working together on a difficult case. At first they do not fully trust each other, but they slowly learn to cooperate. One character cannot solve everything alone. They need each other's different strengths.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "What I like most is the animal world because it feels fresh and imaginative. The book also plays with common stereotypes, because the rabbit and the fox are both different from what others expect. I find their friendship funny and heartwarming, and I felt really happy when I finished the book.",
        "type": "own",
        "adjusted": false
      }
    ]
  },
  {
    "after": "Q33",
    "q": "Q54",
    "zh": "有健康习惯和作息的人",
    "en": "Describe a person who has healthy habits and a good routine",
    "chain": "Claire → 认识十多年 → 做事有目标 → 早上起来运动 → 有课或兼职则下午运动 → 睡前阅读 → 列第二天待办清单 → 生活简单规律、容易坚持 → 健康又有条理",
    "cue": [
      "who this person is",
      "what healthy habits this person has",
      "how this person manages the routine",
      "and explain why you think the habits are healthy"
    ],
    "keywords": [
      "Claire",
      "ten years",
      "clear goal",
      "exercises in the morning",
      "part-time job",
      "afternoon",
      "reading a book",
      "to-do list",
      "next day",
      "simple",
      "healthy and organised"
    ],
    "reviewed": [
      {
        "text": "The person I'd like to talk about is my friend Claire. Claire is one of my closest friends, and we have known each other for more than ten years. She usually starts things with a clear goal.",
        "type": "own",
        "adjusted": false
      },
      {
        "text": "She usually exercises in the morning after getting up. But if she has classes or a part-time job, she moves her workout to the afternoon. She doesn't give up just because she's busy.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "Before going to bed, she likes reading a book and making a short to-do list for the next day. She decides what she needs to do each day, so she doesn't feel stressed in the morning.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "I think her system works because it is simple. She does not make a very strict timetable; she just knows the next few things she needs to finish. I think these small habits help her stay healthy and organised.",
        "type": "own",
        "adjusted": false
      }
    ]
  },
  {
    "after": "Q34",
    "q": "Q55",
    "zh": "帮助他人",
    "en": "Describe a time when you helped someone",
    "chain": "妹妹高中毕业 → 害羞、从未独自旅行 → 想去韩国参加 K-pop Fan Meeting → 担心机场、酒店和场馆 → 我鼓励她 → 帮选酒店、查签证、规划路线 → 她按计划独自完成旅行 → 更有自信 → 我很开心",
    "cue": [
      "who you helped",
      "why this person needed help",
      "what you did to help",
      "and explain how you felt about helping"
    ],
    "keywords": [
      "younger sister",
      "high school",
      "fan meeting",
      "South Korea",
      "airport",
      "hotel",
      "travel plan",
      "visa",
      "route",
      "give up",
      "confident",
      "helped her"
    ],
    "reviewed": [
      {
        "text": "I'd like to talk about a time when I helped my younger sister. She had just finished high school, was quite shy and had never travelled by herself before.",
        "type": "own",
        "adjusted": false
      },
      {
        "text": "She really wanted to attend a K-pop fan meeting in South Korea, but the airport, hotel and venue all made her nervous. Since nobody in our family could go with her, she wasn't sure if she should go.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "I encouraged her and helped her make a travel plan. I helped her choose a safe hotel, check the visa process and go through the route before she left. I also reminded her to arrive early, so she wouldn't feel rushed.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "She still wanted to give up at one point, but having a clear plan made the trip feel possible. During the trip, she used maps on her phone and sent us a message after she reached the hotel.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "In the end, she completed the whole trip alone and came back much more confident. I felt really happy because I had helped her do something she was afraid of.",
        "type": "own",
        "adjusted": false
      }
    ]
  }
];
  added.forEach(t=>{
    const g=groups.find(g=>g.topics.some(x=>x.q===t.after));
    if(!g||groups.some(g=>g.topics.some(x=>x.q===t.q)))return;
    g.topics.push({q:t.q,zh:t.zh,en:t.en,fit:"复用现有母版，题目专属部分只做必要修改。",chain:t.chain,cue:t.cue,keywords:t.keywords,reviewed:t.reviewed});
  });
  const titleAdditions={"zootopia-1":" / 开心的书","claire-person":" / 健康作息","sister":" / 帮助他人"};
  groups.forEach(g=>{if(titleAdditions[g.id]&&!g.title.includes(titleAdditions[g.id]))g.title+=titleAdditions[g.id]});
})();
