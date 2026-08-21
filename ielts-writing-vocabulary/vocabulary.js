/* IELTS Writing Vocabulary Bank — curated for a Band 6.5 learner aiming at Band 7.
   A = active recall, B = topic recall, C = recognition only. */

const vocabulary = [];

function addBlock(task, category, level, kind, text) {
  text.trim().split('\n').forEach((line) => {
    const [english, chinese, warning = ''] = line.split('|');
    vocabulary.push({
      id: `${task}-${category}-${english}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      task, category, level, kind, english, chinese, warning
    });
  });
}

const categoryInfo = {
  'Core arguments': ['万能论证与逻辑', '观点、原因、影响和让步', 'public policy'],
  'Government': ['政府与公共政策', '政府责任、投入与监管', 'government action'],
  'Education': ['教育', '学校、技能与教育公平', 'education'],
  'Technology': ['科技', '数字生活、自动化与隐私', 'technology'],
  'Environment': ['环境', '污染、能源与可持续发展', 'environmental policy'],
  'Work & economy': ['工作与经济', '就业、职场与经济发展', 'employment'],
  'Health': ['健康', '公共医疗、生活方式与心理健康', 'public health'],
  'Crime': ['犯罪', '犯罪原因、惩罚与改造', 'crime prevention'],
  'Media': ['媒体', '信息、广告与社交媒体', 'media'],
  'Culture & family': ['文化与家庭', '传统、儿童与家庭关系', 'family life'],
  'Cities & transport': ['城市与交通', '城市化、住房与公共交通', 'urban development'],
  'Globalisation & tourism': ['全球化与旅游', '国际交流、贸易与旅行', 'globalisation'],
  'Society & equality': ['社会与平等', '个人责任、福利与社会关系', 'social development'],
  'Core words': ['核心名词', '观点、原因、影响与解决方案', 'core academic vocabulary'],
  'High-frequency verbs': ['高频动词', '写作中最常调用的动作词', 'high-frequency academic verbs'],
  'Useful modifiers': ['实用修饰词', '准确表达程度、评价与变化', 'useful modifiers'],
  'Education & work words': ['教育与工作单词', '教育、技能、职业与收入', 'education and work'],
  'Technology & media words': ['科技与媒体单词', '数字科技、信息与媒体', 'technology and media'],
  'Environment & city words': ['环境与城市单词', '环境、资源、交通与城市', 'environment and cities'],
  'Health & society words': ['健康与社会单词', '健康、社会、文化与家庭', 'health and society'],
  'Process': ['流程图', '步骤、原料、加工与循环', 'a process diagram'],
  'Trends': ['趋势图', '上升、下降、波动与稳定', 'a line graph'],
  'Comparison': ['比较与占比', '柱状图、饼图、表格与对比', 'a comparative chart'],
  'Maps': ['地图题', '位置、建设、拆除与用途变化', 'a map'],
  'Overview': ['Overview 总览', '概括最大趋势和主要特征', 'an overview'],
  'Data language': ['数据表达', '时间、数值、近似与幅度', 'statistical data']
};

function addWords(category, text) {
  text.trim().split('\n').forEach((line) => {
    const [english, chinese, level, pos, collocation, example, warning = ''] = line.split('|');
    vocabulary.push({
      id: `words-${category}-${english}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      task: 'Words', category, level, kind: 'word', english, chinese, pos, collocation, example, warning
    });
  });
}

// WORDS — 220 standalone words. These support accurate phrasing rather than rare-word display.
addWords('Core words', `
benefit|好处；使受益|A|名词/动词|bring benefits to|The policy can bring substantial benefits to local residents.
drawback|缺点|A|名词|a major drawback|A major drawback is the high cost of implementation.
advantage|优势|A|名词|have an advantage over|Public transport has an advantage over private cars in crowded cities.
disadvantage|劣势；不利条件|A|名词|put someone at a disadvantage|High tuition fees may put poorer students at a disadvantage.
impact|影响|A|名词/动词|have an impact on|Technology has a significant impact on the way people work.
effect|影响；效果|A|名词|have an effect on|Regular exercise has a positive effect on mental health.
consequence|后果|A|名词|serious consequences|Poor planning can have serious consequences for local communities.
factor|因素|A|名词|a key factor|Cost is a key factor in people’s housing decisions.
cause|原因；导致|A|名词/动词|the main cause of|Traffic is one of the main causes of air pollution.
solution|解决方案|A|名词|a practical solution to|Better public transport is a practical solution to congestion.
approach|方法；处理方式|A|名词|adopt an approach|Schools should adopt a more practical approach to learning.
measure|措施|A|名词|take measures to|Governments should take measures to protect vulnerable groups.
policy|政策|A|名词|implement a policy|The government introduced a policy to reduce plastic waste.
issue|问题；议题|A|名词|address an issue|This issue requires cooperation between governments and individuals.
challenge|挑战|A|名词|face a challenge|Many cities face the challenge of providing affordable housing.
opportunity|机会|A|名词|provide an opportunity to|Online courses provide an opportunity to learn new skills.
responsibility|责任|A|名词|take responsibility for|Individuals should take responsibility for their daily choices.
priority|优先事项|A|名词|give priority to|Public health should be a national priority.
resource|资源|A|名词|allocate resources to|More resources should be allocated to preventive healthcare.
access|获得机会；使用权|A|名词|have access to|All children should have access to quality education.
awareness|意识|A|名词|raise awareness of|Campaigns can raise awareness of environmental problems.
behaviour|行为|A|名词|influence behaviour|Advertising can influence consumer behaviour.
attitude|态度|A|名词|change attitudes towards|Education can change attitudes towards people with disabilities.
trend|趋势|A|名词|an upward trend|The chart shows an upward trend in internet use.
demand|需求|A|名词/动词|meet demand for|Cities must meet the growing demand for housing.
evidence|证据|A|名词|provide evidence that|The research provides evidence that early intervention is effective.
research|研究|A|名词/动词|conduct research into|More research is needed into the long-term effects of automation.
development|发展|A|名词|sustainable development|Education plays a central role in economic development.
growth|增长|A|名词|economic growth|Investment in infrastructure can support economic growth.
decline|下降；衰退|A|名词/动词|a gradual decline|The graph shows a gradual decline in car use.
improvement|改善|A|名词|a significant improvement|The new system led to a significant improvement in service quality.
reduction|减少|A|名词|a reduction in|The policy resulted in a reduction in household waste.
increase|增加|A|名词/动词|an increase in|There was a sharp increase in online shopping.
change|变化；改变|A|名词/动词|bring about change|Collective action can bring about lasting change.
choice|选择|A|名词|make a choice|Consumers should be able to make an informed choice.
decision|决定|A|名词|make a decision|Reliable information helps people make better decisions.
support|支持|A|名词/动词|provide support for|Local authorities should provide support for small businesses.
pressure|压力|A|名词|place pressure on|Population growth can place pressure on public services.
risk|风险|A|名词/动词|reduce the risk of|Safety rules can reduce the risk of injury.
harm|伤害|A|名词/动词|cause harm to|Misleading information can cause harm to the public.
need|需要|A|名词/动词|meet the needs of|Schools should meet the needs of different learners.
outcome|结果|B|名词|positive outcomes|Early support can lead to better educational outcomes.
balance|平衡|B|名词/动词|strike a balance|Governments must strike a balance between growth and conservation.
standard|标准；水平|B|名词|raise standards|Teacher training can raise educational standards.
quality|质量|B|名词|improve the quality of|Investment can improve the quality of public services.
equality|平等|B|名词|promote equality|Equal pay policies can promote gender equality.
inequality|不平等|B|名词|reduce inequality|Progressive taxation may help reduce income inequality.
participation|参与|B|名词|encourage participation|Free facilities can encourage public participation in sport.
cooperation|合作|B|名词|international cooperation|Climate change requires international cooperation.
regulation|监管；规定|B|名词|stricter regulation|Online platforms may require stricter regulation.
`);

addWords('High-frequency verbs', `
improve|改善；提高|A|动词|improve access to|Governments should improve access to affordable healthcare.
enhance|提升；增强|B|动词|enhance efficiency|Digital systems can enhance workplace efficiency.|不要为了替换 improve 而滥用
reduce|减少|A|动词|reduce the cost of|Public transport can reduce the cost of commuting.
boost|促进；提高|B|动词|boost productivity|Better training can boost employee productivity.
address|处理；解决|A|动词|address a problem|Policies should address the causes of educational inequality.|address 后不加 with
tackle|处理；应对|B|动词|tackle a problem|Long-term investment is needed to tackle housing shortages.
assist|帮助；协助|B|动词|assist someone with|Career advisers can assist students with employment decisions.
provide|提供|A|动词|provide access to|Libraries provide access to reliable information.
ensure|确保|A|动词|ensure equal access|Governments should ensure equal access to essential services.
encourage|鼓励|A|动词|encourage people to|Tax incentives can encourage people to use clean energy.
promote|促进；推广|A|动词|promote healthy habits|Schools can promote healthy eating habits.
prevent|防止|A|动词|prevent someone from doing|Education may prevent young people from committing crimes.
protect|保护|A|动词|protect someone from|Strong laws can protect consumers from dishonest advertising.
regulate|监管|B|动词|regulate an industry|Authorities should regulate industries that produce harmful waste.
invest|投资|A|动词|invest in|Governments should invest in public transport.
allocate|分配|B|动词|allocate funds to|More funds should be allocated to rural schools.
implement|实施|B|动词|implement a policy|Effective policies must be implemented consistently.
enforce|执行；强制实施|B|动词|enforce the law|The police are responsible for enforcing the law.
maintain|维持|A|动词|maintain standards|Regular inspections help maintain safety standards.
achieve|实现|A|动词|achieve a goal|Countries must cooperate to achieve sustainable growth.
acquire|获得；习得|B|动词|acquire skills|Students need opportunities to acquire practical skills.
adapt|适应；调整|A|动词|adapt to change|Workers must adapt to rapid technological change.
enable|使能够|A|动词|enable someone to do|Online services enable people to work from home.
affect|影响|A|动词|affect quality of life|Noise pollution can affect residents’ quality of life.
influence|影响|A|动词|influence decisions|Social media can influence purchasing decisions.
shape|塑造|B|动词|shape attitudes|Parents and teachers shape children’s attitudes.
create|创造；造成|A|动词|create opportunities|Technology can create new employment opportunities.
generate|产生|B|动词|generate income|Tourism can generate income for rural communities.
replace|替代|A|动词|replace A with B|Some routine jobs may be replaced by automation.
limit|限制|A|动词|limit access to|High prices can limit access to healthy food.
require|需要|A|动词|require investment|Improving infrastructure requires substantial investment.
involve|涉及|A|动词|involve several stages|The manufacturing process involves several stages.
contribute|促成；贡献|A|动词|contribute to|Regular exercise contributes to better mental health.|to 后接名词或动名词
facilitate|促进；使更容易|B|动词|facilitate communication|Technology can facilitate communication across long distances.
overcome|克服|B|动词|overcome barriers|Financial support helps poorer students overcome barriers to education.
strengthen|加强|B|动词|strengthen relationships|Shared activities can strengthen family relationships.
weaken|削弱|B|动词|weaken social ties|Excessive screen time may weaken social ties.
raise|提高；筹集|A|动词|raise awareness|Campaigns can raise awareness of public health risks.
fluctuate|波动|B|动词|fluctuate considerably|Fuel prices fluctuated considerably during the period.
vary|变化；不同|B|动词|vary considerably|Housing costs vary considerably between regions.
`);

