(function(){
  const dyn=document.getElementById('dynamic');
  const stat=document.getElementById('static');
  if(!dyn||!stat)return;
  const intensityTitle=[...dyn.querySelectorAll('.section-label')].find(x=>x.textContent.includes('程度词：记配对'));
  const pair=intensityTitle?.parentElement.querySelector('.pair');
  if(pair && !pair.dataset.grouped){
    const items=[...pair.querySelectorAll('.pill')];
    const lookup=new Map(items.map(p=>[p.querySelector('b')?.textContent.trim(),p]));
    const groups=[
      ['A · 变化明显 / 快速','dramatic','sharp','rapid'],
      ['B · 平稳 / 渐进','steady','moderate','gradual'],
      ['C · 变化轻微 / 缓慢','slight','slow','marginal']
    ];
    const container=document.createElement('div');
    container.className='intensity-groups';
    for(const [label,...words] of groups){
      const group=document.createElement('div');
      group.className='intensity-group';
      const heading=document.createElement('div');
      heading.className='intensity-heading';
      heading.textContent=label;
      const grid=document.createElement('div');
      grid.className='intensity-pairs';
      for(const word of words){
        const item=lookup.get(word);
        if(item)grid.appendChild(item);
      }
      group.append(heading,grid);
      container.appendChild(group);
    }
    pair.replaceWith(container);
    intensityTitle.textContent='程度词 · 按变化幅度分组';
    const note=document.createElement('div');
    note.className='intensity-note';
    note.textContent='记忆提示：steady 强调变化持续稳定，并不一定代表变化幅度小。';
    container.after(note);
  }
  if(!stat.querySelector('[data-static-connectors]')){
    const card=document.createElement('div');
    card.className='card static-connectors';
    card.dataset.staticConnectors='1';
    const rows=[
      ['总述比较对象','The charts <span class="verb">compare</span> A and B <span class="link">in terms of</span> X.'],
      ['引出第一张图','<span class="link">According to the first graph,</span> + 完整句子'],
      ['引出第二张图','<span class="link">As can be seen from the second chart,</span> + 完整句子'],
      ['引出第三张图','The third graph <span class="verb">shows that</span> + 完整句子'],
      ['形成对比','<span class="link">By contrast,</span> + 完整句子'],
      ['总体概括','<span class="link">Overall, it is clear that</span> + 完整句子']
    ];
    const title=document.createElement('div');
    title.className='section-label';
    title.textContent='静态图 · 模板衔接词';
    const tip=document.createElement('div');
    tip.className='note';
    tip.textContent='前四项适合题目包含多张图表时使用；单张静态图优先使用原有比较句型。';
    const grid=document.createElement('div');
    grid.className='static-connectors-list';
    for(const [purpose,phrase] of rows){
      const block=document.createElement('div');
      block.className='static-connector-row';
      const name=document.createElement('div');
      name.className='static-connector-purpose';
      name.textContent=purpose;
      const example=document.createElement('div');
      example.className='static-connector-expression';
      example.innerHTML=phrase;
      block.append(name,example);
      grid.appendChild(block);
    }
    card.append(title,tip,grid);
    const existing=stat.querySelector('[data-supplement="open-close"]');
    if(existing)stat.insertBefore(card,existing);
    else stat.appendChild(card);
  }
  const style=document.createElement('style');
  style.textContent=`
    .intensity-groups{display:grid;gap:16px;margin-top:12px}
    .intensity-group{border-top:1px solid var(--line);padding-top:12px}
    .intensity-group:first-child{border-top:0;padding-top:0}
    .intensity-heading{font-size:17px;font-weight:750;line-height:1.45;margin-bottom:9px;color:var(--text)}
    .intensity-pairs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .intensity-pairs .pill{min-width:0}
    .intensity-note{font-size:12px;color:var(--muted);line-height:1.6;margin-top:11px}
    .static-connectors{margin-top:14px}
    .static-connectors .note{margin-bottom:12px}
    .static-connectors-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .static-connector-row{border:1px solid var(--line);background:#faf9f6;padding:12px;border-radius:12px}
    .static-connector-purpose{font-size:12px;color:var(--muted);margin-bottom:6px}
    .static-connector-expression{font-size:15px;line-height:1.7}
    @media(max-width:680px){
      .intensity-pairs{grid-template-columns:repeat(2,minmax(0,1fr))}
      .static-connectors-list{grid-template-columns:1fr}
    }
  `;
  document.head.appendChild(style);
})();

