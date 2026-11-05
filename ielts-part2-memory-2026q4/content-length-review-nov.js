/* IELTS Q4 content expansion and Q46 concert revision.
   Target: about 180 words; keep spoken English, natural detail and current paragraph keys.
   Audio is intentionally deferred until the text is approved. */
(() => {
 const groups=window.P2_2026Q4_GROUPS||[];
 const byQ=new Map(groups.flatMap(g=>(g.topics||[]).map(t=>[t.q,t])));
 const zh=window.P2_2026Q4_ZH_TRANSLATIONS||{};
 const additions={
 Q01:[[2,"When I visit, I don't always buy anything. Sometimes I just walk around, look at the displays and take a few photos of details that give me ideas for my own design work. That is one reason I keep going back."]],
 Q02:[[3,"We chat while riding, but the strong afternoon sun still makes it hard to enjoy."]],
 Q03:[[3,"Even the café area was full, so we had to wait before we could order. The noise also made it difficult to have a proper conversation. I don't mind busy places when there is something special to see, but that day the crowds made the whole visit feel more stressful than enjoyable."]],
 Q04:[[3,"She often compares pieces from different periods and explains how their shapes or patterns have changed. I find that interesting because she does not treat history as something that only exists in books. She can connect it with the things she makes today."]],
 Q05:[[3,"The dough was a little sticky, and I needed my mother to show me how to use the mould properly. I learned that even a small change in pressure could make a big difference to the shape. That was probably the most difficult part for me."]],
 Q06:[[3,"We still talk about her work and sometimes share photos of new pieces. I enjoy spending time with her because she never makes me feel silly when I am learning something new. She is patient without making a big deal out of it."]],
 Q07:[[2,"Even during the quieter songs, people were clapping and shouting the members' names. There were huge screens and strong lights, and the sound seemed to come from every direction. It was much louder than a normal event, but the atmosphere was exciting."]],
 Q08:[[3,"The machines are easy to use, and people do not need to learn a complicated process. Shops could put clear signs near the entrance, so even people who have never recycled a bottle would know what to do. I think convenience is important if we want people to keep doing it."]],
 Q09:[[3,"The difficult part was that I depended on the watch every day, but I could not tell whether the problem came from the battery, the software or the device itself. I did not want to pay for a repair before checking the simple solutions."]],
 Q10:[[3,"I also liked that the reporter let the makers speak in their own words instead of only showing finished products. It made the market feel like a real community event, and helped me understand why local people cared about it."]],
 Q11:[[3,"I would not try to build a big business straight away. I would begin with a simple version, test whether people find it useful and improve it based on their feedback. That would make the goal less risky and more realistic."]],
 Q12:[[3,"She has also read about the training doctors need and knows that it takes many years. She is not expecting the work to be easy, but she likes the idea of using knowledge to make a real difference to someone's life. That is why she takes this career choice seriously."]],
 Q13:[[3,"Another reason was that we had no clear plan. We just walked around hoping to find something interesting, but the shops and displays did not give us much to talk about. I would rather visit when there is a special exhibition or activity."]],
 Q14:[[3,"I started with small changes instead of making a strict timetable. For example, I leave my walking shoes near the door and put my phone away before bedtime. These little reminders make it easier to follow the plan, even after a busy day."]],
 Q15:[[3,"Some people came from other cities and shared stories about the show. We also took a group photo before leaving. Our shared interest made it easy to talk."]],
 Q16:[[3,"I do not go every weekend, but I visit when the weather is comfortable and I need a break from screens. We normally spend an hour or two there, rather than making it a whole-day activity. It is close enough for a simple weekend plan, which makes it easy to return."]],
 Q17:[[3,"The next video starts automatically, so I become curious about it. I may plan to scroll for five minutes, but it can easily take much longer."]],
 Q18:[[3,"She also explained why the clay needed to be at the right level of softness before shaping it. I liked that she showed each step slowly and let me practise instead of expecting me to get it right immediately. Her way of teaching made the whole process less stressful."]],
 Q19:[[2,"She often takes pictures when we travel or visit a new place, but she does not only photograph famous sights. She notices small things like shadows, signs and reflections in the water. Sometimes she asks me to stand in the picture, but she also takes many photos of the scenery. I admire her patience because she is willing to wait for the right light."]],
 Q20:[[3,"I compared the prices and read a few reviews before I bought it, so I did not rush into the decision. Saving for it also made me think more carefully about what I really needed. I was pleased that it turned out to be useful, rather than something I only wanted for a short time."]],
 Q21:[[3,"I first came across it in a short article about how supermarkets collect empty bottles. I thought the idea was practical because the return machines are usually near the entrance, so people can use them while shopping. It benefits the environment, but it also helps shops collect bottles in one place. I would welcome a similar system here, as long as the machines are easy to find and the refund process is clear."]],
 Q22:[[2,"I decided to watch it because I like animated films, and the animal characters made the city feel different from the real world. The story also talks about prejudice in a simple way. Judy has to prove that she can do the job, while Nick learns that people should not be judged by their background. I enjoyed the humour, but I also liked the serious message underneath."]],
 Q23:[[4,"I kept checking my phone, which made the wait feel longer. The first seller never replied, so I stayed calm and looked for another seller. I was relieved when the second person answered and sent the ticket details."]],
 Q24:[[3,"I first saw it on social media around the Mid-Autumn Festival, when the brand posted several short clips. The advertisement caught my attention because the product was connected with a familiar festival, but the design looked fresh. It felt more personal than a normal product video, and I remembered it after watching."]],
 Q25:[[4,"We had to make quick decisions because the ticket situation could change at any time. We also checked the flight and hotel details with each other before paying. Once we shared the information, it was easier to avoid mistakes and make sure everyone was comfortable with the plan. I think that clear division of work saved us time."]],
 Q26:[[3,"I would start with supermarkets and shopping centres because they already have space for recycling machines. The points could be used for small discounts, which would make the reward easy to understand. I think a simple system would be more effective than a complicated one, especially for people who are busy."]],
 Q28:[[3,"Even when she was busy, she did not ignore people who asked for help. She remembered what classmates were working on and sometimes checked whether they had understood her explanation. I think people liked her not because she tried to be popular, but because she was genuinely considerate."]],
 Q29:[[3,"She explained the differences in a clear way and gave me time to try the watch myself. When I asked a basic question, she did not rush me or use too many technical words. That made the whole shopping experience comfortable, especially because it was my first smartwatch."]],
 Q30:[[3,"My favourite moment was when the group played a song we all knew. We sang along, took photos and talked about it afterwards. It was lovely to share the show with friends."]],
 Q31:[[2,"I also felt that some jokes were repeated, so the story did not move forward as smoothly as I expected. I know sequels are difficult because they have to keep old characters while introducing new ideas, but this one did not give me the same feeling of surprise. I probably would not watch it again."]],
 Q32:[[2,"I continued listening because she was my friend and I knew the subject mattered to her. I asked a few simple questions when she paused, and that helped me understand the basic idea even if I could not follow every detail. It reminded me that people may be interested in things that seem boring to us. I felt a little impatient at first, but I was glad I did not interrupt her."]],
 Q33:[[3,"She does not make a complicated schedule for every hour. Instead, she writes down the most important tasks and decides what needs to be done first. I think this works well because she can still adjust her plan if something unexpected happens. It is a simple habit, but it helps her stay calm."]],
 Q34:[[2,"Before she left, she was worried about missing her flight or getting lost after arriving. We practised the route from the airport to the hotel and saved the address on her phone. She also kept her important documents together and knew who to contact if she needed help. These steps did not remove every worry, but they gave her enough confidence to continue. I was proud of her because she did not let fear stop her."]],
 Q35:[[3,"She also keeps her art supplies and books in the living room, so the space can look a little busy. I like visiting because it shows her personality, but I prefer a larger home with more room to store things. I would also like a quieter place to work and relax."]],
 Q36:[[3,"She also studies a little every day, even if she only has ten minutes. When she learns a phrase, she writes it down and tries to use it in a message or conversation. She is not embarrassed to ask people to repeat something when she does not understand. I admire her consistency."]],
 Q37:[[2,"There were also several fast changes in the game, and the players had to react immediately. My friend explained some of the rules to me, so I gradually understood why the team moved in certain ways. Even though I did not know every rule, I enjoyed the energy and felt more interested in the sport afterwards."]],
 Q39:[[2,"She does not grow a huge amount because the balcony is small, but she enjoys checking the plants every morning. When the tomatoes are ready, she sometimes uses them in a simple salad. She says it is satisfying to eat something she has grown herself, and I can see why she enjoys looking after them."]],
 Q40:[[3,"I watched it in the evening after work because I wanted something short and relaxing. I was curious about the process, especially how a plain piece of clay could become a finished object. The video was easy to follow, and it gave me an idea of visiting the market in person one day."]],
 Q41:[[3,"I had only seen the group performing before, so hearing her talk about the difficult period made me understand the members in a different way. It was not a dramatic interview, but it felt honest, and that made a stronger impression on me."]],
 Q42:[[3,"She chooses clay and glaze carefully, and checks the shape before firing because small mistakes can become more obvious afterwards. She also makes small animal figures and custom colours. Her attention to detail makes her work look professional."]],
 Q43:[[3,"She does not need a big event to feel happy. Even a good cup of coffee or a message from a friend can improve her mood. I think she is positive because she notices these small moments instead of waiting for something special to happen."]],
 Q44:[[2,"At first, she was afraid of dealing with everything in another country, especially finding the hotel and understanding the transport system. We looked at the airport route together, saved the hotel address and checked how to contact the event organiser. She also kept her passport and booking details in one place. When she arrived safely and sent us a message, I knew she had managed the hardest part. I felt proud because she had faced her fear and done it herself."]],
 Q47:[[3,"The lake is the best part for me because the water reflects the trees when the weather is calm. There are also places to sit down, so people who do not want to cycle can simply enjoy the view. It is suitable for friends or families who want a quiet break from the city."]],
 Q49:[[3,"Families share mooncakes because their round shape represents reunion. Some buy them, while others make them at home, as we did. The shared experience matters most."]],
 Q50:[[3,"She also listens to feedback and makes changes when customers find something confusing. I think that is important for a small business because people will only keep using it if it saves them time and helps them make a decision. Her idea is simple, but it solves a real need."]],
 Q51:[[3,"We used to spend time drawing, talking about music and sharing little things from school. She was easy to be around because she listened and never laughed at other people's mistakes. I think I liked her because she was kind without making a big show of it, and we could enjoy simple activities together."]],
 Q52:[[2,"The building is easy to recognise from the street because it stands among many lower buildings. I like the contrast between its modern outside and the creative spaces inside. It is not just somewhere to shop; people can also meet friends, see an exhibition or get a coffee there."]],
 Q53:[[2,"I also liked the way the story shows that first impressions can be wrong. Judy looks small and Nick seems untrustworthy, but both of them prove to be more capable than others expect. The pictures make the animal city easy to imagine, and I could remember the scenes because I already knew the characters from the film."]],
 Q55:[[3,"She checked the route several times before leaving, and I stayed available by phone in case she had a problem. I was happy to see her handle things on her own."]],
 Q54:[[2,"She does not follow an extreme diet or spend hours at the gym. She prefers ordinary meals, enough sleep and exercise that fits her schedule. If she has an early class or a part-time shift, she moves her workout to the afternoon instead of blaming herself. I like this flexible attitude because it makes healthy habits realistic. It reminds me that small things done regularly matter more than a perfect plan."]],
 Q56:[[3,"She is also known for being calm and focused in interviews. She does not seem to look for attention, and she often talks about the team rather than only her own performance. That is another reason I admire her, because it shows that she takes responsibility for the people around her."]],
 Q57:[[3,"She also chooses the glaze and colours carefully, because the final look depends on how the piece is fired. I like that she experiments with different shapes but still pays attention to the small details."]],
 Q58:[[3,"At first, I only used it to check the time, so I wondered whether buying it had been a good idea. Once I understood the main functions, I started checking my steps during the day and looking at my sleep data in the morning. Now it has become part of my routine."]]
 };
 const zhAdd={
 Q01:"我不一定每次都购物，有时只是逛一逛、看看展陈，拍下有设计感的细节，为自己的设计工作找灵感。",
 Q02:"我们边骑车边聊天，但下午强烈的阳光还是让我很难享受这趟行程。",
 Q03:"连咖啡区都坐满了，我们点单前还要等。人声也让聊天变得困难。我不介意热闹的地方，但那天拥挤让整个体验更有压力，而不是享受。",
 Q04:"她会比较不同时期的作品，解释器型和图案如何变化。我觉得有趣，因为她不把历史当成书本里的知识，而是能联系到今天制作的东西。",
 Q05:"面团有点黏，我需要妈妈教我正确使用模具。我发现按压的力度只要稍有不同，最后的形状就会差很多。",
 Q06:"我们现在还会聊她的工作，偶尔分享新作品的照片。我喜欢和她相处，因为学新东西时，她从不会让我觉得自己很笨。",
 Q07:"即使是比较安静的歌曲，大家也会拍手、喊成员的名字。现场有大屏幕和强烈灯光，声音仿佛从四面八方传来，比普通活动吵得多，但气氛很热烈。",
 Q08:"回收机器容易使用，不需要复杂流程。商店可以在入口放清楚的指示，让第一次回收的人也知道怎么做。要让人长期坚持，方便很重要。",
 Q09:"最难的是我每天都依赖这块手表，却不知道问题来自电池、软件还是设备本身。我不想还没检查简单办法就先花钱维修。",
 Q10:"我还喜欢记者让摊主自己讲述，而不只是展示成品。这让市集更像真实的社区活动，也让我理解当地人为什么在意它。",
 Q11:"我不会一开始就做成大型生意，而是先做一个简单版本，找少量用户试用，再根据反馈改进。这样风险更低，也更现实。",
 Q12:"她还了解过医生需要接受的训练，知道这要花很多年。她并不认为工作会很轻松，但喜欢用专业知识真正帮助别人，所以认真考虑这条职业道路。",
 Q13:"另一个原因是我们没有明确计划，只是在商场里走来走去，希望碰到有趣的东西，但店铺和展陈都没什么可聊的。我更愿意有特别展览或活动时再去。",
 Q14:"我先从小改变开始，而不是制定严格时间表。比如把运动鞋放在门边，睡前把手机收起来。这些提醒让我即使忙了一天也更容易坚持。",
 Q15:"有些粉丝从其他城市赶来，分享了演唱会相关的故事。离开前我们还拍了合照。因为有共同爱好，聊天很自然。",
 Q16:"我不是每个周末都去，但天气舒服、想暂时离开屏幕时会去。通常待一两个小时，不会安排成一整天的活动。离市区不远，也方便以后再去。",
 Q17:"下一个视频会自动播放，所以我容易好奇后面还有什么。我原本只想刷五分钟，却常常花掉更多时间。下班后我本来还想散步或练习英语。",
 Q18:"她还解释了黏土在塑形前为什么要保持合适的软硬程度。我喜欢她慢慢示范每一步，让我自己练习，而不是要求我一次就做对。她的教学方式让我没那么紧张。",
 Q19:"她旅行或去新地方时经常拍照，但不只拍著名景点。她会注意影子、路牌和水面倒影。有时也让我入镜，但更多时候拍风景。我佩服她有耐心等待合适的光线。",
 Q20:"购买前我比较了价格，也看了一些评价，没有急着下决定。存钱的过程让我更认真地考虑自己真正需要什么。买回来后发现每天都用得上，我很满意。",
 Q21:"我最初是在一篇介绍超市回收空瓶的短文里看到这个制度。机器通常放在入口附近，人们购物时就能顺手使用。它既有利于环境，也方便商店集中回收。我支持本地采用类似制度，但机器必须容易找到，退款流程也要清楚。",
 Q22:"我决定看这部作品，是因为我喜欢动画电影，动物角色让城市显得很有想象力。故事也用简单方式讨论偏见：Judy 要证明自己能胜任警察工作，Nick 则逐渐明白不能凭出身判断别人。我喜欢幽默，也喜欢背后的认真主题。",
 Q23:"我不停查看手机，感觉等待时间更长了。我没有连续发很多消息，而是保持冷静寻找其他卖家。原来的卖家始终没有回复，后来第二位卖家答复并发来票务信息，我才松了口气。",
 Q24:"我在中秋节前后于社交媒体看到广告，品牌当时发布了几条短视频。产品和熟悉的节日有关，但设计很新鲜，比普通产品宣传更有个人特色，所以看过之后我还记得。",
 Q25:"票务情况随时可能变化，所以我们必须快速决定。付款前也互相核对机票和酒店信息，避免出错，确保每个人都接受安排。明确分工确实节省了时间。",
 Q26:"我会先在超市和购物中心设置机器，因为那里有空间，也方便人们顺路回收。积分可以换小额折扣，规则容易理解。对忙碌的人来说，简单的制度往往比复杂制度更有效。",
 Q28:"即使自己很忙，她也不会忽略来求助的人。她记得同学在做什么，有时还会确认对方是否理解了讲解。我觉得大家喜欢她，不是因为她刻意受欢迎，而是她确实体贴。",
 Q29:"她清楚解释不同型号的区别，也让我有时间自己试用。问基础问题时，她不会催促我，也不会使用太多专业词汇。第一次买智能手表，这种服务让我很安心。",
 Q30:"我们提前到场，在场馆外拍了照片。最喜欢的时刻之一，是组合唱到我们三个人都熟悉的歌。我们一起合唱，之后还一直讨论，能和朋友分享期待已久的演出非常开心。",
 Q31:"我还觉得有些笑点重复了，故事推进没有预想中流畅。我知道续集既要保留旧角色又要加入新内容并不容易，但这部电影没有带来第一部那种惊喜，我大概不会再看一次。",
 Q32:"我继续听是因为她是我的朋友，而且这个话题对她很重要。她停下来时，我会问几个简单问题，帮助自己理解大意，即使不能听懂所有细节。这也提醒我，别人可能喜欢我们觉得无聊的东西。我一开始有点不耐烦，但庆幸自己没有打断她。",
 Q33:"她不会把每个小时都安排得很复杂，而是写下最重要的任务，再决定先做什么。我觉得这样很好，因为遇到突发情况时，她仍然能调整计划。习惯简单，却能让她保持冷静。",
 Q34:"出发前，她担心错过航班，也担心到了之后迷路。我们一起练习从机场到酒店的路线，把酒店地址保存在手机里。她还把重要证件放在一起，并记下需要帮助时联系谁。这些准备没有消除所有担心，却给了她继续尝试的信心。我为她骄傲，因为她没有让恐惧阻止自己。",
 Q35:"她还把画材和书放在客厅，所以空间有时显得有点杂乱。我喜欢去她家，因为那里很有她的个人风格，但自己更喜欢空间大、收纳更多的房子，也需要更安静的地方工作和休息。",
 Q36:"她尽量每天学一点，即使只有十分钟。学到新短语时，她会记下来，再尝试在消息或对话里使用。听不懂时，她也不怕请别人重复。我佩服她的坚持和不怕犯错。",
 Q37:"比赛中还有很多快速变化，运动员必须马上反应。朋友给我解释了一些规则，所以我逐渐明白队伍为什么那样移动。虽然没完全懂所有规则，我还是很享受现场气氛，看完后也更想了解这项运动。",
 Q39:"阳台不大，所以她种的东西不算多，但她喜欢每天早上看看植物。番茄成熟后，她有时会做简单沙拉。她说吃自己种出来的东西很有成就感，我也能理解她为什么喜欢照料植物。",
 Q40:"我是在下班后的晚上看的，因为想找一个短小、轻松的视频。我很好奇一团普通黏土如何变成完整作品。视频容易理解，也让我有一天想亲自去市集看看。",
 Q41:"此前我只看过组合的舞台表演，听她讲困难时期让我从另一个角度了解成员。采访没有刻意煽情，但很真诚，所以给我留下更深印象。",
 Q42:"她会根据作品选择黏土和釉料，烧制前也会检查形状，因为小错误之后可能更明显。她还会做小动物摆件。我觉得她对细节的关注让作品看起来很专业。",
 Q43:"她不需要特别大的活动才会开心。一杯好喝的咖啡，或朋友发来一条消息，都能让她心情变好。我觉得她积极，是因为会留意生活里的小瞬间，而不是一直等待特别的事情发生。",
 Q44:"一开始她害怕在国外处理所有事情，尤其是找酒店和理解交通系统。我们一起看机场路线、保存酒店地址，也查了怎样联系活动主办方。她把护照和预订信息放在一起。她安全抵达并发消息后，我知道她已经克服了最难的一步。我为她骄傲，因为她面对了恐惧，最终独立完成。",
 Q47:"湖边是我最喜欢的地方，天气平静时水面会映出树影。附近也有可以坐下休息的地方，不想骑车的人也能欣赏风景。这里适合朋友或家庭来城市周边安静地放松。",
 Q49:"人们通常和家人朋友一起分享月饼，因为圆形常让人联想到团圆。有些家庭会购买，也有人像我们一样在家制作。所以我想到这种食物时，首先想到的是家人相聚，而不只是味道。",
 Q50:"她也会听取反馈，如果顾客觉得某个功能难懂，就会做出调整。我认为这对小生意很重要，因为只有真正节省时间、帮助用户做决定，人们才会继续使用。她的想法简单，却解决了实际问题。",
 Q51:"小时候我们常一起画画、聊音乐，也分享学校里的小事。她很容易相处，会认真听别人说话，从不嘲笑别人的错误。我喜欢她，是因为她善良但不刻意表现，我们一起做简单的事也很开心。",
 Q52:"从街上很容易认出这栋楼，因为它比周围许多低层建筑都高。我喜欢外部现代感和内部创意空间之间的对比。它不只是购物的地方，人们也能见朋友、看展览或喝咖啡。",
 Q53:"我还喜欢故事表达的意思：第一印象可能是错的。Judy 看起来弱小，Nick 似乎不值得信任，但他们都证明自己比别人想象中更有能力。插图让动物城市容易想象，因为我已经认识电影里的角色，所以也更容易记住情节。",
 Q54:"她不会极端节食，也不会花几个小时在健身房。她更喜欢普通饮食、充足睡眠和能融入日程的运动。如果早上有课或兼职，她会把运动改到下午。我喜欢这种灵活态度，因为它让健康习惯更现实，也让我明白规律做小事比追求完美计划更重要。",
 Q55:"她出发前反复核对路线，我也保持电话畅通，以防她遇到问题。看到她能独立处理事情，我很开心。",
 Q56:"她在采访中也显得冷静、专注，不太追求关注，常常谈团队而不只是自己的表现。我也因此更钦佩她，因为这说明她会对身边的队友负责。",
 Q57:"她还会仔细选择釉料和颜色，因为烧制方式会影响最终效果。我喜欢她尝试不同造型，同时仍然关注细节。",
 Q58:"一开始我只用它看时间，甚至怀疑自己买它是不是值得。熟悉主要功能后，我开始白天查看步数，早上看睡眠数据。现在它已经成了日常习惯。"
 };
 // Q46 is a separate use of the established Hong Kong concert story:
 // the change of opinion is about work-life balance, not cycling.
 const q46=[
  "I'd like to talk about a time when I changed my mind about taking time off for something important.",
  "I used to think work should always come first, and taking a day off for a concert was irresponsible. I had planned to work overtime that weekend, but my best friend and I heard our favourite K-pop group might not stay together much longer. Another friend joined us and helped arrange the hotel, so we decided to go.",
  "I finished the urgent work, told my team and asked for leave. Because we decided late, the high-speed train tickets were sold out, so we booked an early flight. I packed the night before but still had to get up at around three. The journey was tiring, but we arrived in time.",
  "When the lights went down and everyone sang together, I felt the trip was worth it. I realised I could be responsible at work and still make time for important experiences. I felt relieved and happy, and I no longer reject every personal plan just because I might have work."
 ];
 const q46zh="我想说一次改变了我对请假看演唱会看法的经历。以前我觉得工作应该永远优先，为了演唱会请假是不负责任的。我原本计划周末加班，但我和最好的朋友听说喜欢的 K-pop 组合可能不会再一起活动很久，另一位朋友也加入并帮忙安排酒店，于是我们决定一起去。我先完成紧急工作，提前通知团队并请假。因为决定得比较晚，高铁票售罄，我们只好订早班飞机。我前一晚收拾行李，还是凌晨三点左右起床。旅程很累，但我们及时赶到了。灯光暗下来、全场开始合唱时，我觉得这一趟很值得。这次经历让我明白，认真工作和为重要的事情留时间并不冲突。我感到轻松又开心，也不再自动拒绝每一个私人计划。";
 const byIndex={};
 for(const [q,items] of Object.entries(additions)){
  const t=byQ.get(q);if(!t||!Array.isArray(t.reviewed))throw Error("Missing topic "+q);
  for(const [i,txt] of items){if(!t.reviewed[i])throw Error("Missing paragraph "+q+"/"+i);t.reviewed[i].text+=" "+txt;}
 }
 const t46=byQ.get("Q46");if(!t46||t46.reviewed.length!==4)throw Error("Q46 paragraph structure mismatch");
 q46.forEach((txt,i)=>{t46.reviewed[i].text=txt;});
 t46.chain="原本认为工作应该永远优先 → 得知喜欢的组合可能不再合体 → 完成紧急工作、通知团队请假 → 高铁售罄，改订早班机，凌晨三点起床 → 及时赶到演唱会 → 明白认真工作与珍惜重要经历可以兼顾";
 t46.fit="从“工作永远优先、请假不负责任”转变为“做好工作安排后，也应该为重要的人和经历留出时间”。";
 t46.intro="I'd like to talk about a time when I changed my mind about taking time off for something important.";
 t46.ending="I realised I could be responsible at work and still make time for important experiences.";
 t46.keywords=["changed my mind","work-life balance","K-pop concert","Hong Kong","overtime","day off","high-speed train","early flight","3 a.m.","team","important experience"];
 zh.Q46=q46zh;
 for(const [q,txt] of Object.entries(zhAdd)){zh[q]=(zh[q]||"")+" "+txt;}
 const trim=(q,i,txt)=>{const t=byQ.get(q);if(!t?.reviewed?.[i])throw Error("Missing trim target "+q);t.reviewed[i].text=txt;};
 trim("Q27",5,"Getting up at three was hard, but it felt worth it once the concert began.");
 trim("Q45",5,"I'm glad I took the day off because the concert might not happen again.");
 trim("Q48",5,"I learned not to reject a special opportunity automatically.");
 byQ.get("Q15").reviewed[3].text+=" We took a group photo to remember the evening.";
 byQ.get("Q17").reviewed[1].text+=" I often meant to go for a walk or practise English after work.";
 byQ.get("Q23").reviewed[4].text+=" That was why having a second option mattered.";
 byQ.get("Q30").reviewed[1].text+=" We arrived early and took photos outside the venue before going in.";
 byQ.get("Q42").reviewed[3].text+=" She can make a small animal figure look lively with only a few details.";
 const countWords=s=>(s.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).length;
 const report=[...byQ.entries()].map(([q,t])=>({q,words:t.reviewed.reduce((n,p)=>n+countWords(p.text),0)})).sort((a,b)=>Number(a.q.slice(1))-Number(b.q.slice(1)));
 const bad=report.filter(x=>x.words<165||x.words>205);
 if(byQ.size!==58)throw Error("Expected 58 cue cards, found "+byQ.size);
 window.P2_2026Q4_CONTENT_REVIEW="2026-11-06";
 window.P2_2026Q4_CONTENT_WORD_COUNTS=report;
 window.P2_2026Q4_CONTENT_REVIEW_WARNINGS=bad;
})();