addWords('Useful modifiers', `
significant|显著的；重要的|A|形容词|a significant impact|The policy had a significant impact on low-income families.
considerable|相当大的|B|形容词|considerable pressure|Rapid growth placed considerable pressure on local services.
substantial|大量的；实质性的|B|形容词|substantial investment|The project requires substantial public investment.
gradual|逐渐的|A|形容词|a gradual increase|The chart shows a gradual increase in employment.
rapid|快速的|A|形容词|rapid development|Rapid technological development has changed the labour market.
stable|稳定的|A|形容词|remain stable|The unemployment rate remained stable throughout the period.
effective|有效的|A|形容词|an effective solution|Prevention is often a more effective solution than treatment.
practical|实际的；可行的|A|形容词|a practical approach|Vocational courses provide practical training.
essential|必不可少的|A|形容词|be essential for|Clean water is essential for public health.
beneficial|有益的|A|形容词|be beneficial to|Regular exercise is beneficial to people of all ages.
harmful|有害的|A|形容词|be harmful to|Air pollution is harmful to human health.
negative|负面的|A|形容词|a negative effect|Long working hours can have a negative effect on family life.
positive|积极的|A|形容词|a positive outcome|Early support can produce positive outcomes.
affordable|负担得起的|A|形容词|affordable housing|Cities need more affordable housing.
accessible|容易获得的；无障碍的|B|形容词|make services accessible|Online platforms make education more accessible.
reliable|可靠的|A|形容词|reliable information|People need reliable information to make informed decisions.
sustainable|可持续的|A|形容词|sustainable development|Public policy should support sustainable development.
responsible|负责任的|A|形容词|responsible behaviour|Schools should encourage responsible behaviour.
equal|平等的|A|形容词|equal opportunities|Every child should have equal educational opportunities.
fair|公平的|A|形容词|fair treatment|Workers should receive fair treatment and adequate pay.
flexible|灵活的|B|形容词|flexible working hours|Flexible working hours can improve work-life balance.
efficient|高效的|B|形容词|an efficient system|An efficient transport system saves time and energy.
productive|富有成效的；高产的|B|形容词|a productive workforce|Training helps create a more productive workforce.
competitive|有竞争力的|B|形容词|a competitive market|A competitive market may lead to better services.
vulnerable|易受伤害的|B|形容词|vulnerable groups|Policies should protect vulnerable groups.
disadvantaged|处境不利的|B|形容词|disadvantaged children|Extra support should be provided for disadvantaged children.
widespread|广泛的|B|形容词|widespread concern|There is widespread concern about data privacy.
long-term|长期的|A|形容词|long-term consequences|Poor planning can have long-term consequences.
short-term|短期的|A|形容词|short-term benefits|Short-term benefits should be weighed against future costs.
overall|总体的；总体上|A|形容词/副词|the overall trend|The overall trend was upward.
relatively|相对地|A|副词|remain relatively stable|The figure remained relatively stable after 2015.
approximately|大约|A|副词|approximately 50 percent|Approximately 50 percent of residents used public transport.
significantly|显著地|A|副词|increase significantly|The number of users increased significantly.
gradually|逐渐地|A|副词|decline gradually|The figure declined gradually over the period.
sharply|急剧地|A|副词|rise sharply|House prices rose sharply in 2020.
steadily|稳定地；持续地|A|副词|grow steadily|The population grew steadily throughout the decade.
increasingly|越来越|B|副词|become increasingly common|Remote work has become increasingly common.
particularly|尤其|A|副词|particularly important|This is particularly important for older people.
directly|直接地|B|副词|directly affect|Transport costs directly affect household budgets.
indirectly|间接地|B|副词|indirectly influence|Advertising may indirectly influence children’s choices.
`);

addWords('Education & work words', `
curriculum|课程设置|B|名词|school curriculum|Financial literacy should be included in the school curriculum.
literacy|读写能力；素养|B|名词|digital literacy|Schools should teach both basic and digital literacy.
tuition|学费；教学|B|名词|tuition fees|High tuition fees may discourage poorer students.
graduate|毕业生；毕业|A|名词/动词|university graduates|Many university graduates struggle to find suitable work.
qualification|资格；学历|A|名词|professional qualifications|Professional qualifications can improve career prospects.
skill|技能|A|名词|practical skills|Employers value practical skills and work experience.
knowledge|知识|A|名词|acquire knowledge|Education enables students to acquire specialist knowledge.
discipline|纪律；学科|B|名词|school discipline|Clear rules can improve school discipline.
motivation|动力|A|名词|student motivation|Supportive teachers can increase student motivation.
creativity|创造力|B|名词|encourage creativity|Art education can encourage creativity.
productivity|生产力|A|名词|increase productivity|Better training can increase workplace productivity.
employment|就业|A|名词|employment opportunities|Investment can create employment opportunities.
unemployment|失业|A|名词|reduce unemployment|Job training may help reduce youth unemployment.
career|职业生涯|A|名词|career development|Employees need opportunities for career development.
salary|工资|A|名词|a competitive salary|A competitive salary helps attract skilled workers.
income|收入|A|名词|household income|Rising living costs place pressure on household income.
workplace|工作场所|A|名词|workplace safety|Employers are responsible for workplace safety.
workforce|劳动力队伍|B|名词|a skilled workforce|Education helps build a skilled workforce.
profession|职业；专业|B|名词|enter a profession|Graduates need training before entering the profession.
occupation|职业|B|名词|a skilled occupation|Automation affects some occupations more than others.
employer|雇主|A|名词|employer responsibility|Employers should provide safe working conditions.
employee|雇员|A|名词|employee satisfaction|Flexible hours can improve employee satisfaction.
training|培训|A|名词|vocational training|Vocational training prepares people for practical work.
experience|经验；经历|A|名词|gain experience|Part-time work allows students to gain experience.
flexibility|灵活性|B|名词|workplace flexibility|Workplace flexibility can help working parents.
`);

addWords('Technology & media words', `
technology|科技|A|名词|digital technology|Technology has transformed communication and work.
innovation|创新|B|名词|technological innovation|Innovation can improve the quality of public services.
automation|自动化|B|名词|workplace automation|Automation may replace some routine jobs.
algorithm|算法|C|名词|algorithmic decisions|Algorithms should be checked for unfair bias.
privacy|隐私|A|名词|protect privacy|Online companies must protect users’ privacy.
security|安全|A|名词|data security|Strong passwords improve data security.
data|数据|A|名词|personal data|Companies should not misuse personal data.
platform|平台|A|名词|online platform|Online platforms can spread information rapidly.
device|设备|A|名词|digital devices|Excessive use of digital devices may affect sleep.
internet|互联网|A|名词|internet access|Reliable internet access is essential for remote learning.
communication|交流；通信|A|名词|facilitate communication|Technology can facilitate communication across borders.
information|信息|A|名词|reliable information|Citizens need reliable information from trusted sources.
media|媒体|A|名词|mass media|The media can shape public opinion.
advertising|广告活动|A|名词|online advertising|Online advertising strongly influences consumer behaviour.
misinformation|错误信息|B|名词|spread misinformation|Platforms should prevent the spread of misinformation.
bias|偏见；偏向|B|名词|media bias|Media bias can affect how events are understood.
content|内容|A|名词|harmful content|Children should be protected from harmful online content.
audience|受众|B|名词|a wider audience|Digital media can reach a wider audience.
journalism|新闻业|C|名词|responsible journalism|Responsible journalism supports informed public debate.
censorship|审查制度|C|名词|government censorship|Excessive censorship may restrict freedom of expression.
`);

addWords('Environment & city words', `
pollution|污染|A|名词|air pollution|Air pollution is a serious threat to public health.
emission|排放物|A|名词|carbon emissions|Public transport can reduce carbon emissions.
climate|气候|A|名词|climate change|Climate change requires coordinated international action.
energy|能源；能量|A|名词|renewable energy|Countries should invest in renewable energy.
ecosystem|生态系统|B|名词|protect ecosystems|Industrial waste can damage fragile ecosystems.
renewable|可再生的|B|形容词|renewable sources|Energy from renewable sources is becoming cheaper.
biodiversity|生物多样性|C|名词|protect biodiversity|Habitat loss threatens biodiversity.
habitat|栖息地|B|名词|natural habitats|Urban development can destroy natural habitats.
wildlife|野生动物|B|名词|protect wildlife|National parks help protect wildlife.
conservation|保护；节约|B|名词|environmental conservation|Economic growth should be balanced with conservation.
consumption|消费；消耗|B|名词|energy consumption|Better insulation can reduce energy consumption.
waste|废物；浪费|A|名词/动词|household waste|Cities need better systems for managing household waste.
recycling|回收利用|A|名词|encourage recycling|Deposit schemes can encourage recycling.
transport|交通运输|A|名词|public transport|Reliable public transport can reduce congestion.
infrastructure|基础设施|B|名词|public infrastructure|Rapid growth requires investment in infrastructure.
congestion|拥堵|B|名词|traffic congestion|Better rail services can reduce traffic congestion.
housing|住房|A|名词|affordable housing|Local authorities should build more affordable housing.
urbanisation|城市化|B|名词|rapid urbanisation|Rapid urbanisation places pressure on city services.
population|人口|A|名词|an ageing population|An ageing population increases demand for healthcare.
resident|居民|A|名词|local residents|New developments should meet the needs of local residents.
`);

