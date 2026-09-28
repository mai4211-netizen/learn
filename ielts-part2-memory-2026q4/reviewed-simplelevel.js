(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const rep=(q,i,text)=>{if(byQ[q]?.reviewed?.[i])byQ[q].reviewed[i].text=text};

// Safer spoken structures: avoid forms the user is likely to trip over.
rep("Q46",2,"Once we started riding, the experience felt different from what I had expected. We followed a quiet road beside the coast, could stop whenever we wanted and felt the wind while looking at the sea. We could stop for photos too, so we did not have to wait for a bus or a station.");

rep("Q15",4,"It was not a huge party, but I remember it clearly because everyone was relaxed and we had something fun to do together. We were not just sitting around and looking at our phones.");

rep("Q24",0,"I'd like to talk about a Mid-Autumn advertisement featuring a Chinese member of my favourite K-pop group. I saw it online, and it was made for a local coffee brand. It appeared on social media a few weeks before the festival, so the timing felt very natural.");
rep("Q24",1,"She did not just hold the product and smile. She showed viewers how to make a simple snow-skin mooncake. I followed the steps at home, mixed the filling, wrapped it in the skin and pressed a pattern on top with a mould.");

rep("Q09",1,"The watch shut down even though it was only about a year old. I tried charging it again and restarting it. Both attempts failed. I also looked for a support option in the app, but I could not find anything useful.");
rep("Q09",2,"I did not want to take time off and visit a store, so I searched online. I found a post from someone with the same problem, and one comment suggested updating the system. I tried that and the watch started working normally again.");

rep("Q32",2,"Near the end, she showed me a few colourful modern pieces on her phone. That helped me understand the topic a little better, but pottery still was not something I would normally choose to talk about.");

rep("Q33",3,"She is also not afraid of making mistakes. If she learns a useful phrase, she tries to use it in a real conversation. She does not just write it down.");
rep("Q36",3,"She is also not afraid of making mistakes. If she learns a useful phrase, she tries to use it in a real conversation. She does not just write it down.");

rep("Q50",3,"I see her as successful because people actually use the service and buy art through it. The AR preview shows them how a painting may look in their room, so they have a clear reason to use the platform.");

rep("Q45",0,"An important decision I was happy with was choosing to go to a concert. That meant I did not work the whole weekend as I had first planned.");

rep("Q16",3,"We fed a few of the deer, took photos together and watched a beautiful sunset. I was exhausted, but when I saw the view, I felt the climb was worth it.");

rep("Q22",2,"The two characters end up working together on a difficult case. At first they do not fully trust each other, but they slowly learn to cooperate. One character cannot solve everything alone. They need each other's different strengths.");
})();
