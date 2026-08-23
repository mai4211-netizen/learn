const $=id=>document.getElementById(id);
let queue=[],idx=-1,running=false,paused=false,current=null,timerId=null,timerVal=0;
let recorder=null,chunks=[],audioBlob=null,recognizer=null,sessionTranscript="",itemTranscript="",useLocal=false;

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function history(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}}
function saveHistory(key,arr){localStorage.setItem(key,JSON.stringify([...new Set(arr)]));updateHist()}
function pickFresh(pool,used,n,key,idFn=x=>x){
  let available=pool.filter(x=>!used.includes(idFn(x)));
  if(available.length<n){used=[];available=[...pool]}
  const picks=shuffle(available).slice(0,n);
  saveHistory(key,[...used,...picks.map(idFn)]);
  return picks;
}
function updateHist(){$("histP1").textContent="P1 已练 "+history("ielts_used_p1").length;$("histP2").textContent="P2 已练 "+history("ielts_used_p2").length}
updateHist();

function buildQueue(){
  queue=[];
  const mode=$("mode").value;
  let p2=null;
  if(mode==="full"||mode==="p1"){
    const topics=pickFresh(P1_TOPICS,history("ielts_used_p1"),3,"ielts_used_p1");
    topics.forEach(topic=>P1Q[topic].forEach(q=>queue.push({part:1,type:"normal",q,source:topic})));
  }
  if(mode==="full"||mode==="p2"||mode==="p3"){
    p2=pickFresh(P2_CARDS,history("ielts_used_p2"),1,"ielts_used_p2",x=>x.source)[0];
  }
  if(mode==="full"||mode==="p2") queue.push({part:2,type:"part2",...p2});
  if(mode==="full"||mode==="p3"){
    const qs=shuffle(P3[p2.theme]||P3.experience).slice(0,4);
    qs.forEach(q=>queue.push({part:3,type:"normal",q,source:p2.source}));
  }
}

function fmt(s){s=Math.max(0,s|0);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function setTimer(seconds,onEnd,countUp=false){
  clearInterval(timerId);timerVal=countUp?0:seconds;$("timer").textContent=fmt(timerVal);
  timerId=setInterval(()=>{if(paused)return;timerVal+=countUp?1:-1;$("timer").textContent=fmt(timerVal);if(!countUp&&timerVal<=0){clearInterval(timerId);onEnd&&onEnd()}},1000)
}
function voices(){return speechSynthesis.getVoices()}
function loadVoices(){
  if(!("speechSynthesis" in window))return;
  const s=$("voice");s.innerHTML="";
  voices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>(/en-GB/i.test(b.lang)?1:0)-(/en-GB/i.test(a.lang)?1:0)).forEach(v=>{
    const o=document.createElement("option");o.value=v.name;o.textContent=v.name+" · "+v.lang;
    if(/Daniel|Arthur|Oliver|Serena|Kate/i.test(v.name)&&/GB/i.test(v.lang))o.selected=true;s.appendChild(o)
  })
}
loadVoices();if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadVoices;

function speak(text,after){
  stopRecognition();if(!("speechSynthesis" in window)){after&&after();return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);
  u.voice=voices().find(v=>v.name===$("voice").value)||voices().find(v=>/en-GB/i.test(v.lang))||voices().find(v=>/^en/i.test(v.lang));
  u.rate=parseFloat($("rate").value);u.pitch=1;
  $("status").textContent="EXAMINER SPEAKING";$("bars").classList.add("on");
  const done=()=>{$("status").textContent="LISTENING";$("bars").classList.remove("on");after&&after()};
  u.onend=done;u.onerror=done;speechSynthesis.speak(u)
}

function displayItem(item){
  current=item;$("phase").textContent="PART "+item.part;$("sidePhase").textContent="Part "+item.part;
  $("count").textContent=(idx+1)+" / "+queue.length;$("prog").style.width=(idx/queue.length*100)+"%";
  $("cues").innerHTML="";$("cues").style.display="none";
  $("source").textContent="爱听写当季主题："+(item.source||"");$("source").style.display=$("showSource").checked?"block":"none";
  const show=$("showText").checked||item.part===2;
  $("question").textContent=show?item.q:"Listen to the examiner.";
  itemTranscript="";$("done").disabled=true;$("repeat").disabled=true;
}
function ask(){
  const item=queue[idx];if(!item)return finish();
  displayItem(item);
  if(item.type==="part2"){
    item.cues.forEach(c=>{const li=document.createElement("li");li.textContent=c;$("cues").appendChild(li)});$("cues").style.display="block";
    $("hint").textContent="Part 2 · 听完题后自动开始 1 分钟准备";
    speak(item.q+" You should say: "+item.cues.join(". ")+". You have one minute to prepare. You can make some notes if you wish.",prep)
  }else{
    $("hint").textContent=item.part===1?"Part 1 · 简短直接回答":"Part 3 · 展开观点和理由";
    speak(item.q,()=>{$("done").disabled=false;$("repeat").disabled=false;setTimer(0,null,true);startRecognition()})
  }
}
function prep(){
  $("phase").textContent="PART 2 · PREP";$("sidePhase").textContent="Part 2 准备";$("status").textContent="PREPARATION";$("hint").textContent="准备 1:00 · 可以记关键词";
  setTimer(60,()=>speak("All right. Remember, you have one to two minutes for this. Please start speaking now.",talkP2))
}
function talkP2(){
  $("phase").textContent="PART 2 · SPEAK";$("sidePhase").textContent="Part 2 回答";$("hint").textContent="回答 2:00 · 到点会自动打断";$("status").textContent="LISTENING";
  $("done").disabled=false;startRecognition();setTimer(120,()=>{stopRecognition();$("done").disabled=true;speak("Thank you.",()=>{idx++;setTimeout(ask,450)})})
}
function next(){
  if(!running)return;stopRecognition();clearInterval(timerId);
  if(current?.type==="part2") speak("Thank you.",()=>{idx++;setTimeout(ask,350)});
  else{idx++;ask()}
}
function repeat(){if(!current)return;speak(current.q,()=>{startRecognition();$("status").textContent="LISTENING"})}