addWords('Health & society words', `
healthcare|医疗保健|A|名词|healthcare services|Rural communities need better healthcare services.
treatment|治疗|A|名词|medical treatment|Prevention is often cheaper than medical treatment.
prevention|预防|A|名词|disease prevention|Governments should invest more in disease prevention.
disease|疾病|A|名词|chronic disease|Poor diet increases the risk of chronic disease.
obesity|肥胖|B|名词|childhood obesity|Schools can help address childhood obesity.
fitness|健康状况；体能|B|名词|physical fitness|Regular exercise improves physical fitness.
wellbeing|福祉；身心健康|B|名词|mental wellbeing|Social contact is important for mental wellbeing.
stress|压力|A|名词|work-related stress|Long working hours can cause work-related stress.
lifestyle|生活方式|A|名词|a healthy lifestyle|Public campaigns should promote a healthy lifestyle.
diet|饮食|A|名词|a balanced diet|Children need a balanced diet.
exercise|锻炼|A|名词/动词|regular exercise|Regular exercise reduces the risk of disease.
poverty|贫困|A|名词|reduce poverty|Employment programmes can help reduce poverty.
welfare|福利|B|名词|social welfare|Social welfare protects people during difficult periods.
crime|犯罪|A|名词|crime rate|Better opportunities may help lower the crime rate.
punishment|惩罚|A|名词|strict punishment|Strict punishment alone may not prevent crime.
rehabilitation|改造；康复|B|名词|offender rehabilitation|Education is central to offender rehabilitation.
offender|罪犯|B|名词|repeat offenders|Training can reduce the risk of offenders committing crimes again.
victim|受害者|A|名词|support victims|The justice system should support victims of crime.
tradition|传统|A|名词|preserve traditions|Communities should preserve valuable cultural traditions.
culture|文化|A|名词|local culture|Tourism can support or damage local culture.
diversity|多样性|B|名词|cultural diversity|Cultural diversity can enrich society.
identity|身份认同|B|名词|cultural identity|Language is an important part of cultural identity.
family|家庭|A|名词|family relationships|Long working hours may weaken family relationships.
generation|一代人|A|名词|future generations|Environmental decisions affect future generations.
tourism|旅游业|A|名词|tourism industry|The tourism industry creates jobs for local residents.
`);

// TASK 2 — 600 expressions
addBlock('Task 2', 'Core arguments', 'A', 'verb', `
play a crucial role in|在……中发挥关键作用|role 后接 in，不接 to do
have a significant impact on|对……产生显著影响|impact 后用 on
contribute to long-term development|促进长期发展|to 是介词，后接名词或动名词
lead to serious consequences|导致严重后果|to 后接名词，不接动词原形
result in positive outcomes|带来积极结果|不要与 result from（源于）混淆
bring considerable benefits|带来显著好处
provide people with opportunities|为人们提供机会|结构是 provide A with B
offer equal access to services|提供平等的服务获取机会
improve people's quality of life|提高人们的生活质量
raise public awareness|提高公众意识|不用 improve awareness
take effective measures|采取有效措施|通常由政府或机构作主语
address the root cause|解决根本原因|address 本身含“处理”，不加 with
strike a balance between A and B|在 A 与 B 之间取得平衡
reduce the risk of harm|降低伤害风险
place pressure on public services|给公共服务带来压力
meet people's changing needs|满足人们不断变化的需求
create new opportunities|创造新机会
pose a serious threat to|对……构成严重威胁
have long-term consequences for|对……产生长期后果
bring about lasting change|带来持久改变
encourage responsible behaviour|鼓励负责任的行为
make informed decisions|做出知情且理性的决定
take responsibility for|为……承担责任
set a good example|树立好榜样
from a long-term perspective|从长远角度看
to a certain extent|在一定程度上
the benefits outweigh the drawbacks|利大于弊|outweigh 后直接接名词
the drawbacks should not be overlooked|缺点不应被忽视
a balanced approach is required|需要一种平衡的方法
one of the main reasons is that|主要原因之一是|one of 后接复数名词
this is mainly because|这主要是因为
as a result|因此；结果
for example|例如
in other words|换句话说
this is particularly true for|这对……尤其如此
`);
addBlock('Task 2', 'Core arguments', 'B', 'verb', `
facilitate social progress|促进社会进步
enhance overall well-being|提升整体福祉
generate substantial benefits|产生可观好处
give rise to new challenges|引发新挑战
increase the likelihood of conflict|增加冲突的可能性
minimise potential harm|尽量减少潜在伤害
remove barriers to participation|消除参与障碍
enable people to reach their potential|让人们发挥潜力|enable 后用人 + to do
empower individuals to make choices|使个人有能力作出选择
ensure fair access to resources|确保公平获得资源
protect the interests of the public|保护公众利益
respond to changing circumstances|应对不断变化的环境
adapt to rapid change|适应快速变化
achieve sustainable growth|实现可持续增长
produce unintended consequences|产生意想不到的后果
create a vicious cycle|形成恶性循环
create a positive cycle|形成良性循环
have a cumulative effect|产生累积效应
serve the wider public interest|服务更广泛的公共利益
allocate limited resources effectively|有效分配有限资源
another contributing factor is|另一个促成因素是
this can be attributed to|这可以归因于|常用于原因分析
there is no denying that|不可否认的是|后接完整句
despite the fact that|尽管|后接完整句
nevertheless|尽管如此
`);
addBlock('Task 2', 'Core arguments', 'C', 'noun', `
far-reaching implications|深远影响
a multi-faceted issue|多层面的问题|不要把 multi-faceted 当作空洞装饰
a short-term solution|短期解决方案
a long-term strategy|长期策略
competing priorities|相互竞争的优先事项
the underlying problem|潜在的根本问题
the wider social context|更广泛的社会背景
the potential trade-offs|潜在取舍
an evidence-based approach|基于证据的方法
a shared responsibility|共同责任
`);

addBlock('Task 2', 'Government', 'A', 'verb', `
implement effective policies|实施有效政策
introduce practical measures|推出切实措施
enforce existing laws|执行现有法律
impose stricter regulations|实施更严格监管
invest in public infrastructure|投资公共基础设施
improve public services|改善公共服务
provide financial support|提供资金支持
allocate public funds|分配公共资金
offer targeted subsidies|提供有针对性的补贴
provide incentives for change|为改变提供激励
launch public campaigns|开展公众宣传活动
protect public interests|保护公共利益
ensure equal access to education|确保平等接受教育
maintain social stability|维护社会稳定
reduce unnecessary spending|减少不必要支出
prioritise essential services|优先保障基本服务
consult local communities|征询当地社区意见
monitor policy outcomes|监测政策效果
hold authorities accountable|督促政府部门负责
cooperate with the private sector|与私营部门合作
`);
addBlock('Task 2', 'Government', 'B', 'noun', `
government intervention|政府干预
public expenditure|公共支出
policy implementation|政策实施
regulatory framework|监管框架
public accountability|公共问责
political commitment|政治承诺
limited public resources|有限的公共资源
budget constraints|预算限制
tax revenue|税收收入
welfare provision|福利供给
public-private partnership|公私合作
local authorities|地方政府部门
national priorities|国家优先事项
administrative costs|行政成本
long-term planning|长期规划
policy effectiveness|政策有效性
public consultation|公众咨询
transparent decision-making|透明决策
equal treatment under the law|法律面前平等
the role of central government|中央政府的作用
`);
addBlock('Task 2', 'Government', 'C', 'noun', `
institutional capacity|机构执行能力
policy coherence|政策一致性
fiscal responsibility|财政责任
regulatory oversight|监管监督
decentralised decision-making|分权决策
`);

addBlock('Task 2', 'Education', 'A', 'verb', `
equip students with practical skills|让学生具备实践技能|equip A with B
develop critical thinking skills|培养批判性思维能力
improve academic performance|提高学习表现
broaden students' horizons|开阔学生视野
prepare students for future careers|帮助学生为未来职业做准备
encourage independent learning|鼓励自主学习
promote lifelong learning|促进终身学习
provide a supportive learning environment|提供支持性的学习环境
improve access to education|增加接受教育的机会
reduce educational inequality|减少教育不平等
meet the needs of individual learners|满足不同学习者的需要
combine theory with practice|把理论与实践结合起来
gain practical experience|获得实践经验
acquire essential knowledge|获得必要知识
improve employment prospects|改善就业前景
close the gap between education and work|缩小教育与工作的差距
adapt teaching methods|调整教学方法
motivate students to learn|激励学生学习
support students' personal development|支持学生的个人发展
prepare young people for future challenges|帮助年轻人应对未来挑战
`);
addBlock('Task 2', 'Education', 'B', 'noun', `
equal educational opportunities|平等的教育机会
quality of education|教育质量
academic achievement|学业成就
vocational training|职业培训
higher education|高等教育
compulsory education|义务教育
educational resources|教育资源
qualified teachers|合格教师
student motivation|学生学习动力
learning outcomes|学习成果
practical abilities|实践能力
problem-solving skills|解决问题能力
communication skills|沟通能力
interpersonal skills|人际交往能力
digital literacy|数字素养
financial literacy|金融素养
class size|班级规模
school curriculum|学校课程
standardised testing|标准化考试
tuition fees|学费
`);
addBlock('Task 2', 'Education', 'C', 'noun', `
holistic education|全人教育
learner autonomy|学习者自主性
curriculum reform|课程改革
pedagogical innovation|教学创新
knowledge retention|知识留存
`);

