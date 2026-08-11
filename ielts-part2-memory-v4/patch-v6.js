(function(){
const P=window.P2_DATA_PARTS||[];
const get=id=>P.find(x=>x.id===id);
const takeTopic=(t,q)=>{if(!t)return null;const i=t.topics.findIndex(x=>x.q===q);return i>=0?t.topics.splice(i,1)[0]:null};

// Q56: restore the user's older final answer almost verbatim and keep it as a standalone cake story.
{
  const drawing=get('claire-drawing');
  takeTopic(drawing,'Q56');

  const cake={
    id:'special-cake',
    title:'十年友谊的莫奈风蛋糕',
    category:'Claire',
    memory:'十年友谊聚餐 → 朋友带来神秘大盒子 → 打开是莫奈风蛋糕 → 第一次做蛋糕更感动 → 想以后回送特别礼物',
    shared:[
      "We booked a restaurant to celebrate more than ten years of friendship. When I arrived, she was sitting beside a large box. She opened it, and inside was a beautiful cake that looked like a Monet painting.",
      "I knew that she was good at painting, but the cake still amazed me. It looked too beautiful to eat, so we took many photos with it.",
      "She then told me that it was the first cake she had ever made. Knowing how difficult it had been made me feel even more grateful."
    ],
    topics:[{
      q:'Q56',
      zh:'收到特殊蛋糕',
      en:'Describe a special cake you received from others',
      intro:"I'd like to talk about a special cake my best friend gave me last year. It surprised me because she cannot eat cream or drink milk, so we normally do not give each other cakes.",
      middle:'',
      ending:"It is a precious memory, and I feel lucky to have her as my friend. I would like to prepare an equally special gift for her in the future."
    }],
    note:'恢复自旧版最终稿：不再和 Q58/Q59 共用人物正文，整篇只讲蛋糕。'
  };

  const pos=drawing?P.indexOf(drawing):P.length-1;
  P.splice(pos<0?P.length:pos,0,cake);
}
})();
