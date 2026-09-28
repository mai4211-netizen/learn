(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const rep=(q,i,text)=>{if(byQ[q]?.reviewed?.[i])byQ[q].reviewed[i].text=text};

rep("Q31",1,"The story still follows Judy and Nick on a new case, and there are several new characters. I liked seeing them work together again, but some parts spent a long time explaining the city's history.");
rep("Q31",2,"The first movie felt fresh because I was discovering the animal city for the first time. In the second one, I had to remember more names and background details, and sometimes I lost track of what Judy and Nick were actually trying to solve.");

rep("Q10",3,"After watching it, I wanted to see the work in person, so I later visited a pottery studio. Before that, I had mostly pictured pottery as old-fashioned bowls, but the report gave me a much more modern image of it.");

rep("Q08",2,"The money collected would go towards cheaper buses and more reliable public transport. If buses were easy to use, people would have a real reason to leave the car at home.");

rep("Q21",2,"The money collected would be used to improve buses and other public transport. If those services were cheaper and easier to use, more people might choose them instead of driving.");

rep("Q26",2,"The fee would help pay for cheaper buses and better public transport. So people would not simply be told to drive less; they would have another option.");

rep("Q42",3,"Watching her work showed me how much control the skill needs. She can turn a soft piece of clay into something neat and detailed in a few minutes, while I needed much longer just to fix one small shape.");

rep("Q50",3,"I see her as successful because people do not only follow her online; they actually use the service and buy art through it. The AR preview helps them decide whether a painting would suit their room, which gives the platform a clear purpose.");
})();