addBlock('Task 2', 'Technology', 'A', 'verb', `
improve efficiency|提高效率
increase productivity|提高生产力
save time and effort|节省时间和精力
automate routine tasks|自动处理重复任务
reduce the workload|减轻工作量
provide convenient access to information|提供便捷的信息获取方式
make information more accessible|让信息更容易获取
facilitate communication|促进交流
connect people across distances|连接相隔很远的人
improve the quality of services|提高服务质量
create new job opportunities|创造新的工作机会
transform the way people work|改变人们的工作方式
reduce face-to-face interaction|减少面对面交流
increase dependence on technology|增加对科技的依赖
protect personal information|保护个人信息
address privacy concerns|处理隐私担忧
bridge the digital divide|缩小数字鸿沟
regulate online platforms|监管网络平台
spread information rapidly|快速传播信息
replace some human workers|替代部分人类劳动者
`);
addBlock('Task 2', 'Technology', 'B', 'noun', `
technological advancement|科技进步
digital transformation|数字化转型
artificial intelligence|人工智能
workplace automation|工作场所自动化
online services|在线服务
virtual communication|虚拟交流
internet access|互联网接入
digital devices|数字设备
data privacy|数据隐私
cybersecurity risks|网络安全风险
screen time|屏幕使用时间
online learning|在线学习
remote working|远程工作
digital skills|数字技能
algorithmic bias|算法偏见
misuse of personal data|个人数据滥用
technological unemployment|技术性失业
rapid technological change|快速技术变化
ethical concerns|伦理担忧
human oversight|人工监督
`);
addBlock('Task 2', 'Technology', 'C', 'noun', `
digital inclusion|数字包容
technological literacy|科技素养
automated decision-making|自动化决策
responsible innovation|负责任的创新
data-driven services|数据驱动型服务
`);

addBlock('Task 2', 'Environment', 'A', 'verb', `
reduce carbon emissions|减少碳排放
protect natural resources|保护自然资源
conserve energy|节约能源
recycle household waste|回收生活垃圾
reduce plastic consumption|减少塑料消费
promote renewable energy|推广可再生能源
encourage sustainable practices|鼓励可持续做法
adopt environmentally friendly methods|采用环保方式
raise environmental awareness|提高环保意识
protect endangered species|保护濒危物种
preserve natural habitats|保护自然栖息地
reduce dependence on fossil fuels|减少对化石燃料的依赖
improve waste management|改善废物管理
limit industrial emissions|限制工业排放
invest in clean energy|投资清洁能源
use resources more efficiently|更有效地利用资源
prevent further environmental damage|防止进一步的环境破坏
encourage public participation|鼓励公众参与
adopt a sustainable lifestyle|采用可持续的生活方式
balance development with conservation|平衡发展与保护
`);
addBlock('Task 2', 'Environment', 'B', 'noun', `
climate change|气候变化
global warming|全球变暖
greenhouse gas emissions|温室气体排放
air pollution|空气污染
water pollution|水污染
environmental degradation|环境恶化
sustainable development|可持续发展
renewable energy sources|可再生能源
fossil fuels|化石燃料
natural resources|自然资源
ecological balance|生态平衡
biodiversity loss|生物多样性丧失
wildlife conservation|野生动物保护
excessive consumption|过度消费
industrial waste|工业废物
energy efficiency|能源效率
public transport use|公共交通使用
environmental responsibility|环境责任
long-term environmental costs|长期环境成本
a low-carbon economy|低碳经济
`);
addBlock('Task 2', 'Environment', 'C', 'noun', `
ecosystem resilience|生态系统韧性
resource depletion|资源枯竭
climate adaptation|气候适应
circular economy|循环经济
intergenerational responsibility|代际责任
`);

addBlock('Task 2', 'Work & economy', 'A', 'verb', `
create employment opportunities|创造就业机会
earn a stable income|获得稳定收入
improve job security|提高工作稳定性
achieve a better work-life balance|实现更好的工作生活平衡
gain valuable work experience|获得宝贵的工作经验
develop professional skills|培养职业技能
improve employee productivity|提高员工生产力
increase job satisfaction|提高工作满意度
attract skilled workers|吸引技术人才
support small businesses|支持小型企业
stimulate economic growth|刺激经济增长
boost the local economy|促进地方经济
attract foreign investment|吸引外国投资
increase household income|增加家庭收入
reduce financial pressure|减轻经济压力
meet labour market demands|满足劳动力市场需求
provide flexible working arrangements|提供灵活工作安排
protect workers' rights|保护劳动者权益
improve working conditions|改善工作条件
reduce the unemployment rate|降低失业率
`);
addBlock('Task 2', 'Work & economy', 'B', 'noun', `
career development|职业发展
career prospects|职业前景
professional qualifications|职业资格
practical experience|实践经验
job satisfaction|工作满意度
work-life balance|工作生活平衡
flexible employment|灵活就业
remote work|远程工作
workplace stress|职场压力
heavy workloads|繁重工作量
income inequality|收入不平等
labour market|劳动力市场
skilled workforce|技能型劳动力
economic prosperity|经济繁荣
living costs|生活成本
consumer spending|消费者支出
market demand|市场需求
economic stability|经济稳定
financial security|经济保障
minimum wage|最低工资
`);
addBlock('Task 2', 'Work & economy', 'C', 'noun', `
labour mobility|劳动力流动
occupational mobility|职业流动
income volatility|收入波动
economic resilience|经济韧性
structural unemployment|结构性失业
`);

addBlock('Task 2', 'Health', 'A', 'verb', `
promote a healthy lifestyle|推广健康生活方式
encourage regular exercise|鼓励规律运动
improve access to healthcare|改善医疗服务可及性
provide affordable medical care|提供可负担的医疗服务
prevent chronic diseases|预防慢性疾病
reduce health risks|降低健康风险
raise health awareness|提高健康意识
provide health education|提供健康教育
improve mental well-being|改善心理健康
reduce pressure on hospitals|减轻医院压力
invest in preventive care|投资预防性医疗
address the causes of obesity|处理肥胖的成因
make healthy food more affordable|让健康食品价格更可负担
restrict the advertising of unhealthy food|限制不健康食品广告
support people with mental health problems|支持有心理健康问题的人
improve the quality of medical services|提高医疗服务质量
increase life expectancy|提高预期寿命
maintain a balanced diet|保持均衡饮食
reduce sedentary behaviour|减少久坐行为
protect public health|保护公共健康
`);
addBlock('Task 2', 'Health', 'B', 'noun', `
healthcare system|医疗体系
public health services|公共医疗服务
medical treatment|医疗治疗
preventive measures|预防措施
physical fitness|身体健康水平
mental health|心理健康
life expectancy|预期寿命
chronic illness|慢性疾病
balanced diet|均衡饮食
regular physical activity|规律体育活动
sedentary lifestyle|久坐的生活方式
unhealthy eating habits|不健康饮食习惯
health inequality|健康不平等
medical professionals|医疗专业人员
healthcare costs|医疗成本
early diagnosis|早期诊断
emotional support|情感支持
work-related stress|工作相关压力
sleep quality|睡眠质量
personal well-being|个人福祉
`);

addBlock('Task 2', 'Crime', 'A', 'verb', `
reduce crime rates|降低犯罪率
prevent criminal behaviour|预防犯罪行为
enforce the law|执行法律
impose appropriate punishments|施加适当惩罚
address the root causes of crime|处理犯罪根源
rehabilitate offenders|改造罪犯
help offenders reintegrate into society|帮助罪犯重返社会
provide vocational training for prisoners|为囚犯提供职业培训
create opportunities for young people|为年轻人创造机会
reduce poverty and inequality|减少贫困与不平等
strengthen community ties|加强社区联系
increase police presence|增加警力
protect the public from harm|保护公众免受伤害
deter people from committing crimes|阻止人们犯罪|deter A from doing B
reduce the risk of reoffending|降低再次犯罪风险
support victims of crime|支持犯罪受害者
improve neighbourhood safety|提高社区安全
tackle juvenile crime|处理青少年犯罪
balance punishment with rehabilitation|平衡惩罚与改造
ensure fair trials|确保公正审判
`);
addBlock('Task 2', 'Crime', 'B', 'noun', `
law enforcement|执法
criminal justice system|刑事司法体系
prison sentence|监禁刑罚
community service|社区服务
rehabilitation programmes|改造项目
juvenile crime|青少年犯罪
violent crime|暴力犯罪
property crime|财产犯罪
repeat offenders|惯犯
crime prevention|犯罪预防
social exclusion|社会排斥
peer pressure|同伴压力
lack of opportunity|机会匮乏
public safety|公共安全
victim support|受害者支持
prison overcrowding|监狱过度拥挤
strict punishment|严厉惩罚
restorative justice|恢复性司法
legal responsibility|法律责任
social reintegration|社会再融入
`);

addBlock('Task 2', 'Media', 'A', 'verb', `
spread information quickly|快速传播信息
raise public awareness of social issues|提高公众对社会问题的认识
influence people's opinions|影响人们的观点
shape public attitudes|塑造公众态度
provide reliable information|提供可靠信息
verify information before sharing it|分享前核实信息
prevent the spread of misinformation|防止错误信息传播
protect individual privacy|保护个人隐私
regulate harmful content|监管有害内容
promote media literacy|提高媒体素养
expose people to different viewpoints|让人们接触不同观点
hold powerful institutions accountable|监督有权力的机构
respect freedom of expression|尊重表达自由
limit children's exposure to advertising|限制儿童接触广告
influence consumer behaviour|影响消费者行为
create unrealistic expectations|制造不现实的期待
encourage excessive consumption|鼓励过度消费
reduce attention spans|缩短注意力持续时间
connect people with shared interests|连接兴趣相同的人
distinguish facts from opinions|区分事实与观点
`);
addBlock('Task 2', 'Media', 'B', 'noun', `
mass media|大众媒体
news coverage|新闻报道
social media platforms|社交媒体平台
public opinion|公众舆论
freedom of speech|言论自由
privacy protection|隐私保护
reliable sources|可靠来源
misleading information|误导信息
fake news|虚假新闻
media influence|媒体影响
advertising pressure|广告压力
consumer culture|消费文化
online communities|网络社区
user-generated content|用户生成内容
information overload|信息过载
media bias|媒体偏见
sensational reporting|煽情报道
fact-checking|事实核查
digital citizenship|数字公民素养
editorial responsibility|编辑责任
`);

