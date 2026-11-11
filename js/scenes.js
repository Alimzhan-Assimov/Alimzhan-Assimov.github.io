/* Mini scenes: one hand-drawn SVG per project type, animated via CSS (see style.css).
   Every scene is 400x300, thick ink, flat colours, halftone where it fits. */
(function (global) {
  const INK = '#141414';
  const stroke = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const thin = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

  function wrap(cls, inner, bg = '#fff') {
    return `<svg class="${cls}" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <rect width="400" height="300" fill="${bg}"/>${inner}</svg>`;
  }

  /* ---------- Bridge to the Moon: girders walking out to the Moon ---------- */
  function bridge() {
    const stars = Array.from({ length: 22 }, (_, i) => {
      const x = (i * 97 + 31) % 390 + 5, y = (i * 53 + 17) % 150 + 8, r = 1.5 + (i % 3);
      return `<circle class="star" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`;
    }).join('');
    // bridge blocks: diagonal from bottom-left towards the moon
    const blocks = Array.from({ length: 6 }, (_, i) => {
      const x = 20 + i * 40, y = 240 - i * 23;
      return `<g transform="translate(${x} ${y}) rotate(-30)">
        <rect x="0" y="0" width="44" height="14" fill="#b0b7c3" ${stroke}/>
        <rect x="0" y="14" width="44" height="6" fill="#6c7380" ${thin}/>
        <circle cx="10" cy="7" r="2.2" fill="${INK}"/><circle cx="34" cy="7" r="2.2" fill="${INK}"/>
      </g>`;
    }).join('');
    return wrap('s-bridge', `
      <rect width="400" height="300" fill="#1b1f3b"/>
      <rect width="400" height="300" fill="url(#halftone-light)" opacity=".5"/>
      ${stars}
      <g class="moon"><circle cx="330" cy="62" r="40" fill="#fff6c8" ${stroke}/>
        <circle cx="318" cy="52" r="7" fill="#e8dca8"/><circle cx="345" cy="78" r="10" fill="#e8dca8"/><circle cx="340" cy="45" r="4" fill="#e8dca8"/></g>
      <g transform="translate(390 20)"><g class="asteroid"><polygon points="0,0 14,-6 24,4 18,16 4,14" fill="#8d6e63" ${thin}/>
        <path d="M0 4 L-30 16 M2 10 L-22 26" stroke="#ffb74d" stroke-width="3" stroke-linecap="round"/></g></g>
      <!-- scrapyard ground -->
      <path d="M0 300 L0 262 Q60 250 110 266 T220 262 L260 300Z" fill="#4a3b2f" ${stroke}/>
      <rect x="12" y="236" width="52" height="26" rx="6" fill="#c0392b" ${stroke}/>
      <rect x="20" y="226" width="30" height="14" rx="3" fill="#7fb3d5" ${thin}/>
      <circle cx="24" cy="266" r="7" fill="#222" ${thin}/><circle cx="54" cy="266" r="7" fill="#222" ${thin}/>
      <rect x="76" y="244" width="40" height="18" fill="#6c7380" ${thin}/><rect x="80" y="232" width="32" height="12" fill="#95a5a6" ${thin}/>
      <!-- bridge so far -->
      <line x1="30" y1="258" x2="258" y2="120" stroke="#6c7380" stroke-width="10"/>
      ${blocks}
      <!-- pillars -->
      <rect x="92" y="200" width="8" height="64" fill="#8c95a4" ${thin}/><rect x="172" y="152" width="8" height="112" fill="#8c95a4" ${thin}/>
      <!-- new girder being carried in by robot -->
      <g class="new-girder"><g transform="translate(260 102) rotate(-30)">
        <rect x="0" y="0" width="44" height="14" fill="#dfe6f0" ${stroke}/>
        <rect x="0" y="14" width="44" height="6" fill="#6c7380" ${thin}/></g></g>
      <g class="robot"><g transform="translate(236 70)">
        <rect x="0" y="0" width="30" height="26" rx="5" fill="#ffb300" ${stroke}/>
        <rect x="6" y="7" width="18" height="9" rx="2" fill="#1b1f3b"/>
        <circle cx="11" cy="11.5" r="2" fill="#7CFC00"/><circle cx="19" cy="11.5" r="2" fill="#7CFC00"/>
        <line x1="15" y1="0" x2="15" y2="-8" ${thin}/><circle cx="15" cy="-10" r="3" fill="#e63946"/>
        <rect x="4" y="26" width="22" height="18" rx="3" fill="#ff8f00" ${stroke}/>
        <g class="leg"><line x1="9" y1="44" x2="6" y2="60" ${stroke}/></g>
        <g class="leg" style="animation-delay:-.15s"><line x1="21" y1="44" x2="24" y2="60" ${stroke}/></g>
        <line x1="0" y1="32" x2="-12" y2="38" ${stroke}/><line x1="30" y1="32" x2="40" y2="26" ${stroke}/>
      </g></g>
      <g transform="translate(288 92)"><g class="spark">
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="0" y1="0" x2="${Math.cos(a * Math.PI / 180) * 20}" y2="${Math.sin(a * Math.PI / 180) * 20}" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>`).join('')}
      </g></g>
      <g transform="translate(300 150)"><g class="clank">
        <polygon points="-50,-18 -40,-30 -22,-24 -10,-36 4,-22 24,-30 30,-14 50,-10 36,4 48,18 26,20 20,36 4,24 -14,36 -24,20 -46,22 -38,4 -56,-4" fill="#ffd23f" ${stroke}/>
        <text x="0" y="8" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="30" fill="${INK}" transform="rotate(-6)">RIVET!</text>
      </g></g>
      <text x="14" y="22" font-family="Bangers, Impact, sans-serif" font-size="16" fill="#fff" opacity=".8" letter-spacing="2">384,400 KM TO GO</text>
    `, '#1b1f3b');
  }

  /* ---------- Project Lazy: a field, the sun, a sprout that grows ---------- */
  function farm() {
    const rows = [200, 222, 244].map(y => `<path d="M0 ${y} Q100 ${y - 8} 200 ${y} T400 ${y}" stroke="#5a3a1e" stroke-width="4" fill="none" opacity=".6"/>`).join('');
    return wrap('s-farm', `
      <rect class="sky" width="400" height="300" fill="#8fd3ff"/>
      <g class="sun"><circle cx="200" cy="80" r="26" fill="#ffd23f" ${stroke}/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="${200 + Math.cos(a * Math.PI / 180) * 34}" y1="${80 + Math.sin(a * Math.PI / 180) * 34}" x2="${200 + Math.cos(a * Math.PI / 180) * 44}" y2="${80 + Math.sin(a * Math.PI / 180) * 44}" ${stroke}/>`).join('')}</g>
      <g class="moonlet"><circle cx="200" cy="80" r="20" fill="#fff6c8" ${stroke}/><circle cx="194" cy="74" r="4" fill="#e8dca8"/></g>
      <ellipse cx="80" cy="60" rx="46" ry="18" fill="#fff" ${stroke}/><ellipse cx="110" cy="52" rx="30" ry="16" fill="#fff" ${stroke}/>
      <path d="M0 180 Q120 150 400 176 L400 300 L0 300Z" fill="#7bc96f" ${stroke}/>
      <rect x="30" y="196" width="340" height="70" rx="6" fill="#8b5a2b" ${stroke}/>
      <rect x="30" y="196" width="340" height="70" rx="6" fill="url(#halftone-light)" opacity=".4"/>
      ${rows}
      <!-- fence -->
      <g ${thin}>${[300, 330, 360].map(x => `<line x1="${x}" y1="160" x2="${x}" y2="192"/>`).join('')}<line x1="292" y1="172" x2="372" y2="172"/><line x1="292" y1="184" x2="372" y2="184"/></g>
      <!-- sheep napping -->
      <g transform="translate(330 150)"><ellipse cx="0" cy="0" rx="24" ry="14" fill="#fff" ${stroke}/><circle cx="-22" cy="-2" r="8" fill="#222" ${thin}/>
        <path d="M-26 -3 q3 2 6 0" stroke="#fff" stroke-width="2" fill="none"/></g>
      <text class="sheep-zzz" x="336" y="128" font-family="Bangers, Impact, sans-serif" font-size="20" fill="${INK}">zZ</text>
      <!-- plant -->
      <g transform="translate(200 236)">
        <g class="plant"><path d="M0 0 C-2 -30 2 -60 0 -90" stroke="#2e7d32" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M0 -40 q-22 -4 -28 -24 q22 2 28 24z" fill="#58b368" ${thin}/>
          <path d="M0 -62 q22 -4 28 -24 q-22 2 -28 24z" fill="#58b368" ${thin}/></g>
        <g class="ear"><ellipse cx="0" cy="-100" rx="9" ry="22" fill="#ffd23f" ${thin}/>
          ${[-14, -8, -2, 4, 10].map(d => `<line x1="-7" y1="${-100 + d}" x2="7" y2="${-100 + d - 4}" stroke="${INK}" stroke-width="2"/>`).join('')}</g>
      </g>
      <!-- watering can -->
      <g transform="translate(240 150)"><g class="can">
        <rect x="0" y="0" width="44" height="34" rx="6" fill="#3a86ff" ${stroke}/>
        <path d="M44 10 L62 2 L66 10 L50 18Z" fill="#3a86ff" ${stroke}/>
        <path d="M8 0 Q22 -22 36 0" fill="none" ${stroke}/></g>
        <g><circle class="drop" cx="66" cy="14" r="4" fill="#7fd1ff" ${thin}/><circle class="drop" cx="60" cy="14" r="4" fill="#7fd1ff" ${thin}/><circle class="drop" cx="70" cy="18" r="3" fill="#7fd1ff" ${thin}/></g>
      </g>
      <g transform="translate(110 110)"><g class="harvest">
        <polygon points="-50,-18 -40,-30 -22,-24 -10,-36 4,-22 24,-30 30,-14 50,-10 36,4 48,18 26,20 20,36 4,24 -14,36 -24,20 -46,22 -38,4 -56,-4" fill="#ffd23f" ${stroke}/>
        <text x="0" y="8" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="26" fill="${INK}" transform="rotate(-6)">HARVEST!</text>
      </g></g>
    `, '#8fd3ff');
  }

  /* ---------- ReadTrack: a book whose pages keep turning ---------- */
  function book() {
    return wrap('s-book', `
      <rect width="400" height="300" fill="#f3edff"/>
      <rect width="400" height="300" fill="url(#halftone-light)" opacity=".35"/>
      <!-- shelf -->
      <rect x="0" y="250" width="400" height="14" fill="#8b5a2b" ${stroke}/>
      ${[[20, '#e63946', 40, 70], [64, '#3a86ff', 26, 78], [94, '#58b368', 34, 60], [132, '#ffd23f', 22, 74]].map(([x, c, w, h]) => `<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" fill="${c}" ${stroke}/>`).join('')}
      ${[[300, '#6b4e9b', 30, 72], [334, '#ff8f00', 22, 60], [360, '#e63946', 28, 80]].map(([x, c, w, h]) => `<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" fill="${c}" ${stroke}/>`).join('')}
      <!-- open book -->
      <g transform="translate(200 150)">
        <path d="M-120 -70 Q-60 -82 0 -70 L0 70 Q-60 58 -120 70Z" fill="#fff" ${stroke}/>
        <path d="M120 -70 Q60 -82 0 -70 L0 70 Q60 58 120 70Z" fill="#fff" ${stroke}/>
        <g class="lines" transform="translate(-100 -40)">
          <rect class="line" x="0" y="0" width="80" height="4" fill="#999"/><rect class="line" x="0" y="14" width="70" height="4" fill="#999"/>
          <rect class="line" x="0" y="28" width="84" height="4" fill="#999"/><rect class="line" x="0" y="42" width="50" height="4" fill="#999"/></g>
        <g transform="translate(22 -40)" opacity=".5">
          <rect x="0" y="0" width="80" height="4" fill="#999"/><rect x="0" y="14" width="64" height="4" fill="#999"/><rect x="0" y="28" width="84" height="4" fill="#999"/><rect x="0" y="42" width="40" height="4" fill="#999"/></g>
        <!-- the turning page -->
        <g class="flip"><path d="M118 -68 Q60 -80 2 -68 L2 68 Q60 56 118 68Z" fill="#fff" ${stroke}/></g>
        <line x1="0" y1="-70" x2="0" y2="70" ${stroke}/>
        <g transform="translate(70 -72)"><g class="bookmark"><path d="M0 0 h18 v44 l-9 -8 l-9 8z" fill="#e63946" ${thin}/></g></g>
        <path class="heart" d="M-70 30 c-8-10-22 0-10 10 l10 8 l10-8 c12-10-2-20-10-10z" fill="#e63946" ${thin}/>
      </g>
      <!-- progress -->
      <g transform="translate(80 282)">
        <rect x="0" y="-12" width="240" height="14" fill="#fff" ${thin}/>
        <rect class="bar-fill" x="0" y="-12" width="240" height="14" fill="#6b4e9b"/>
      </g>
      <text x="330" y="282" font-family="Bangers, Impact, sans-serif" font-size="18" fill="${INK}">CH. 12/40</text>
      <text x="14" y="26" font-family="Bangers, Impact, sans-serif" font-size="16" fill="#6b4e9b" letter-spacing="2">NOW READING</text>
    `, '#f3edff');
  }

  /* ---------- generic fallbacks ---------- */
  function game() {
    return wrap('s-game', `
      <rect width="400" height="300" fill="#ffe9a8"/><rect width="400" height="300" fill="url(#halftone-light)" opacity=".3"/>
      <g transform="translate(200 160)">
        <path d="M-120 -40 h240 a40 40 0 0 1 40 40 l-14 60 a30 30 0 0 1 -50 10 l-30 -40 h-132 l-30 40 a30 30 0 0 1 -50 -10 l-14 -60 a40 40 0 0 1 40 -40z" fill="#6b4e9b" ${stroke}/>
        <rect x="-96" y="-20" width="16" height="48" rx="3" fill="#fff" ${thin}/><rect x="-112" y="-4" width="48" height="16" rx="3" fill="#fff" ${thin}/>
        <circle class="btn-a" cx="92" cy="-6" r="11" fill="#e63946" ${thin}/><circle class="btn-b" cx="66" cy="14" r="11" fill="#58b368" ${thin}/>
        <circle cx="66" cy="-26" r="11" fill="#ffd23f" ${thin}/><circle cx="118" cy="14" r="11" fill="#3a86ff" ${thin}/>
        <circle class="glow" cx="0" cy="-10" r="6" fill="#7CFC00" ${thin}/>
      </g>`, '#ffe9a8');
  }
  function app() {
    return wrap('s-app', `
      <rect width="400" height="300" fill="#dff5ff"/>
      <g transform="translate(140 20)"><rect x="0" y="0" width="120" height="260" rx="18" fill="#222" ${stroke}/>
        <clipPath id="screen"><rect x="8" y="24" width="104" height="212"/></clipPath>
        <rect x="8" y="24" width="104" height="212" fill="#fff"/>
        <g clip-path="url(#screen)"><g class="card">${[0, 60, 120, 180, 240].map(y => `<rect x="16" y="${34 + y}" width="88" height="46" rx="6" fill="${['#ffd23f', '#3a86ff', '#58b368', '#e63946', '#ffd23f'][y / 60]}" ${thin}/>`).join('')}</g></g>
        <rect x="46" y="10" width="28" height="6" rx="3" fill="#555"/></g>`, '#dff5ff');
  }
  function code() {
    return wrap('s-code', `
      <rect width="400" height="300" fill="#2d2d2d"/>
      <rect x="30" y="30" width="340" height="240" rx="10" fill="#111" ${stroke}/>
      <circle cx="52" cy="50" r="6" fill="#e63946"/><circle cx="72" cy="50" r="6" fill="#ffd23f"/><circle cx="92" cy="50" r="6" fill="#58b368"/>
      <g font-family="monospace" font-size="16" fill="#7CFC00">
        <text class="ln" x="50" y="90">$ git log --oneline</text><text class="ln" x="50" y="116" fill="#fff">a1b2c3  ship it</text>
        <text class="ln" x="50" y="142" fill="#fff">d4e5f6  fix the thing</text><text class="ln" x="50" y="168" fill="#fff">789abc  first commit</text>
      </g>
      <rect class="cursor" x="50" y="186" width="12" height="20" fill="#7CFC00"/>`, '#2d2d2d');
  }
  function archive() {
    return wrap('s-archive', `
      <rect width="400" height="300" fill="#e8e0cc"/>
      <g transform="translate(200 170)"><path d="M-110 -40 h220 v120 h-220z" fill="#c9a66b" ${stroke}/><path d="M-120 -70 h240 v30 h-240z" fill="#d9b77b" ${stroke}/>
        <text x="0" y="40" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="34" fill="${INK}">ARCHIVE</text></g>`, '#e8e0cc');
  }

  /* ---------- decorations ---------- */
  function cobweb() {
    const lines = [0, 15, 30, 45, 60, 75, 90].map(a => {
      const r = a * Math.PI / 180; return `<line x1="0" y1="0" x2="${Math.cos(r) * 220}" y2="${Math.sin(r) * 220}"/>`;
    }).join('');
    const arcs = [50, 90, 130, 170, 205].map(rad => {
      let d = ''; for (let a = 0; a <= 90; a += 15) {
        const r = a * Math.PI / 180, x = Math.cos(r) * rad, y = Math.sin(r) * rad;
        d += (a === 0 ? `M${x} ${y}` : ` Q${Math.cos((a - 7.5) * Math.PI / 180) * (rad - 10)} ${Math.sin((a - 7.5) * Math.PI / 180) * (rad - 10)} ${x} ${y}`);
      } return `<path d="${d}"/>`;
    }).join('');
    return `<svg class="web" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${lines}${arcs}</svg>`;
  }
  function spider() {
    return `<svg class="spider" width="60" height="120" viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="30" y1="0" x2="30" y2="70" stroke="#444" stroke-width="1.5"/>
      <g ${thin}>${[-1, 1].map(s => [0, 1, 2, 3].map(i => `<path d="M30 ${80 + i * 4} q${s * 14} ${-8 + i * 5} ${s * 24} ${6 + i * 6}" fill="none"/>`).join('')).join('')}</g>
      <ellipse cx="30" cy="86" rx="11" ry="13" fill="#222" ${thin}/><circle cx="30" cy="72" r="7" fill="#222" ${thin}/>
      <circle cx="27" cy="71" r="1.6" fill="#e63946"/><circle cx="33" cy="71" r="1.6" fill="#e63946"/></svg>`;
  }
  function cracks() {
    return `<svg class="cracks" viewBox="0 0 400 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 40 l30 18 l-8 26 l34 22 l12 40"/><path d="M400 500 l-40 -12 l6 -28 l-44 -16"/><path d="M380 0 l-16 30 l10 24"/></svg>`;
  }
  function coverArt() {
    return `<svg viewBox="0 0 330 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="30" width="200" height="110" rx="8" fill="#ffd23f" ${stroke}/>
      <rect x="22" y="42" width="176" height="86" fill="#fff" ${thin}/>
      <path d="M40 112 L80 70 L110 96 L140 60 L180 112Z" fill="#3a86ff" ${thin}/>
      <circle cx="160" cy="62" r="10" fill="#e63946" ${thin}/>
      <g transform="translate(222 20)"><rect x="0" y="40" width="96" height="100" rx="8" fill="#58b368" ${stroke}/>
        <rect x="14" y="54" width="68" height="12" fill="#fff" ${thin}/><rect x="14" y="76" width="68" height="12" fill="#fff" ${thin}/><rect x="14" y="98" width="44" height="12" fill="#fff" ${thin}/>
        <path d="M30 40 l18 -30 l18 30" fill="#ffd23f" ${stroke}/></g>
      <path d="M0 148 h330" ${stroke}/></svg>`;
  }

  global.Scenes = { bridge, farm, book, game, app, code, archive, cobweb, spider, cracks, coverArt };
})(window);
