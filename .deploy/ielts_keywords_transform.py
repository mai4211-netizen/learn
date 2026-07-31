from pathlib import Path
import re, hashlib, subprocess

p=Path('ielts-part2-shared-v2/index.html')
s=p.read_text(encoding='utf-8')
old_sha='379bbdbacb4f00ef198250eb10be28ef2f792c97e79fc6ead3a4f155532eb8e2'
new_sha='03903c81d1421ebf48691b19baeef6feec62253305c5d146ab32471102a7b378'
if hashlib.sha256(s.encode()).hexdigest()!=old_sha:
    raise SystemExit('unexpected source index.html')

css="""strong.kw{font-weight:700;text-decoration:underline;text-decoration-color:#d9822b;
 text-decoration-thickness:2px;text-underline-offset:3px}
#kwbtn{position:absolute;z-index:60;border:0;background:var(--ink);color:#fff;border-radius:7px;
 padding:5px 11px;font-size:12.5px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.22)}
.kwbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:14px 0;font-size:13px;color:var(--sub)}
.kwbar b{color:var(--ink);font-size:13.5px}
"""
s=s.replace(".p-own{padding:0 12px}\n",".p-own{padding:0 12px}\n"+css,1)

bar="""<div class="kwbar"><b>关键词加粗</b>
<span>选中英文 → 右上角按钮，或 Ctrl/⌘+B。再选一次取消。记录存在本机浏览器里。</span>
<button class="toggle" id="kwclear" style="margin:0">清除全部</button>
<button class="toggle" id="kwexp" style="margin:0">导出</button>
<label class="toggle" style="margin:0;cursor:pointer">导入<input id="kwimp" type="file" accept="application/json" hidden></label>
<span id="kwcount"></span></div>

"""
s=s.replace('<section class="mpane" data-mp="lib">\n','<section class="mpane" data-mp="lib">\n'+bar,1)

def block(m):
    x=m.group(0); bid=m.group(1)
    x,n=re.subn(r'<p class="en">',f'<p class="en" data-p="{bid}">',x,count=1)
    if n!=1: raise SystemExit('block transform failed '+bid)
    return x
s,n=re.subn(r'<article class="block[^"]*" id="(blk-[^"]+)">.*?</article>',block,s,flags=re.S)
if n!=65: raise SystemExit(f'expected 65 blocks, got {n}')

def card(m):
    num=int(m.group(1)); body=m.group(0)
    a=re.search(r'(<div class="answer">)(.*?)(</div>)',body,re.S)
    if not a: raise SystemExit(f'answer missing t{num}')
    i=0
    def rp(x):
        nonlocal i
        out=f'<p class="{x.group(1)}" data-p="t{num}-{i}">'
        i+=1
        return out
    inner,c=re.subn(r'<p class="([^"]+)">',rp,a.group(2))
    if c<1: raise SystemExit(f'paragraphs missing t{num}')
    return body[:a.start(2)]+inner+body[a.end(2):]
s,n=re.subn(r'<article class="card" id="t(\d+)".*?</article>',card,s,flags=re.S)
if n!=59: raise SystemExit(f'expected 59 cards, got {n}')