addBlock('Task 2', 'Culture & family', 'A', 'verb', `
preserve cultural traditions|保护文化传统
pass traditions on to future generations|把传统传给后代|结构是 pass A on to B
maintain cultural identity|保持文化身份认同
promote cultural understanding|促进文化理解
respect cultural differences|尊重文化差异
broaden cultural horizons|拓宽文化视野
strengthen family bonds|加强家庭纽带
spend quality time with family|与家人共度高质量时间
provide emotional support|提供情感支持
guide children's behaviour|引导儿童行为
shape children's values|塑造儿童价值观
create a supportive home environment|营造支持性的家庭环境
set clear boundaries for children|为孩子设定清晰界限
share household responsibilities|分担家务责任
maintain a healthy family relationship|保持健康的家庭关系
reduce the generation gap|缩小代沟
protect cultural heritage|保护文化遗产
encourage cultural exchange|鼓励文化交流
adapt traditions to modern life|使传统适应现代生活
develop a sense of belonging|培养归属感
`);
addBlock('Task 2', 'Culture & family', 'B', 'noun', `
cultural diversity|文化多样性
cultural heritage|文化遗产
traditional values|传统价值观
cultural identity|文化身份认同
local customs|当地习俗
national identity|国家认同
cross-cultural exchange|跨文化交流
family structure|家庭结构
parental responsibility|父母责任
parental guidance|父母引导
child development|儿童发展
childhood experience|童年经历
family environment|家庭环境
generation gap|代沟
family conflict|家庭冲突
shared values|共同价值观
sense of belonging|归属感
intercultural understanding|跨文化理解
traditional craftsmanship|传统手工艺
cultural homogenisation|文化同质化
`);
addBlock('Task 2', 'Culture & family', 'C', 'noun', `
intangible cultural heritage|非物质文化遗产
collective memory|集体记忆
cultural assimilation|文化同化
intergenerational communication|代际沟通
cultural continuity|文化延续性
`);

addBlock('Task 2', 'Cities & transport', 'A', 'verb', `
improve public transport systems|改善公共交通系统
reduce traffic congestion|缓解交通拥堵
build affordable housing|建设可负担住房
improve urban planning|改善城市规划
invest in local infrastructure|投资地方基础设施
reduce pressure on major cities|减轻大城市压力
promote balanced regional development|促进区域均衡发展
improve living conditions|改善居住条件
create more green spaces|创造更多绿地
encourage the use of public transport|鼓励使用公共交通
make cities more pedestrian-friendly|让城市更适合步行
develop safe cycle lanes|建设安全自行车道
reduce commuting time|减少通勤时间
improve road safety|提高道路安全
limit urban sprawl|限制城市无序扩张
revitalise neglected areas|振兴被忽视地区
provide essential public facilities|提供必要公共设施
manage population growth|管理人口增长
connect rural and urban areas|连接城乡地区
improve access to city centres|改善前往市中心的交通
`);
addBlock('Task 2', 'Cities & transport', 'B', 'noun', `
rapid urbanisation|快速城市化
population density|人口密度
housing shortage|住房短缺
traffic congestion|交通拥堵
public transportation|公共交通
urban infrastructure|城市基础设施
living environment|居住环境
affordable housing|可负担住房
urban poverty|城市贫困
overcrowded cities|过度拥挤的城市
rising housing prices|上涨的房价
public facilities|公共设施
commuting distance|通勤距离
road safety|道路安全
green spaces|绿地
urban sprawl|城市无序扩张
rural depopulation|农村人口减少
regional development|区域发展
pedestrian areas|步行区域
transport emissions|交通排放
`);
addBlock('Task 2', 'Cities & transport', 'C', 'noun', `
mixed-use development|混合用途开发
urban regeneration|城市更新
transport connectivity|交通连通性
compact city planning|紧凑型城市规划
spatial inequality|空间不平等
`);

addBlock('Task 2', 'Globalisation & tourism', 'A', 'verb', `
promote international cooperation|促进国际合作
facilitate cultural exchange|促进文化交流
create jobs in local communities|在当地社区创造工作
generate tourism revenue|创造旅游收入
support local businesses|支持当地企业
attract international visitors|吸引国际游客
protect local communities|保护当地社区
preserve tourist attractions|保护旅游景点
reduce the negative impact of tourism|减少旅游的负面影响
promote responsible tourism|推广负责任旅游
respect local customs|尊重当地习俗
improve cross-cultural understanding|改善跨文化理解
expand access to global markets|扩大进入全球市场的机会
increase international competition|加剧国际竞争
share knowledge across borders|跨国分享知识
create economic dependence|造成经济依赖
threaten local traditions|威胁当地传统
encourage sustainable travel|鼓励可持续旅行
limit visitor numbers|限制游客数量
distribute tourism benefits fairly|公平分配旅游收益
`);
addBlock('Task 2', 'Globalisation & tourism', 'B', 'noun', `
global economic integration|全球经济一体化
international trade|国际贸易
global competition|全球竞争
cross-border communication|跨境交流
cultural exchange|文化交流
economic interdependence|经济相互依赖
multinational companies|跨国公司
global labour market|全球劳动力市场
local tourism industry|当地旅游业
tourist destinations|旅游目的地
peak tourist season|旅游旺季
cultural attractions|文化景点
environmental pressure|环境压力
seasonal employment|季节性就业
over-tourism|过度旅游
local residents|当地居民
traditional ways of life|传统生活方式
international mobility|国际流动
global consumer culture|全球消费文化
responsible travel|负责任旅行
`);

addBlock('Task 2', 'Society & equality', 'A', 'verb', `
reduce social inequality|减少社会不平等
support disadvantaged groups|支持弱势群体
protect vulnerable people|保护易受伤害群体
promote equal opportunities|促进机会平等
strengthen social cohesion|增强社会凝聚力
encourage community participation|鼓励社区参与
build trust within communities|在社区内建立信任
meet the needs of an ageing population|满足老龄人口需求
provide care for older people|为老年人提供照护
promote gender equality|促进性别平等
remove barriers to employment|消除就业障碍
ensure fair treatment|确保公平对待
improve social mobility|改善社会流动
reduce the gap between rich and poor|缩小贫富差距
provide a social safety net|提供社会保障网
encourage voluntary work|鼓励志愿工作
take part in community activities|参与社区活动
respect individual differences|尊重个体差异
develop a sense of responsibility|培养责任感
make a positive contribution to society|为社会作出积极贡献
`);
addBlock('Task 2', 'Society & equality', 'B', 'noun', `
social development|社会发展
social progress|社会进步
social values|社会价值观
social norms|社会规范
individual responsibility|个人责任
collective action|集体行动
public participation|公众参与
local communities|当地社区
social cohesion|社会凝聚力
social mobility|社会流动
equal opportunities|平等机会
disadvantaged groups|弱势群体
vulnerable populations|易受伤害人群
ageing population|老龄人口
gender equality|性别平等
income distribution|收入分配
social welfare|社会福利
community engagement|社区参与
personal freedom|个人自由
collective responsibility|集体责任
quality of life|生活质量
living standards|生活水平
public trust|公众信任
social isolation|社会孤立
community spirit|社区精神
`);
addBlock('Task 2', 'Society & equality', 'C', 'noun', `
social capital|社会资本
intergenerational equity|代际公平
structural inequality|结构性不平等
civic engagement|公民参与
social inclusion|社会包容
welfare dependency|福利依赖
demographic change|人口结构变化
public consensus|社会共识
individual autonomy|个人自主
shared social values|共同社会价值观
`);

// TASK 1 — 180 expressions. Process receives the largest share of A-level items.
addBlock('Task 1', 'Process', 'A', 'process', `
begin with the collection of raw materials|从收集原材料开始
the first stage involves|第一阶段涉及
in the following stage|在下一阶段
once this stage is complete|这一阶段完成后
the material is transported to|材料被运送到
the material is transferred to|材料被转移到
the mixture is heated|混合物被加热
the liquid is cooled|液体被冷却
the material is crushed|材料被压碎
the substance is filtered|物质被过滤
the product is stored|产品被储存
the material is processed|材料被加工
the mixture is poured into|混合物被倒入
the substance is converted into|物质被转化为
the final product is packaged|最终产品被包装
`);
addBlock('Task 1', 'Process', 'B', 'process', `
subsequently|随后
at the same time|与此同时
meanwhile|与此同时
following this|在此之后
after passing through|在经过……之后
before being sent to|在被送往……之前
undergo further processing|经过进一步加工
enter a continuous cycle|进入连续循环
the process is repeated|这一过程被重复
the waste is removed|废料被清除
the remaining material is recycled|剩余材料被回收
the finished product is delivered|成品被运送
`);
addBlock('Task 1', 'Process', 'C', 'noun', `
raw materials|原材料
manufacturing process|制造过程
storage tank|储存罐
processing facility|加工设施
final product|最终产品
`);

