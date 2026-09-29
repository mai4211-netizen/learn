#!/usr/bin/env python3
import json, re, subprocess, tempfile
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import portrait

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "ielts-part2-memory-2026q4"
OUT = SRC / "IELTS_Part2_2026Q4_Offline.pdf"

def extract_data():
    index = (SRC / "index.html").read_text(encoding="utf-8")
    scripts = re.findall(r'<script src="([^"]+\.js)"></script>', index)
    scripts = [s for s in scripts if s != "app.js"]
    node = r"""
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = process.argv[1];
const scripts = JSON.parse(process.argv[2]);
const sandbox = {window:{}};
vm.createContext(sandbox);
for (const s of scripts) {
  const code = fs.readFileSync(path.join(root, s), 'utf8');
  vm.runInContext(code, sandbox, {filename:s});
}
process.stdout.write(JSON.stringify(sandbox.window.P2_2026Q4_GROUPS || []));
"""
    result = subprocess.run(
        ["node", "-e", node, str(SRC), json.dumps(scripts)],
        check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)

def topic_num(q):
    m = re.search(r"(\d+)", q or "")
    return int(m.group(1)) if m else 999

def clean(s):
    return (s or "").replace("→", " > ").replace("–", "-").replace("—", "-")

pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))

PAGE = (432, 768)
MARGIN_X = 28
MARGIN_TOP = 26
MARGIN_BOTTOM = 28

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CNTitle", fontName="STSong-Light", fontSize=18, leading=23,
    textColor=HexColor("#201E1B"), spaceAfter=8
))
styles.add(ParagraphStyle(
    name="QNo", fontName="Helvetica-Bold", fontSize=9.5, leading=12,
    textColor=HexColor("#766E65"), spaceAfter=3
))
styles.add(ParagraphStyle(
    name="ENPrompt", fontName="STSong-Light", fontSize=11.2, leading=15.5,
    textColor=HexColor("#26231F"), spaceAfter=7
))
styles.add(ParagraphStyle(
    name="Label", fontName="STSong-Light", fontSize=8.7, leading=11,
    textColor=HexColor("#756D63"), spaceAfter=3
))
styles.add(ParagraphStyle(
    name="Chain", fontName="STSong-Light", fontSize=9.8, leading=14.2,
    textColor=HexColor("#514A43"), backColor=HexColor("#FFF9ED"),
    borderColor=HexColor("#D9C59C"), borderWidth=0.6, borderPadding=7,
    spaceAfter=10
))
styles.add(ParagraphStyle(
    name="Body", fontName="STSong-Light", fontSize=10.4, leading=15.4,
    textColor=HexColor("#24211E"), spaceAfter=7
))
styles.add(ParagraphStyle(
    name="Keywords", fontName="STSong-Light", fontSize=8.8, leading=12.5,
    textColor=HexColor("#556B57"), backColor=HexColor("#F2F7F1"),
    borderPadding=6, spaceBefore=5, spaceAfter=2
))
styles.add(ParagraphStyle(
    name="Cover", fontName="STSong-Light", fontSize=24, leading=31,
    alignment=TA_CENTER, textColor=HexColor("#201E1B"), spaceAfter=12
))
styles.add(ParagraphStyle(
    name="CoverSub", fontName="STSong-Light", fontSize=11, leading=17,
    alignment=TA_CENTER, textColor=HexColor("#6E675F"), spaceAfter=8
))
styles.add(ParagraphStyle(
    name="Index", fontName="STSong-Light", fontSize=9.5, leading=14,
    textColor=HexColor("#332F2A"), leftIndent=3, spaceAfter=2
))

def page_decor(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(HexColor("#E8E2DA"))
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, 20, PAGE[0]-MARGIN_X, 20)
    canvas.setFillColor(HexColor("#8B837A"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(PAGE[0]-MARGIN_X, 10.5, str(doc.page))
    canvas.restoreState()

def build():
    groups = extract_data()
    topics = []
    for g in groups:
        for t in g.get("topics", []):
            item = dict(t)
            item["_story"] = g.get("story", "")
            item["_group"] = g.get("title", "")
            topics.append(item)
    topics.sort(key=lambda x: topic_num(x.get("q")))

    doc = SimpleDocTemplate(
        str(OUT), pagesize=PAGE,
        leftMargin=MARGIN_X, rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP, bottomMargin=MARGIN_BOTTOM,
        title="IELTS Part 2 2026 Sep-Dec Offline",
        author="ChatGPT"
    )
    story=[]

    story += [Spacer(1, 95)]
    story += [Paragraph("IELTS Part 2<br/>2026 Sep-Dec", styles["Cover"])]
    story += [Paragraph("爱听写 52 题 · 手机离线备份", styles["CoverSub"])]
    story += [Spacer(1, 12)]
    story += [Paragraph("目标 6-6.5 · 中文记忆链 + 完整答案 + 推荐记忆锚点", styles["CoverSub"])]
    story += [Spacer(1, 28)]
    story += [Paragraph("这份 PDF 是网页 PWA 的离线备份。网页用于切题、搜索和自定义加粗；PDF 用于飞机上或缓存异常时直接阅读。", styles["CoverSub"])]
    story += [PageBreak()]

    story += [Paragraph("题目索引", styles["CNTitle"])]
    for t in topics:
        story.append(Paragraph(f'{clean(t.get("q"))}  {clean(t.get("zh"))}', styles["Index"]))
    story += [PageBreak()]

    for t in topics:
        q=clean(t.get("q"))
        zh=clean(t.get("zh"))
        en=clean(t.get("en"))
        cues=[clean(x) for x in t.get("cue",[]) if x]
        chain=clean(t.get("chain"))
        reviewed=t.get("reviewed") or []
        answer=[clean(p.get("text","")) for p in reviewed if p.get("text")]
        if not answer:
            answer=[clean(t.get("intro",""))]
        keywords=[clean(x) for x in t.get("keywords",[]) if x]

        story.append(Paragraph(q, styles["QNo"]))
        story.append(Paragraph(zh, styles["CNTitle"]))
        story.append(Paragraph(en, styles["ENPrompt"]))
        if cues:
            cue_text="<br/>".join(["• "+x for x in cues])
            story.append(Paragraph(cue_text, styles["Index"]))
            story.append(Spacer(1,5))
        story.append(Paragraph("中文记忆链", styles["Label"]))
        story.append(Paragraph(chain, styles["Chain"]))
        story.append(Paragraph("完整答案", styles["Label"]))
        for p in answer:
            story.append(Paragraph(p, styles["Body"]))
        if keywords:
            story.append(Paragraph("推荐记忆锚点", styles["Label"]))
            story.append(Paragraph(" / ".join(keywords), styles["Keywords"]))
        story.append(PageBreak())

    doc.build(story, onFirstPage=page_decor, onLaterPages=page_decor)
    print(OUT)

if __name__ == "__main__":
    build()
