/* Additional Q4 mainland questions from the latest screenshot; reuse existing stories. */
(function(){
 const groups=window.P2_2026Q4_GROUPS||[];
 const added=[
  {
    "after": "Q37",
    "q": "Q56",
    "zh": "钦佩的运动员",
    "en": "Describe a sportsperson you admire",
    "chain": "温哥华看冰球 → 第一次现场看、冰球速度快 → 回去看相关视频 → 了解球员 Quinn Hughes → 移动很快、判断冷静 → 很重视队友配合 → 不只靠个人能力 → 我佩服这种团队意识",
    "cue": [
      "who this sportsperson is",
      "how you learned about him or her",
      "what this person has achieved or is good at",
      "and explain why you admire this person"
    ],
    "keywords": [
      "Quinn Hughes",
      "Vancouver",
      "ice hockey",
      "live match",
      "puck",
      "quickly",
      "teamwork",
      "calm",
      "teammates",
      "admire"
    ],
    "reviewed": [
      {
        "text": "An athlete I admire is an ice hockey player called Quinn Hughes. I first became interested in ice hockey when I travelled to Vancouver with my best friend.",
        "type": "own",
        "adjusted": false
      },
      {
        "text": "We saw a poster for a game and decided to buy tickets. It was my first live ice hockey match. Many people wore team jerseys, and the crowd was excited even before the game started.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "At first I found it hard to follow the puck because it moved so quickly and looked tiny from our seats. After the trip, I watched some ice hockey videos online and learned about Quinn Hughes.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "What I like about him is that he moves quickly but still seems calm. He makes decisions in a very fast game and works well with his teammates. I think that takes a lot of practice.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "I admire him because ice hockey is not just about one talented player. You have to trust other people and make quick decisions together. That is what makes the sport interesting to me.",
        "type": "own",
        "adjusted": false
      }
    ]
  },
  {
    "after": "Q42",
    "q": "Q57",
    "zh": "有创造力的朋友",
    "en": "Describe a creative friend you have",
    "chain": "陶艺朋友 → 自己开工作室 → 研究传统陶艺图案 → 不照搬古老设计 → 用彩色和可爱角色做现代杯子、雕塑 → 我看过她手工制作 → 传统和现代结合 → 我很佩服她的创意",
    "cue": [
      "who this friend is",
      "how you know this person",
      "what creative things this person does",
      "and explain why you think this person is creative"
    ],
    "keywords": [
      "pottery friend",
      "small studio",
      "traditional patterns",
      "colourful cups",
      "small sculptures",
      "creative",
      "clay",
      "modern",
      "designs",
      "old ideas"
    ],
    "reviewed": [
      {
        "text": "A creative friend I know is my pottery friend. She is a few years older than me and runs a small pottery studio.",
        "type": "own",
        "adjusted": false
      },
      {
        "text": "She is interested in the history of Chinese pottery, so she often looks at old bowls, shapes and patterns in museums or online. But she does not just copy old designs.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "Instead, she takes ideas from them and makes colourful cups, small sculptures and cute character-shaped pieces. She still shapes the clay by hand and fires it in a kiln.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "I have watched her work in the studio, and she can make small changes very quickly. Before I met her, I thought pottery was old-fashioned, but her work completely changed my impression.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "I think she is creative because she can turn traditional ideas into something modern and fun. As someone who works in design, I really admire the way she combines old techniques with new ideas.",
        "type": "own",
        "adjusted": false
      }
    ]
  },
  {
    "after": "Q09",
    "q": "Q58",
    "zh": "不会用的科技产品",
    "en": "Describe a piece of technology you found difficult to use",
    "chain": "买智能手表记录运动睡眠 → 店员帮设置基本功能 → 起初看不懂活动圆环和睡眠数据 → 功能很多、找不到想要的设置 → 上网找说明、慢慢试 → 学会记录步数和睡眠 → 现在觉得有用但上手不简单",
    "cue": [
      "what the product is",
      "when you started using it",
      "why you found it difficult to use",
      "and explain how you felt about it"
    ],
    "keywords": [
      "smartwatch",
      "exercise",
      "sleep",
      "activity rings",
      "settings",
      "confusing",
      "online",
      "steps",
      "sleep reports",
      "useful"
    ],
    "reviewed": [
      {
        "text": "A piece of technology I found difficult to use at first was my smartwatch. I bought it because I wanted to track my exercise and sleep.",
        "type": "own",
        "adjusted": false
      },
      {
        "text": "When I bought it at an Apple Store, a staff member showed me the basic functions and helped me set it up. But when I started using it on my own, I found some parts confusing.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "There were so many icons and settings that I did not know where to look. For example, I could see my activity rings, but I did not understand all the numbers. I also had trouble finding my sleep reports.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "I searched online for simple instructions and tried the different features one by one. After a while, I learned how to check my steps, daily activity and sleep.",
        "type": "shared",
        "adjusted": false
      },
      {
        "text": "Now I use the watch almost every day, so I think it is useful. But I still remember how difficult it felt at the beginning. Even a helpful product can take time to learn.",
        "type": "own",
        "adjusted": false
      }
    ]
  }
];
 added.forEach(t=>{
   const g=groups.find(g=>g.topics.some(x=>x.q===t.after));
   if(!g||groups.some(g=>g.topics.some(x=>x.q===t.q)))return;
   g.topics.push({q:t.q,zh:t.zh,en:t.en,fit:"复用现有母版，仅补贴题细节。",chain:t.chain,cue:t.cue,keywords:t.keywords,reviewed:t.reviewed});
 });
 const labels={"hockey":" / 钦佩的运动员","pottery-person":" / 创造力","smartwatch-life":" / 不会用的科技产品"};
 groups.forEach(g=>{if(labels[g.id]&&!g.title.includes(labels[g.id]))g.title+=labels[g.id]});
})();
