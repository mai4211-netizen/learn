(function(){
const P=window.P2_DATA_PARTS||[];
const get=id=>P.find(x=>x.id===id);
const take=(id,q)=>{const t=get(id);if(!t)return null;const i=t.topics.findIndex(x=>x.q===q);return i<0?null:t.topics.splice(i,1)[0]};
const reset=(q,changes={})=>Object.assign(q,{middle:'',ending:'',omitSharedIndexes:[]},changes);
const removeEmpty=()=>{for(let i=P.length-1;i>=0;i--)if(!P[i].topics.length)P.splice(i,1)};

// Q19/Q37/Q38/Q41: the same younger-sister trip. Only the question angle changes.
{
  const t=get('sister-trip');
  const q37=take('encourage-friend-v11','Q37');
  const q38=take('advice-friend-v11','Q38');
  t.title='妹妹第一次独自参加见面会';
  t.memory='内向妹妹第一次独自旅行 → 我鼓励她 → 帮她订酒店机票并准备发言 → 她顺利完成 → 变得更自信';
  t.shared[0]="My younger sister was eighteen and had just finished high school. She is shy and had never travelled alone. She wanted to attend a K-pop fan meeting, but was afraid to travel there alone.";
  t.topics.push(q37,q38);
  reset(t.topics.find(x=>x.q==='Q19'),{
    intro:"I'd like to talk about my younger sister, who faced the difficulty of travelling alone but succeeded.",
    ending:"She succeeded because she faced something she had been afraid of and completed the whole trip by herself."
  });
  reset(t.topics.find(x=>x.q==='Q37'),{
    intro:"I'd like to talk about a time when I encouraged my younger sister to take her first trip alone.",
    ending:"I encouraged her because I did not want fear to make her miss an important opportunity."
  });
  reset(t.topics.find(x=>x.q==='Q38'),{
    intro:"I'd like to talk about the travel advice I gave my younger sister before her first trip alone.",
    ending:"The advice made the journey safer and easier, while still allowing her to complete it independently."
  });
  reset(t.topics.find(x=>x.q==='Q41'),{
    intro:"I'd like to talk about a time when I felt proud of my younger sister.",
    ending:"I was proud because she became more confident and independent through the experience."
  });
}

// Q16 joins Q06/Q42: the same decision to choose an irreplaceable concert
// instead of always putting overtime first.
{
  const q16=take('island-bike','Q16');
  const t=get('concert-change');
  t.title='放弃加班去演唱会：决定、想法与计划改变';
  t.memory='原计划周末加班 → 担心错过最后一场 → 改为请假去演唱会 → 交通计划临时调整 → 意识到工作和生活要平衡';
  t.topics.push(q16);
  reset(q16,{
    intro:"I'd like to talk about a time when I changed an important opinion about always putting work first.",
    ending:"Before that weekend, I thought work should always come before personal plans. The concert made me realise that some experiences cannot be repeated, so work and life need a better balance.",
    omitSharedIndexes:[3]
  });
}

// Q12/Q13: identical Zootopia body; only the medium-specific opening changes.
{
  const t=get('zootopia');
  t.title='Zootopia：同一个动物故事与电影';
  reset(t.topics.find(x=>x.q==='Q12'),{intro:"The animal story I would like to describe is Zootopia."});
  reset(t.topics.find(x=>x.q==='Q13'),{intro:"A movie I watched and enjoyed recently was Zootopia."});
}

// Q15 becomes an advertisement featuring the K-pop group promoting its fan-
// club volunteer programme, and shares the programme body with Q04.
{
  const q15=take('mooncake','Q15');
  const t=get('concert-job-v11');
  t.title='K-pop 演唱会志愿者工作与宣传广告';
  t.memory='K-pop 组合在粉丝俱乐部广告中招募志愿者 → 免费看演出并可能见到组合 → 提交粉丝经历和语言资料 → 现场维持队伍、卖周边、引导观众';
  t.shared=[
    "My best friend and I have been fans of a K-pop group for five years. Recently, the group appeared in an online advertisement from its official fan club and announced a chance to volunteer at its latest concert in Korea.",
    "The advertisement explained that volunteers could see the concert for free and might even see the group backstage. To apply, people needed to provide information such as how long they had been fans, where they came from and which languages they could speak.",
    "The volunteers would keep the fan queues in order, help the staff sell merchandise and guide fans to different areas when the concert started.",
    "The group said the work would be busy but meaningful. After watching the advertisement, my friend and I both wanted to apply and take a short trip while we were in Korea."
  ];
  reset(t.topics.find(x=>x.q==='Q04'),{intro:"The short-term job I would like to do abroad is concert volunteering in Korea."});
  reset(q15,{intro:"I'd like to talk about an online advertisement featuring my favourite K-pop group."});
  t.topics.push(q15);
}

// Q14/Q51/Q52: identical pottery-market body; only the media label changes.
{
  const q51=take('pottery-video-v11','Q51');
  const t=get('pottery-media');
  t.title='同一则现代陶艺内容';
  t.memory='本地陶艺市场 → 年轻艺术家把传统陶艺做得更现代 → 彩色杯子、雕塑和可爱图案 → 改变我对传统工艺的看法';
  reset(t.topics.find(x=>x.q==='Q14'),{intro:"I'd like to talk about a pottery programme I recently watched online."});
  reset(q51,{intro:"I'd like to talk about an interesting pottery video I recently saw on TikTok."});
  reset(t.topics.find(x=>x.q==='Q52'),{intro:"I'd like to talk about a local news report I recently saw about a pottery market in my city."});
  t.topics.push(q51);
}

// Q26/Q33/Q34: one K11 visit answers cost, tall-building opinion and boredom.
{
  const q33=take('k11','Q33');
  const t=get('k11-boring-v11');
  t.title='K11：少花钱、不喜欢的高建筑与无聊外出';
  t.memory='和朋友去高层商场 K11 → 八层商店、楼上办公室和艺术展 → 连锁店贵又不合口味 → 装修加人多 → 只买咖啡便离开';
  t.shared=[
    "I went to K11 in downtown Guangzhou with my best friend last weekend because we wanted to kill time. It is a tall building with eight levels of shops, offices on the upper floors and occasional art exhibitions.",
    "The shops were not really my type. There were many chain clothing stores, and the prices were too high, so I only did some window-shopping. As a designer, I would rather look for independent design shops.",
    "The building was also crowded, and several shops were closed for renovation, so we could not explore much and felt disappointed. In the end, we only bought coffee and then left.",
    "Although K11 is easy to recognise because of its height and mixed uses, I disliked the visit. It was boring, and I spent very little because I found almost nothing worth buying."
  ];
  const sameEnding="Next time, I would rather explore local lanes and independent design shops instead.";
  reset(t.topics.find(x=>x.q==='Q26'),{intro:"I'd like to talk about a day out at K11 when I spent very little money.",ending:sameEnding});
  reset(q33,{intro:"I'd like to talk about K11, a tall building in Guangzhou that I dislike.",ending:sameEnding});
  reset(t.topics.find(x=>x.q==='Q34'),{intro:"I'd like to talk about K11, one of the most boring places I have visited.",ending:sameEnding});
  t.topics.push(q33);
}

// Q10/Q35: exactly the same Tokyo answer already fits recommendation and favourite city.
{
  const t=get('tokyo');
  const sameIntro="I'd like to talk about Tokyo, my favourite city and a place I would recommend.";
  const sameEnding="That is why Tokyo became my favourite city and a place I would recommend to other people.";
  reset(t.topics.find(x=>x.q==='Q10'),{intro:sameIntro,ending:sameEnding});
  reset(t.topics.find(x=>x.q==='Q35'),{intro:sameIntro,ending:sameEnding});
}

removeEmpty();
})();
