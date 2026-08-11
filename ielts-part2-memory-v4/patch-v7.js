(function(){
const P=window.P2_DATA_PARTS||[];
const get=id=>P.find(x=>x.id===id);
const topic=(t,q)=>t&&t.topics.find(x=>x.q===q);
const takeTopic=(t,q)=>{if(!t)return null;const i=t.topics.findIndex(x=>x.q===q);return i>=0?t.topics.splice(i,1)[0]:null};

// Q01: fix the missing subject and move the wording back toward the older final answer.
{
  const t=get('fan-help');
  t.memory='害羞不敢见偶像 → 朋友帮做旅行计划 → 提醒别错过机会 → 最后决定参加 → 变得更勇敢';
  t.shared=[
    "My best friend and I have known each other for over ten years because we were high school classmates. I had loved a K-pop group for ten years, but I had never been to one of their fan meetings. I was too shy to take action, and I also found it hard to plan the trip by myself.",
    "My friend had felt the same way before her first concert trip, so she understood me. She helped me make a clear travel plan. She also reminded me to prepare what I wanted to say because I would only have a few seconds with the group.",
    "At first, I still wanted to give up. However, she told me that the group might not stay together forever and that I might regret missing the chance. In the end, I decided to attend the fan meeting."
  ];
  const q=topic(t,'Q01');
  q.ending="I felt nervous but grateful. Her help made me braver and taught me to handle things on my own.";
}

// Q04 / Q22: Claire is already a long-time friend elsewhere, so do not say we first met at this concert.
{
  const t=get('concert-volunteer');
  t.memory='和 Claire 去韩国演唱会 → 我看不懂交通 → 她帮我找路 → 她在现场做志愿者 → 平时也会帮助别人';
  t.shared[0]="One time, Claire and I went to a K-pop concert in Korea. It was my first time there, and I couldn't understand the public transport system. She noticed that I looked confused at a bus station and showed me the way to the venue.";
}

// Q06: the decision was to go to the concert instead of working overtime, not to keep a failed travel plan.
{
  const t=get('concert-change');
  const q=topic(t,'Q06');
  q.intro="An important decision I made was to go to a concert instead of working overtime that weekend.";
  q.ending="I was really glad we made that decision because we might not have had another chance to see the group.";
}

// Q17 / Q18 / Q31 / Q32: keep one business template, but make the shared body neutral so each question still answers its own subject.
{
  const t=get('claire-art-business');
  t.title='线上绘画平台：我的目标 / Claire 的公司';
  t.memory='线上卖画 → 手机购买 → AR 预览 → 与画家合作 → 社媒吸引年轻用户';
  t.shared=[
    "The idea is an online platform that sells paintings. Customers can buy paintings on their phones and use AR technology to see how a painting might look in their home before buying it.",
    "The platform works with independent artists and makes it easier for them to reach more people. This is useful because some talented artists have a unique style but do not have enough customers.",
    "The business can attract young users through social media, and it can also work with brands or hold exhibitions to reach more people."
  ];
  Object.assign(topic(t,'Q17'),{
    intro:"I'd like to talk about a long-term goal that I have had for several years. I want to start my own online business selling paintings.",
    middle:"To achieve it, I would first need to raise some money. I would also need better communication skills because I might have to work with painters, and I would need to learn more about art and different painting styles.",
    ending:"I have loved paintings since I was a child, so I would be very happy if I could turn this interest into my own business."
  });
  Object.assign(topic(t,'Q18'),{
    intro:"I'd like to talk about my dream job. I would like to run an online business that sells paintings.",
    middle:"I have seen similar businesses on social media, so the idea feels possible to me. I would need to learn more about art, business management, design and branding, and I would also need good communication skills to work with painters and a design team.",
    ending:"I have been interested in paintings since I was a child. Turning this interest into a career would make the job meaningful to me."
  });
  Object.assign(topic(t,'Q31'),{
    intro:"I'd like to talk about my best friend, Claire, who runs a successful online painting business. We have known each other since high school, so I know her quite well.",
    middle:"After university, she wanted to open her own painting shop. She noticed that some talented artists had unique styles but found it difficult to reach enough people. She contacted several of them, explained her plan, and they agreed to work with her.",
    ending:"I think her business is successful because it has gained many followers on social media and the paintings are popular with young people. She is also willing to try a different way of selling art."
  });
  Object.assign(topic(t,'Q32'),{
    intro:"I'd like to talk about my best friend, Claire, who works in a successful online art company.",
    middle:"In the company, she works as a project manager. She communicates with painters and the design team. Her job keeps her busy, but she enjoys the work.",
    ending:"I think the company is successful because the AR feature has attracted many users and it has also held exhibitions overseas and gained loyal customers."
  });
}

// Q20 / Q24: fix awkward wording. Q28: add the missing relationship details instead of only talking about language study.
{
  const t=get('claire-learning');
  t.shared[2]="She used the same method to learn languages. When she was younger, she talked with foreigners online every weekend, and she watched Friends once a week to pick up natural spoken English. Recently she started learning Japanese, and she practises with an app every day. All of these activities were part of her own study plan.";
  topic(t,'Q24').ending="She learned both languages without a teacher, although a teacher might have made some parts easier.";
  Object.assign(topic(t,'Q28'),{
    intro:"I'd like to talk about Claire, my best friend from high school. She is currently a university student, and she is the most organized person I know.",
    middle:"We both love K-pop, and one experience that brought us closer was a concert. After that, we met many times and found that we had similar personalities and endless topics to talk about.",
    ending:"I like her because she is reliable and easy to talk to. I also feel that I have learned a lot from the way she plans her life."
  });
}

// K11: after making Q09 more home-focused, restore the missing prompt points for the building and boring-place questions.
{
  const t=get('k11');
  Object.assign(topic(t,'Q33'),{
    middle:"Inside, there are artworks and colourful lights, so it looks more creative than an ordinary shopping mall. The lower floors are used for shops, while the upper floors are offices and apartments.",
    ending:"I like the art and the mixed-use design, although I do not like the crowds or the high prices."
  });
  Object.assign(topic(t,'Q34'),{
    middle:"I went there with my sister one weekend. We walked around the shops, looked at a few exhibitions and bought coffee, but after a while many of the stores started to look similar.",
    ending:"That is why I found the shopping area boring after a while, even though the building itself is quite interesting."
  });
}

// Q13: add when, where, who and why; the animal-story body can then remain shared with Q12.
{
  const t=get('zootopia');
  Object.assign(topic(t,'Q13'),{
    intro:"A movie I watched and enjoyed recently was Zootopia.",
    middle:"I watched it with a friend at home last weekend. I chose it because I wanted something light and easy to watch, and I already liked the animal characters.",
    ending:"I enjoyed it because it was funny and easy to watch, but it also had a clear message about prejudice."
  });
}

// Q15 / Q53: these are different events in the older version, so stop forcing them into one story.
{
  const t=get('mooncake');
  const q53=takeTopic(t,'Q53');
  t.title='偶像的中秋月饼广告';
  t.memory='偶像拍中秋广告 → 示范冰皮月饼 → 跟着步骤制作 → 她做绿色我做白色 → 学会给家人做';
  t.shared=[
    "A Chinese member of my favourite K-pop group appeared in an online programme and showed viewers how to make a mooncake. The programme introduced several new flavours, including ice cream and mango. My idol chose an easy type called a snow-skin mooncake and used food colouring to give it a bright appearance.",
    "I followed her steps and made one at home. I prepared the ingredients, mixed the eggs and sweet filling, and heated the mixture. After it cooled, I put the filling inside the mooncake skin.",
    "In the end, she made a green mooncake, while mine was white. The process was easier than I had expected, and the mooncake tasted good."
  ];
  Object.assign(topic(t,'Q15'),{
    intro:"I'd like to talk about a Mid-Autumn Festival advertisement for a local coffee brand.",
    middle:'',
    ending:"I was happy to see my idol in a Mid-Autumn Festival programme. The advertisement also taught me a simple way to make mooncakes for my family."
  });
  const tradition={
    id:'family-mooncake', title:'全家一起做中秋月饼', category:'故事与媒体',
    memory:'中秋看到月饼制作活动 → 全家跟视频做冰皮月饼 → 压传统花纹 → 一起品尝 → 变成家庭小传统',
    shared:[
      "My most special Mid-Autumn Festival was a year ago because I made mooncakes myself. My family had planned to buy some new flavours, such as ice cream and mango. However, a banner advertising a mooncake-making activity caught my attention, so I registered without hesitation.",
      "Later, my family joined me in following a video to make snow-skin mooncakes. We prepared the ingredients, mixed the eggs and sweet filling, and heated the mixture in the oven. After it cooled, we put it into the mooncake skins and used moulds to create traditional patterns.",
      "We were very happy with our work and enjoyed the mooncakes together. I am often too busy to go home and spend time with my family, so this became a precious Mid-Autumn Festival memory."
    ],
    topics:[q53],
    note:'恢复旧版 Q53：这是家庭中秋习俗，不再和偶像广告混成同一个事件。'
  };
  Object.assign(q53,{
    intro:"I'd like to talk about the Mid-Autumn Festival. People usually eat mooncakes and enjoy the moon with their family.",
    middle:'',
    ending:"Making mooncakes at home is now a small family tradition. It makes me feel closer to my family and culture, and I hope we can do it together every year."
  });
  P.splice(P.indexOf(t)+1,0,tradition);
}

// Q58: restore the reason she loves drawing and the effect she has on me.
{
  const t=get('claire-drawing');
  Object.assign(topic(t,'Q58'),{
    middle:"She is especially good at turning ordinary moments into something interesting, and she also likes visiting art exhibitions. Because of her, I have started to understand art better.",
    ending:"I think she loves drawing because it lets her express feelings that are hard to explain in words. I am proud to have such a creative friend."
  });
}

// Final consistency pass for the visible template count after patch-v6 and this patch.
const stats=document.querySelectorAll('.stat b');
if(stats.length>1) stats[1].textContent=String(P.length);
const foot=document.querySelector('.foot');
if(foot) foot.textContent='GitHub 修正版 v7 · 语法、扣题与人物一致性复查';
})();