// Review adjustments 2026-10-29
(function(){
  const dynamic = document.getElementById('dynamic');
  const process = document.getElementById('process');
  const essay = document.getElementById('essay');

  // 1. Highlight forms that are identical as verbs and nouns.
  const wordTable = [...(dynamic?.querySelectorAll('table.table') || [])]
    .find(table => table.querySelector('thead')?.textContent.includes('名词'));
  if(wordTable){
    [...wordTable.querySelectorAll('tbody tr')].forEach(row => {
      const cells = row.querySelectorAll('td');
      if(cells.length < 4) return;
      const verb = cells[1].textContent.trim();
      const noun = cells[3].textContent.trim();
      if(verb && noun && verb !== '—' && verb.toLowerCase() === noun.toLowerCase()){
        [cells[1],cells[3]].forEach(td => {
          if(td.querySelector('.identical-word')) return;
          const word = document.createElement('strong');
          word.className = 'identical-word';
          word.textContent = td.textContent.trim();
          td.replaceChildren(word);
        });
      }
    });
  }

  // 2. Preserve all 12 source transitions and group them by their purpose.
  const transitionCard = [...(process?.querySelectorAll('.card') || [])]
    .find(card => [...card.querySelectorAll('.section-label')]
      .some(label => label.textContent.includes('衔接词汇总')));
  if(transitionCard && !transitionCard.querySelector('.connector-groups')){
    const grid = transitionCard.querySelector('.connector-grid');
    if(grid){
      const items = [...grid.children].filter(x => x.classList.contains('connector'));
      const byKey = new Map(items.map(item => [item.querySelector('.key')?.textContent.trim(),item]));
      const groups = [
        ['引出不同图表',[
          'According to the first diagram / chart,',
          'As can be seen from the second diagram / graph,'
        ]],
        ['开始 / 结束',[
          'To begin with,',
          'At last,'
        ]],
        ['进入下一步 / 阶段',[
          'After that,','Next,',
          'When it comes to the next / third stage,',
          'in the next stage',
          'and then'
        ]],
        ['时间间隔 / 先后关系',[
          'Around ... later,',
          'Then, after ...,',
          'after which'
        ]]
      ];
      const wrap = document.createElement('div');
      wrap.className = 'connector-groups';
      for(const [heading,keys] of groups){
        const group = document.createElement('div');
        group.className = 'connector-group';
        const label = document.createElement('div');
        label.className = 'connector-group-title';
        label.textContent = heading;
        const sectionGrid = document.createElement('div');
        sectionGrid.className = 'connector-grid';
        keys.forEach(key => {
          const item = byKey.get(key);
          if(item) sectionGrid.appendChild(item);
        });
        group.append(label,sectionGrid);
        wrap.appendChild(group);
      }
      if(wrap.querySelectorAll('.connector').length === items.length){
        grid.replaceWith(wrap);
        const heading = transitionCard.querySelector('.section-label');
        if(heading) heading.textContent='衔接词汇总 · 按用途分组';
      }
    }
  }

  // 3. In Task 2, examples should be plain text, not highlighted.
  if(essay){
    essay.querySelectorAll('.mini .verb, .mini .link, .mini .irreg').forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent));
    });
  }

  // 4. Replace the old cause/effect report with the supplied Template #2.
  const reportCard = [...(essay?.querySelectorAll('.card') || [])]
    .find(card => [...card.querySelectorAll('.section-label')]
      .some(label => label.textContent.includes('Report 模板')));
  if(reportCard && !reportCard.dataset.reportFixed){
    reportCard.dataset.reportFixed = 'true';
    reportCard.innerHTML = `
      <div class="section-label">Report 模板 · 原因/问题 + 解决方案</div>
      <div class="note report-note">沿用原图 Template #2：原因＋解决方案，或造成的问题＋解决方案。</div>
      <div class="pattern">
        <div class="use">开头段 · 引出主题＋交代文章内容</div>
        <div class="sentence">In the present-day society, there <span class="verb">have been growing concerns</span> that ______.
          Some possible <span class="link">causes/influences</span> of this phenomenon
          <span class="verb">will be analysed</span> and some effective solutions
          <span class="verb">will be proposed</span> in this essay.</div>
      </div>
      <div class="pattern">
        <div class="use">原因 / 问题段 · 1–2 点</div>
        <div class="sentence"><span class="link">There are many reasons for the issue,</span> /
          <span class="link">There are many problems caused by this issue,</span>
          one of which is that ______.
          <span class="link">Secondly,</span> ______.</div>
      </div>
      <div class="pattern">
        <div class="use">解决方案段 · 1–2 点</div>
        <div class="sentence">Although this problem is disturbing, some effective measures
          <span class="verb">can be taken to solve</span> it.
          The main solution is that ______.
          Another solution is that ______.</div>
      </div>
      <div class="pattern">
        <div class="use">结尾段 · 重申解决</div>
        <div class="sentence">In conclusion, various measures
          <span class="verb">could be implemented to address</span> the problem and
          <span class="link">only when</span> such actions are carried out with persistence,
          <span class="verb">can we solve</span> this issue easily.</div>
      </div>
      <div class="report-extra">
        <div class="use">解决方案动词 · 图中补充</div>
        <div>The government could <strong>impose higher taxes on</strong> ...</div>
        <div>The government should <strong>invest in</strong> ...</div>
        <div>The government ought to <strong>introduce laws to</strong> ...</div>
      </div>`;
  }

  // 5. Remove the cloze/review switch; review is now the sole view.
  document.body.classList.remove('cloze');
  document.querySelector('.mode-switch')?.remove();
  document.querySelectorAll('.mode').forEach(node => node.remove());

  const style = document.createElement('style');
  style.textContent = `
    .identical-word{
      background:#fff0c8;
      color:var(--text);
      border-radius:4px;
      padding:2px 5px;
      font-weight:800;
    }
    .connector-groups{display:grid;gap:18px}
    .connector-group{border-top:1px solid var(--line);padding-top:12px}
    .connector-group:first-child{border-top:0;padding-top:0}
    .connector-group-title{font-weight:750;font-size:16px;margin-bottom:10px;line-height:1.4}
    #essay .mini .verb, #essay .mini .link{
      background:none!important;box-shadow:none!important;text-decoration:none!important;
      font-weight:inherit!important;padding:0!important;
    }
    .report-note{margin-bottom:14px}
    .report-extra{background:#faf9f6;border:1px solid var(--line);
      border-radius:12px;padding:12px 14px;margin-top:14px;
      font-size:13px;line-height:1.85}
    .report-extra .use{margin-bottom:6px}
    .mode-switch{display:none!important}
  `;
  document.head.appendChild(style);
})();