js="""
/* ===== 关键词加粗 ===== */
(function(){
const KEY='ielts-kw-v1', SKIP='.pin,.hint,.vtag';
let store={};try{store=JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){alert('本机浏览器不允许保存，加粗只在本次有效');}};
function tnodes(el){const o=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,
 {acceptNode:n=>n.parentElement.closest(SKIP)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 let n;while(n=w.nextNode())o.push(n);return o;}
const plain=el=>tnodes(el).map(n=>n.nodeValue).join('');
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=(h*33^s.charCodeAt(i))>>>0;return h.toString(36);}
const keyOf=el=>el.dataset.p+'#'+hash(plain(el));
function offsetOf(el,node,off){
 if(node.nodeType===3){let t=0;for(const n of tnodes(el)){if(n===node)return t+off;t+=n.nodeValue.length;}return -1;}
 const probe=document.createRange();probe.setStart(node,off);probe.collapse(true);
 let t=0;for(const n of tnodes(el)){let c;try{c=probe.comparePoint(n,0);}catch(e){c=-1;}
  if(c>=0)return t;t+=n.nodeValue.length;}
 return t;}
function hostOf(r){const c=r.commonAncestorContainer;const e=c.nodeType===1?c:c.parentElement;return e&&e.closest('[data-p]');}
function strip(el){el.querySelectorAll('strong.kw').forEach(s=>{const p=s.parentNode;
 while(s.firstChild)p.insertBefore(s.firstChild,s);p.removeChild(s);});el.normalize();}
function rangeFor(el,s,e){let t=0,got=false;const r=document.createRange();
 for(const n of tnodes(el)){const L=n.nodeValue.length;
  if(!got&&s<=t+L){r.setStart(n,s-t);got=true;}
  if(got&&e<=t+L){r.setEnd(n,e-t);return r;}t+=L;}return null;}
function apply(el,rs){strip(el);if(!rs||!rs.length)return;
 rs.slice().sort((a,b)=>b[0]-a[0]).forEach(([s,e])=>{const r=rangeFor(el,s,e);if(!r)return;
  const g=document.createElement('strong');g.className='kw';
  try{g.appendChild(r.extractContents());r.insertNode(g);}catch(err){}});el.normalize();}
const merge=rs=>{rs.sort((a,b)=>a[0]-b[0]);const o=[];for(const r of rs){const l=o[o.length-1];
 if(l&&r[0]<=l[1])l[1]=Math.max(l[1],r[1]);else o.push(r.slice());}return o;};
const sub=(rs,s,e)=>{const o=[];for(const [a,b] of rs){if(b<=s||a>=e){o.push([a,b]);continue;}
 if(a<s)o.push([a,s]);if(b>e)o.push([e,b]);}return o;};
const covered=(rs,s,e)=>rs.some(([a,b])=>a<=s&&b>=e);
function count(){let c=0;for(const k in store)c+=store[k].length;
 document.getElementById('kwcount').textContent=c?('已加粗 '+c+' 处'):'';}
function toggle(){const sel=getSelection();if(!sel.rangeCount||sel.isCollapsed)return;
 const r=sel.getRangeAt(0),el=hostOf(r);if(!el)return;
 const s=offsetOf(el,r.startContainer,r.startOffset),e=offsetOf(el,r.endContainer,r.endOffset);
 if(s<0||e<0||e<=s)return;
 const k=keyOf(el);let rs=store[k]||[];
 rs=covered(rs,s,e)?sub(rs,s,e):merge(rs.concat([[s,e]]));
 if(rs.length)store[k]=rs;else delete store[k];
 save();apply(el,store[k]||[]);count();sel.removeAllRanges();hide();}
const btn=document.createElement('button');btn.id='kwbtn';btn.hidden=true;document.body.appendChild(btn);
btn.addEventListener('mousedown',e=>e.preventDefault());
btn.addEventListener('click',toggle);
const hide=()=>btn.hidden=true;
function show(){const sel=getSelection();if(!sel.rangeCount||sel.isCollapsed)return hide();
 const r=sel.getRangeAt(0),el=hostOf(r);if(!el)return hide();
 const s=offsetOf(el,r.startContainer,r.startOffset),e=offsetOf(el,r.endContainer,r.endOffset);
 if(s<0||e<0||e<=s)return hide();
 btn.textContent=covered(store[keyOf(el)]||[],s,e)?'取消加粗':'加粗';
 btn.hidden=false;let b=null;try{b=r.getBoundingClientRect();}catch(err){}
 if(!b||(!b.width&&!b.height))b=el.getBoundingClientRect();
 btn.style.left=Math.max(8,b.right+scrollX-btn.offsetWidth)+'px';
 btn.style.top=Math.max(4,b.top+scrollY-btn.offsetHeight-6)+'px';}
document.addEventListener('mouseup',()=>setTimeout(show,0));
document.addEventListener('keyup',e=>{if(!e.ctrlKey&&!e.metaKey)setTimeout(show,0);});
document.addEventListener('mousedown',e=>{if(e.target!==btn)hide();});
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&(e.key==='b'||e.key==='B')){
  const sel=getSelection();if(sel.rangeCount&&!sel.isCollapsed&&hostOf(sel.getRangeAt(0))){e.preventDefault();toggle();}}
 if(e.key==='Escape')hide();});
function renderAll(){document.querySelectorAll('[data-p]').forEach(el=>{const rs=store[keyOf(el)];if(rs)apply(el,rs);});count();}
document.getElementById('kwclear').addEventListener('click',()=>{
 if(!confirm('清除全部加粗记录？'))return;store={};save();
 document.querySelectorAll('[data-p]').forEach(strip);count();});
document.getElementById('kwexp').addEventListener('click',()=>{
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(store)],{type:'application/json'}));
 a.download='ielts-keywords.json';a.click();URL.revokeObjectURL(a.href);});
document.getElementById('kwimp').addEventListener('change',ev=>{
 const f=ev.target.files[0];if(!f)return;const rd=new FileReader();
 rd.onload=()=>{try{Object.assign(store,JSON.parse(rd.result));save();
  document.querySelectorAll('[data-p]').forEach(strip);renderAll();}catch(e){alert('文件格式不对');}};
 rd.readAsText(f);ev.target.value='';});
renderAll();
})();
"""
if s.count('</script>')!=1: raise SystemExit('unexpected script count')
s=s.replace('</script>',js+'</script>',1)

if hashlib.sha256(s.encode()).hexdigest()!=new_sha:
    raise SystemExit('generated HTML checksum mismatch')
if s.count('class="card"')!=59: raise SystemExit('card count mismatch')
if len(re.findall(r'\bdata-p="',s))<300: raise SystemExit('data-p count too low')
scripts=re.findall(r'<script[^>]*>(.*?)</script>',s,re.S|re.I)
if len(scripts)!=1: raise SystemExit('script count mismatch')
Path('/tmp/ielts-inline.js').write_text(scripts[0],encoding='utf-8')
subprocess.run(['node','--check','/tmp/ielts-inline.js'],check=True)
p.write_text(s,encoding='utf-8',newline='')
print('OK',len(s.encode()),new_sha)
