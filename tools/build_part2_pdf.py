#!/usr/bin/env python3
"""Export the CURRENT 58 IELTS Part 2 answers from the same scripts as the website.

English answer + cue card + optional extension are copied, not rewritten.
"""
import html
import json
import re
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "ielts-part2-memory-2026q4"
OUT = SRC / "IELTS_Part2_2026Q4_Offline.pdf"

def extract():
    index = (SRC / "index.html").read_text(encoding="utf8")
    scripts = [s.split("?")[0] for s in re.findall(
        r'<script\s+src="([^"]+)"\s*>\s*</script>', index
    )]
    if "app.js" not in scripts:
        raise RuntimeError("Cannot find app.js in website script list")
    scripts = [s for s in scripts[:scripts.index("app.js")]
               if s.endswith(".js") and not s.startswith("audio/")]
    js = r"""
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = process.argv[1];
const scripts = JSON.parse(process.argv[2]);
const context = vm.createContext({window:{},console});
for(const filename of scripts) {
  vm.runInContext(fs.readFileSync(path.join(root,filename),"utf8"),
                  context,{filename,timeout:15000});
}
const groups = context.window.P2_2026Q4_GROUPS || [];
const translations = context.window.P2_2026Q4_ZH_TRANSLATIONS || {};
process.stdout.write(JSON.stringify({groups,translations}));
"""
    run = subprocess.run(["node", "-e", js, str(SRC), json.dumps(scripts)],
                         capture_output=True, text=True)
    if run.returncode:
        raise RuntimeError("Failed to read final website answers:\n" + run.stderr[-4000:])
    return json.loads(run.stdout)

def paragraph_data(group, topic):
    """Exact same order as app.js parts(), including optional paragraph."""
    if topic.get("reviewed"):
        parts = [{"text":p.get("text",""), "optional":False}
                 for p in topic["reviewed"] if p and p.get("text")]
    else:
        parts=[{"text":topic.get("intro",""),"optional":False}]
        omit=set(topic.get("omit") or [])
        for i, shared in enumerate(group.get("shared") or []):
            if i in omit:
                continue
            override=(topic.get("overrides") or {}).get(str(i),shared)
            parts.append({"text":override,"optional":False})
            if i == 0 and topic.get("middle"):
                parts.append({"text":topic["middle"],"optional":False})
        for extra in topic.get("extra") or []:
            parts.append({"text":extra,"optional":False})
        if topic.get("ending"):
            parts.append({"text":topic["ending"],"optional":False})
        parts=[p for p in parts if p["text"]]
    if topic.get("flex",{}).get("text"):
        parts.insert(max(0,len(parts)-1),
                     {"text":topic["flex"]["text"],"optional":True})
    return parts

def safe(value):
    s=str(value or "")
    s=s.replace("\u2019","'").replace("\u2018","'")
    s=s.replace("\u201c",'"').replace("\u201d",'"')
    s=s.replace("\u2014"," - ").replace("\u2013"," - ")
    return html.escape(s,quote=False)

pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleLarge",fontName="Helvetica-Bold",
    fontSize=24,leading=29,textColor=HexColor("#172636"),
    alignment=TA_CENTER,spaceAfter=13))
styles.add(ParagraphStyle(name="CoverCN",fontName="STSong-Light",
    fontSize=11,leading=18,textColor=HexColor("#617180"),
    alignment=TA_CENTER,spaceAfter=10))
styles.add(ParagraphStyle(name="Qno",fontName="Helvetica-Bold",
    fontSize=10,leading=13,textColor=HexColor("#31715C"),spaceAfter=7))
styles.add(ParagraphStyle(name="Qtitle",fontName="STSong-Light",
    fontSize=16,leading=23,textColor=HexColor("#1D2934"),spaceAfter=9))
styles.add(ParagraphStyle(name="Prompt",fontName="Helvetica-Bold",
    fontSize=11.5,leading=16,textColor=HexColor("#1D2934"),spaceAfter=10))
styles.add(ParagraphStyle(name="Cue",fontName="Helvetica",
    fontSize=9.2,leading=14,textColor=HexColor("#52616F"),leftIndent=8,
    spaceAfter=3))
styles.add(ParagraphStyle(name="Section",fontName="Helvetica-Bold",
    fontSize=9,leading=12,textColor=HexColor("#58706C"),
    spaceBefore=11,spaceAfter=8))
styles.add(ParagraphStyle(name="Answer",fontName="Helvetica",
    fontSize=10.7,leading=16.4,textColor=HexColor("#243039"),
    spaceAfter=9))
styles.add(ParagraphStyle(name="Optional",parent=styles["Answer"],
    backColor=HexColor("#EAF5EB"),borderColor=HexColor("#78A68A"),
    borderWidth=.6,borderPadding=8,spaceBefore=3,spaceAfter=12))
