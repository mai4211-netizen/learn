(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const replace=(q,i,text,keywords)=>{const t=byQ[q];if(!t?.reviewed?.[i])return;t.reviewed[i].text=text;if(keywords)t.keywords=keywords};

replace("Q31",2,
"The first movie felt fresh because I was seeing the animal city for the first time. In the second one, there were more names, more background information and more things to remember, so I sometimes lost track of the main case.",
["Zootopia 2","first film","high expectations","Judy","Nick","new case","more characters","animal city","lost track","main case","disappointed"]);

replace("Q31",3,
"I would not call it a terrible movie, but I came out a little disappointed. The first film was easier to follow and gave me more surprises, while the second one felt more complicated without being more fun.",
["Zootopia 2","first film","high expectations","Judy","Nick","new case","more characters","animal city","lost track","main case","disappointed","easier to follow","more surprises"]);

replace("Q41",3,
"After the interview, I understood better why their performances look so confident now. They had gone through years of training and awkward early stages, so I respected them more than before.",
["online interview","K-pop group","trainee years","debuted","busy schedules","joked","early performances","confident","polished","years of training","respected them more"]);

replace("Q10",2,
"The report also interviewed a few young makers who said they wanted younger people to notice traditional crafts. As a designer, I liked that idea because the same craft can look completely different when the colours and presentation change.",
["local news","pottery market","young artists","colourful cups","small sculptures","clay","kiln","traditional crafts","younger people","designer","colours","presentation"]);

replace("Q11",1,
"I like the idea of letting customers use their phones to preview how a painting might look in their own room before buying it. For people who do not usually visit galleries, that could make choosing art much easier.",
["online art platform","Claire","preview","painting","room","galleries","choosing art","management","branding","artists","design","technology","step by step"]);

replace("Q42",3,
"Watching her work made me realise how much control the skill needs. She can turn a soft piece of clay into something neat and detailed in a few minutes, while I needed much longer just to fix one small shape.",
["pottery friend","small studio","clay","colourful cups","small sculptures","traditional methods","kiln","small animal","pressure","neat and detailed","fix one small shape"]);

replace("Q44",1,
"She had just finished high school, was quite shy and had never travelled by herself. The airport, hotel and venue all made her nervous because she normally travelled with family members.",
["younger sister","first trip alone","fan meeting","high school","airport","hotel","venue","nervous","visa","clear plan","confident","independence"]);

replace("Q45",1,
"I hesitated because work was busy, but I knew I could finish the work later while the concert would happen only once. I asked for a day off, completed the most urgent tasks first and planned to catch up on the rest afterwards.",
["important decision","concert","working overtime","finish the work later","only once","day off","urgent tasks","train sold out","early flight","memory","regretted"]);

replace("Q48",3,
"That decision changed the way I deal with similar situations now. I still take work seriously, but if an experience may happen only once, I no longer say no automatically just because changing my schedule is inconvenient.",
["important decision","day off","concert","working overtime","group could stop","urgent tasks","team","train sold out","early flight","only once","changing my schedule"]);

replace("Q50",3,
"I see her as successful because people do not only follow her online; they actually use the service and buy art through it. The technology helps customers picture the artwork at home, which gives them a clear reason to use her platform.",
["Claire","online art business","artists","preview","painting","AR feature","social media","audience","overseas exhibitions","buy art","artwork at home","platform"]);
})();