addBlock('Task 1', 'Trends', 'A', 'trend', `
rise steadily|稳步上升
increase gradually|逐渐增加
grow significantly|显著增长
climb sharply|急剧上升
reach a peak of|达到……的峰值
fall steadily|稳步下降
decrease gradually|逐渐下降
drop sharply|急剧下降
remain stable|保持稳定
remain unchanged throughout the period|整个时期保持不变
fluctuate considerably|大幅波动
recover gradually|逐渐恢复
level off|趋于平稳
show an upward trend|呈上升趋势
show a downward trend|呈下降趋势
`);
addBlock('Task 1', 'Trends', 'B', 'trend', `
experience a slight increase|经历小幅增长
record a substantial rise|录得大幅上升
see a gradual decline|出现逐渐下降
reach the lowest point|达到最低点
peak at|在……达到峰值
bottom out at|在……触底
return to its initial level|回到初始水平
overtake the figure for|超过……的数值
remain relatively stable|保持相对稳定
vary throughout the period|整个时期内有所变化
`);
addBlock('Task 1', 'Trends', 'C', 'noun', `
an upward trend|上升趋势
a downward trend|下降趋势
a slight fluctuation|轻微波动
a dramatic increase|急剧增长
a moderate decline|适度下降
`);

addBlock('Task 1', 'Comparison', 'A', 'compare', `
be higher than|高于
be lower than|低于
be twice as high as|是……的两倍高
be three times the figure for|是……数值的三倍
account for the largest proportion|占最大比例
make up the smallest share|占最小份额
be similar to|与……相似
differ significantly from|与……存在显著差异
compared with|与……相比
in contrast to|与……形成对比
respectively|分别地
the gap between A and B|A 与 B 之间的差距
`);
addBlock('Task 1', 'Comparison', 'B', 'compare', `
rank first among the categories|在各类别中排名第一
be the second-largest category|是第二大类别
represent approximately one third|约占三分之一
constitute a small minority|构成少数
be almost identical to|与……几乎相同
be marginally higher than|略高于
be considerably lower than|显著低于
exceed the figure for|超过……的数值
the corresponding figure for|……的对应数值
by comparison|相比之下
`);
addBlock('Task 1', 'Comparison', 'C', 'noun', `
the dominant category|占主导的类别
a negligible proportion|可忽略的比例
a marked difference|明显差异
a comparable figure|相近数值
the remaining categories|其余类别
the combined share|合计占比
the respective figures|各自的数值
the overall distribution|整体分布
`);

addBlock('Task 1', 'Maps', 'A', 'map', `
be located to the north of|位于……北面
be situated in the centre of|位于……中心
be adjacent to|与……相邻
be opposite|在……对面
be replaced by|被……取代
be converted into|被改造成
be demolished|被拆除
be constructed|被建造
be expanded|被扩建
be relocated|被迁移
remain unchanged|保持不变
a new road was added|新增了一条道路
`);
addBlock('Task 1', 'Maps', 'B', 'map', `
undergo significant changes|经历重大变化
be transformed into|被转变为
be extended towards|向……延伸
be surrounded by|被……环绕
run alongside|沿着……延伸
be positioned between A and B|位于 A 与 B 之间
occupy the eastern side|占据东侧
make way for|为……腾出空间
additional facilities were introduced|增加了额外设施
the road system was improved|道路系统得到改善
`);
addBlock('Task 1', 'Maps', 'C', 'noun', `
residential area|住宅区
industrial zone|工业区
pedestrian path|步行道
parking area|停车区域
recreational facilities|休闲设施
open space|开放空间
`);

addBlock('Task 1', 'Overview', 'A', 'overview', `
overall, it is clear that|总体来看，很明显
overall, the most noticeable feature is that|总体上，最显著的特征是
in general, most categories increased|总体而言，大多数类别有所上升
the overall trend was upward|总体趋势是上升的
the overall trend was downward|总体趋势是下降的
A remained the largest category|A 始终是最大类别
B recorded the most significant growth|B 录得最显著增长
the figures followed similar patterns|这些数字呈现相似走势
the two figures moved in opposite directions|两个数字走势相反
the area became more urbanised|该地区变得更加城市化
the process consists of several stages|该流程由若干阶段组成
the process begins with A and ends with B|流程始于 A，止于 B
`);
addBlock('Task 1', 'Overview', 'B', 'overview', `
there was an overall increase in|……总体有所增加
there was an overall decline in|……总体有所下降
the largest change occurred in|最大的变化出现在
most figures remained relatively stable|大多数数字保持相对稳定
A consistently had the highest figure|A 的数字一直最高
B was the least significant category|B 是占比最低的类别
the main changes involved|主要变化涉及
the site was substantially redeveloped|该地点经历了大规模重建
no clear overall trend can be seen|看不出明确的总体趋势
the process is linear rather than cyclical|该流程是线性的而非循环的
`);
addBlock('Task 1', 'Overview', 'C', 'overview', `
with the exception of|除……之外
throughout the period|在整个时期
over the period shown|在图示期间
the most striking contrast|最明显的对比
the key feature of the diagram|图表的关键特征
the general pattern|总体模式
the broad picture|整体情况
the main point to note|需要注意的主要一点
`);

addBlock('Task 1', 'Data language', 'A', 'data', `
stand at 50 percent|为 50%
increase from A to B|从 A 增长到 B
increase by 20 percent|增长了 20%|from/to 是终点；by 是变化量
decrease from A to B|从 A 降至 B
decrease by 10 units|减少了 10 个单位
approximately 100|大约 100
just over one half|略高于一半
just under one third|略低于三分之一
between 2000 and 2010|在 2000 至 2010 年之间
over the following decade|在接下来的十年中
`);
addBlock('Task 1', 'Data language', 'B', 'data', `
roughly a quarter|大约四分之一
nearly two thirds|接近三分之二
an increase of 15 percentage points|增加 15 个百分点|百分比与百分点不要混用
at the beginning of the period|在时期开始时
by the end of the period|到时期结束时
over a five-year period|在五年期间
the figure stood at|数字为
the number reached|数量达到
the proportion fell to|比例降至
the rate rose by|比率上升了
`);
addBlock('Task 1', 'Data language', 'C', 'data', `
in the order shown|按照图示顺序
around|大约
marginally|略微
considerably|显著地
in percentage terms|按百分比计算
in absolute terms|按绝对数值计算
the initial figure|初始数值
the final figure|最终数值
the recorded value|记录值
the total number of|……的总数
`);

const actors = {
  'Core arguments': 'Governments and individuals can', Government: 'Governments can', Education: 'Schools can',
  Technology: 'Technology firms and policymakers can', Environment: 'Governments and individuals can',
  'Work & economy': 'Employers and governments can', Health: 'Health authorities and individuals can',
  Crime: 'Governments can', Media: 'Media organisations and users can',
  'Culture & family': 'Families and communities can', 'Cities & transport': 'Local authorities can',
  'Globalisation & tourism': 'Governments and tourism operators can',
  'Society & equality': 'Governments and communities can'
};

const frameExamples = {
  'play a crucial role in': 'Public transport plays a crucial role in reducing traffic congestion.',
  'have a significant impact on': 'Early education can have a significant impact on children’s development.',
  'contribute to long-term development': 'Investment in practical skills can contribute to long-term development.',
  'lead to serious consequences': 'A lack of regulation can lead to serious consequences for vulnerable users.',
  'result in positive outcomes': 'Early intervention can result in positive outcomes for children and families.',
  'bring considerable benefits': 'Flexible working arrangements can bring considerable benefits to employees.',
  'provide people with opportunities': 'Higher education can provide people with opportunities to develop specialist skills.',
  'offer equal access to services': 'Digital platforms can offer equal access to services in remote areas.',
  "improve people's quality of life": 'Reliable healthcare can improve people’s quality of life.',
  'raise public awareness': 'National campaigns can raise public awareness of preventable diseases.',
  'take effective measures': 'Governments should take effective measures to reduce air pollution.',
  'address the root cause': 'Long-term policies should address the root cause rather than the symptoms.',
  'strike a balance between A and B': 'Policymakers must strike a balance between economic growth and environmental protection.',
  'reduce the risk of harm': 'Clear safety standards can reduce the risk of harm to consumers.',
  'place pressure on public services': 'Rapid population growth can place pressure on public services.',
  "meet people's changing needs": 'Education systems must adapt to meet people’s changing needs.',
  'create new opportunities': 'Technological innovation can create new opportunities for small businesses.',
  'pose a serious threat to': 'Uncontrolled development can pose a serious threat to natural habitats.',
  'have long-term consequences for': 'Decisions made today can have long-term consequences for future generations.',
  'bring about lasting change': 'Collective action is more likely to bring about lasting change.',
  'encourage responsible behaviour': 'Financial incentives can encourage responsible behaviour.',
  'make informed decisions': 'Reliable information helps consumers make informed decisions.',
  'take responsibility for': 'Individuals should take responsibility for the waste they produce.',
  'set a good example': 'Parents and teachers can set a good example for children.',
  'from a long-term perspective': 'From a long-term perspective, prevention is more effective than short-term treatment.',
  'to a certain extent': 'To a certain extent, this policy can reduce pressure on public services.',
  'the benefits outweigh the drawbacks': 'For most residents, the benefits of the scheme outweigh the drawbacks.',
  'the drawbacks should not be overlooked': 'However, the financial drawbacks should not be overlooked.',
  'a balanced approach is required': 'A balanced approach is required to protect freedom while reducing harm.',
  'one of the main reasons is that': 'One of the main reasons is that many families cannot afford the service.',
  'this is mainly because': 'This is mainly because public transport remains unreliable in rural areas.',
  'as a result': 'As a result, more people can gain access to essential services.',
  'for example': 'For example, flexible hours can help parents remain in full-time employment.',
  'in other words': 'In other words, the policy treats prevention as a long-term investment.',
  'this is particularly true for': 'This is particularly true for people living in remote communities.',
  'another contributing factor is': 'Another contributing factor is the rising cost of housing.',
  'this can be attributed to': 'This can be attributed to changes in people’s working patterns.',
  'there is no denying that': 'There is no denying that technology has changed the way people communicate.',
  'despite the fact that': 'Despite the fact that the scheme is expensive, it offers substantial long-term benefits.',
  'nevertheless': 'Nevertheless, stricter regulation alone cannot solve the problem.'
};

