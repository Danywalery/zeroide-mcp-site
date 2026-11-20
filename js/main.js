/* ZeroIDE MCP landing — main interactions */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var T = function (k, v) { return ZI.t(k, v); };
  var P = function (o) { return ZI.p(o); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var body = document.body;

  /* ---------- marquee: duplicate for a seamless loop ---------- */
  var mq = $("marq"); if (mq) mq.innerHTML += mq.innerHTML;

  /* ---------- language ---------- */
  ZI.apply(ZI.lang);
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { ZI.apply(b.getAttribute("data-lang")); }); });

  /* ---------- POWER ---------- */
  var sw = $("sw"), power = $("power"), touched = false, isOn = false;
  function renderPower() {
    sw.setAttribute("aria-checked", String(isOn));
    $("pwState").innerHTML = isOn ? T("pw.on") : T("pw.off");
    $("pwHint").innerHTML = isOn ? T("pw.hintOn") : T("pw.hintOff");
    $("pwDot").classList.toggle("on", isOn);
    $("navDot").classList.toggle("on", isOn);
    $("navState").innerHTML = isOn ? T("nav.on") : T("nav.off");
  }
  function setPower(on, fromEl) {
    if (on === isOn) return;
    isOn = on;
    body.classList.toggle("power-on", on);
    renderPower();
    var r = (fromEl || sw).getBoundingClientRect();
    var heroR = $("top").getBoundingClientRect();
    var inHero = r.top < heroR.bottom && r.bottom > heroR.top;
    if (window.ZField) window.ZField.power(on, inHero ? r.left + r.width / 2 : null, inHero ? r.top + r.height / 2 : null);
    document.dispatchEvent(new CustomEvent("zi:power", { detail: on }));
  }
  sw.addEventListener("click", function () { touched = true; power.classList.add("touched"); setPower(!isOn); });
  var offOn = $("offOn"); if (offOn) offOn.addEventListener("click", function () { touched = true; power.classList.add("touched"); setPower(true, offOn); });
  setTimeout(function () { if (!touched) setPower(true); }, reduce ? 300 : 2600);
  window.addEventListener("scroll", function onS() { if (window.scrollY > window.innerHeight * 0.5) { if (!touched && !isOn) setPower(true); window.removeEventListener("scroll", onS); } }, { passive: true });
  renderPower();

  /* ---------- nav, progress, burger ---------- */
  var nav = $("nav"), prog = $("progress");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("solid", y > 20);
    prog.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    scrub();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  var burger = $("burger");
  burger.addEventListener("click", function () { var o = !body.classList.contains("menu-open"); body.classList.toggle("menu-open", o); burger.setAttribute("aria-expanded", String(o)); });
  $$("#mmenu a").forEach(function (a) { a.addEventListener("click", function () { body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); }); });

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv,.rv-scale").forEach(function (el) { io.observe(el); });

  /* ---------- manifesto scrub ---------- */
  var scrubEl = $("scrub"), words = [];
  function buildScrub() {
    if (!scrubEl) return;
    var out = "";
    [].slice.call(scrubEl.childNodes).forEach(function (n) {
      var hl = n.nodeType === 1, txt = n.textContent;
      txt.split(/(\s+)/).forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) out += w; else out += '<span class="wd' + (hl ? " hl" : "") + '">' + w.replace(/</g, "&lt;") + "</span>";
      });
    });
    scrubEl.innerHTML = out;
    words = $$(".wd", scrubEl);
    if (reduce) scrubEl.classList.add("done");
    scrub();
  }
  function scrub() {
    if (!words.length) return;
    var r = scrubEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.82 - r.top) / (r.height + vh * 0.35);
    p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < n);
  }
  buildScrub();

  /* ---------- counters ---------- */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suf") ? (ZI.lang === "en" ? " s" : " с") : "";
      if (reduce) { el.textContent = to + suf; return; }
      var t0 = performance.now(), d = 1400;
      (function f(now) { var k = Math.min(1, (now - t0) / d); k = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * k) + suf; if (k < 1) requestAnimationFrame(f); })(t0);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ---------- spotlight cards + magnetic buttons ---------- */
  if (fine) {
    document.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".card"); if (!c) return;
      var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
    $$(".magnet").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- WHO: personas ---------- */
  var PERS = [
    { ic: "🙂", tab: { ru: "Я не технарь", en: "I'm not technical" },
      h: { ru: "«Хочу, чтобы компьютер просто делал, что я прошу»", en: "“I just want my computer to do what I ask”" },
      p: { ru: "Вы уже общаетесь с ChatGPT или Claude. Теперь ИИ может не только подсказать, но и сделать — на вашем ПК и только с вашего разрешения.", en: "You already talk to ChatGPT or Claude. Now the AI can not only suggest but do it — on your PC and only with your permission." },
      need: ["ChatGPT", "Claude", { ru: "ngrok настроит мастер", en: "the wizard sets up ngrok" }],
      asks: [
        { q: { ru: "Разложи «Загрузки» по папкам и найди дубликаты фото", en: "Sort my Downloads into folders and find duplicate photos" }, r: { ru: "Папки по типам файлов, удаление — только после вашего «да»", en: "Folders by file type, deleting only after your “yes”" }, t: ["list_directory", "run_command"] },
        { q: { ru: "Почему компьютер тормозит? Посмотри, что грузит систему", en: "Why is my computer slow? See what's loading the system" }, r: { ru: "Список самых «тяжёлых» программ и совет, что закрыть", en: "A list of the heaviest programs and advice on what to close" }, t: ["run_command"] },
        { q: { ru: "Собери все фото с отпуска в одну папку", en: "Put all my holiday photos into one folder" }, r: { ru: "Найдёт и скопирует — с вашего разрешения", en: "Finds and copies them — with your permission" }, t: ["list_directory", "run_command"] }
      ] },
    { ic: "💼", tab: { ru: "Работаю с документами", en: "I work with documents" },
      h: { ru: "«Хочу меньше рутины с файлами и таблицами»", en: "“I want less busywork with files and spreadsheets”" },
      p: { ru: "Отчёты, счета, заметки, выгрузки. ИИ читает ваши файлы и собирает из них то, что нужно, — в папке на ПК или в Notion.", en: "Reports, invoices, notes, exports. The AI reads your files and builds what you need — in a folder on your PC or in Notion." },
      need: ["Notion", "ChatGPT", "Claude"],
      asks: [
        { q: { ru: "Сведи все счета из папки «Счета» в одну таблицу с итогом", en: "Combine all invoices from the Invoices folder into one table with a total" }, r: { ru: "Новый файл с таблицей появится после вашего «да»", en: "A new table file appears after your “yes”" }, t: ["read_file", "write_file"] },
        { q: { ru: "Найди в заметках все договорённости с «Альфой»", en: "Find every agreement with Alpha in my notes" }, r: { ru: "Ответ со ссылками на файлы — только чтение, без вопросов", en: "An answer with file references — read only, no questions" }, t: ["search_files", "read_file"] },
        { q: { ru: "Возьми план из Notion и создай на ПК папки под каждый проект", en: "Take the plan from Notion and create a folder for each project" }, r: { ru: "Структура папок по вашему плану", en: "A folder structure that matches your plan" }, t: ["run_command"] }
      ] },
    { ic: "👩‍💻", tab: { ru: "Я разработчик", en: "I'm a developer" },
      h: { ru: "«Хочу, чтобы агент работал на моих машинах»", en: "“I want the agent to work on my own machines”" },
      p: { ru: "Claude Code, Cursor, Codex или веб-агент получают PowerShell, файлы и фоновые задачи. Подтверждения, пропуска с ограничением папки и журнал — из коробки.", en: "Claude Code, Cursor, Codex or a web agent get PowerShell, files and background jobs. Approvals, folder-scoped passes and a log come built in." },
      need: ["Claude Code", "Cursor", "Codex"],
      asks: [
        { q: { ru: "Собери проект, прогони тесты и пришли итог мне в трей", en: "Build the project, run the tests and send me the result in the tray" }, r: { ru: "Фоновая задача, её вывод и сообщение вам", en: "A background job, its output and a message to you" }, t: ["run_command", "job_output", "user_message"] },
        { q: { ru: "Почини падающий тест и покажи, что поменял", en: "Fix the failing test and show me what you changed" }, r: { ru: "Точечная правка и запись в журнале аудита", en: "A precise edit and an entry in the audit log" }, t: ["read_file", "edit_file", "audit_log"] },
        { q: { ru: "Продолжи вчерашнюю задачу с того же места", en: "Pick up yesterday's task where you left off" }, r: { ru: "Агент читает свой журнал и продолжает", en: "The agent reads its journal and carries on" }, t: ["journal_log", "journal_entry"] }
      ] },
    { ic: "🖥", tab: { ru: "У меня несколько ПК", en: "I have several PCs" },
      h: { ru: "«Хочу управлять всеми компьютерами из одного чата»", en: "“I want to run all my computers from one chat”" },
      p: { ru: "Домашний, рабочий, ноутбук. Поставьте ZeroIDE MCP на каждый, и один агент поведёт задачу сразу на всех.", en: "Home, work, laptop. Install ZeroIDE MCP on each and one agent can run a task across all of them." },
      need: ["Tailscale", "ngrok"],
      asks: [
        { q: { ru: "Обнови программу на всех трёх компьютерах", en: "Update the app on all three computers" }, r: { ru: "Каждый ПК спросит вас отдельно", en: "Each PC asks you separately" }, t: ["run_command"] },
        { q: { ru: "Сравни отчёт на рабочем ПК с домашней версией", en: "Compare the report on the work PC with the home copy" }, r: { ru: "Чтение на обоих ПК и сводка отличий", en: "Reading on both PCs and a summary of differences" }, t: ["read_file", "search_files"] },
        { q: { ru: "Проверь, где заканчивается место на диске", en: "Check which machine is running out of disk space" }, r: { ru: "Отчёт по всем машинам в одном ответе", en: "A report for every machine in one answer" }, t: ["run_command"] }
      ] }
  ];
  var whoIdx = 0, whoTabs = $("whoTabs"), whoPanel = $("whoPanel");
  var ASKT = { run_command: 1, write_file: 1, edit_file: 1, take_screenshot: 1 };
  function renderWho() {
    whoTabs.innerHTML = PERS.map(function (p, i) { return '<button type="button" role="tab" aria-selected="' + (i === whoIdx) + '" data-i="' + i + '"><span>' + p.ic + "</span>" + P(p.tab) + "</button>"; }).join("");
    var p = PERS[whoIdx];
    whoPanel.innerHTML = '<div class="who-panel"><div class="who-hero"><div class="big">' + p.ic + "</div><h3>" + P(p.h) + "</h3><p>" + P(p.p) + '</p><div class="who-need"><small>' + P({ ru: "Подойдёт", en: "Works with" }) + "</small><div>" +
      p.need.map(function (n) { return '<span class="tag tag-v">' + P(n) + "</span>"; }).join("") + '</div></div></div><div class="who-list">' +
      p.asks.map(function (a) {
        return '<div class="ask"><q>' + P(a.q).replace(/^[«“]|[»”]$/g, "") + '</q><span class="tags">' + a.t.map(function (t) { return '<span class="tag ' + (ASKT[t] ? "tag-ask" : "tag-ok") + '">' + t + "</span>"; }).join("") + '</span><span class="res">' + P(a.r) + "</span></div>";
      }).join("") + "</div></div>";
    $$("button", whoTabs).forEach(function (b) { b.addEventListener("click", function () { whoIdx = +b.getAttribute("data-i"); renderWho(); }); });
  }
  renderWho();

  /* ---------- HOW: gate packets ---------- */
  (function gate() {
    var g = $("gate"), cv = $("gateCv"); if (!g || !cv) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = $$(".gn", g), pts = [], segs = [], total = 0, stopS = 0, gateOn = true, pk = [], last = 0, spawn = 0, vis = false;
    var gsw = $("gSw"), key = $("gKey");
    function layout() {
      var r = g.getBoundingClientRect();
      cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = nodes.map(function (n) { var b = n.getBoundingClientRect(); return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2, w: b.width, h: b.height }; });
      segs = []; total = 0;
      for (var i = 0; i < pts.length - 1; i++) { var L = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); segs.push({ a: pts[i], b: pts[i + 1], s: total, L: L }); total += L; }
      var s2 = segs[1], horiz = Math.abs(s2.b.x - s2.a.x) > Math.abs(s2.b.y - s2.a.y);
      stopS = s2.s + s2.L - (horiz ? pts[2].w / 2 : pts[2].h / 2) - 14;
    }
    function at(s) {
      for (var i = 0; i < segs.length; i++) { var sg = segs[i]; if (s <= sg.s + sg.L || i === segs.length - 1) { var k = Math.max(0, Math.min(1, (s - sg.s) / sg.L)); return { x: sg.a.x + (sg.b.x - sg.a.x) * k, y: sg.a.y + (sg.b.y - sg.a.y) * k }; } }
      return pts[0];
    }
    function draw(now) {
      if (!vis) { last = 0; return; }
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      var r = g.getBoundingClientRect(); ctx.clearRect(0, 0, r.width, r.height);
      ctx.setLineDash([4, 8]); ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(255,255,255,.14)";
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke(); ctx.setLineDash([]);
      spawn -= dt; if (spawn <= 0) { spawn = 0.55 + Math.random() * 0.5; pk.push({ s: 0, v: 240 + Math.random() * 60, w: Math.random() < 0.38, st: "go", hold: 0, a: 1 }); }
      for (var j = pk.length - 1; j >= 0; j--) {
        var p = pk[j];
        if (p.st === "go") {
          p.s += p.v * dt;
          if (p.s >= stopS && p.s - p.v * dt < stopS) {
            if (!gateOn) { p.st = "back"; p.s = stopS; }
            else if (p.w) { p.st = "hold"; p.s = stopS; p.hold = 0.9 + Math.random() * 0.5; }
          }
          if (p.s >= total) { pk.splice(j, 1); continue; }
        } else if (p.st === "hold") {
          p.hold -= dt; if (!gateOn) p.st = "back"; else if (p.hold <= 0) { p.st = "go"; p.s += 1; p.ok = 1; }
        } else { p.s -= p.v * 0.8 * dt; p.a -= dt * 0.9; if (p.s <= 0 || p.a <= 0) { pk.splice(j, 1); continue; } }
        var q = at(p.s), col = p.st === "back" ? "255,93,93" : (p.w && !p.ok ? "255,181,71" : "198,248,44");
        var pulse = p.st === "hold" ? 1 + Math.sin(now / 90) * 0.35 : 1;
        var grd = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 16 * pulse);
        grd.addColorStop(0, "rgba(" + col + "," + (0.55 * p.a) + ")"); grd.addColorStop(1, "rgba(" + col + ",0)");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(q.x, q.y, 16 * pulse, 0, 6.29); ctx.fill();
        ctx.fillStyle = "rgba(" + col + "," + p.a + ")"; ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, 6.29); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    layout();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
    new IntersectionObserver(function (es) { var was = vis; vis = es[0].isIntersecting && !reduce; if (vis && !was) { layout(); requestAnimationFrame(draw); } }).observe(g);
    function renderG() { gsw.setAttribute("aria-checked", String(gateOn)); key.classList.toggle("off", !gateOn); $("gSwT").innerHTML = gateOn ? T("how.on") : T("how.off"); }
    gsw.addEventListener("click", function () { gateOn = !gateOn; renderG(); });
    document.addEventListener("zi:lang", renderG);
  })();

  /* ---------- tools: mini terminal ---------- */
  (function mini() {
    var el = $("termMini"); if (!el) return;
    var vis = false, busy = false;
    function L() {
      var en = ZI.lang === "en";
      return [
        ['<span class="p">AI ›</span> run_command  Get-Process | sort CPU -desc | select -first 3', 500],
        ['<span style="color:var(--amber)">⏳ ' + (en ? "waiting for your “yes” in the tray…" : "ждёт вашего «да» в трее…") + "</span>", 1400],
        ['<span class="g">✓ ' + (en ? "allowed by the owner" : "разрешено владельцем") + "</span>", 500],
        ["chrome.exe    812 MB   18%", 220], ["Teams.exe     430 MB    9%", 220], ["obs64.exe     290 MB    7%", 2600]
      ];
    }
    async function loop() {
      if (busy) return; busy = true;
      while (vis) {
        el.innerHTML = "";
        var lines = L();
        for (var i = 0; i < lines.length && vis; i++) { var d = document.createElement("div"); d.innerHTML = lines[i][0]; el.appendChild(d); await new Promise(function (r) { setTimeout(r, lines[i][1]); }); }
      }
      busy = false;
    }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) loop(); }).observe(el);
  })();

  /* ---------- CONTROL: pass builder ---------- */
  (function passB() {
    var pass = $("pass"); if (!pass) return;
    var st = { who: "Claude", scope: "read", root: "proj", exp: "7", lim: "500" };
    /* order: 13 read-scope tools (read_image asks), 5 readwrite tools, run_command */
    var TOOLS = ["read_file", "list_directory", "search_files", "system_info", "job_status", "job_output", "audit_log", "journal_log", "user_message", "task_status", "agent_message", "await_owner", "read_image", "journal_entry", "write_file", "edit_file", "file_ops", "take_screenshot", "run_command"];
    var ASK = { read_image: 1, write_file: 1, edit_file: 1, file_ops: 1, take_screenshot: 1, run_command: 1 };
    var bars = $("pTools"); bars.innerHTML = TOOLS.map(function (t) { return '<i title="' + t + '"></i>'; }).join("");
    var bi = $$("i", bars), revoked = false;
    function fmtDate(days) { var d = new Date(Date.now() + days * 864e5); return d.toLocaleDateString(ZI.lang === "en" ? "en-GB" : "ru-RU"); }
    function render(changed) {
      var root = st.root === "all" ? T("r.all") : "C:\\Projects";
      $("pName").textContent = st.who + " · " + root;
      $("pScope").textContent = T("s." + st.scope);
      $("pRoot").textContent = root;
      $("pExp").textContent = st.exp === "0" ? T("e.0") : fmtDate(+st.exp);
      $("pLim").textContent = st.lim === "0" ? T("l.0") : (+st.lim).toLocaleString(ZI.lang === "en" ? "en-US" : "ru-RU");
      var n = st.scope === "read" ? 13 : st.scope === "readwrite" ? 18 : 19;
      bi.forEach(function (b, i) { b.className = i < n ? (ASK[TOOLS[i]] ? "is-ask" : "is-on") : ""; });
      $("pCount").innerHTML = T("pass.count", { n: n });
      $("scopeHint").textContent = T("scope." + st.scope);
      $("revoke").textContent = revoked ? T("pass.reissue") : T("pass.revB");
      if (changed) { var m = { scope: "pScope", root: "pRoot", exp: "pExp", lim: "pLim", who: "pName" }[changed]; var e = $(m); if (e) { e.classList.add("chg"); setTimeout(function () { e.classList.remove("chg"); }, 700); } }
    }
    $$(".bld .seg").forEach(function (seg) {
      var k = seg.getAttribute("data-k");
      $$("button", seg).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", seg).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          st[k] = b.getAttribute("data-v"); revoked = false; pass.classList.remove("revoked");
          if (!reduce) { pass.classList.remove("flip"); void pass.offsetWidth; pass.classList.add("flip"); }
          render(k);
        });
      });
    });
    $("revoke").addEventListener("click", function () { revoked = !revoked; pass.classList.toggle("revoked", revoked); render(); });
    render();
    document.addEventListener("zi:lang", function () { render(); });
    if (fine && !reduce) {
      var stage = pass.parentElement, tx = 0, ty = 0, cx = 0, cy = 0, mx = 50, my = 50, run = false;
      function loopT() { cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1; pass.style.setProperty("--rx", cy.toFixed(2) + "deg"); pass.style.setProperty("--ry", cx.toFixed(2) + "deg"); pass.style.setProperty("--mx", mx + "%"); pass.style.setProperty("--my", my + "%"); if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) requestAnimationFrame(loopT); else run = false; }
      stage.addEventListener("pointermove", function (e) { var r = pass.getBoundingClientRect(); var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; tx = (x - 0.5) * 22; ty = (0.5 - y) * 16; mx = Math.round(x * 100); my = Math.round(y * 100); if (!run) { run = true; requestAnimationFrame(loopT); } });
      stage.addEventListener("pointerleave", function () { tx = 0; ty = 0; mx = 50; my = 50; if (!run) { run = true; requestAnimationFrame(loopT); } });
    }
  })();

  /* ---------- VIDEO theater ---------- */
  (function theater() {
    var tv = $("tv"), cv = $("ambi"), list = $$("#plist .pv"); if (!tv) return;
    var ctx = cv.getContext("2d"), idx = 0, raf = 0;
    var keys = ["v1.t", "v2.t", "v3.t"];
    function paintPoster() { var img = list[idx].querySelector("img"); if (img.complete && img.naturalWidth) { try { ctx.drawImage(img, 0, 0, cv.width, cv.height); } catch (e) {} } else img.onload = paintPoster; }
    function paint() { raf = 0; if (tv.paused || tv.ended) return; try { ctx.drawImage(tv, 0, 0, cv.width, cv.height); } catch (e) {} raf = requestAnimationFrame(paint); }
    function select(i, play) {
      idx = i;
      list.forEach(function (b, j) { b.setAttribute("aria-selected", String(j === i)); var bar = b.querySelector(".pv-bar i"); if (bar) bar.style.width = "0"; });
      tv.poster = list[i].getAttribute("data-poster");
      tv.src = list[i].getAttribute("data-src");
      var vt = $("vTitle"); vt.setAttribute("data-i18n", keys[i]); vt.innerHTML = T(keys[i]);
      paintPoster();
      if (play) { var pr = tv.play(); if (pr && pr.catch) pr.catch(function () {}); }
    }
    list.forEach(function (b, i) { b.addEventListener("click", function () { select(i, true); }); });
    tv.addEventListener("play", function () { if (!raf) raf = requestAnimationFrame(paint); });
    tv.addEventListener("timeupdate", function () { var bar = list[idx].querySelector(".pv-bar i"); if (bar && tv.duration) bar.style.width = (tv.currentTime / tv.duration * 100) + "%"; });
    tv.addEventListener("ended", function () { if (idx < list.length - 1) select(idx + 1, true); });
    new IntersectionObserver(function (es) { if (!es[0].isIntersecting && !tv.paused) tv.pause(); }, { threshold: 0.1 }).observe(tv);
    paintPoster();
  })();

  /* ---------- modal video ---------- */
  (function modal() {
    var m = $("modal"), v = $("mvid"), x = $("modalX"); if (!m) return;
    function open(src, poster) { v.poster = poster || ""; v.src = src; m.classList.add("open"); body.style.overflow = "hidden"; var p = v.play(); if (p && p.catch) p.catch(function () {}); x.focus(); }
    function close() { m.classList.remove("open"); body.style.overflow = ""; v.pause(); }
    $$("[data-modal]").forEach(function (b) { b.addEventListener("click", function () { open(b.getAttribute("data-modal"), b.getAttribute("data-poster")); }); });
    x.addEventListener("click", close);
    m.addEventListener("click", function (e) { if (e.target === m) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("open")) close(); });
  })();

  /* ---------- copy ---------- */
  var copied = $("copied"), ct;
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = $(b.getAttribute("data-copy")).textContent.trim();
      function ok() { copied.textContent = T("copied"); copied.classList.add("show"); clearTimeout(ct); ct = setTimeout(function () { copied.classList.remove("show"); }, 1600); }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
      function fallback() { var ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} ta.remove(); }
    });
  });

  /* ---------- language change hooks ---------- */
  document.addEventListener("zi:lang", function () {
    renderPower(); buildScrub(); renderWho();
    $$("[data-count]").forEach(function (el) { if (el.getAttribute("data-suf")) el.textContent = el.getAttribute("data-count") + (ZI.lang === "en" ? " s" : " с"); });
  });

  onScroll();
})();
