// Check the same 58 final answers shown by the page against the published audio manifest
// and the immutable, source-versioned MP3s. Used as the Pages deployment gate.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const folder = path.resolve(__dirname,'..');
const run = cp.spawnSync(process.execPath,[path.join(__dirname,'export-audio-answers.js')],{encoding:'utf8'});
if (run.status !== 0) throw new Error('Failed to extract final answers: '+(run.stderr||run.stdout));
const source = JSON.parse(run.stdout);
const file = path.join(folder,'audio','audio-manifest.js');
const prefix = 'window.P2_2026Q4_AUDIO = ';
const script = fs.readFileSync(file,'utf8');
if(!script.startsWith(prefix))throw new Error('Unexpected manifest format');
const manifest=JSON.parse(script.slice(prefix.length).trim().replace(/;$/,''));
const values=manifest.versions||{};
const errors=[];
if(Object.keys(source.items).length!==58)errors.push('Wrong answer count');
if(Object.keys(values).length!==58)errors.push('Wrong manifest count');
if(manifest.voice!==source.voice||manifest.rate!==source.rate)errors.push('Voice settings mismatch');
for(const [q,item] of Object.entries(source.items)){
  const hash=item.hash.slice(0,16);
  if(values[q]!==hash){errors.push(q+': manifest version does not match displayed text');continue;}
  const mp3=path.join(folder,'audio',q+'-'+hash+'.mp3');
  if(!fs.existsSync(mp3)||fs.statSync(mp3).size<8000)errors.push(q+': immutable MP3 missing or too small');
}
if(errors.length)throw new Error('Jenny audio is NOT synchronized:\n'+errors.join('\n'));
console.log('Verified 58 final English answers, versioned MP3s, and manifest');
