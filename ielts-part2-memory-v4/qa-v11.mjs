import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const context = {
  window: {},
  document: {
    querySelectorAll() { return []; },
    querySelector() { return null; }
  }
};
vm.createContext(context);

for (const file of [
  'data1.js', 'data2.js', 'data3.js', 'data4.js', 'data5.js',
  'patch-v5.js', 'patch-v6.js', 'patch-v7.js', 'patch-v10.js', 'patch-v11.js', 'groups-v11.js'
]) {
  vm.runInContext(fs.readFileSync(path.join(here, file), 'utf8'), context, { filename: file });
}

const data = context.window.P2_DATA_PARTS || [];
const rows = [];
for (const template of data) {
  for (const topic of template.topics) {
    const omitted = new Set(topic.omitSharedIndexes || []);
    const parts = [];
    if (topic.intro) parts.push(topic.intro);
    template.shared.forEach((text, index) => {
      if (omitted.has(index)) return;
      parts.push(text);
      if (index === 0 && topic.middle) parts.push(topic.middle);
    });
    if (topic.ending) parts.push(topic.ending);
    const text = parts.join(' ');
    const words = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
    rows.push({
      q: topic.q,
      zh: topic.zh,
      en: topic.en,
      template: template.id,
      templateTitle: template.title,
      memory: template.memory,
      words: words.length,
      text
    });
  }
}

rows.sort((a, b) => Number(a.q.slice(1)) - Number(b.q.slice(1)));
const counts = new Map();
for (const row of rows) counts.set(row.q, (counts.get(row.q) || 0) + 1);
const expected = Array.from({ length: 59 }, (_, index) => `Q${String(index + 1).padStart(2, '0')}`);
const grouped = (context.window.P2_SIMILARITY_GROUPS || []).flatMap(group => group.topics.map(n => `Q${String(n).padStart(2, '0')}`));
const missing = expected.filter(q => !counts.has(q));
const duplicate = [...counts].filter(([, count]) => count !== 1);
const groupMissing = expected.filter(q => !grouped.includes(q));
const groupDuplicate = [...new Set(grouped.filter((q, index) => grouped.indexOf(q) !== index))];
const empty = rows.filter(row => !row.text.trim() || !row.en.trim());
const malformed = rows.filter(row => /\b(undefined|null)\b|\s{3,}|[.?!][A-Za-z]/.test(row.text));
const short = rows.filter(row => row.words < 130);
const long = rows.filter(row => row.words > 180);
const byQ = Object.fromEntries(rows.map(row => [row.q, row.text]));
const adversarialChecks = [
  ['Q05 must not contain Q44 hotel-cancellation events', !/cancelled our booking|backup plan|another hotel/i.test(byQ.Q05)],
  ['Q07 must not use the Q05/Q44 problem branches', !/did not reply|cancelled our booking|backup plan|another hotel/i.test(byQ.Q07)],
  ['Q07 must make the happy event visible', /took photos|sang along|dinner together|favourite moments|excited/i.test(byQ.Q07)],
  ['Q57 must keep both original problems', /pouring|muddy/i.test(byQ.Q57) && /phones were not allowed|filming-rights/i.test(byQ.Q57)],
  ['Q28 must not contain the detailed language-study branch', !/started learning Japanese|foreigners online|watched Friends/i.test(byQ.Q28)],
  ['Q56 must stay on the cake story', /cake/i.test(byQ.Q56) && !/followers|brands|exhibitions/i.test(byQ.Q56)],
  ['Q25 must explain why the river is important', /important/i.test(byQ.Q25) && /history|culture|transport route/i.test(byQ.Q25)],
  ['Q23 must keep Claire as the smart problem solver', /Claire/i.test(byQ.Q23) && /smart/i.test(byQ.Q23)],
  ['Q14 must remain a pottery programme', /programme/i.test(byQ.Q14) && /pottery market/i.test(byQ.Q14)],
  ['Q51 must remain the original TikTok character-pottery video', /TikTok/i.test(byQ.Q51) && /character|sculpture/i.test(byQ.Q51) && !/pottery market/i.test(byQ.Q51)],
  ['Q52 must remain local pottery news', /local news/i.test(byQ.Q52) && /pottery market/i.test(byQ.Q52)],
  ['Q04 must not contain the old friendship-timeline contradiction', !/met her again|found out that she was/i.test(byQ.Q04)],
  ['Q15 must remain a famous-person advertisement', /advertisement/i.test(byQ.Q15) && /coffee brand/i.test(byQ.Q15) && !/online programme/i.test(byQ.Q15)],
  ['Q02/Q03 must remain self-solved', !/Claire/i.test(byQ.Q02) && !/Claire/i.test(byQ.Q03) && /social media/i.test(byQ.Q02)],
  ['Q04 must remain a future overseas job', /would like|want|will|could|might/i.test(byQ.Q04) && /volunteer/i.test(byQ.Q04)],
  ['Q36 must remain a future Tokyo itinerary', /If we go again|would like to visit/i.test(byQ.Q36) && /three days/i.test(byQ.Q36)],
  ['Q37/Q38 must remain best-friend stories', /best friend/i.test(byQ.Q37) && /best friend/i.test(byQ.Q38) && !/sister/i.test(byQ.Q37 + byQ.Q38)],
  ['Q44 must keep teamwork and hotel backup', /divided the tasks|teamwork/i.test(byQ.Q44) && /backup plan/i.test(byQ.Q44)],
  ['Q48 must remain a future first purchase', /want|would|could|might/i.test(byQ.Q48) && !/gave me|I bought|I paid/i.test(byQ.Q48)],
  ['Q54 must remain a penguin-learning exhibition', /exhibition/i.test(byQ.Q54) && /learn|understand/i.test(byQ.Q54) && !/tax benefit|law/i.test(byQ.Q54)],
  ['Q55 must remain the public-transport law', /law/i.test(byQ.Q55) && /public transport/i.test(byQ.Q55)]
];
const adversarialFailures = adversarialChecks.filter(([, passed]) => !passed).map(([name]) => name);

console.log(JSON.stringify({
  templates: data.length,
  topics: rows.length,
  similarityGroups: (context.window.P2_SIMILARITY_GROUPS || []).length,
  missing,
  duplicate,
  groupMissing,
  groupDuplicate,
  empty: empty.map(row => row.q),
  malformed: malformed.map(row => row.q),
  adversarialFailures,
  shortest: rows.slice().sort((a, b) => a.words - b.words).slice(0, 10).map(({ q, words, template }) => ({ q, words, template })),
  longest: rows.slice().sort((a, b) => b.words - a.words).slice(0, 10).map(({ q, words, template }) => ({ q, words, template })),
  short: short.map(({ q, words }) => ({ q, words })),
  long: long.map(({ q, words }) => ({ q, words }))
}, null, 2));

if (process.argv.includes('--dump')) {
  for (const row of rows) {
    console.log(`\n## ${row.q} ${row.zh} | ${row.words} words | ${row.template}`);
    console.log(`Prompt: ${row.en}`);
    console.log(row.text);
  }
}

if (missing.length || duplicate.length || groupMissing.length || groupDuplicate.length || grouped.length !== 59 || empty.length || malformed.length || adversarialFailures.length || short.length || long.length) process.exitCode = 1;
