(()=>{
const data={
"广告":{
 groups:[
  ["积极作用",[["提供产品信息，帮助消费者做出购买决策","Provides information, help customers make wise decisions"],["刺激消费，促进经济发展","stimulate consumption and boost economic growth"],["公益广告引发公众对社会问题的关注","Public advertising campaigns create people's awareness about societal issues"]]],
  ["消极作用",[["刺激人们冲动消费","encourage impulse buying"],["信息不全面，只提及产品优点","incomprehensive; only claim the advantages of products"],["广告费用增加商品价格","raise the price of products"],["广告可能成为受众不欢迎的信息，尤其在网络媒体上","a nuisance to the audience, especially in online media"]]]
 ],
 vocab:[["commercial / advertisement","广告"],["target audience","目标受众"],["induce","诱使，促使"],["marketing tools","市场营销手段"],["promotion","促销"],["purchase decision","购买决策"],["satisfy / meet the needs","满足需求"],["excessive spending","过度消费"],["consumer goods","消费品"],["consumer society","崇尚消费的社会"],["purchase the most advanced model","购买最先进的版本"],["outmoded / outdated","过时的"],["running costs","运营成本"],["low-income families","低收入家庭"]]
},
"媒体":{
 groups:[
  ["新闻媒体的作用",[["传播最新资讯，让人们了解全球趋势和事件","Provide latest news, keeping people updated on the current trends and happenings worldwide"],["提供娱乐","Serves as a good source of entertainment"],["揭露社会问题，推动政府解决","Disclose social problems and push the government to deal with them"]]],
  ["新闻媒体存在的问题",[["为获取流量而过度报道负面新闻","over-report negative news in order to jockey for traffic"],["歪曲或不实信息误导公众","mislead the public with distorted and false information"]]],
  ["不同传播媒介的特点",[["传统纸媒：经过严格审查，信息准确度较高","Information is more accurate because traditional news publishers are strictly supervised by the government"],["电视：提供声音和画面，比纸媒传递信息更高效","Provide sensory information such as sound and visuals, more efficient in conveying information compared with printed media"],["网络：方便、省时、互动、容易获取","Convenient, time-efficient, interactive, easy availability"]]]
 ],
 vocab:[["the press / media","媒体"],["media coverage","媒体报道"],["news report","新闻报道"],["professional report","专业报道"],["media hype","媒体炒作"],["cater for audiences","迎合观众"],["enforce strict press censorship","加强媒体审查制度"],["conceal the truth","隐瞒真相"],["public opinion","舆论"],["give an exaggerated account of","夸大"],["misleading","有误导性的"],["biased / unobjective","不客观的"],["objective and balanced","客观公正的"],["up-to-the-minute","最新的，及时的"],["a reliable source of information","来源可靠的信息"],["fake news","虚假新闻"]]
},
"环境":{
 groups:[
  ["主要环境问题",[["气候变化 / 全球变暖","climate change / global warming"],["空气污染","air pollution"],["水污染","water pollution"],["垃圾污染","garbage pollution"],["土地荒漠化 / 水土流失 / 土壤酸化","desertification / soil erosion / soil acidification"]]],
  ["根本原因",[["工业扩张","industrial expansion"],["人口增长","population growth"],["长期人类活动","long-term human activities"]]],
  ["解决方案",[["国际：合作、达成共识、制定环保标准","international cooperation, reach the agreement, set international standards for environmental protection"],["政府：制定环保法律、鼓励低碳经济","introduce laws to protect the environment, encourage low carbon economy"],["科技：开发可再生能源、投资节能科技","develop renewable energy, invest in energy-saving technologies"],["企业：推广环保产品、引导绿色消费","promote environmentally-friendly products, lead a green spending habit"]]]
 ],
 vocab:[["low carbon","低碳"],["environmentally-friendly / eco-friendly / green","环保的"],["ecosystem","生态系统"],["sustainable development","可持续发展"],["deplete natural resources","耗尽自然资源"],["discharge pollutants","排放污染物"],["greenhouse effect","温室效应"],["contaminate","污染"],["degrade / deteriorate","恶化"],["renewable energy","可再生能源"],["fuel-efficient vehicles","高效燃油汽车"],["take public transport / carpool / ride a bicycle","公共交通 / 拼车 / 骑车"],["avoid using throw-away products","避免使用一次性产品"],["eco-friendly alternatives","环保替代品"],["sort the daily garbage","生活垃圾分类"]]
},
"教育":{
 groups:[
  ["教育内容",[["学术能力：理论知识、独立思考、批判性思维、创造性思维、分析和解决问题","academic ability: theoretical knowledge, independent thinking, critical thinking, creative thinking, ability to analyse and solve problems"],["实践技能：人际交流、沟通合作、数字化素养","practical skills: interpersonal skills, communication and cooperation skills, digital literacy"],["运动和健康：提高身体素质、培养健康习惯","Health: improve physical fitness, cultivate healthy lifestyle habits"],["兴趣爱好：培养文学、艺术等兴趣","Interests and hobbies: arouse students' interests in literature, art and so on"]]],
  ["教育目的",[["培养独立、有思考能力的个体","nurture independent thinkers"],["为社会提供有生产力和创造力的人才，推动社会各方面发展","ensure a productive and creative workforce, and propel the development in every aspect of society"]]]
 ],
 vocab:[["theoretical / practical","理论的 / 实践的"],["nurture","培养，教育"],["motivate","激发"],["curriculum","课程"],["formative years","成长期"],["formal education / schooling","正式教育"],["receive a good education","接受良好教育"],["school performance","学校表现"],["self-control / self-discipline","自控力 / 自律"],["learn by rote","死记硬背"],["constrain creativity","限制创造力"],["be passionate about","对……有热情"],["well-rounded / versatile","全面发展的"],["career prospects","职业前景"],["academic qualification","学历"],["specialise in a subject","专注于一个学科"],["school-to-work transition","从学校到工作的适应期"]]
},
"科技":{
 groups:[
  ["积极影响",[["提高工作效率","improve work efficiency"],["拓宽获取知识渠道，足不出户学习全球知识","obtain information in various ways, learn on a global scale without leaving home"],["为生活提供便利","make lives more convenient"],["促进交流，扩大社交，与全球志同道合的人联系","promote communication, make contact with similar minded people worldwide"]]],
  ["消极影响",[["侵犯隐私","violate one's privacy"],["不良内容影响青少年行为，导致青少年犯罪","inappropriate content, have negative effects on teenagers' behaviour, lead to juvenile delinquency"],["增加工作压力，模糊工作与家庭边界","increasing pressure of work, work-life blur"],["不利于身体健康：久坐、户外活动减少","negatively affect physical health, sedentary lifestyle, less outdoor activities"],["损害精神健康：社交隔离、孤独、抑郁","undermine mental health, socially isolated, cause loneliness and depression"],["安全问题，如网络诈骗","security issue, cyber fraud"]]]
 ],
 vocab:[["break down geographical barriers","打破地理障碍"],["high-tech devices","高科技设备"],["cutting-edge technology","高端科技"],["electronic / digital devices / gadgets","电子产品"],["boost productivity","提高生产力"],["virtual world","虚拟世界"],["weaken one's eyesight","视力下降"],["the information age","信息时代"],["surf the internet","上网"],["due to the proliferation of the internet","由于互联网的普及"],["innovation","创新"],["cost-effective machines","节约成本的机器"],["telecommunication","远程交流"],["conventional ways of communication","传统交流方式"],["online retailers","网络零售商"],["cyber crimes","网络犯罪"],["media violence","媒体暴力"]]
},
"政府":{
 groups:[
  ["政府责任",[["保卫国家安全、维护社会稳定","ensure national security, stabilize the society"],["保证国民健康、完善医疗设施","improve the nation's general health, upgrade medical facilities"],["改善道路等公共基础设施","improve infrastructure such as roads"],["精神文化建设，满足人民精神需求","satisfy people's spiritual needs"],["发展经济、教育、科学研究","boost economy, promote education and scientific research"]]],
  ["优先次序",[["先满足基础需求，再投资娱乐设施","give priority to infrastructure, education and medical care to satisfy people's basic needs before investing in recreational facilities"]]]
 ],
 vocab:[["the government / the authorities","政府 / 当局"],["government budget","政府预算"],["government tax revenue","政府税收"],["infrastructure","基础设施"],["public service","公共服务"],["prioritize","优先考虑"],["financial aid / financial assistance","经济资助"],["subsidy","补贴"],["vulnerable groups","弱势群体"],["create job opportunities","创造就业机会"],["spur economic growth","刺激经济发展"],["bridge the gap between rich and poor","缩小贫富差距"],["ensure social equality","确保社会公平"],["elevate people's standard of living","提高人民生活水平"],["implement effective policies","实施有效政策"],["introduce laws / enact laws","颁布法律"],["tax reduction and exemption","税收减免"],["preferential policies","优惠政策"]]
},
"犯罪":{
 groups:[
  ["犯罪原因",[["缺乏教育和培训","lack of education and training"],["父母不称职","poor parenting"],["贫困","poverty"],["失业","unemployment"],["媒体暴力","media violence"],["同龄人影响","peer pressure"],["法律体系不健全","ineffective legal system"]]],
  ["解决方案",[["加强教育与职业培训，提高就业率","education and job training, reduce unemployment rate"],["完善社会福利保障、减少贫困","enhance welfare system, alleviate poverty"],["完善法律制度","perfect legal system"],["严厉惩罚","severe punishment"],["加强公共安全措施，如安装监控摄像头","more security measures in public places such as installing surveillance cameras"]]]
 ],
 vocab:[["criminal / offender / law-breaker","罪犯"],["commit crimes / break laws / violate laws","犯罪"],["crack down on / curb / combat crimes","打击犯罪"],["bring somebody to justice","将某人绳之以法"],["retribution / punishment","惩罚"],["preventive measure","预防措施"],["nonserious crimes / trivial offences","轻罪"],["serious crimes","严重犯罪"],["severe consequences","严重后果"],["pose a threat to public safety","威胁公共安全"],["stringent","严厉的"],["impulsive","冲动的"],["juvenile delinquency","青少年犯罪"],["vocational / job training","职业培训"],["reform / rehabilitate prisoners","改造囚犯"],["a deterrent effect","震慑作用"]]
}
};

const css=`
.topic-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 14px}.topic-tab{border:1px solid var(--line);background:#fff;color:#625e57;padding:7px 11px;border-radius:10px;cursor:pointer;font-size:13px}.topic-tab.active{background:#1f1f1c;color:#fff;border-color:#1f1f1c}.topic-panel{display:none}.topic-panel.active{display:block}.topic-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:14px}.idea-group+.idea-group{margin-top:16px}.idea-title{font-size:13px;font-weight:700;margin-bottom:7px}.idea-row{padding:9px 0;border-bottom:1px solid var(--line)}.idea-row:last-child{border-bottom:0}.idea-cn{font-size:13px;line-height:1.55}.idea-en{font-size:13px;line-height:1.55;color:#4f4b45;margin-top:3px}.vocab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.vocab-item{border:1px solid var(--line);background:#faf9f6;border-radius:10px;padding:8px 9px}.vocab-en{font-size:12.5px;font-weight:650;line-height:1.45}.vocab-cn{font-size:11.5px;color:var(--muted);line-height:1.45;margin-top:2px}@media(max-width:820px){.topic-grid{grid-template-columns:1fr}.vocab-grid{grid-template-columns:1fr 1fr}}@media(max-width:520px){.vocab-grid{grid-template-columns:1fr}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

const mainTabs=document.querySelector('.tabs');
const mainBtn=document.createElement('button');mainBtn.className='tab';mainBtn.dataset.tab='topics';mainBtn.textContent='话题观点';mainTabs.appendChild(mainBtn);

const sec=document.createElement('section');sec.id='topics';sec.className='panel';
const names=Object.keys(data);
sec.innerHTML=`<div class="callout">只保留 PDF 中的通用观点与核心表达；例题分析和范文不纳入。</div><div class="topic-tabs">${names.map((n,i)=>`<button class="topic-tab ${i?'':'active'}" data-topic="${n}">${n}</button>`).join('')}</div>${names.map((n,i)=>{const d=data[n];const groups=d.groups.map(g=>`<div class="idea-group"><div class="idea-title">${g[0]}</div>${g[1].map(x=>`<div class="idea-row"><div class="idea-cn">${x[0]}</div><div class="idea-en">${x[1]}</div></div>`).join('')}</div>`).join('');const vs=d.vocab.map(x=>`<div class="vocab-item"><div class="vocab-en">${x[0]}</div><div class="vocab-cn">${x[1]}</div></div>`).join('');return `<div class="topic-panel ${i?'':'active'}" data-topic-panel="${n}"><div class="topic-grid"><div class="card"><div class="section-label">通用观点</div>${groups}</div><div class="card"><div class="section-label">核心表达 · 优先背</div><div class="vocab-grid">${vs}</div></div></div></div>`}).join('')}`;
document.querySelector('.wrap').appendChild(sec);

mainBtn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));mainBtn.classList.add('active');sec.classList.add('active')});
document.querySelectorAll('.tab:not([data-tab="topics"])').forEach(t=>t.addEventListener('click',()=>{mainBtn.classList.remove('active');sec.classList.remove('active')}));
sec.querySelectorAll('.topic-tab').forEach(b=>b.addEventListener('click',()=>{sec.querySelectorAll('.topic-tab').forEach(x=>x.classList.remove('active'));sec.querySelectorAll('.topic-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');sec.querySelector(`[data-topic-panel="${b.dataset.topic}"]`).classList.add('active')}));
})();