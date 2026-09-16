// Replay exported phone input against the actual inline application code.
// Usage: node replay.cjs recording.json [--baseline] [--check]
// Recorded frame times are post-step observations. Replay is approximate because
// sensor callbacks and timer scheduling have sub-frame timing differences.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (data.format !== 'blindbox-physics-recording') throw Error('Unknown recording format');
const baseline = process.argv.includes('--baseline');
const html = baseline
  ? execFileSync('git', ['show', '3c9f283:blindbox-shake-test/index.html'], { cwd: __dirname, encoding: 'utf8', maxBuffer: 10e6 })
  : fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let now = data.startTime, nextId = 1;
const timers = new Map(), nodes = new Map();
function node(key) {
  if (!nodes.has(key)) nodes.set(key, {
    style: { setProperty() {} }, classList: { add() {}, remove() {} },
    offsetWidth: data.geometry.box.width, offsetHeight: data.geometry.box.height,
    clientWidth: data.geometry.arena.width, clientHeight: data.geometry.arena.height,
    querySelector: node, addEventListener() {}, animate() {}, append() {}, remove() {},
    textContent: '', innerHTML: '', hidden: false
  });
  return nodes.get(key);
}
const context = {
  console, performance: { now: () => now, timeOrigin: data.timeOrigin },
  document: { querySelector: node, addEventListener() {}, hidden: false },
  navigator: { userAgent: data.device.userAgent },
  screen: { orientation: { angle: data.device.screenAngle } },
  window: { addEventListener() {}, orientation: data.device.screenAngle },
  requestAnimationFrame: () => nextId++, cancelAnimationFrame() {},
  setInterval() {}, clearTimeout: id => timers.delete(id),
  setTimeout: (callback, delay) => { const id = nextId++; timers.set(id, { at: now + delay, callback }); return id; },
  devicePixelRatio: data.device.pixelRatio, innerWidth: data.geometry.viewport.width,
  innerHeight: data.geometry.viewport.height,
  Math: Object.assign(Object.create(Math), { random: () => 0 }),
  Date, URL, initial: data.initial, parameters: data.parameters, recordingStart: data.startTime
};
vm.createContext(context);
const restored = ['state','body','rotation','angularVelocity','physicsAccumulator','gravity','gravityReady',
  'gravityForce','previousAcceleration','sensorForce','phoneAcceleration','inertiaAcceleration',
  'bodyAcceleration','deltaVelocity','wallContact','latestImpactSpeed','hitCount','targetHits',
  'distanceSinceImpact','physicsPaused','pointer','lastMotionTime','lastFrameTime','lastImpactTime','orientation'];
let script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const hook = `
  ${restored.map(k => `${k}=JSON.parse(JSON.stringify(initial.${k}));`).join('\n')}
  Object.assign(MOTION,parameters); motionAttached=true;
  recordActive=true; recordStarted=recordingStart; recording={events:[]};
  haptic=()=>{}; pulseImpact=()=>{};
  globalThis.replay={handleMotion,tick,reset,beginSettle,beginRun,captureState,
    parameters:p=>Object.assign(MOTION,p),pause:p=>{physicsPaused=p;},
    orientation:o=>{orientation={beta:o.beta,gamma:o.gamma};},events:()=>recording.events};
`;
script = script.replace(/\}\)\(\);\s*$/, hook + '\n})();');
vm.runInContext(script, context);
function advance(time) {
  for (;;) {
    const due = [...timers].filter(([, t]) => t.at <= time).sort((a,b) => a[1].at-b[1].at)[0];
    if (!due) break;
    now = due[1].at; timers.delete(due[0]); due[1].callback();
  }
  now = time;
}
const differences = [];
for (const event of data.events) {
  advance(data.startTime + event.t);
  if (event.type === 'sensor') {
    context.screen.orientation.angle = event.screenAngle;
    context.replay.handleMotion({ ...event, timeStamp: event.eventTime });
  } else if (event.type === 'frame') {
    context.replay.tick(event.frameTime);
    const actual = context.replay.captureState();
    if (actual.state === event.snapshot.state) differences.push(Math.hypot(actual.body.x-event.snapshot.body.x, actual.body.y-event.snapshot.body.y));
  } else if (event.type === 'reset') context.replay.reset();
  else if (event.type === 'parameters') context.replay.parameters(event.parameters);
  else if (event.type === 'pause') context.replay.pause(event.paused);
  else if (event.type === 'orientation') context.replay.orientation(event);
}
const events = context.replay.events();
const summary = {
  baseline,
  meanPositionErrorPx: differences.reduce((a,b)=>a+b,0)/Math.max(1,differences.length),
  maxPositionErrorPx: Math.max(0,...differences),
  counted: events.filter(e=>e.type==='countedImpact').map(({t,wall,speed,hitCount,targetHits})=>({t,wall,speed,hitCount,targetHits})),
  results: events.filter(e=>e.type==='result').map(e=>e.t),
  shakeStarts: events.filter(e=>e.type==='beginRun').map(e=>e.t)
};
console.log(JSON.stringify(summary,null,2));

if (process.argv.includes('--check')) {
  const assert = require('node:assert/strict');
  advance(now + 1000);
  context.replay.reset();
  const started = now;
  for (let frame = 1; frame <= 240; frame++) {
    advance(started + frame * 1000 / 120);
    context.replay.handleMotion({ acceleration: { x:0,y:0,z:0 }, accelerationIncludingGravity: { x:0,y:9.81,z:0 }, interval: 8.333 });
    context.replay.tick(now);
  }
  let snapshot = context.replay.captureState();
  assert.equal(snapshot.hitCount, 1, 'Quiet gravity drop must count exactly once');
  assert.equal(snapshot.state, 'armed', 'Quiet gravity drop must wait for the next shake');
  context.replay.reset();
  advance(now + 20);
  context.replay.handleMotion({ acceleration: { x:8,y:0,z:0 }, accelerationIncludingGravity: { x:8,y:9.81,z:0 }, interval: 16 });
  snapshot = context.replay.captureState();
  assert.equal(snapshot.state, 'running', 'Shaking during the drop must start the round immediately');
  assert.equal(snapshot.hitCount, 0, 'Shaking without wall contact must not count');
  console.log('PASS: quiet drop counts once; immediate shake interrupts drop; shake alone does not count');
}