// Task 2 original 25 sentence patterns
(function(){
 const essay=document.getElementById('essay');
 if(!essay)return;
 const data=[
 [1,'A <span class="verb">has / have</span> a positive / beneficial / negative / damaging / opposite <span class="link">effect on</span> B.','Watching violent images can have a negative effect on one’s mental health.'],
 [2,'It <span class="verb">is</span> difficult / easy / important / possible / necessary <span class="link">for sb. to do sth.</span>','It is possible for people to alter their food preparation methods.'],
 [3,'A can <span class="verb">pose a threat to / present a challenge to / cause damage to</span> B.','Intensive farming technology can pose a threat to the environment.'],
 [4,'Sth. <span class="verb">enables / allows / encourages / causes / requires</span> sb. <span class="link">to do sth.</span>','Overseas travelling enables people to gain an insight into foreign cultures.'],
 [5,'Sb. <span class="verb">lays emphasis on / gives importance to / pays closer attention to</span> something.','Primary schools should lay emphasis on moral education.'],
 [6,'Sth. <span class="verb">plays a vital role in / forms an important part of / holds the key to</span> something.','Reading newspapers has formed an important part of life for many people.'],
 [7,'Somebody <span class="verb">is</span> likely / willing / unwilling / able <span class="link">to do something.</span>','Local farms are likely to cultivate different varieties or even change their livelihoods.'],
 [8,'Something <span class="verb">has made it</span> difficult / easy / possible <span class="link">for somebody to do something.</span>','The Internet has made it easy for people to keep abreast of the newest information.'],
 [9,'Something <span class="verb">has provided somebody with opportunities to do</span> something.','Public libraries have provided people with opportunities to expand their knowledge.'],
 [10,'Somebody <span class="verb">chooses / decides / tends / fails / intends to do</span> something.','An increasing number of people have chosen to work from home.'],
 [11,'Something <span class="verb">is</span> important / essential / vital / valuable <span class="link">to somebody.</span>','Financial assistance is essential to those countries where people do not have basic necessities to survive.'],
 [12,'Something <span class="verb">is regarded as / is considered to be</span> ...','Carbon emissions are considered to be the biggest contributor to global warming.'],
 [13,'Sb. <span class="verb">considers it necessary to do</span> something / <span class="verb">feels the need to do</span> something / <span class="verb">finds it difficult to do</span> something.','Parents find it difficult to sustain/maintain the children’s interest.'],
 [14,'Somebody <span class="verb">is encouraged / motivated / required / permitted / urged / persuaded to do</span> something.','Children are encouraged to pursue their hobbies.'],
 [15,'It <span class="verb">is</span> clear / true / obvious / apparent / unquestionable <span class="link">that</span> ...','It is clear that parents’ behaviour has a direct impact on children’s world view.'],
 [16,'It <span class="verb">is</span> not surprising / uncommon / unavoidable <span class="link">that</span> ...','It is not surprising that work-life balance is now a challenge to many people.'],
 [17,'It <span class="verb">is important to realise / recognise / acknowledge / note / remember / bear in mind</span> <span class="link">that</span> ...','It is important to realise that some resources are non-renewable.'],
 [18,'Sb. <span class="verb">believes / argues / holds / suggests / claims / realises / contends / agrees</span> <span class="link">that</span> ...','People tend to believe that young people’s lack of work experience is a clear disadvantage.'],
 [19,'One main argument / reason / point <span class="verb">is</span> <span class="link">that</span> ...','One main argument is that online education suits the needs of adult students.'],
 [20,'The advantage / benefit / consequence / counterargument / difference / problem <span class="verb">is</span> <span class="link">that</span> ...','The main explanation for children’s anti-social behaviour is that children tend to express their dissatisfaction radically.'],
 [21,'<span class="link">Despite the fact that</span> A, B.','Despite the fact that people hate rules, they in fact accept rules or even set rules from time to time during the course of their lives.'],
 [22,'<span class="link">Due to the fact that</span> A, B. / <span class="link">In view of the fact that</span> A, B.','Due to the fact that rural economies are normally backward, the rural-to-urban shift is understandable.'],
 [23,'This <span class="verb">can explain why</span> ... / This <span class="verb">is the reason why</span> ...','This is the reason why these buildings are of cultural and historical value.'],
 [24,'There <span class="verb">is a growing recognition</span> <span class="link">that</span> ... / There <span class="verb">are growing concerns</span> <span class="link">that</span> ...','There is a growing recognition that more people than ever before vacation overseas.'],
 [25,'I <span class="verb">am of the view</span> <span class="link">that</span> ...','I am of the view that no society functions properly without rules governing citizens’ behaviour.']
 ];
 const existing=new Map();
 essay.querySelectorAll('.pattern').forEach(p=>{
   const number=p.querySelector('.use')?.textContent.trim().match(/^(\d+)\s*·/);
   if(number)existing.set(Number(number[1]),p);
 });
 if(existing.size!==23)return;
 for(const [number,skeleton,example] of data){
   let p=existing.get(number);
   if(!p){
     const host=existing.get(23).parentElement;
     p=document.createElement('div');p.className='pattern';
     const use=document.createElement('div');use.className='use';
     use.textContent=number===24?'24 · 越来越多人认识到 / 关注':'25 · 我认为……';
     p.appendChild(use);host.appendChild(p);
   }
   let sentence=p.querySelector('.sentence');
   if(!sentence){sentence=document.createElement('div');sentence.className='sentence';p.appendChild(sentence);}
   sentence.innerHTML=skeleton;
   let mini=p.querySelector('.mini');
   if(!mini){mini=document.createElement('div');mini.className='mini';p.appendChild(mini);}
   mini.textContent=example;
 }
 const heading=[...existing.get(23).parentElement.querySelectorAll('.section-label')][0];
 if(heading)heading.textContent='句型 15–25';
})();
