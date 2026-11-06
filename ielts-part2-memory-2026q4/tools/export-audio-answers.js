// Extract the same final English answers displayed by app.js, after all story patches.
// Usage: node ielts-part2-memory-2026q4/tools/export-audio-answers.js
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');

const folder = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(folder, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\s+src="([^"]+)"\s*>\s*<\/script>/g)]
  .map(m => m[1].split('?')[0]);
const ctx = vm.createContext({ window: {}, console, document: { addEventListener() {} } });
for (const script of scripts) {
  if (script === 'app.js') break;
  // Browser dependencies are after app.js; skip generated audio manifests.
  if (script.startsWith('audio/')) continue;
  vm.runInContext(fs.readFileSync(path.join(folder, script), 'utf8'), ctx, { filename: script, timeout: 10000 });
}
// The live page applies this final data patch after app.js. Run it here too,
// with a minimal document stub, so MP3 hashes match the text actually spoken.
const lateContentPatches = ['quality-alignment-v44.js'];
for (const script of lateContentPatches) {
  vm.runInContext(fs.readFileSync(path.join(folder, script), 'utf8'), ctx, { filename: script, timeout: 10000 });
}
const groups = ctx.window.P2_2026Q4_GROUPS || [];
const voice = 'en-US-JennyNeural', rate = '-5%';
function parts(g,t) {
  let result;
  if (Array.isArray(t.reviewed) && t.reviewed.length) {
    result = t.reviewed.filter(p => p && p.text).map(p => p.text);
  } else {
    const omit = new Set(t.omit || []);
    result = [t.intro];
    (g.shared || []).forEach((part,i) => {
      if (omit.has(i)) return;
      result.push(t.overrides && Object.prototype.hasOwnProperty.call(t.overrides,i) ? t.overrides[i] : part);
      if (i===0 && t.middle) result.push(t.middle);
    });
    (t.extra || []).forEach(x => result.push(x));
    if (t.ending) result.push(t.ending);
    result = result.filter(Boolean);
  }
  // Keep exactly the same placement as the website's parts(g,t).
  if (t.flex?.text) result.splice(Math.max(0,result.length-1),0,t.flex.text);
  return result;
}
const items = {};
for (const g of groups) for (const t of g.topics) {
  if (items[t.q]) throw new Error('Repeated topic '+t.q);
  const text = parts(g,t).join(' ').replace(/\s+/g,' ').trim();
  if (text.length < 200) throw new Error('Suspiciously short answer '+t.q+': '+text.length);
  const hash = crypto.createHash('sha256').update(voice+'\0'+rate+'\0'+text).digest('hex');
  items[t.q] = {hash,text};
}
if (Object.keys(items).length !== 58) throw new Error('Expected 58 answers, got '+Object.keys(items).length);
for (let n=1;n<=58;n++) {
  const q='Q'+String(n).padStart(2,'0');
  if (!items[q]) throw new Error('Missing '+q);
}
process.stdout.write(JSON.stringify({voice,rate,items}));
