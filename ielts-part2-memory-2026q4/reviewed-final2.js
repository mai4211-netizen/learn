(()=>{
const groups=window.P2_2026Q4_GROUPS||[];
const byQ={};for(const g of groups)for(const t of g.topics)byQ[t.q]=t;
const add=(q,i,text)=>{if(byQ[q]?.reviewed?.[i])byQ[q].reviewed[i].text+=" "+text};
const keys=(q,arr)=>{if(byQ[q])byQ[q].keywords=arr};

// Keep the shorter merged answers comfortably long enough without repeating ideas.
add("Q02",2,"We had expected to use the bus, so the long bike ride felt like a last-minute backup plan.");
add("Q46",0,"Before that day, I thought cycling on a trip would only make me tired and slow me down.");
add("Q19",2,"She likes natural light and usually takes several versions before choosing one. She also photographs small things such as signs, bicycles and food.");
for(const q of ["Q01","Q52"])add(q,2,"When I have more time, I sometimes walk through the exhibition areas before getting coffee.");

// Refresh keywords after the final wording changes.
keys("Q02",["short island trip","Japanese island","missed the bus","public transport","rented bikes","extremely hot","coast","taking photos","last-minute backup plan","tired","sweaty","sunburnt"]);
keys("Q05",["snow-skin mooncakes","Mid-Autumn Festival","family","mother","sweet filling","mooncake skin","mould","pressed the mould too hard","more gently","tea","basic steps"]);
keys("Q49",["snow-skin mooncake","Mid-Autumn Festival","family","mother","sweet filling","mould","pattern","homemade mooncakes","tea","soft and slightly sweet","made the food ourselves","ate it together"]);
keys("Q26",["new law","congestion fee","private cars","busiest parts","peak hours","unnecessary trips","buses","public transport","leave the car at home","drive less","easy to understand","extra fee"]);
keys("Q29",["good service","smartwatch","Apple Store","staff member","exercise","heart-rate","sleep functions","cheaper options","most expensive model","set up","spend more","sales pitch"]);
keys("Q38",["changed recently","weekend","working overtime","K-pop group","urgent work","team","day off","train was already sold out","early flight","concert on time","finished later"]);
keys("Q45",["important decision","concert","working overtime","urgent work","team","day off","train was already sold out","early flight","concert on time","finished later","only happen once"]);
keys("Q48",["important decision","day off","concert","working overtime","urgent work","team","train was already sold out","early flight","concert on time","work seriously","only happen once"]);
keys("Q16",["Mount Wakakusa","Nara","shopping","taxi","sunset","walk uphill","green grass slopes","deer","fed","photos","exhausted","worth it"]);
})();