const overviewExamples = {
  'overall, it is clear that': 'Overall, it is clear that all three categories increased over the period.',
  'overall, the most noticeable feature is that': 'Overall, the most noticeable feature is that car use rose sharply.',
  'in general, most categories increased': 'In general, most categories increased, with the exception of coal consumption.',
  'the overall trend was upward': 'The overall trend was upward, despite a brief decline in 2015.',
  'the overall trend was downward': 'The overall trend was downward, although the figure recovered slightly at the end.',
  'A remained the largest category': 'Category A remained the largest category throughout the period.',
  'B recorded the most significant growth': 'Category B recorded the most significant growth of all five groups.',
  'the figures followed similar patterns': 'The figures followed similar patterns, rising steadily after 2010.',
  'the two figures moved in opposite directions': 'The two figures moved in opposite directions over the period shown.',
  'the area became more urbanised': 'Overall, the area became more urbanised and gained several public facilities.',
  'the process consists of several stages': 'Overall, the process consists of several stages, from collection to distribution.',
  'the process begins with A and ends with B': 'Overall, the process begins with raw materials and ends with the packaged product.',
  'there was an overall increase in': 'There was an overall increase in the use of renewable energy.',
  'there was an overall decline in': 'There was an overall decline in the number of private vehicles.',
  'the largest change occurred in': 'The largest change occurred in the 25–34 age group.',
  'most figures remained relatively stable': 'Most figures remained relatively stable throughout the period.',
  'A consistently had the highest figure': 'Category A consistently had the highest figure, while Category C had the lowest.',
  'B was the least significant category': 'Category B was the least significant category in both years.',
  'the main changes involved': 'The main changes involved the construction of housing and the removal of farmland.',
  'the site was substantially redeveloped': 'Overall, the site was substantially redeveloped for residential use.',
  'no clear overall trend can be seen': 'Overall, no clear overall trend can be seen because the figures fluctuated considerably.',
  'the process is linear rather than cyclical': 'Overall, the process is linear rather than cyclical, ending with delivery to shops.',
  'with the exception of': 'With the exception of Category C, all figures increased.',
  'throughout the period': 'Throughout the period, Category A remained the largest group.',
  'over the period shown': 'Over the period shown, the gap between the two groups widened.',
  'the most striking contrast': 'The most striking contrast is between the youngest and oldest age groups.',
  'the key feature of the diagram': 'The key feature of the diagram is the recycling of waste water.',
  'the general pattern': 'The general pattern is one of gradual growth followed by stability.',
  'the broad picture': 'The broad picture is that public transport became more popular.',
  'the main point to note': 'The main point to note is that the village changed very little.'
};

const dataExamples = {
  'stand at 50 percent': 'In 2020, the figure stood at 50 percent.',
  'increase from A to B': 'The figure increased from 20 to 35 units.',
  'increase by 20 percent': 'Sales increased by 20 percent between 2015 and 2020.',
  'decrease from A to B': 'The rate decreased from 40 percent to 25 percent.',
  'decrease by 10 units': 'The total decreased by 10 units over the period.',
  'approximately 100': 'Approximately 100 people used the service each day.',
  'just over one half': 'Just over one half of respondents chose public transport.',
  'just under one third': 'Just under one third of the budget was spent on housing.',
  'between 2000 and 2010': 'Between 2000 and 2010, the figure rose steadily.',
  'over the following decade': 'Over the following decade, the figure remained stable.',
  'roughly a quarter': 'Roughly a quarter of the population lived alone.',
  'nearly two thirds': 'Nearly two thirds of the total came from domestic sales.',
  'an increase of 15 percentage points': 'The chart shows an increase of 15 percentage points.',
  'at the beginning of the period': 'At the beginning of the period, Category A stood at 30 percent.',
  'by the end of the period': 'By the end of the period, the figure had doubled.',
  'over a five-year period': 'The number increased steadily over a five-year period.',
  'the figure stood at': 'The figure stood at 75 in 2020.',
  'the number reached': 'The number reached 2 million by the end of the period.',
  'the proportion fell to': 'The proportion fell to 18 percent in 2020.',
  'the rate rose by': 'The rate rose by 12 percentage points.',
  'in the order shown': 'The values were 20, 35 and 50, in the order shown.',
  'around': 'The total was around 600 units.',
  'marginally': 'The figure for Group A was marginally higher than that for Group B.',
  'considerably': 'Spending on housing was considerably higher in 2020.',
  'in percentage terms': 'In percentage terms, Category A experienced the largest increase.',
  'in absolute terms': 'In absolute terms, the number rose by 500.',
  'the initial figure': 'The initial figure was 40 percent.',
  'the final figure': 'The final figure was almost twice as high.',
  'the recorded value': 'The recorded value remained below 100.',
  'the total number of': 'The total number of visitors reached 2 million.'
};

function fillTrailingSlot(phrase) {
  if (/ between A and B$/i.test(phrase)) return phrase.replace(/A and B$/i, 'economic growth and environmental protection');
  if (/\b(in|on|for|to|with|into|from|of|towards|through)$/i.test(phrase)) {
    const ending = phrase.match(/\b(in|on|for|to|with|into|from|of|towards|through)$/i)[1].toLowerCase();
    const fillers = {
      in: 'achieving long-term progress', on: 'people’s daily lives', for: 'future generations',
      to: 'essential public services', with: 'reliable public transport', into: 'a finished product',
      from: 'preventive healthcare', of: 'avoidable harm', towards: 'the town centre', through: 'the filtering unit'
    };
    return `${phrase} ${fillers[ending]}`;
  }
  return phrase;
}

function makeExample(item) {
  const phrase = item.english;
  if (item.task === 'Words') return item.example;
  if (frameExamples[phrase]) return frameExamples[phrase];
  if (item.task === 'Task 2') {
    if (item.kind === 'verb') {
      let actor = actors[item.category] || 'People can';
      if (item.category === 'Education' && /^(gain|acquire|improve employment prospects)/.test(phrase)) actor = 'Students can';
      if (item.category === 'Work & economy' && /^(earn|achieve|gain|develop)/.test(phrase)) actor = 'Workers can';
      return `${actor} ${fillTrailingSlot(phrase)} through practical, long-term action.`;
    }
    return `Policies related to ${phrase} require careful planning and reliable evidence.`;
  }
  if (item.kind === 'process') {
    if (/^(subsequently|meanwhile|following this|at the same time)/i.test(phrase)) return `${phrase[0].toUpperCase() + phrase.slice(1)}, the material is sent to the next stage.`;
    if (phrase === 'the first stage involves') return 'The first stage involves collecting and sorting the raw materials.';
    if (phrase === 'in the following stage') return 'In the following stage, the mixture is heated in a large tank.';
    if (phrase === 'once this stage is complete') return 'Once this stage is complete, the product is ready to be packaged.';
    if (phrase === 'begin with the collection of raw materials') return 'The process begins with the collection of raw materials.';
    if (phrase === 'after passing through') return 'After passing through a filter, the liquid enters a storage tank.';
    if (phrase === 'before being sent to') return 'The product is packaged before being sent to local shops.';
    if (/^(undergo|enter)/.test(phrase)) return `The material then ${phrase.replace(/^undergo /, 'undergoes ').replace(/^enter /, 'enters ')}.`;
    const processSlots = {
      'the material is transported to': 'The material is transported to a processing facility',
      'the material is transferred to': 'The material is transferred to a storage tank',
      'the mixture is poured into': 'The mixture is poured into a mould',
      'the substance is converted into': 'The substance is converted into a usable product'
    };
    const completed = processSlots[phrase] || fillTrailingSlot(phrase);
    return `${completed[0].toUpperCase() + completed.slice(1)} before the next stage begins.`;
  }
  if (item.kind === 'trend') {
    const special = {
      'reach a peak of': 'The figure reached a peak of 80 in 2020.',
      'peak at': 'The figure peaked at 75 percent in 2018.',
      'bottom out at': 'The figure bottomed out at 10 percent in 2015.',
      'overtake the figure for': 'The figure for Group A overtook the figure for Group B in 2019.',
      'vary throughout the period': 'The figure varied throughout the period, with no clear overall trend.'
    };
    return special[phrase] || `The figure is expected to ${phrase} over the period.`;
  }
  if (item.kind === 'compare') {
    if (phrase === 'compared with') return 'Compared with Group B, Group A recorded a much higher figure.';
    if (phrase === 'in contrast to') return 'In contrast to Group A, the figure for Group B declined steadily.';
    if (phrase === 'by comparison') return 'By comparison, the other three categories changed only slightly.';
    if (phrase === 'respectively') return 'The figures for Groups A and B were 40% and 25%, respectively.';
    if (phrase === 'the gap between A and B') return 'The gap between Category A and Category B widened over the period.';
    if (phrase === 'the corresponding figure for') return 'The corresponding figure for Group B was only 25 percent.';
    if (phrase === 'exceed the figure for') return 'The figure for Group A exceeded the figure for Group B.';
    if (phrase === 'be three times the figure for') return 'The figure for Group A was three times the figure for Group B.';
    if (phrase.startsWith('be ')) {
      let completed = phrase.replace(/^be /, 'was ');
      if (/\b(than|to|as)$/.test(completed)) completed += ' that for Group B';
      return `The figure for Group A ${completed}.`;
    }
    if (phrase.startsWith('account')) return `Category A ${phrase.replace(/^account/, 'accounted')}.`;
    if (phrase.startsWith('make up')) return `Category A ${phrase.replace(/^make/, 'made')}.`;
    if (phrase.startsWith('represent')) return `Category A ${phrase.replace(/^represent/, 'represented')}.`;
    if (phrase.startsWith('constitute')) return `Category A ${phrase.replace(/^constitute/, 'constituted')}.`;
    if (phrase.startsWith('rank')) return `Category A ${phrase.replace(/^rank/, 'ranked')}.`;
    if (phrase.startsWith('differ')) return `The figure for Group A ${phrase.replace(/^differ/, 'differed')} that for Group B.`;
    return `The chart uses “${phrase}” to compare the two groups.`;
  }
  if (item.kind === 'map') {
    const special = {
      'be located to the north of': 'The school is located to the north of the river.',
      'be situated in the centre of': 'A fountain is situated in the centre of the park.',
      'be adjacent to': 'The car park is adjacent to the main entrance.',
      'be opposite': 'The library is opposite the sports centre.',
      'be replaced by': 'The old factory was replaced by a residential area.',
      'be converted into': 'The warehouse was converted into offices.',
      'be transformed into': 'The farmland was transformed into a housing estate.',
      'be surrounded by': 'The new hotel is surrounded by trees.',
      'be positioned between A and B': 'The café is positioned between the school and the hospital.',
      'run alongside': 'A new footpath runs alongside the river.',
      'make way for': 'Several old buildings were removed to make way for housing.',
      'remain unchanged': 'The farmland in the north remained unchanged.',
      'undergo significant changes': 'The town centre underwent significant changes during the period.',
      'occupy the eastern side': 'The residential area now occupies the eastern side of the site.'
    };
    if (special[phrase]) return special[phrase];
    if (phrase.startsWith('be ')) return `The old building ${fillTrailingSlot(phrase).replace(/^be /, 'was ')}.`;
    if (phrase.startsWith('a new road')) return 'A new road was added to connect the village with the main highway.';
    if (phrase.startsWith('additional facilities')) return 'Additional facilities were introduced on the eastern side of the site.';
    if (phrase.startsWith('the road system')) return 'The road system was improved, while the residential area remained unchanged.';
    return `The old site was changed to ${fillTrailingSlot(phrase)}.`;
  }
  if (item.kind === 'overview') return overviewExamples[phrase];
  if (item.kind === 'data') return dataExamples[phrase];
  if (item.task === 'Task 1' && item.kind === 'noun') return `The diagram uses the term “${phrase}” to label this feature.`;
  return `The report uses “${phrase}” to describe the value accurately.`;
}

