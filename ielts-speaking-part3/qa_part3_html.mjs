import fs from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from '/tmp/part3-qa/node_modules/jsdom/lib/api.js';

const html = fs.readFileSync('output/html/雅思口语_Part3_复习资料_交互版.html', 'utf8');
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'https://part3.local/',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = () => {};
    window.print = () => {};
  }
});

await new Promise(resolve => setTimeout(resolve, 80));
const { document, Event } = dom.window;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

assert.equal($$('.nav-item').length, 15, 'nav chapter count');
assert.equal($$('.chapter').length, 15, 'rendered chapter count');
assert.equal($$('.chapter-end').length, 0, 'no previous/next chapter controls');
assert.equal($$('.global-nav').length, 2, 'two global tool chapters');
assert.ok($$('.topic-card').length > 25, 'collapsible topic cards created');

$$('.nav-item')[0].click();
assert.equal($$('.nav-item')[0].classList.contains('active'), true, 'direct chapter navigation updates active item');
assert.equal($('#currentTitle').textContent.includes('衔接方式'), true, 'global connector chapter navigation');

const reviewButton = $$('.chapter')[0].querySelector('.review-button');
reviewButton.click();
assert.ok(reviewButton.classList.contains('done'), 'review state toggled');
assert.equal($('#progressText').textContent, '1 / 15', 'progress count updated');

$('[data-jump="10 个通用角度"]').click();
assert.equal($('#currentTitle').textContent.includes('10 个通用角度'), true, 'hero tab jumps directly to chapter');

const search = $('#searchInput');
search.value = 'AI';
search.dispatchEvent(new Event('input', { bubbles: true }));
assert.ok($('#searchResults').classList.contains('active'), 'search mode active');
assert.ok($$('.result-card').length > 0, 'search returns results');
assert.ok($('#resultCount').textContent.includes('找到'), 'search count announced');

search.value = '';
search.dispatchEvent(new Event('input', { bubbles: true }));
assert.ok(!$('#searchResults').classList.contains('active'), 'search clears to chapter');
assert.ok(!$('#content').classList.contains('searching'), 'continuous content restored after search');

$('#openPractice').click();
assert.ok($('#practicePanel').classList.contains('open'), 'practice panel opens');
assert.notEqual($('#practiceQuestion').textContent, '点击“换一题”开始。', 'practice question selected');
$('#timerButton').click();
await new Promise(resolve => setTimeout(resolve, 1100));
assert.equal($('#timer').textContent, '0:39', 'timer counts down');
$('#timerButton').click();

const previousQuestion = $('#practiceQuestion').textContent;
$('#nextQuestion').click();
assert.notEqual($('#practiceQuestion').textContent, previousQuestion, 'next question avoids immediate repeat');

const beforeSize = document.documentElement.style.getPropertyValue('--reading-size');
$('#fontUp').click();
assert.notEqual(document.documentElement.style.getPropertyValue('--reading-size'), beforeSize, 'font control works');

$('#focusToggle').click();
assert.ok(document.body.classList.contains('focus-mode'), 'focus mode toggles');

console.log('QA passed: direct navigation, continuous chapters, progress, search, cards, practice timer, font and focus mode.');
dom.window.close();
