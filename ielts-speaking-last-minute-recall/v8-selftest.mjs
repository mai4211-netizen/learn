import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const dir = new URL('./', import.meta.url);
const read = name => fs.readFileSync(new URL(name, dir), 'utf8');
const report = { build: 'v8', startedAt: new Date().toISOString(), checks: [] };
const check = (name, fn) => Promise.resolve().then(fn).then(() => report.checks.push({ name, ok: true })).catch(error => { report.checks.push({ name, ok: false, error: String(error?.stack || error) }); throw error; });

await check('assemble base page and verify digest', () => {
  const html = Array.from({ length: 8 }, (_, index) => read(`page-v6-${index + 1}.txt`)).join('');
  assert.equal(html.length, 43116);
  assert.equal(crypto.createHash('sha256').update(html).digest('hex'), '37d44065866508b993cd0940427067fe24662c521d2ff6f3dd3c2150fa0fd878');
  for (const token of ['id="learningMode"', 'data-record-start', '本轮练习', '分享练习包']) assert.ok(html.includes(token), token);
});

const v7 = read('patch-v7.js');
const v8 = read('patch-v8.js');
await check('parse v7 and v8 scripts', () => {
  new vm.Script(v7, { filename: 'patch-v7.js' });
  new vm.Script(v8, { filename: 'patch-v8.js' });
});

const stored = new Map();
const listeners = new Map();
const fakeDocument = {
  hidden: false,
  activeElement: null,
  head: { appendChild() {} },
  createElement() { return { className: '', innerHTML: '', style: {}, appendChild() {}, insertAdjacentElement() {}, querySelector() { return null; }, setAttribute() {}, addEventListener() {} }; },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  addEventListener(type, handler) { listeners.set(`document:${type}`, handler); }
};
const fakeWindow = {
  document: fakeDocument,
  addEventListener(type, handler) { listeners.set(`window:${type}`, handler); },
  speechSynthesis: { cancel() {}, speak() {} }
};
class FakeMediaRecorder {
  static isTypeSupported() { return true; }
  constructor(stream, options = {}) { this.stream = stream; this.mimeType = options.mimeType || 'audio/webm'; this.state = 'inactive'; this.ondataavailable = null; this.onstop = null; this.onerror = null; }
  start() { this.state = 'recording'; }
  requestData() { if (this.state === 'recording') this.ondataavailable?.({ data: new Blob(['audio-payload-for-test'], { type: this.mimeType }) }); }
  stop() { if (this.state !== 'recording') return; this.state = 'inactive'; this.onstop?.(); }
}
const stream = { getTracks: () => [{ stop() {} }] };
const objectUrls = new Set();
const fakeURL = {
  createObjectURL() { const value = `blob:test-${objectUrls.size + 1}`; objectUrls.add(value); return value; },
  revokeObjectURL(value) { objectUrls.delete(value); }
};
const toasts = [];
const rec = {};
const baseRender = () => 'rendered';
const context = vm.createContext({
  console,
  Blob,
  TextEncoder,
  Uint8Array,
  DataView,
  Map,
  Set,
  Promise,
  Date,
  Math,
  RegExp,
  String,
  Array,
  Object,
  Error,
  URL: fakeURL,
  window: fakeWindow,
  document: fakeDocument,
  navigator: { mediaDevices: { getUserMedia: async () => stream } },
  MediaRecorder: FakeMediaRecorder,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame: callback => setTimeout(callback, 16),
  cancelAnimationFrame: id => clearTimeout(id),
  confirm: () => true,
  rec,
  cardMode: false,
  currentCardId: '',
  render: baseRender,
  filtered: () => [],
  panel: () => null,
  startRecording() {},
  stopRecording() {},
  localAnalyze() {},
  copyTranscript() {},
  saveTake: async take => { stored.set(take.id, take); },
  allTakes: async () => [...stored.values()],
  deleteTake: async id => { stored.delete(id); },
  clearTakes: async () => { stored.clear(); },
  refreshSessionCount: async () => {},
  itemById: id => ({ id, part: 'p1', topic: 'Work', title: id === 'q2' ? 'What is interesting about your job?' : 'What do you do?' }),
  toast: text => toasts.push(text),
  fileExt: () => 'webm',
  fmt: seconds => `${Math.round(seconds)}s`,
  esc: value => String(value)
});
fakeWindow.window = fakeWindow;
fakeWindow.MediaRecorder = FakeMediaRecorder;
fakeWindow.URL = fakeURL;

vm.runInContext(v8, context, { filename: 'patch-v8.js' });

await check('install v8 patch and expose helpers', () => {
  assert.equal(context.window.__IELTS_RECALL_V8__.build, 'v8');
  assert.equal(typeof context.startRecording, 'function');
  assert.equal(typeof context.stopRecording, 'function');
  assert.equal(typeof context.localAnalyze, 'function');
  assert.equal(typeof context.copyTranscript, 'function');
  assert.equal(context.render(), 'rendered');
});

await check('detect and clean frequent spoken grammar errors', () => {
  const sample = 'I am work as a designer. My job was is that designing the interface. I very like it.';
  const hints = context.window.__IELTS_RECALL_V8__.grammarHints(sample);
  const cleaned = context.window.__IELTS_RECALL_V8__.cleanTranscript(sample);
  assert.ok(hints.length >= 3);
  assert.ok(cleaned.includes('I work as a designer'));
  assert.ok(cleaned.includes('I really like it'));
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
await check('record first answer and verify persistent storage', async () => {
  await context.startRecording('q1');
  await sleep(420);
  context.stopRecording(true);
  await sleep(800);
  const list = await context.allTakes();
  assert.equal(list.length, 1);
  assert.equal(list[0].itemId, 'q1');
  assert.ok(list[0].blob.size > 0);
  assert.ok(list[0].duration >= 0.35);
});

await check('record a second answer without overwriting the first', async () => {
  await context.startRecording('q2');
  await sleep(420);
  context.stopRecording(true);
  await sleep(800);
  const list = await context.allTakes();
  assert.equal(list.length, 2);
  assert.deepEqual(list.map(item => item.itemId), ['q1', 'q2']);
  assert.ok(list.every(item => item.blob.size > 0));
});

await check('delete and clear stored recordings', async () => {
  const list = await context.allTakes();
  await context.deleteTake(list[0].id);
  assert.equal((await context.allTakes()).length, 1);
  await context.clearTakes();
  assert.equal((await context.allTakes()).length, 0);
});

report.finishedAt = new Date().toISOString();
report.ok = report.checks.every(item => item.ok);
fs.writeFileSync(new URL('v8-test-report.json', dir), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
