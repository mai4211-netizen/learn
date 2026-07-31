(() => {
  'use strict';
  const data = window.IELTS538_DATA;
  if (!data || !Array.isArray(data.entries)) return;

  const patches = {
    1: {
      sourceMapping: 'like, look, like, be similar to',
      mappingItems: ['like', 'look like', 'be similar to'],
      auditLevel: 'warn',
      auditNote: '原书排版把 “look like” 拆成了 “look, like”。学习展示按 look like 处理；来源对照保留原书写法。',
    },
    49: {
      meaning: 'v.加速；加快；促进',
      auditLevel: 'danger',
      auditNote: '原书中文释义含“强调”，与 accelerate 无关；应理解为“加速、加快”。',
    },
    79: {
      meaning: 'adv.出乎意料地；意外地',
      auditLevel: 'danger',
      auditNote: '原书写成“出乎意料的”，中文词性不准确；unexpectedly 是副词。',
    },
    98: {
      sourceMapping: 'initial, fist',
      mappingItems: ['initial', 'first'],
      auditLevel: 'danger',
      auditNote: '原书命题方式写作“initial, fist”；其中 fist（拳头）明显应为 first。本版学习展示修正为 first，来源对照保留 fist。',
    },
    106: {
      meaning: 'v.不同；有差异；相异',
      auditLevel: 'danger',
      auditNote: '原书写成“使……相异/不同”，但 differ 通常是不及物动词，如 A differs from B。',
    },
    194: {
      meaning: 'adj.生态友好的；环保的',
      auditLevel: 'danger',
      auditNote: '原书中文“生态有好的”是明显录入错误，应为“生态友好的”。',
    },
    218: {
      meaning: 'n.健康；健壮；适合度',
      auditLevel: 'danger',
      auditNote: '原书写“n.健康的”，中文词性错误；fitness 是名词。',
    },
    240: {
      meaning: 'n.（分期付款的）一期付款；分批交付的一部分',
      auditLevel: 'danger',
      auditNote: '原书把 installment 释为“安装；分期付款”。“安装”应是 installation；installment 指分期付款的一期或分批的一部分。',
    },
    249: {
      meaning: 'adj.热切的；渴望的；强烈的；敏锐的',
      auditLevel: 'danger',
      auditNote: '原书中文含“强迫的”，与 keen 无关；常见义为热切的、渴望的、强烈的或敏锐的。',
    },
    314: {
      meaning: 'v.禁止；阻止',
      auditLevel: 'danger',
      auditNote: '原书写成“v.禁止的”，中文词性表达错误；prohibit 是动词“禁止、阻止”。',
    },
    317: {
      meaning: 'v.繁荣；兴旺；成功发展',
      auditLevel: 'danger',
      auditNote: '原书写“使成功，使繁荣”容易误导；prosper 通常作不及物动词，表示“繁荣、兴旺”。',
    },
    366: {
      meaning: 'n.扳机；诱因 / v.触发；引发',
      auditLevel: 'danger',
      auditNote: '原书只标 n.，却给出“触发、引发、引起”等动词义；trigger 可作名词，也可作动词。',
    },
  };

  data.entries.forEach((entry) => {
    const patch = patches[entry.seq];
    if (patch) Object.assign(entry, patch);
  });

  const dangerCount = data.entries.filter((entry) => entry.auditLevel === 'danger').length;
  const warnCount = data.entries.filter((entry) => entry.auditLevel === 'warn').length;
  data.meta.auditCount = dangerCount + warnCount;
  data.meta.dangerCount = dangerCount;
  data.meta.auditRevision = '2026-07-31-r4';
  data.meta.auditNote = '原书“真题命题方式”按来源保留，但不默认等于可互换同义词；明显拼写、词性或释义错误会在学习层修正，并保留原书对照。';
})();
