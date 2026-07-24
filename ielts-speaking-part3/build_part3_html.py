from __future__ import annotations

import html
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "part3_review_guide.md"
OUTPUT = ROOT / "output" / "html" / "雅思口语_Part3_复习资料_交互版.html"


def markdown_fragment() -> str:
    result = subprocess.run(
        ["pandoc", str(SOURCE), "-f", "gfm", "-t", "html5", "--wrap=none"],
        check=True,
        capture_output=True,
        text=True,
    )
    fragment = result.stdout
    fragment = re.sub(r"\A<h1[^>]*>.*?</h1>\s*", "", fragment, count=1, flags=re.S)
    fragment = re.sub(r"\A<blockquote>.*?</blockquote>\s*", "", fragment, count=1, flags=re.S)
    return fragment


def chapters() -> list[tuple[str, str]]:
    items = []
    for line in SOURCE.read_text(encoding="utf-8").splitlines():
        if not line.startswith("## "):
            continue
        label = line[3:].strip()
        slug = re.sub(r"[^a-zA-Z0-9\u4e00-\u9fff]+", "-", label).strip("-").lower()
        items.append((slug, label))
    return items


def navigation(items: list[tuple[str, str]]) -> str:
    buttons = []
    for index, (slug, label) in enumerate(items):
        short = label
        is_global = label.startswith("全局工具")
        if is_global and "｜" in short:
            short = short.split("｜", 1)[1].split("（", 1)[0]
        if "：" in short:
            short = short.split("：", 1)[0]
        buttons.append(
            f'<button class="nav-item{" global-nav" if is_global else ""}" type="button" data-target="{html.escape(slug)}">'
            f'<span class="nav-index">{index + 1:02d}</span>'
            f'<span class="nav-label">{("<small>全局</small>" if is_global else "")}{html.escape(short)}</span>'
            f'<span class="nav-check" aria-hidden="true">✓</span>'
            f'</button>'
        )
    return "\n".join(buttons)


