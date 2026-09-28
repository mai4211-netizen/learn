(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const rep=(q,i,text)=>{if(byQ[q]?.reviewed?.[i])byQ[q].reviewed[i].text=text};
const add=(q,i,text)=>{if(byQ[q]?.reviewed?.[i])byQ[q].reviewed[i].text+=" "+text};
const keys=(q,arr)=>{if(byQ[q])byQ[q].keywords=arr};

// Split long sentences into safer spoken chunks.
for(const q of ["Q07","Q30"])rep(q,3,"At the end, the group performed a fan song. They also said, 'See you next year.' We were tired after the show, but we still bought drinks and kept talking on the way back to the hotel.");

rep("Q26",4,"I think the rule would be easy to understand. If you choose to drive into the busiest area at the busiest time, you pay a small extra fee.");

rep("Q47",0,"A place I have visited and would recommend is Tokyo. I went there with my best friend a few years ago. We had planned the trip for a long time because we both wanted to visit a large Harry Potter attraction.");
rep("Q47",2,"Another reason I liked Tokyo was the transport. Trains made it easy to move between different areas in one day. Even when we changed our plan, it was usually simple to find another route.");

rep("Q42",4,"I admire her skill because the process is difficult when I try it. She can turn a soft piece of clay into something neat and detailed very quickly.");

for(const q of ["Q20","Q29"])rep(q,1,"I wanted a smartwatch because I wanted to track my exercise and sleep. I did not need to buy it immediately. So I saved a fixed amount from my salary for a few months and cut down on unnecessary online shopping.");

rep("Q27",0,"The clearest time I remember getting up early was for a concert trip to Hong Kong. My best friend and I had planned to travel by train. The tickets sold out, so we had to take an early flight.");
rep("Q27",1,"That meant getting up at about three in the morning. I had packed most of my things the night before. I still had to get dressed, check my passport and leave home when it was completely dark outside.");

for(const q of ["Q38","Q45","Q48"])rep(q,1,"I had originally planned to spend the weekend working overtime. Then my best friend and I heard that our favourite K-pop group might not stay together much longer. We started thinking about going to their concert.");

rep("Q16",0,"A natural place I really like is Mount Wakakusa in Nara. I went there after shopping for most of the day. I was already tired and still carrying a few bags when we started going up the mountain.");
rep("Q16",1,"We took a taxi quite far up. But the best place to watch the sunset was even higher, so we still had to walk uphill for a while. At first, the climb felt much harder than I expected.");

rep("Q22",0,"An animal story I really like is Zootopia. It takes place in a city where many kinds of animals live together. The main character is a small rabbit who dreams of becoming a police officer.");
keys("Q22",["Zootopia","many kinds of animals","rabbit","police officer","take her seriously","fox","judged by a stereotype","dishonest","working together","trust","cooperate","cannot solve everything alone","need each other's different strengths","animal world","fresh and imaginative","different from what others expect","judge someone too quickly"]);

rep("Q31",2,"The first movie felt fresh because I was discovering the animal city for the first time. In the second one, I had to remember more names and background details. Sometimes I lost track of what Judy and Nick were actually trying to solve.");

rep("Q37",1,"It was my first time watching ice hockey in person. Many people wore team jerseys, and the crowd was already excited before the match started. The arena felt very different from watching sport on TV.");

for(const q of ["Q03","Q13","Q17"])rep(q,1,"I went to K11 with a friend on a weekend afternoon. It was very crowded near the escalators and the food area. We had to walk slowly, and it was hard to find a seat.");

for(const q of ["Q05","Q15","Q49"])rep(q,1,"One Mid-Autumn Festival, my family got together at home. I was still quite young, and my mother taught me how to make snow-skin mooncakes.");

rep("Q09",0,"A technological problem I faced happened when my smartwatch suddenly stopped working. I use it every day to track my steps, heart rate and sleep. So the problem was annoying, even though it was not an emergency.");

rep("Q23",0,"A time I waited a long time for a reply happened when I was buying a concert ticket on a second-hand platform. Tickets were selling quickly, so I was already worried that I might miss the chance.");

rep("Q12",1,"She became interested in being a doctor after watching a Korean medical drama. The doctors had to stay calm, make quick decisions and help people in difficult situations. That made her respect the job a lot.");

rep("Q41",1,"They talked about their trainee years and how uncertain they felt when they first debuted. They also explained how they dealt with busy schedules as a group. The conversation was relaxed, so they joked with each other between the more serious parts.");

rep("Q19",4,"Later, she sent me a small album from the trip. I realised that I had already forgotten many of those small moments. Since then, I have appreciated her habit much more.");

// Avoid repeated intro wording after merging.
rep("Q33",1,"Claire is one of my closest friends, and we have known each other for more than ten years. She usually starts things with a clear goal.");
rep("Q36",1,"Claire is one of my closest friends, and we have known each other for more than ten years. She usually starts things with a clear goal.");

// Keep merged answers long enough without repeating the same point.
for(const q of ["Q10","Q40"])rep(q,1,"I found it on social media and almost skipped it because I used to think pottery was old-fashioned. The clip was only about two or three minutes long, so it was easy to finish.");
for(const q of ["Q28","Q43","Q51"])add(q,2,"Even when we are both busy, she sends short messages and remembers small plans we made.");
add("Q21",4,"The rule is also easy to understand. I think that matters for a city law.");
for(const q of ["Q01","Q52"])add(q,2,"The food court is useful too, especially when we stay there for a few hours.");

// Shorten Q50 slightly and keep the reason concrete.
rep("Q50",2,"The business did not become popular immediately. Claire started with only a few artists and posted regularly on social media. Later, the platform joined some exhibitions overseas, and she kept adding new work from different artists.");
rep("Q50",3,"I see her as successful because people actually use the service and buy art through it. The AR preview shows how a painting may look in a room, so customers have a clear reason to use the platform.");
})();