vocabulary.forEach((item) => {
  if (item.task === 'Words') {
    item.usage = `${item.pos} · ${item.collocation}`;
  } else {
    item.usage = categoryInfo[item.category]?.[1] || item.category;
    item.example = makeExample(item);
  }
});

const state = {
  task: 'Task 2', level: 'A', category: 'Core arguments', query: '', unmasteredOnly: false,
  visible: 40, hideChinese: false,
  mastered: new Set(JSON.parse(localStorage.getItem('ielts-writing-mastered-v2') || '[]')),
  reviewItem: null
};

const $ = (selector) => document.querySelector(selector);
const cards = $('#cards');
const template = $('#cardTemplate');

function saveMastered() {
  localStorage.setItem('ielts-writing-mastered-v2', JSON.stringify([...state.mastered]));
  updateProgress();
}

function filteredItems() {
  const q = state.query.trim().toLowerCase();
  return vocabulary.filter((item) => {
    if (state.task !== 'all' && item.task !== state.task) return false;
    if (state.level !== 'all' && item.level !== state.level) return false;
    if (state.category !== 'all' && item.category !== state.category) return false;
    if (state.unmasteredOnly && state.mastered.has(item.id)) return false;
    if (q && !`${item.english} ${item.chinese} ${item.category} ${item.usage}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function updateProgress() {
  const mastered = vocabulary.filter((item) => state.mastered.has(item.id)).length;
  $('#masteredCount').textContent = mastered;
  $('#progressText').textContent = `${mastered} / ${vocabulary.length} 已掌握`;
  $('#progressBar').style.width = `${(mastered / vocabulary.length) * 100}%`;
}

function renderNav() {
  const nav = $('#categoryNav');
  nav.innerHTML = '';
  ['Words', 'Task 2', 'Task 1'].forEach((task) => {
    const group = document.createElement('div');
    group.className = 'nav-group';
    const taskTitle = task === 'Words' ? 'WORDS 高频单词' : task === 'Task 2' ? 'TASK 2 大作文' : 'TASK 1 小作文';
    group.innerHTML = `<div class="nav-group-title">${taskTitle}</div>`;
    [...new Set(vocabulary.filter((v) => v.task === task).map((v) => v.category))].forEach((category) => {
      const count = vocabulary.filter((v) => v.category === category).length;
      const button = document.createElement('button');
      button.className = `nav-button${state.category === category ? ' active' : ''}`;
      button.innerHTML = `<span>${categoryInfo[category][0]}</span><span>${count}</span>`;
      button.addEventListener('click', () => {
        state.category = state.category === category ? 'all' : category;
        state.task = task;
        state.level = 'all';
        state.visible = 40;
        syncControls(); render(); closeDrawer();
      });
      group.appendChild(button);
    });
    nav.appendChild(group);
  });
}

function renderCard(item) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.id = item.id;
  node.classList.toggle('mastered', state.mastered.has(item.id));
  const level = node.querySelector('.level-badge');
  level.textContent = `${item.level} · ${item.level === 'A' ? '必须掌握' : item.level === 'B' ? '熟悉调用' : '阅读识别'}`;
  level.classList.add(`level-${item.level}`);
  node.querySelector('.task-badge').textContent = `${item.task} · ${categoryInfo[item.category][0]}`;
  node.querySelector('.expression').textContent = item.english;
  node.querySelector('.chinese').textContent = item.chinese;
  node.querySelector('.usage').textContent = item.usage;
  node.querySelector('.usage-label').textContent = item.task === 'Words' ? '词性/搭配' : '适用';
  node.querySelector('.example').textContent = item.example;
  node.querySelector('.warning').textContent = item.warning;
  node.querySelector('.warning-row').hidden = !item.warning;
  node.querySelector('.master-button').addEventListener('click', () => toggleMastered(item.id));
  return node;
}

function render() {
  const items = filteredItems();
  const shown = items.slice(0, state.visible);
  cards.replaceChildren(...shown.map(renderCard));
  $('#resultCount').textContent = `共 ${items.length} 条`;
  $('#emptyState').hidden = items.length !== 0;
  $('#loadMore').hidden = shown.length >= items.length;
  const info = state.category !== 'all' ? categoryInfo[state.category] : null;
  $('#sectionTask').textContent = state.task === 'all' ? 'ALL VOCABULARY' : state.task.toUpperCase();
  $('#sectionTitle').textContent = info ? info[0] : state.level === 'A' ? 'A 级必须掌握' : '全部表达';
  renderNav();
}

function toggleMastered(id) {
  state.mastered.has(id) ? state.mastered.delete(id) : state.mastered.add(id);
  saveMastered(); render();
}

function syncControls() {
  document.querySelectorAll('#taskFilter button').forEach((b) => b.classList.toggle('active', b.dataset.task === state.task));
  document.querySelectorAll('#levelFilter button').forEach((b) => b.classList.toggle('active', b.dataset.level === state.level));
  $('#unmasteredOnly').checked = state.unmasteredOnly;
}

function showRandom() {
  const pool = filteredItems();
  if (!pool.length) return;
  const previous = state.reviewItem;
  const choices = pool.length > 1 ? pool.filter((item) => item.id !== previous?.id) : pool;
  state.reviewItem = choices[Math.floor(Math.random() * choices.length)];
  const item = state.reviewItem;
  $('#reviewMeta').textContent = `${item.task} · ${categoryInfo[item.category][0]}`;
  $('#reviewLevel').textContent = item.level;
  $('#reviewEnglish').textContent = item.english;
  $('#reviewChinese').textContent = item.chinese;
  $('#reviewUsage').textContent = item.usage;
  $('#reviewExample').textContent = item.example;
  $('#reviewAnswer').hidden = true;
  $('#revealAnswer').hidden = false;
  $('#reviewMastered').textContent = state.mastered.has(item.id) ? '取消已掌握' : '标为已掌握';
  if (!$('#reviewDialog').open) $('#reviewDialog').showModal();
}

function closeDrawer() {
  $('#sidebar').classList.remove('open');
  $('#drawerBackdrop').classList.remove('open');
}

document.querySelectorAll('#taskFilter button').forEach((button) => button.addEventListener('click', () => {
  state.task = button.dataset.task; state.category = 'all'; state.level = 'all'; state.visible = 40; syncControls(); render();
}));
document.querySelectorAll('#levelFilter button').forEach((button) => button.addEventListener('click', () => {
  state.level = button.dataset.level; state.visible = 40; syncControls(); render();
}));
$('#searchInput').addEventListener('input', (event) => {
  state.query = event.target.value;
  if (state.query.trim()) { state.task = 'all'; state.level = 'all'; state.category = 'all'; syncControls(); }
  state.visible = 40; render();
});
$('#unmasteredOnly').addEventListener('change', (event) => { state.unmasteredOnly = event.target.checked; state.visible = 40; render(); });
$('#toggleChinese').addEventListener('click', () => {
  state.hideChinese = !state.hideChinese;
  document.body.classList.toggle('hide-chinese', state.hideChinese);
  $('#toggleChinese').textContent = state.hideChinese ? '显示中文' : '隐藏中文';
  $('#toggleChinese').setAttribute('aria-pressed', String(state.hideChinese));
});
$('#resetFilters').addEventListener('click', () => {
  Object.assign(state, { task: 'all', level: 'all', category: 'all', query: '', unmasteredOnly: false, visible: 40 });
  $('#searchInput').value = ''; syncControls(); render();
});
$('#loadMore').addEventListener('click', () => { state.visible += 40; render(); });
$('#randomReview').addEventListener('click', showRandom);
$('#reviewNext').addEventListener('click', showRandom);
$('#revealAnswer').addEventListener('click', () => { $('#reviewAnswer').hidden = false; $('#revealAnswer').hidden = true; });
$('#reviewMastered').addEventListener('click', () => { if (state.reviewItem) toggleMastered(state.reviewItem.id); $('#reviewMastered').textContent = state.mastered.has(state.reviewItem.id) ? '取消已掌握' : '标为已掌握'; });
$('#dialogClose').addEventListener('click', () => $('#reviewDialog').close());
$('#mobileFilter').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#drawerBackdrop').classList.add('open'); });
$('#drawerBackdrop').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#searchInput').focus(); }
});

$('#totalCount').textContent = vocabulary.length;
$('#aCount').textContent = vocabulary.filter((item) => item.level === 'A').length;
updateProgress(); syncControls(); render();
