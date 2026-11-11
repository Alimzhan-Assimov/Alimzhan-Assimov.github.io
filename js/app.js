/* THE WORKSHOP — book logic */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const cover = $('#cover'), book = $('#book'), spread = $('#spread');
  const prevBtn = $('#prev'), nextBtn = $('#next'), counter = $('#counter');
  const burst = $('#sfx-burst');

  // ?today=YYYY-MM-DD lets you preview how the book will age; press T for the time machine slider.
  const params = new URLSearchParams(location.search);
  let today = params.get('today') ? new Date(params.get('today')) : new Date();
  let extraDays = 0;

  let data = null, cv = null, pages = [], index = 0, turning = false;

  const SFX = ['FLIP!', 'WHOOSH!', 'FWIP!', 'SHUFF!', 'PAF!'];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- age → dust ---------- */
  function daysSince(iso) {
    const t = new Date(today.getTime() + extraDays * 864e5);
    return Math.max(0, Math.floor((t - new Date(iso)) / 864e5));
  }
  function dustLevel(days) {
    if (days <= 7) return 0; if (days <= 30) return 1; if (days <= 90) return 2; if (days <= 180) return 3; return 4;
  }
  const DUST_NAME = ['shining', 'fresh', 'dusty', 'cobwebs', 'forgotten'];
  const DUST_LINE = [
    'Still warm. Pushed this week.',
    'Fresh ink. Touched this month.',
    'A thin layer of dust has settled.',
    'Spiders moved in. Nobody minds.',
    'Lost in the back of the shelf…'
  ];
  function ageLabel(days) {
    if (days === 0) return 'today'; if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.round(days / 30)} months ago`;
    return `${(days / 365).toFixed(1)} years ago`;
  }
  function fmtDate(iso) { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

  /* ---------- decoration per level ---------- */
  function decorate(level) {
    let html = '';
    if (level === 0) {
      html += '<div class="sparkles">' + Array.from({ length: 9 }, (_, i) =>
        `<i class="sparkle" style="left:${(i * 37 + 11) % 92}%;top:${(i * 53 + 7) % 90}%;animation-delay:${(i * .23) % 1.6}s;transform:scale(${.6 + (i % 3) * .3})"></i>`).join('') + '</div>';
    }
    if (level >= 2) {
      html += '<div class="dust-layer"></div><div class="motes">' + Array.from({ length: 14 }, (_, i) =>
        `<i class="mote" style="left:${(i * 29 + 5) % 96}%;top:${(i * 41) % 70}%;animation-delay:${(i * .7) % 9}s;animation-duration:${7 + (i % 4) * 2}s"></i>`).join('') + '</div>';
      html += `<div class="smudge" style="left:10%;top:70%;width:160px;height:60px"></div><div class="smudge" style="right:8%;top:14%;width:120px;height:90px"></div>`;
    }
    if (level >= 3) html += Scenes.cobweb().replace('class="web"', 'class="web tl"') + Scenes.cobweb().replace('class="web"', 'class="web br"');
    if (level >= 4) {
      html += Scenes.cobweb().replace('class="web"', 'class="web tr"') + Scenes.spider() + Scenes.cracks();
      html += '<div class="zzz"><span>Z</span><span>Z</span><span>Z</span></div>';
    }
    return html;
  }

  /* ---------- spreads ---------- */
  function introSpread() {
    const d = data;
    const toc = d.projects.map((p, i) => {
      const days = daysSince(p.pushedAt), lv = dustLevel(days);
      return `<li data-goto="${i + 1}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(p.title)}</span><span class="age">${ageLabel(days)}</span><i class="dot d${lv}"></i></li>`;
    }).join('') + (cv ? `<li data-goto="${d.projects.length + 1}"><span class="n">★</span><span class="t">The Author · CV</span><span class="age">${esc(cv.headline.split(' at ')[1] || '')}</span><i class="dot d0"></i></li>` : '');
    return {
      cls: 'intro',
      left: `
        <div class="page-grid">
          <h2 class="p-title"><small>CHAPTER 0</small>Hello!</h2>
          <div style="display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap">
            <div class="panel avatar-frame"><img src="${esc(d.avatar)}" alt="${esc(d.name)}"></div>
            <div style="flex:1;min-width:200px">
              <div class="bubble">I'm ${esc(d.name)}. I build games and apps, mostly alone, mostly at night.</div>
            </div>
          </div>
          <div class="caption narration">This book is a living portfolio. Every project gets its own page.
            The longer a project goes without a commit, the more its page gathers dust, cobwebs and eventually a spider.
            A fresh push polishes it right back up.</div>
          <div class="caption">How to read: use ▶ ◀, the arrow keys, or just click a chapter on the right.</div>
        </div>
        <span class="page-num">01</span>`,
      right: `
        <div class="page-grid">
          <h2 class="p-title"><small>CONTENTS</small>Chapters</h2>
          <ul class="toc">${toc}</ul>
          <div class="caption narration" style="margin-top:auto;font-size:13px">Data pulled from GitHub on ${fmtDate(d.generated)} · ${d.projects.length} repos</div>
        </div>
        <span class="page-num">02</span>`
    };
  }

  function projectSpread(p, i) {
    const days = daysSince(p.pushedAt), lv = dustLevel(days);
    const scene = (Scenes[p.scene] || Scenes.code)();
    const chips = p.tags.map((t, k) => `<span class="chip" style="--r:${(k % 2 ? 1 : -1) * (1 + k % 3)}deg">${esc(t)}</span>`).join('');
    const img = p.image ? (p.image.endsWith('.svg')
      ? `<div class="panel shot icon tilt-r"><img src="${esc(p.image)}" alt=""></div>`
      : `<div class="panel shot tilt-r"><img src="${esc(p.image)}" alt="${esc(p.title)} screenshot"></div>`) : '';
    const age = daysSince(p.createdAt);
    const pageL = String(i * 2 + 3).padStart(2, '0'), pageR = String(i * 2 + 4).padStart(2, '0');
    return {
      cls: `d${lv}`,
      left: `
        <div class="speedlines"></div>
        <div class="page-grid" style="position:relative">
          <h2 class="p-title"><small>CHAPTER ${i + 1} · ${DUST_NAME[lv].toUpperCase()}</small>${esc(p.title)}</h2>
          <div class="panel scene-panel tilt-l">${scene}</div>
          <span class="sfx-stamp" style="right:2%;top:18%">${esc(p.sfx)}</span>
          <div>${chips}</div>
          <div class="caption narration" style="font-size:13px">${esc(DUST_LINE[lv])} Last commit ${ageLabel(days)}.</div>
        </div>
        <span class="page-num">${pageL}</span>`,
      right: `
        <div class="page-grid">
          <div class="bubble">${esc(p.tagline || p.description.slice(0, 80))}</div>
          <div style="display:grid;grid-template-columns:${p.image ? (p.image.endsWith('.svg') ? '1fr auto' : '1fr 44%') : '1fr'};gap:16px;align-items:start">
            <div class="caption narration">${esc(p.description)}</div>${img}
          </div>
          <div class="stats">
            <div class="stat"><b>${p.commits}</b><span>commits</span></div>
            <div class="stat"><b>${esc(p.language)}</b><span>language</span></div>
            <div class="stat"><b>${age}d</b><span>since first commit · ${fmtDate(p.createdAt)}</span></div>
            <div class="stat"><b>${days}d</b><span>since last push · ${fmtDate(p.pushedAt)}</span></div>
          </div>
          <div class="actions">
            <a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">GO! → GitHub</a>
            ${p.homepage ? `<a class="btn ${/itch\.io/.test(p.homepage) ? 'itch' : 'secondary'}" href="${esc(p.homepage)}" target="_blank" rel="noopener">${esc(p.homepageLabel || 'Play / Visit')}</a>` : ''}
            ${p.private ? '<span class="stamp">private</span>' : ''}
            ${p.archived ? '<span class="stamp">archived</span>' : ''}
            ${p.stars ? `<span class="chip">★ ${p.stars}</span>` : ''}
          </div>
        </div>
        <span class="page-num">${pageR}</span>`
    };
  }

  function cvSpread() {
    const n = data.projects.length;
    const row = (e, k) => `
      <div class="tl-row">
        <div class="tl-when">${esc(e.when)}</div>
        <div class="tl-card panel ${k % 2 ? 'tilt-r' : 'tilt-l'}">
          <b>${esc(e.what)}</b><span>${esc(e.where)}</span>
          ${e.sfx ? `<em class="tl-sfx">${esc(e.sfx)}</em>` : ''}
        </div>
      </div>`;
    const skills = cv.skills.map((s, k) => `<span class="chip" style="--r:${(k % 2 ? 1 : -1) * (1 + k % 3)}deg">${esc(s)}</span>`).join('');
    const langs = cv.languages.map(l => `<div class="stat"><b>${esc(l.level)}</b><span>${esc(l.name)}</span></div>`).join('');
    return {
      cls: 'cv d0',
      left: `
        <div class="speedlines"></div>
        <div class="page-grid" style="position:relative">
          <h2 class="p-title"><small>CHAPTER ★ · THE AUTHOR</small>${esc(cv.name)}</h2>
          <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">
            <div class="panel avatar-frame portrait"><img src="${esc(cv.portrait)}" alt="${esc(cv.name)}"></div>
            <div style="flex:1;min-width:200px">
              <div class="bubble">${esc(cv.intro)}</div>
              <p class="p-sub" style="margin-top:28px">${esc(cv.headline)} · ${esc(cv.location)}</p>
            </div>
          </div>
          <h3 class="h-ink">Experience</h3>
          <div class="timeline">${cv.experience.map(row).join('')}</div>
          <h3 class="h-ink">Education</h3>
          <div class="timeline">${cv.education.map(row).join('')}</div>
        </div>
        <span class="page-num">${String(n * 2 + 3).padStart(2, '0')}</span>`,
      right: `
        <div class="page-grid" style="grid-template-rows:auto auto auto auto 1fr auto">
          <div class="bubble thought">Tools I reach for.</div>
          <div>${skills}</div>
          <h3 class="h-ink">Languages</h3>
          <div class="stats" style="grid-template-columns:repeat(3,1fr)">${langs}</div>
          <div class="caption narration">Street, phone and date of birth live only in the PDF, not on this page.</div>
          <div class="actions">
            <a class="btn" href="${esc(cv.pdf)}" download>GET! → CV.pdf</a>
            <a class="btn secondary" href="mailto:${esc(cv.email)}">✉ Mail me</a>
          </div>
        </div>
        <span class="page-num">${String(n * 2 + 4).padStart(2, '0')}</span>`
    };
  }

  function outroSpread() {
    const n = data.projects.length;
    return {
      cls: 'outro',
      left: `
        <div class="page-grid" style="height:100%">
          <div class="big-end">TO BE<br>CONTINUED…</div>
          <div class="caption narration">New chapters appear whenever a new repo shows up. Dust falls on its own.</div>
        </div>
        <span class="page-num">${String(n * 2 + (cv ? 7 : 5)).padStart(2, '0')}</span>`,
      right: `
        <div class="page-grid" style="height:100%">
          <h2 class="p-title"><small>BACK COVER</small>Find me</h2>
          <div class="bubble thought">Want to poke at the code? Everything lives on GitHub.</div>
          <div class="actions" style="margin-top:0">
            <a class="btn" href="https://github.com/${esc(data.owner)}" target="_blank" rel="noopener">GO! → github.com/${esc(data.owner)}</a>
          </div>
          <div class="caption" style="margin-top:auto">Drawn with HTML, CSS and a lot of ink. Press <b>T</b> for the time machine.</div>
        </div>
        <span class="page-num">${String(n * 2 + (cv ? 8 : 6)).padStart(2, '0')}</span>`
    };
  }

  function buildPages() {
    pages = [introSpread(), ...data.projects.map(projectSpread), ...(cv ? [cvSpread()] : []), outroSpread()];
  }

  function render() {
    const s = pages[index];
    spread.className = `spread ${s.cls}`;
    const lv = (s.cls.match(/\bd(\d)\b/) || [])[1];
    const deco = lv !== undefined ? decorate(+lv) : '';
    spread.innerHTML = `<article class="page left">${s.left}${deco}</article><article class="page right">${s.right}${deco}</article>`;
    setAmbient(lv !== undefined ? +lv : null);
    prevBtn.disabled = index === 0; nextBtn.disabled = index === pages.length - 1;
    counter.textContent = index === 0 ? 'CONTENTS' : index === pages.length - 1 ? 'THE END' : pages[index].cls.startsWith('cv') ? 'THE AUTHOR' : `CHAPTER ${index} / ${data.projects.length}`;
    spread.querySelectorAll('[data-goto]').forEach(li => li.addEventListener('click', () => go(+li.dataset.goto)));
  }

  /* whole-page mood: tint the body, scatter dust/webs/sparkles over the viewport */
  const ambient = $('#ambient');
  function setAmbient(level) {
    document.body.className = level === null ? '' : `d${level}`;
    if (level === null) { ambient.innerHTML = ''; return; }
    let html = '';
    if (level === 0) html += '<div class="sparkles">' + Array.from({ length: 14 }, (_, i) =>
      `<i class="sparkle" style="left:${(i * 31 + 3) % 97}%;top:${(i * 47 + 5) % 95}%;animation-delay:${(i * .19) % 1.6}s;transform:scale(${.5 + (i % 4) * .3})"></i>`).join('') + '</div>';
    if (level >= 2) html += '<div class="dust-layer"></div><div class="motes">' + Array.from({ length: 30 }, (_, i) =>
      `<i class="mote" style="left:${(i * 23 + 2) % 98}%;top:${(i * 37) % 80}%;animation-delay:${(i * .5) % 9}s;animation-duration:${8 + (i % 5) * 2}s"></i>`).join('') + '</div>';
    if (level >= 3) html += Scenes.cobweb().replace('class="web"', 'class="web tl"') + Scenes.cobweb().replace('class="web"', 'class="web br"');
    if (level >= 4) html += Scenes.cobweb().replace('class="web"', 'class="web tr"') + Scenes.cobweb().replace('class="web"', 'class="web bl"')
      + Scenes.spider() + '<div class="zzz"><span>Z</span><span>Z</span><span>Z</span></div>';
    ambient.innerHTML = html;
  }

  function sfx(txt) {
    burst.textContent = txt; burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go');
  }

  function go(to) {
    if (turning || to === index || to < 0 || to >= pages.length) return;
    turning = true;
    const fwd = to > index;
    spread.classList.add(fwd ? 'flip-out-next' : 'flip-out-prev');
    sfx(SFX[Math.floor(Math.random() * SFX.length)]);
    setTimeout(() => {
      index = to; render();
      spread.classList.add(fwd ? 'flip-in-next' : 'flip-in-prev');
      setTimeout(() => { spread.classList.remove('flip-in-next', 'flip-in-prev'); turning = false; }, 400);
    }, 360);
  }

  /* ---------- cover ---------- */
  $('#cover-art').innerHTML = Scenes.coverArt();
  function openBook() {
    if (cover.classList.contains('opening')) return;
    cover.classList.add('opening');
    sfx('OPEN!');
    setTimeout(() => {
      cover.hidden = true; book.hidden = false;
      index = 0; render();
    }, 900);
  }
  cover.addEventListener('click', openBook);
  cover.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBook(); } });
  $('#closeBook').addEventListener('click', () => {
    book.hidden = true; cover.hidden = false; cover.classList.remove('opening'); setAmbient(null);
  });

  prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn.addEventListener('click', () => go(index + 1));
  document.addEventListener('keydown', e => {
    if (book.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(index + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(index - 1);
    if (e.key === 'Home') go(0); if (e.key === 'End') go(pages.length - 1);
    if (e.key.toLowerCase() === 't') tm.classList.toggle('on');
  });
  // swipe
  let sx = null;
  spread.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  spread.addEventListener('touchend', e => {
    if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
  });

  /* ---------- time machine ---------- */
  const tm = document.createElement('div');
  tm.className = 'timemachine';
  tm.innerHTML = `⏩ time machine <input type="range" min="0" max="400" value="0"> <span class="tm-out">+0 days</span>`;
  document.body.appendChild(tm);
  tm.querySelector('input').addEventListener('input', e => {
    extraDays = +e.target.value; tm.querySelector('.tm-out').textContent = `+${extraDays} days`;
    buildPages(); if (!book.hidden) render();
  });

  /* ---------- load ---------- */
  Promise.all([
    fetch('data/projects.json').then(r => r.json()),
    fetch('data/cv.json').then(r => r.ok ? r.json() : null).catch(() => null)
  ]).then(([d, c]) => {
    data = d; cv = c; buildPages();
    $('.cover-sub em').textContent = d.projects.length;
    $('.cover-title .t3').textContent = 'of ' + (d.name.split(' ')[0] || d.owner);
    const fresh = d.projects.some(p => dustLevel(daysSince(p.pushedAt)) === 0);
    $('.cover-sfx').textContent = fresh ? 'NEW!' : 'OPEN!';
  }).catch(err => {
    $('.cover-sub').textContent = 'data/projects.json missing — run tools/sync-projects.sh';
    console.error(err);
  });
})();
