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