async function initRecorder(){
  if(!navigator.mediaDevices?.getUserMedia){$("rec").textContent="不支持";return}
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(stream);chunks=[];
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{audioBlob=new Blob(chunks,{type:recorder.mimeType||"audio/webm"});$("saveAudio").disabled=false};
    recorder.start();$("rec").textContent="录制中"
  }catch{$("rec").textContent="未授权"}
}
function initRecognition(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  recognizer=new SR();recognizer.lang="en-GB";recognizer.continuous=true;recognizer.interimResults=true;
  recognizer.onresult=e=>{let inter="",fin="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)fin+=t+" ";else inter+=t}
    if(fin){itemTranscript+=fin;sessionTranscript+=fin}$("transcript").textContent=(itemTranscript+inter).trim()||"Listening…"
  };
  recognizer.onerror=()=>{};recognizer.onend=()=>{if(running&&!paused&&$("status").textContent==="LISTENING"){try{recognizer.start()}catch{}}}
}
initRecognition();
function startRecognition(){if(recognizer)try{recognizer.start()}catch{}}
function stopRecognition(){if(recognizer)try{recognizer.stop()}catch{}}

async function startTest(){
  buildQueue();idx=0;running=true;paused=false;sessionTranscript="";$("intro").classList.add("hidden");
  $("startBtn").disabled=true;$("end").disabled=false;$("pause").disabled=false;$("transcript").textContent="Listening…";await initRecorder();
  $("phase").textContent="INTRO";$("sidePhase").textContent="身份核对";$("question").textContent="Can you tell me your full name, please?";$("hint").textContent="身份核对";$("count").textContent="—";
  speak("Good afternoon. My name is Alex. Can you tell me your full name, please?",()=>{$("done").disabled=false;$("done").onclick=()=>{
      $("done").onclick=next;speak("Thank you. Now, in this first part, I'd like to ask you some questions about yourself.",ask)
    }})
}
function finish(){
  running=false;clearInterval(timerId);stopRecognition();speechSynthesis.cancel();if(recorder&&recorder.state!=="inactive")recorder.stop();
  $("phase").textContent="FINISHED";$("sidePhase").textContent="已结束";$("status").textContent="FINISHED";$("question").textContent="The speaking test is finished.";
  $("hint").textContent="可以保存录音，或把转写复制给 ChatGPT 复盘。";$("timer").textContent="00:00";$("prog").style.width="100%";
  ["done","repeat","pause","end"].forEach(id=>$(id).disabled=true);$("startBtn").disabled=false;$("startBtn").textContent="再抽一场"
}

$("go").onclick=()=>{$("mode").value="full";startTest()};$("setupFirst").onclick=()=>{$("intro").classList.add("hidden");$("settings").classList.add("open")};
$("startBtn").onclick=startTest;$("done").onclick=next;$("repeat").onclick=repeat;$("end").onclick=finish;
$("settingsBtn").onclick=()=>$("settings").classList.toggle("open");
$("pause").onclick=()=>{paused=!paused;$("pause").textContent=paused?"继续":"暂停";if(paused){speechSynthesis.pause();stopRecognition();$("status").textContent="PAUSED"}else{speechSynthesis.resume();startRecognition();$("status").textContent="LISTENING"}};
$("rate").oninput=e=>$("rateVal").textContent=parseFloat(e.target.value).toFixed(2)+"×";
function videoTransform(){const z=parseFloat($("zoom").value),x=parseInt($("xpos").value);$("zoomVal").textContent=z.toFixed(2)+"×";const t=`translate(calc(-50% + ${x}%), -50%) scale(${z})`;$("yt").style.transform=t;$("localVideo").style.transform=t}
$("zoom").oninput=videoTransform;$("xpos").oninput=videoTransform;videoTransform();
$("showSource").onchange=()=>{if(current)$("source").style.display=$("showSource").checked?"block":"none"};
$("showText").onchange=()=>{if(current&&current.part!==2)$("question").textContent=$("showText").checked?current.q:"Listen to the examiner."};
$("videoFile").onchange=e=>{const f=e.target.files?.[0];if(!f)return;useLocal=true;$("localVideo").src=URL.createObjectURL(f);$("localVideo").style.display="block";$("yt").style.display="none";$("localVideo").play().catch(()=>{})};
$("copy").onclick=async()=>{const t=`IELTS Speaking 模拟转写\n\n${sessionTranscript||$("transcript").textContent}\n\n请按 Fluency & Coherence / Lexical Resource / Grammar / Pronunciation 四项评估，并优先指出最影响分数的问题。`;try{await navigator.clipboard.writeText(t);$("copy").textContent="已复制";setTimeout(()=>$("copy").textContent="复制给 ChatGPT",1200)}catch{alert(t)}};
$("saveAudio").onclick=()=>{if(!audioBlob)return;const a=document.createElement("a");a.href=URL.createObjectURL(audioBlob);a.download="IELTS-speaking-mock.webm";a.click()};
$("resetHist").onclick=()=>{localStorage.removeItem("ielts_used_p1");localStorage.removeItem("ielts_used_p2");updateHist();$("resetHist").textContent="已清空";setTimeout(()=>$("resetHist").textContent="清空不重复记录",1200)};