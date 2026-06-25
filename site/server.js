const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const PORT = 3456;

const sermonsDir = path.join(__dirname, '..');

app.use(express.static(path.join(__dirname, 'public')));

function getSermonList() {
  const sermons = [];
  for (let i = 1; i <= 33; i++) {
    const file = path.join(sermonsDir, `sermon${i}.md`);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : `Sermon ${i}`;
      const firstLine = content.split('\n')[0] || '';
      sermons.push({ num: i, title, file: `sermon${i}.md` });
    }
  }
  return sermons;
}

function renderPage(title, bodyHtml, extraNav = '') {
  const sermons = getSermonList();
  const sermonLinks = sermons.map(s =>
    `<li><a href="/sermon/${s.num}" ${s.title.includes(`Sermon ${s.num}`) ? `class="active"` : ''}>${s.title}</a></li>`
  ).join('\n          ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Nibbāna: The Mind Stilled</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #faf9f6;
      --fg: #1a1a1a;
      --accent: #8b4513;
      --accent-light: #f5ebe0;
      --muted: #6b6b6b;
      --border: #e0ddd5;
      --serif: 'Source Serif 4', Georgia, 'Times New Roman', serif;
      --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    html { font-size: 18px; scroll-behavior: smooth; }
    @media (max-width: 768px) { html { font-size: 16px; } }
    body {
      font-family: var(--serif);
      color: var(--fg);
      background: var(--bg);
      line-height: 1.7;
      min-height: 100vh;
      display: flex;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    a:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; border-radius: 2px; }

    nav.sidebar {
      width: 280px;
      flex-shrink: 0;
      background: #fff;
      border-right: 1px solid var(--border);
      padding: 2rem 1.25rem;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      font-family: var(--sans);
    }
    nav.sidebar h1 { font-size: 1rem; font-weight: 600; line-height: 1.3; margin-bottom: 0.25rem; color: var(--accent); }
    nav.sidebar .subtitle { font-size: 0.75rem; color: var(--muted); margin-bottom: 1.25rem; }
    nav.sidebar ol { list-style: none; }
    nav.sidebar li { margin-bottom: 0.15rem; }
    nav.sidebar a {
      display: block;
      padding: 0.2rem 0.5rem;
      font-size: 0.78rem;
      color: var(--fg);
      border-radius: 4px;
      transition: background 0.15s;
    }
    nav.sidebar a:hover { background: var(--accent-light); text-decoration: none; }
    nav.sidebar a.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }

    main {
      flex: 1;
      max-width: 760px;
      padding: 3rem 2.5rem 5rem;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      body { flex-direction: column; }
      nav.sidebar {
        width: 100%;
        height: auto;
        position: static;
        border-right: none;
        border-bottom: 1px solid var(--border);
        padding: 1rem;
      }
      nav.sidebar ol { display: flex; flex-wrap: wrap; gap: 0.25rem; }
      nav.sidebar li { margin-bottom: 0; }
      main { padding: 1.5rem 1.25rem 4rem; }
    }

    .sermon-nav {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2rem; padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      font-family: var(--sans); font-size: 0.85rem;
    }
    .sermon-nav a { padding: 0.4rem 0.8rem; border-radius: 4px; transition: background 0.15s; }
    .sermon-nav a:hover { background: var(--accent-light); text-decoration: none; }
    .sermon-nav .prev-next { display: flex; gap: 0.5rem; }
    .sermon-nav .disabled { color: var(--border); pointer-events: none; }

    article.sermon h1 {
      font-size: 1.6rem; font-weight: 700; line-height: 1.3;
      margin-bottom: 0.25rem;
    }
    article.sermon .author { font-family: var(--sans); font-size: 0.85rem; color: var(--muted); margin-bottom: 1.5rem; }

    article.sermon h2 {
      font-size: 1.2rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem;
      font-family: var(--sans);
    }
    article.sermon h3 {
      font-size: 1.05rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem;
    }
    article.sermon p { margin-bottom: 1rem; }
    article.sermon blockquote {
      margin: 1.25rem 0; padding: 1rem 1.25rem;
      background: #fff; border-left: 4px solid var(--accent); border-radius: 0 6px 6px 0;
      font-style: italic; color: #2a2a2a;
    }
    article.sermon blockquote > *:last-child { margin-bottom: 0; }
    article.sermon hr { border: none; border-top: 2px solid var(--border); margin: 2rem 0; }
    article.sermon em { font-style: italic; }
    article.sermon strong { font-weight: 700; }
    article.sermon ul, article.sermon ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    article.sermon li { margin-bottom: 0.35rem; }

    article.sermon table {
      width: 100%; border-collapse: collapse; margin: 1rem 0;
      font-family: var(--sans); font-size: 0.85rem;
    }
    article.sermon th, article.sermon td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); text-align: left; }
    article.sermon th { background: var(--accent-light); font-weight: 600; }

    .index-hero {
      text-align: center; padding: 3rem 0 2rem;
    }
    .index-hero h1 { font-size: 2rem; font-weight: 700; }
    .index-hero .subtitle { font-size: 1.1rem; color: var(--muted); margin-top: 0.5rem; font-family: var(--sans); }
    .index-hero .source { font-family: var(--sans); font-size: 0.85rem; margin-top: 1rem; }
    .index-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;
      margin-top: 2rem;
    }
    .index-grid a {
      display: block; padding: 1rem; background: #fff; border: 1px solid var(--border);
      border-radius: 8px; font-family: var(--sans); font-size: 0.85rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .index-grid a:hover { border-color: var(--accent); box-shadow: 0 2px 8px rgba(139,69,19,0.08); text-decoration: none; }
    .index-grid .num { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
    .index-grid .sermon-title { font-weight: 500; margin-top: 0.15rem; color: var(--fg); }

    .footer-nav { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition: none !important; }
    }
    @media print {
      nav.sidebar { display: none; }
      main { max-width: 100%; padding: 0; }
      .sermon-nav { display: none; }
    }
    .skip-link {
      position: absolute; top: -100px; left: 0; z-index: 100;
      padding: 0.5rem 1rem; background: var(--accent); color: #fff;
      font-family: var(--sans); font-size: 0.85rem;
    }
    .skip-link:focus { top: 0; }
  </style>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <nav class="sidebar" aria-label="Sermon index">
    <h1>Nibbāna:<br>The Mind Stilled</h1>
    <p class="subtitle">33 Sermons by Bhikkhu K. Ñāṇananda</p>
    <ol>
      ${sermonLinks}
    </ol>
  </nav>
  <main id="main-content">
    ${extraNav}
    ${bodyHtml}
  </main>
</body>
</html>`;
}

app.get('/', (req, res) => {
  const sermons = getSermonList();
  const cards = sermons.map(s =>
    `<a href="/sermon/${s.num}"><div class="num">Sermon ${s.num}</div><div class="sermon-title">${s.title.replace(/^Nibbāna – The Mind Stilled: /, '')}</div></a>`
  ).join('\n      ');

  const body = `
    <div class="index-hero">
      <h1>Nibbāna — The Mind Stilled</h1>
      <p class="subtitle">33 Sermons by Bhikkhu K. Ñāṇananda</p>
      <p class="source">Delivered at Meetirigala Nissarana Vanaya Meditation Centre (1988–1991)</p>
    </div>
    <div class="index-grid">${cards}</div>
  `;
  res.send(renderPage('Home', body));
});

app.get('/sermon/:num', (req, res) => {
  const num = parseInt(req.params.num, 10);
  if (num < 1 || num > 33) return res.status(404).send('Sermon not found');

  const file = path.join(sermonsDir, `sermon${num}.md`);
  if (!fs.existsSync(file)) return res.status(404).send('Sermon not found');

  const content = fs.readFileSync(file, 'utf-8');
  const html = marked.parse(content);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : `Sermon ${num}`;

  const prev = num > 1 ? `<a href="/sermon/${num - 1}">← Sermon ${num - 1}</a>` : `<span class="disabled">← Previous</span>`;
  const next = num < 33 ? `<a href="/sermon/${num + 1}">Sermon ${num + 1} →</a>` : `<span class="disabled">Next →</span>`;

  const extraNav = `
    <nav class="sermon-nav" aria-label="Sermon navigation">
      <a href="/">All Sermons</a>
      <div class="prev-next">${prev} ${next}</div>
    </nav>
  `;

  const body = `<article class="sermon">${html}</article>
    <nav class="sermon-nav footer-nav" aria-label="Sermon navigation">
      <a href="/">All Sermons</a>
      <div class="prev-next">${prev} ${next}</div>
    </nav>
  `;

  res.send(renderPage(title, body, extraNav));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`33 Sermons site running at http://localhost:${PORT}`);
});