TEMPLATE = r'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="雅思口语 Part 3 复习资料：题型、逻辑、通用角度、主题观点、语法、示范与计时练习。">
  <title>雅思口语 Part 3 复习资料｜交互版</title>
  <style>
    :root {
      --ink: #17212b;
      --muted: #637181;
      --blue: #235c8c;
      --blue-deep: #173e63;
      --blue-soft: #eaf3fa;
      --blue-pale: #f5f9fc;
      --teal: #247e78;
      --gold: #b4812a;
      --line: #d5e0e8;
      --panel: #ffffff;
      --bg: #f3f6f8;
      --shadow: 0 12px 35px rgba(23, 62, 99, .09);
      --reading-size: 17px;
      --sidebar: 286px;
      --topbar: 60px;
      color-scheme: light;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--bg);
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      font-size: var(--reading-size);
      line-height: 1.72;
      -webkit-font-smoothing: antialiased;
    }

    button, input, textarea { font: inherit; }
    button { color: inherit; }
    button:focus-visible, input:focus-visible, textarea:focus-visible, summary:focus-visible {
      outline: 3px solid rgba(35, 92, 140, .25);
      outline-offset: 2px;
    }

    .skip-link {
      position: fixed;
      z-index: 1000;
      top: 8px;
      left: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      color: #fff;
      background: var(--blue-deep);
      transform: translateY(-150%);
    }
    .skip-link:focus { transform: translateY(0); }

    .topbar {
      position: fixed;
      z-index: 50;
      inset: 0 0 auto var(--sidebar);
      height: var(--topbar);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(213, 224, 232, .9);
      background: rgba(255, 255, 255, .92);
      backdrop-filter: blur(14px);
    }
    .topbar-title { min-width: 0; font-size: 14px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .topbar-title strong { color: var(--blue-deep); }
    .top-actions { display: flex; align-items: center; gap: 7px; }
    .icon-button, .text-button {
      min-height: 36px;
      border: 1px solid var(--line);
      border-radius: 9px;
      background: #fff;
      cursor: pointer;
      transition: .18s ease;
    }
    .icon-button { width: 38px; padding: 0; font-weight: 700; }
    .text-button { padding: 6px 11px; font-size: 13px; }
    .icon-button:hover, .text-button:hover { border-color: #9db7cc; background: var(--blue-pale); }
    .menu-button { display: none; }

    .sidebar {
      position: fixed;
      z-index: 60;
      inset: 0 auto 0 0;
      width: var(--sidebar);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--line);
      background: #fff;
      box-shadow: 8px 0 32px rgba(23, 62, 99, .04);
    }
    .brand { padding: 24px 22px 18px; }
    .brand-mark { width: 34px; height: 4px; margin-bottom: 15px; border-radius: 99px; background: var(--gold); }
    .brand h1 { margin: 0; color: var(--blue-deep); font-size: 21px; line-height: 1.32; letter-spacing: -.02em; }
    .brand p { margin: 7px 0 0; color: var(--muted); font-size: 12px; }

    .search-box { position: relative; padding: 0 16px 14px; }
    .search-box input {
      width: 100%;
      height: 42px;
      padding: 0 36px 0 13px;
      border: 1px solid var(--line);
      border-radius: 10px;
      color: var(--ink);
      background: var(--blue-pale);
    }
    .search-box input::placeholder { color: #8794a0; }
    .search-key { position: absolute; right: 27px; top: 11px; color: #8b98a4; font-size: 12px; pointer-events: none; }

    .progress-wrap { padding: 0 18px 14px; }
    .progress-label { display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--muted); font-size: 12px; }
    .progress-track { height: 6px; overflow: hidden; border-radius: 99px; background: #e6edf2; }
    .progress-fill { width: 0; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--teal), #5fb4a8); transition: width .25s ease; }

    .nav-list { flex: 1; overflow: auto; padding: 2px 10px 18px; }
    .nav-item {
      width: 100%;
      display: grid;
      grid-template-columns: 28px minmax(0, 1fr) 22px;
      align-items: center;
      gap: 6px;
      padding: 9px 10px;
      border: 0;
      border-radius: 9px;
      text-align: left;
      background: transparent;
      cursor: pointer;
    }
    .nav-item:hover { background: var(--blue-pale); }
    .nav-item.active { color: var(--blue-deep); background: var(--blue-soft); font-weight: 700; }
    .nav-index { color: #96a1ab; font-size: 11px; font-variant-numeric: tabular-nums; }
    .nav-label { overflow: hidden; font-size: 13px; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
    .nav-label small { display: inline-block; margin-right: 6px; padding: 1px 5px; border-radius: 5px; color: var(--teal); background: #e8f5f2; font-size: 9px; vertical-align: 1px; }
    .global-nav { color: #315f5b; }
    .nav-check { opacity: 0; color: var(--teal); font-size: 12px; }
    .nav-item.reviewed .nav-check { opacity: 1; }

    .sidebar-footer { padding: 13px 16px 18px; border-top: 1px solid var(--line); }
    .practice-entry {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #b8d2e5;
      border-radius: 10px;
      color: var(--blue-deep);
      background: var(--blue-soft);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .app { min-height: 100vh; margin-left: var(--sidebar); padding-top: var(--topbar); }
    .hero {
      max-width: 980px;
      margin: 0 auto;
      padding: 54px 46px 20px;
    }
    .eyebrow { margin: 0 0 9px; color: var(--gold); font-size: 13px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    .hero h2 { max-width: 800px; margin: 0; color: var(--blue-deep); font-size: clamp(32px, 5vw, 54px); line-height: 1.13; letter-spacing: -.035em; }
    .hero p { max-width: 720px; margin: 17px 0 0; color: var(--muted); font-size: 17px; }
    .hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
    .hero-tag { padding: 5px 10px; border: 1px solid var(--line); border-radius: 999px; color: var(--blue); background: rgba(255,255,255,.8); font-size: 12px; cursor: pointer; transition: .18s ease; }
    .hero-tag:hover { border-color: #9dbbd1; background: var(--blue-soft); transform: translateY(-1px); }

    .content-shell { max-width: 980px; margin: 0 auto; padding: 16px 46px 76px; }
    #content > h1 { display: none; }
    .chapter { display: block; margin-bottom: 72px; scroll-margin-top: calc(var(--topbar) + 18px); animation: enter .18s ease; }
    #content.searching .chapter { display: none; }
    @keyframes enter { from { opacity: .3; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .chapter-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 16px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--line);
    }
    .chapter-head h2 { margin: 0; color: var(--blue-deep); font-size: clamp(25px, 3.3vw, 37px); line-height: 1.24; letter-spacing: -.025em; }
    .review-button {
      flex: none;
      min-width: 104px;
      padding: 8px 11px;
      border: 1px solid #a9c8c3;
      border-radius: 9px;
      color: var(--teal);
      background: #f5fbfa;
      font-size: 12px;
      cursor: pointer;
    }
    .review-button.done { color: #fff; background: var(--teal); }

    .chapter h3 { margin: 1.5em 0 .6em; color: var(--blue); font-size: 1.25em; line-height: 1.38; }
    .chapter p { margin: .65em 0; }
    .chapter strong { color: var(--blue-deep); }
    .chapter blockquote {
      margin: 18px 0;
      padding: 12px 16px;
      border: 1px solid #bad3e5;
      border-left: 4px solid var(--blue);
      border-radius: 8px;
      color: var(--blue-deep);
      background: var(--blue-soft);
    }
    .chapter ul, .chapter ol { padding-left: 1.45em; }
    .chapter li { margin: .34em 0; }
    .chapter li::marker { color: var(--blue); }

    .chapter table {
      width: 100%;
      margin: 18px 0 23px;
      border-spacing: 0;
      border-collapse: separate;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 11px;
      background: #fff;
      box-shadow: 0 5px 18px rgba(23, 62, 99, .05);
      font-size: .86em;
    }
    .chapter th, .chapter td { padding: 10px 11px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
    .chapter th:last-child, .chapter td:last-child { border-right: 0; }
    .chapter tr:last-child td { border-bottom: 0; }
    .chapter th { color: #fff; background: var(--blue); font-size: .9em; }
    .chapter tbody tr:nth-child(even) { background: var(--blue-pale); }

    .topic-card {
      margin: 13px 0;
      overflow: clip;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--panel);
      box-shadow: 0 5px 20px rgba(23, 62, 99, .045);
    }
    .topic-card summary {
      position: relative;
      padding: 14px 46px 14px 16px;
      color: var(--blue);
      font-size: 1.05em;
      font-weight: 800;
      cursor: pointer;
      list-style: none;
      user-select: none;
    }
    .topic-card summary::-webkit-details-marker { display: none; }
    .topic-card summary::after { content: "+"; position: absolute; right: 17px; top: 13px; font-size: 20px; font-weight: 400; color: var(--muted); }
    .topic-card[open] summary { border-bottom: 1px solid var(--line); background: var(--blue-pale); }
    .topic-card[open] summary::after { content: "−"; }
    .topic-card-body { padding: 8px 17px 14px; }
    .topic-card-body > :first-child { margin-top: .45em; }
    .topic-card-body > :last-child { margin-bottom: .2em; }

    .search-results { display: none; }
    .search-results.active { display: block; }
    .search-title { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
    .search-title h2 { margin: 0; color: var(--blue-deep); }
    .search-title span { color: var(--muted); font-size: 13px; }
    .result-card { width: 100%; margin: 8px 0; padding: 13px 15px; border: 1px solid var(--line); border-radius: 10px; text-align: left; background: #fff; cursor: pointer; }
    .result-card:hover { border-color: #9cb9cf; box-shadow: var(--shadow); }
    .result-path { margin-bottom: 5px; color: var(--blue); font-size: 12px; font-weight: 700; }
    .result-text { color: var(--ink); font-size: 14px; line-height: 1.55; }
    mark { padding: 0 .08em; color: inherit; background: #ffeda8; }

    .practice-panel {
      position: fixed;
      z-index: 90;
      inset: var(--topbar) 0 0 auto;
      width: min(480px, 100vw);
      padding: 24px;
      overflow: auto;
      border-left: 1px solid var(--line);
      background: #fff;
      box-shadow: -18px 0 45px rgba(23, 62, 99, .18);
      transform: translateX(105%);
      transition: transform .23s ease;
    }
    .practice-panel.open { transform: translateX(0); }
    .practice-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .practice-head h2 { margin: 0; color: var(--blue-deep); font-size: 24px; }
    .close-button { width: 38px; height: 38px; border: 1px solid var(--line); border-radius: 9px; background: #fff; cursor: pointer; }
    .practice-question { min-height: 125px; margin: 20px 0 14px; padding: 18px; border: 1px solid #b8d2e5; border-radius: 12px; color: var(--blue-deep); background: var(--blue-soft); font-size: 20px; line-height: 1.48; }
    .timer-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .timer { display: grid; place-items: center; border: 1px solid var(--line); border-radius: 10px; color: var(--blue-deep); background: #fff; font-size: 22px; font-variant-numeric: tabular-nums; }
    .timer.warning { color: #a35d20; background: #fff7e8; }
    .timer-row button { min-height: 48px; border: 1px solid var(--line); border-radius: 10px; background: #fff; cursor: pointer; }
    .timer-row button.primary { border-color: var(--blue); color: #fff; background: var(--blue); }
    .outline-label { display: block; margin: 20px 0 7px; color: var(--blue-deep); font-size: 13px; font-weight: 800; }
    .practice-panel textarea { width: 100%; min-height: 190px; resize: vertical; padding: 13px; border: 1px solid var(--line); border-radius: 10px; line-height: 1.6; }
    .outline-hint { margin-top: 7px; color: var(--muted); font-size: 12px; }
    .overlay { position: fixed; z-index: 55; inset: 0; display: none; background: rgba(16, 26, 36, .42); }
    .overlay.active { display: block; }

    .focus-mode .chapter p { color: #596774; }
    .focus-mode .chapter strong, .focus-mode .chapter h2, .focus-mode .chapter h3, .focus-mode .topic-card summary { color: #0d5d81; }
    .focus-mode .chapter li::marker { color: var(--gold); }
    .focus-mode .chapter table { box-shadow: 0 0 0 2px rgba(180,129,42,.15); }

    .mobile-drawer-close { display: none; }

    @media (max-width: 880px) {
      :root { --sidebar: 0px; --reading-size: 16px; }
      .topbar { left: 0; padding: 0 12px; }
      .menu-button { display: inline-grid; place-items: center; }
      .topbar-title { display: none; }
      .sidebar { width: min(310px, 88vw); transform: translateX(-105%); transition: transform .22s ease; }
      .sidebar.open { transform: translateX(0); }
      .mobile-drawer-close { display: block; position: absolute; top: 16px; right: 14px; width: 36px; height: 36px; border: 0; border-radius: 8px; background: var(--blue-pale); cursor: pointer; }
      .app { margin-left: 0; }
      .hero { padding: 38px 20px 14px; }
      .content-shell { padding: 14px 18px 60px; }
      .chapter-head { align-items: flex-start; }
      .chapter-head h2 { font-size: 27px; }
      .review-button { min-width: auto; }
      .chapter table { display: block; overflow-x: auto; white-space: normal; }
      .practice-panel { top: 0; padding-top: 18px; }
    }

    @media (max-width: 560px) {
      .top-actions .desktop-only { display: none; }
      .hero h2 { font-size: 34px; }
      .hero p { font-size: 15px; }
      .chapter-head { display: block; }
      .review-button { margin-top: 12px; }
      .timer-row { grid-template-columns: 1fr 1fr; }
      .timer { grid-column: 1 / -1; min-height: 55px; }
    }

    @media print {
      :root { --reading-size: 11pt; }
      body { background: #fff; }
      .sidebar, .topbar, .hero, .practice-panel, .overlay, .review-button { display: none !important; }
      .app { margin: 0; padding: 0; }
      .content-shell { max-width: none; padding: 0; }
      .chapter { display: block !important; break-before: page; }
      .chapter:first-child { break-before: auto; }
      .chapter-head { margin-top: 0; }
      .topic-card { break-inside: avoid; box-shadow: none; }
      .topic-card summary { border-bottom: 1px solid var(--line); }
      .topic-card-body { display: block !important; }
      .chapter table { break-inside: avoid; box-shadow: none; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main">跳到正文</a>
  <div class="overlay" id="overlay"></div>

  <aside class="sidebar" id="sidebar" aria-label="章节导航">
    <button class="mobile-drawer-close" id="drawerClose" type="button" aria-label="关闭导航">×</button>
    <div class="brand">
      <div class="brand-mark"></div>
      <h1>雅思口语 Part 3<br>复习资料</h1>
      <p>逻辑优先 · 可说性优先</p>
    </div>
    <label class="search-box">
      <span class="sr-only">搜索内容</span>
      <input id="searchInput" type="search" placeholder="搜索题型、话题或表达" autocomplete="off">
      <span class="search-key">⌘K</span>
    </label>
    <div class="progress-wrap">
      <div class="progress-label"><span>复习进度</span><span id="progressText">0 / 0</span></div>
      <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
    </div>
    <nav class="nav-list" id="navList">
__NAV__
    </nav>
    <div class="sidebar-footer">
      <button class="practice-entry" id="openPractice" type="button">随机题 · 40 秒练习</button>
    </div>
  </aside>

  <header class="topbar">
    <button class="icon-button menu-button" id="menuButton" type="button" aria-label="打开章节导航">☰</button>
    <div class="topbar-title">当前：<strong id="currentTitle">全局工具</strong></div>
    <div class="top-actions">
      <button class="text-button desktop-only" id="focusToggle" type="button" aria-pressed="false">重点模式</button>
      <button class="icon-button" id="fontDown" type="button" aria-label="缩小字号">−</button>
      <button class="icon-button" id="fontUp" type="button" aria-label="放大字号">＋</button>
      <button class="text-button desktop-only" id="printButton" type="button">打印</button>
    </div>
  </header>

  <div class="app">
    <section class="hero">
      <p class="eyebrow">IELTS Speaking</p>
      <h2>听懂题型，选一个角度，把一条逻辑说完整。</h2>
      <p>把 9 份资料去重、纠错并重新组织。例题只在需要示范展开方式的地方出现，不用背整篇答案。</p>
      <div class="hero-tags" aria-label="内容概览">
        <button class="hero-tag jump-button" type="button" data-jump="全局工具 A">Part 1–3 全局工具</button>
        <button class="hero-tag jump-button" type="button" data-jump="7 类题型">7 类题型</button>
        <button class="hero-tag jump-button" type="button" data-jump="10 个通用角度">10 个通用角度</button>
        <button class="hero-tag jump-button" type="button" data-jump="12 个主题观点库">12 个主题观点库</button>
        <button class="hero-tag" id="heroPractice" type="button">随机计时练习</button>
      </div>
    </section>

    <main class="content-shell" id="main">
      <section class="search-results" id="searchResults" aria-live="polite">
        <div class="search-title"><h2>搜索结果</h2><span id="resultCount"></span></div>
        <div id="resultList"></div>
      </section>
      <article id="content">
__CONTENT__
      </article>
    </main>
  </div>

  <aside class="practice-panel" id="practicePanel" aria-hidden="true" aria-label="随机计时练习">
    <div class="practice-head">
      <h2>随机题 · 40 秒</h2>
      <button class="close-button" id="closePractice" type="button" aria-label="关闭练习">×</button>
    </div>
    <div class="practice-question" id="practiceQuestion">点击“换一题”开始。</div>
    <div class="timer-row">
      <div class="timer" id="timer" aria-live="polite">0:40</div>
      <button class="primary" id="timerButton" type="button">开始计时</button>
      <button id="nextQuestion" type="button">换一题</button>
    </div>
    <label class="outline-label" for="outline">只写关键词，不写全文</label>
    <textarea id="outline" placeholder="Type：&#10;Answer：&#10;Chain：原因 → 机制 → 结果&#10;Optional：例子 / 对比 / 条件"></textarea>
    <p class="outline-hint">内容会保存在当前浏览器中。换题时不会清空。</p>
  </aside>

  <script>
  (() => {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const storage = {
      get(key, fallback) { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } },
      set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
    };

    const content = $('#content');
    const navItems = $$('.nav-item');
    const searchInput = $('#searchInput');
    const searchResults = $('#searchResults');
    const resultList = $('#resultList');
    const resultCount = $('#resultCount');
    const overlay = $('#overlay');
    const sidebar = $('#sidebar');
    const practicePanel = $('#practicePanel');
    const reviewed = new Set(storage.get('part3-reviewed', []));
    let chapters = [];
    let activeIndex = 0;
    let timerId = null;
    let seconds = 40;

    function slug(text) {
      return text.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
    }

    function groupChapters() {
      const nodes = [...content.childNodes];
      let current = null;
      for (const node of nodes) {
        if (node.nodeType === 1 && node.tagName === 'H2') {
          const section = document.createElement('section');
          section.className = 'chapter';
          section.dataset.chapter = slug(node.textContent);
          section.id = section.dataset.chapter;

          const head = document.createElement('div');
          head.className = 'chapter-head';
          head.append(node);

          const reviewButton = document.createElement('button');
          reviewButton.type = 'button';
          reviewButton.className = 'review-button';
          reviewButton.textContent = '标记已复习';
          reviewButton.addEventListener('click', () => toggleReviewed(section.dataset.chapter));
          head.append(reviewButton);
          section.append(head);
          content.append(section);
          current = section;
        } else if (current) {
          current.append(node);
        } else if (node.nodeType === 1) {
          node.remove();
        }
      }
      chapters = $$('.chapter', content);
      chapters.forEach(chapter => wrapTopicCards(chapter));
    }

    function wrapTopicCards(chapter) {
      const headings = $$(':scope > h3', chapter);
      headings.forEach((heading, index) => {
        const details = document.createElement('details');
        details.className = 'topic-card';
        details.open = index === 0 && headings.length > 4;
        const summary = document.createElement('summary');
        summary.textContent = heading.textContent;
        const body = document.createElement('div');
        body.className = 'topic-card-body';
        let node = heading.nextSibling;
        while (node && !(node.nodeType === 1 && node.tagName === 'H3')) {
          const next = node.nextSibling;
          body.append(node);
          node = next;
        }
        details.append(summary, body);
        heading.replaceWith(details);
      });
    }

    function setActiveChapter(target) {
      const index = typeof target === 'number' ? target : chapters.findIndex(c => c.dataset.chapter === target);
      activeIndex = index >= 0 ? index : 0;
      navItems.forEach((item, i) => item.classList.toggle('active', i === activeIndex));
      const title = $('h2', chapters[activeIndex])?.textContent || '';
      $('#currentTitle').textContent = title;
    }

    function jumpToChapter(target, updateHash = true) {
      setActiveChapter(target);
      searchResults.classList.remove('active');
      content.classList.remove('searching');
      if (updateHash) history.replaceState(null, '', '#' + chapters[activeIndex].dataset.chapter);
      setTimeout(() => chapters[activeIndex].scrollIntoView({behavior: 'smooth', block: 'start'}), 0);
      closeDrawer();
    }

    function toggleReviewed(id) {
      reviewed.has(id) ? reviewed.delete(id) : reviewed.add(id);
      storage.set('part3-reviewed', [...reviewed]);
      updateProgress();
    }

    function updateProgress() {
      chapters.forEach((chapter, index) => {
        const done = reviewed.has(chapter.dataset.chapter);
        $('.review-button', chapter)?.classList.toggle('done', done);
        const button = $('.review-button', chapter);
        if (button) button.textContent = done ? '✓ 已复习' : '标记已复习';
        navItems[index]?.classList.toggle('reviewed', done);
      });
      $('#progressText').textContent = `${reviewed.size} / ${chapters.length}`;
      $('#progressFill').style.width = `${chapters.length ? reviewed.size / chapters.length * 100 : 0}%`;
    }

    function openDrawer() { sidebar.classList.add('open'); overlay.classList.add('active'); }
    function closeDrawer() { sidebar.classList.remove('open'); if (!practicePanel.classList.contains('open')) overlay.classList.remove('active'); }
    function openPractice() { practicePanel.classList.add('open'); practicePanel.setAttribute('aria-hidden', 'false'); overlay.classList.add('active'); }
    function closePractice() { practicePanel.classList.remove('open'); practicePanel.setAttribute('aria-hidden', 'true'); overlay.classList.remove('active'); }

    function cleanText(text) { return text.replace(/\s+/g, ' ').trim(); }
    function escapeRegExp(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function marked(text, query) {
      const safe = text.replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
      return safe.replace(new RegExp(`(${escapeRegExp(query)})`, 'ig'), '<mark>$1</mark>');
    }

    function search(query) {
      const q = query.trim();
      if (!q) {
        searchResults.classList.remove('active');
        content.classList.remove('searching');
        return;
      }
      content.classList.add('searching');
      searchResults.classList.add('active');
      resultList.replaceChildren();
      const matches = [];
      chapters.forEach((chapter, chapterIndex) => {
        const chapterTitle = $('h2', chapter)?.textContent || '';
        const candidates = $$('summary, p, li, tr', chapter);
        candidates.forEach(element => {
          const text = cleanText(element.textContent);
          if (text && text.toLowerCase().includes(q.toLowerCase())) matches.push({element, text, chapterIndex, chapterTitle});
        });
      });
      matches.slice(0, 60).forEach(match => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'result-card';
        const path = document.createElement('div');
        path.className = 'result-path';
        path.textContent = match.chapterTitle;
        const text = document.createElement('div');
        text.className = 'result-text';
        text.innerHTML = marked(match.text.slice(0, 260), q);
        button.append(path, text);
        button.addEventListener('click', () => {
          searchInput.value = '';
          jumpToChapter(match.chapterIndex);
          const details = match.element.closest('details');
          if (details) details.open = true;
          setTimeout(() => match.element.scrollIntoView({behavior: 'smooth', block: 'center'}), 120);
        });
        resultList.append(button);
      });
      resultCount.textContent = matches.length > 60 ? `找到 ${matches.length} 条，显示前 60 条` : `找到 ${matches.length} 条`;
    }

    const practiceQuestions = [
      'Is it important for children to learn how to cooperate with others?',
      'Should the government be responsible for protecting old buildings?',
      'Why do people buy things they do not need?',
      'Why do some people find it difficult to maintain a work-life balance?',
      'What are the advantages and disadvantages of being a famous child?',
      'What positive and negative effects does social media have on friendship?',
      'What are the differences between online and face-to-face communication?',
      'How are transport systems in urban and rural areas different?',
      'How have shopping habits changed because of the internet?',
      'Will people still read paper books in fifty years?',
      'How can employers help staff reduce work-related stress?',
      'How can cities preserve historic buildings while continuing to develop?',
      'Do you think students are overly reliant on AI?',
      'Why is it difficult for some people to relax?',
      'Do you think school rules are important?'
    ];
    let lastQuestion = -1;
    function nextQuestion() {
      let index;
      do { index = Math.floor(Math.random() * practiceQuestions.length); } while (practiceQuestions.length > 1 && index === lastQuestion);
      lastQuestion = index;
      $('#practiceQuestion').textContent = practiceQuestions[index];
      resetTimer();
    }
    function renderTimer() {
      $('#timer').textContent = `0:${String(seconds).padStart(2, '0')}`;
      $('#timer').classList.toggle('warning', seconds <= 10);
    }
    function resetTimer() {
      clearInterval(timerId); timerId = null; seconds = 40; renderTimer(); $('#timerButton').textContent = '开始计时';
    }
    function toggleTimer() {
      if (timerId) { clearInterval(timerId); timerId = null; $('#timerButton').textContent = '继续'; return; }
      if (seconds === 0) seconds = 40;
      $('#timerButton').textContent = '暂停';
      timerId = setInterval(() => {
        seconds -= 1; renderTimer();
        if (seconds <= 0) { clearInterval(timerId); timerId = null; $('#timerButton').textContent = '重新开始'; }
      }, 1000);
    }

    groupChapters();
    navItems.forEach((item, index) => item.addEventListener('click', () => jumpToChapter(index)));
    updateProgress();
    const hash = decodeURIComponent(location.hash.slice(1));
    setActiveChapter(hash || 0);
    if (hash) setTimeout(() => chapters[activeIndex].scrollIntoView({block: 'start'}), 0);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (content.classList.contains('searching')) return;
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter(chapters.indexOf(visible.target));
      }, {rootMargin: '-80px 0px -68% 0px', threshold: [0, .15, .4]});
      chapters.forEach(chapter => observer.observe(chapter));
    }

    $$('.jump-button').forEach(button => button.addEventListener('click', () => {
      const index = chapters.findIndex(chapter => $('h2', chapter)?.textContent.includes(button.dataset.jump));
      if (index >= 0) jumpToChapter(index);
    }));

    searchInput.addEventListener('input', e => search(e.target.value));
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && window.innerWidth <= 880) closeDrawer();
    });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.innerWidth <= 880) openDrawer();
        searchInput.focus();
      }
      if (e.key === 'Escape') { closeDrawer(); closePractice(); searchInput.blur(); }
    });

    $('#menuButton').addEventListener('click', openDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', () => { closeDrawer(); closePractice(); });
    $('#openPractice').addEventListener('click', () => { closeDrawer(); openPractice(); if (lastQuestion < 0) nextQuestion(); });
    $('#heroPractice').addEventListener('click', () => { openPractice(); if (lastQuestion < 0) nextQuestion(); });
    $('#closePractice').addEventListener('click', closePractice);
    $('#nextQuestion').addEventListener('click', nextQuestion);
    $('#timerButton').addEventListener('click', toggleTimer);
    $('#outline').value = storage.get('part3-outline', '');
    $('#outline').addEventListener('input', e => storage.set('part3-outline', e.target.value));

    const initialFont = Math.min(21, Math.max(14, storage.get('part3-font-size', 17)));
    document.documentElement.style.setProperty('--reading-size', initialFont + 'px');
    function changeFont(delta) {
      const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reading-size')) || 17;
      const next = Math.min(21, Math.max(14, current + delta));
      document.documentElement.style.setProperty('--reading-size', next + 'px');
      storage.set('part3-font-size', next);
    }
    $('#fontDown').addEventListener('click', () => changeFont(-1));
    $('#fontUp').addEventListener('click', () => changeFont(1));
    $('#focusToggle').addEventListener('click', e => {
      const active = document.body.classList.toggle('focus-mode');
      e.currentTarget.setAttribute('aria-pressed', String(active));
      e.currentTarget.textContent = active ? '退出重点' : '重点模式';
    });
    $('#printButton').addEventListener('click', () => window.print());
    window.addEventListener('beforeprint', () => $$('.topic-card').forEach(d => { d.dataset.wasOpen = String(d.open); d.open = true; }));
    window.addEventListener('afterprint', () => $$('.topic-card').forEach(d => { d.open = d.dataset.wasOpen === 'true'; }));
  })();
  </script>
</body>
</html>
'''


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    page = TEMPLATE.replace("__NAV__", navigation(chapters())).replace("__CONTENT__", markdown_fragment())
    OUTPUT.write_text(page, encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    build()