styles.add(ParagraphStyle(name="Chinese",fontName="STSong-Light",
    fontSize=9.2,leading=15,textColor=HexColor("#53616C"),spaceAfter=8))
styles.add(ParagraphStyle(name="IndexCN",fontName="STSong-Light",
    fontSize=10,leading=16,textColor=HexColor("#293B49"),spaceAfter=4))
styles.add(ParagraphStyle(name="Guide",fontName="STSong-Light",
    fontSize=9.5,leading=16,textColor=HexColor("#52616F"),spaceAfter=8))

def header_footer(canvas,doc):
    canvas.saveState()
    width,height=A4
    canvas.setStrokeColor(HexColor("#E5EAED"))
    canvas.setLineWidth(.5)
    canvas.line(42,38,width-42,38)
    canvas.setFont("Helvetica",8)
    canvas.setFillColor(HexColor("#7A8892"))
    canvas.drawString(43,26,"IELTS Part 2 | 2026 Sep-Dec | 58 topics")
    canvas.drawRightString(width-43,26,f"{doc.page}")
    canvas.restoreState()

def build():
    docdata=extract()
    grouped=docdata["groups"]
    translations=docdata["translations"]
    topics=[(g,t) for g in grouped for t in g.get("topics",[])]
    topics.sort(key=lambda x:int(re.search(r"\d+",x[1].get("q","999")).group()))
    if len(topics)!=58 or len(set(t.get("q") for _,t in topics))!=58:
        raise RuntimeError(f"Expected 58 unique topics, got {len(topics)}")
    story=[]
    story.extend([Spacer(1,175),
                  Paragraph("IELTS SPEAKING<br/>PART 2",styles["TitleLarge"]),
                  Paragraph("2026 Sep-Dec · 58 题 · 当前完整答案",styles["CoverCN"]),
                  Spacer(1,28),
                  Paragraph("供其他 AI 批改反馈使用。逐题保留网页现有英文题干、提示点和完整答案；没有扩写或改写。",styles["CoverCN"]),
                  Paragraph("绿色段落 = 网页中标注的可选延展句；该句已计入字数。后附中文参考，方便核对故事含义。",styles["CoverCN"]),
                  Spacer(1,22),
                  Paragraph("导出内容以当前仓库网站脚本为准，题卡提示点为已整理的回忆版本，不代表官方逐字原题。",styles["CoverCN"]),
                  PageBreak()])
    story.append(Paragraph("58 TOPICS",styles["TitleLarge"]))
    story.append(Paragraph("题目索引",styles["CoverCN"]))
    story.append(Spacer(1,12))
    for g,t in topics:
        story.append(Paragraph(safe(t.get("q"))+"  "+safe(t.get("zh")),styles["IndexCN"]))
    story.append(PageBreak())
    word_counts={}
    for g,t in topics:
        q=t["q"]
        paras=paragraph_data(g,t)
        text=" ".join(p["text"] for p in paras)
        words=len(re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?",text))
        word_counts[q]=words
        heading=[
          Paragraph(safe(q)+"  |  "+str(words)+" WORDS",styles["Qno"]),
          Paragraph(safe(t.get("zh")),styles["Qtitle"]),
          Paragraph(safe(t.get("en")),styles["Prompt"]),
        ]
        cues=t.get("cue") or []
        if cues:
            heading.append(Paragraph("YOU SHOULD SAY:",styles["Section"]))
            for bullet in cues:
                heading.append(Paragraph("&#8226;  "+safe(bullet),styles["Cue"]))
        story.append(KeepTogether(heading))
        story.append(Paragraph("COMPLETE ANSWER",styles["Section"]))
        for p in paras:
            if p["optional"]:
                story.append(Paragraph("<b>OPTIONAL EXTENSION</b><br/>"+safe(p["text"]),
                                       styles["Optional"]))
            else:
                story.append(Paragraph(safe(p["text"]),styles["Answer"]))
        chinese=translations.get(q,"")
        if chinese:
            story.append(Paragraph("中文参考 / CHINESE REFERENCE",styles["Section"]))
            story.append(Paragraph(safe(chinese),styles["Chinese"]))
        story.append(PageBreak())
    output=SimpleDocTemplate(str(OUT),pagesize=A4,
        leftMargin=43,rightMargin=43,topMargin=43,bottomMargin=52,
        title="IELTS Part 2 2026 Q4 - 58 Answers for Feedback",
        author="IELTS study notes")
    output.build(story,onFirstPage=header_footer,onLaterPages=header_footer)
    print(f"Built {OUT}; 58 topics; words min={min(word_counts.values())} "
          f"max={max(word_counts.values())}; mean={sum(word_counts.values())/58:.1f}")
    print("WORD_COUNTS="+json.dumps(word_counts,ensure_ascii=False))

if __name__=="__main__":
    build()
