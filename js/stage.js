/* ZeroIDE MCP landing — live stage: an AI chat that works on a simulated Windows PC.
   Illustration only. Mirrors the real defaults: reads pass, writes/commands/screenshots wait for the owner, 60 s timeout. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var T = function (k, v) { return ZI.t(k, v); };
  var P = function (o) { return ZI.p(o); };
  var msgs = $("msgs"), compose = $("compose"), screen = $("pcScreen"), pc = $("pc"), auditEl = $("audit");
  var note = $("pcNote"), flashEl = $("flash"), shotFrame = $("shotFrame"), trayZ = $("trayZ");
  if (!msgs || !pc) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var runId = 0, current = "tidy";
  var ABORT = { abort: true };

  function wait(ms, id) {
    return new Promise(function (res, rej) {
      setTimeout(function () { if (id !== runId) rej(ABORT); else res(); }, reduce ? Math.min(ms, 80) : ms);
    });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function home() { return ZI.lang === "en" ? "C:\\Users\\You" : "C:\\Users\\Вы"; }
  var WHO = { ru: "ИИ-ассистент", en: "AI assistant" };

  /* ---------- chat ---------- */
  function add(cls, html) {
    var d = document.createElement("div");
    d.className = "msg " + cls; d.innerHTML = html; msgs.appendChild(d);
    while (msgs.children.length > 16) msgs.removeChild(msgs.firstChild);
    return d;
  }
  async function user(text, id) {
    compose.classList.add("typed"); compose.textContent = "";
    var step = text.length > 70 ? 14 : 22;
    for (var i = 1; i <= text.length; i += (reduce ? text.length : 1)) { compose.textContent = text.slice(0, i); await wait(step, id); }
    await wait(380, id);
    compose.classList.remove("typed"); compose.textContent = T("chat.ph");
    add("user", esc(text));
    await wait(300, id);
  }
  async function ai(html, id) {
    var ty = document.createElement("div"); ty.className = "typing"; ty.innerHTML = "<i></i><i></i><i></i>"; msgs.appendChild(ty);
    try { await wait(700, id); } finally { ty.remove(); }
    var m = add("ai", '<span class="ava ai">✦</span><p></p>'), p = m.querySelector("p"), w = html.split(" ");
    for (var i = 1; i <= w.length; i += (reduce ? w.length : 1)) { p.innerHTML = w.slice(0, i).join(" "); await wait(32, id); }
    p.innerHTML = html;
    await wait(250, id);
  }
  function tool(name, arg) {
    var m = add("tool run", '<span class="ic"></span><code>' + name + '</code><span class="arg">' + esc(arg || "") + '</span><span class="st">' + T("sc.running") + "</span>");
    return { set: function (st, label) { m.className = "msg tool " + st; m.querySelector(".st").textContent = label; } };
  }
  /* audit log: a tail of fixed-height rows; older entries scroll up under a fade, new ones scroll into view */
  var auditN = 0, auditCnt = null;
  if (auditEl) {
    var auditHead = auditEl.parentNode.querySelector(".audit-h");
    if (auditHead) { auditCnt = document.createElement("span"); auditCnt.className = "audit-n"; auditCnt.hidden = true; auditHead.appendChild(auditCnt); }
    auditEl.addEventListener("scroll", auditFade, { passive: true });
  }
  function auditFade() {
    var below = auditEl.scrollHeight - auditEl.clientHeight - auditEl.scrollTop;
    auditEl.classList.toggle("fade-t", auditEl.scrollTop > 1);
    auditEl.classList.toggle("fade-b", below > 1);
  }
  function auditCount() {
    if (!auditCnt) return;
    var n = auditN, a = n % 10, b = n % 100;
    auditCnt.hidden = !n;
    auditCnt.textContent = n + " " + (ZI.lang === "en" ? (n === 1 ? "entry" : "entries") : a === 1 && b !== 11 ? "запись" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "записи" : "записей");
  }
  function audit(name, res, why) {
    if (!auditEl) return null;
    var li = document.createElement("li");
    var lab = { ok: "✓ ok", ask: "… approval", no: "✕ denied" }[res] || res;
    var stick = auditEl.scrollHeight - auditEl.clientHeight - auditEl.scrollTop < 40; /* keep following new rows unless the reader scrolled back */
    li.className = "is-" + res;
    li.title = name + " · " + lab + (why ? " · " + why : "");
    li.innerHTML = '<span class="au-time">' + new Date().toTimeString().slice(0, 8) + '</span><span class="au-tool">' + esc(name) + '</span><span class="au-st">' + lab + '</span><span class="au-why">' + esc(why || "") + "</span>";
    auditEl.appendChild(li);
    while (auditEl.children.length > 40) auditEl.removeChild(auditEl.firstChild);
    if (stick) { if (auditEl.scrollTo) auditEl.scrollTo({ top: auditEl.scrollHeight, behavior: reduce ? "auto" : "smooth" }); else auditEl.scrollTop = auditEl.scrollHeight; }
    auditN++; auditCount(); auditFade();
    return li;
  }
  function pcNote(text, ms) {
    note.textContent = text; note.classList.add("show");
    clearTimeout(pcNote._t); pcNote._t = setTimeout(function () { note.classList.remove("show"); }, ms || 2600);
  }

  /* ---------- approval toast ---------- */
  function approve(o, id) {
    return new Promise(function (resolve, reject) {
      var host = o.host || pc;
      var el = document.createElement("div");
      el.className = "toast";
      el.innerHTML =
        '<div class="toast-h"><svg><use href="#i-z"/></svg><b>' + T("toast.app") + '</b><span class="t">60</span></div>' +
        '<div class="toast-q"><span>' + P(WHO) + "</span> " + T("toast." + o.kind) + (o.pc ? " " + T("toast.on") + " «" + esc(o.pc) + "»" : "") + "</div>" +
        (o.code ? "<pre>" + esc(o.code) + "</pre>" : "") +
        (o.shot ? '<div class="shotp"><i></i></div>' : "") +
        '<p class="why">“' + esc(o.why) + '”</p>' +
        '<div class="toast-a"><button type="button" class="yes">' + T("toast.allow") + '</button><button type="button" class="no">' + T("toast.deny") + "</button></div>" +
        '<div class="toast-bar"><i></i></div><div class="toast-hint">' + T("toast.hint") + "</div>";
      host.appendChild(el);
      trayZ.classList.add("ping");
      var left = 60, finished = false;
      var timer = setInterval(function () {
        if (id !== runId) { cleanup(); reject(ABORT); return; }
        left -= 1; var t = el.querySelector(".t"); if (t) t.textContent = left;
        if (left <= 0) done(null);
      }, 1000);
      var hintT = setTimeout(function () {
        var h = el.querySelector(".toast-hint"); if (h) h.classList.add("show");
        var y = el.querySelector(".yes"); if (y) y.classList.add("nudge");
      }, 2600);
      function cleanup() {
        if (finished) return; finished = true;
        clearInterval(timer); clearTimeout(hintT); trayZ.classList.remove("ping");
        el.classList.add("out"); setTimeout(function () { el.remove(); }, 380);
      }
      function done(v) { if (finished) return; cleanup(); if (id !== runId) reject(ABORT); else resolve(v); }
      el.querySelector(".yes").addEventListener("click", function () { done(true); });
      el.querySelector(".no").addEventListener("click", function () { done(false); });
    });
  }
  async function ask(t, o, id) {
    t.set("wait", T("sc.waiting"));
    var pend = audit(o.tool, "ask", o.why), ok;
    try { ok = await approve(o, id); } finally { if (pend) pend.classList.add("is-done"); }
    if (ok) { t.set("ok", T("sc.allowed")); audit(o.tool, "ok", P({ ru: "владелец разрешил", en: "owner approved" })); }
    else {
      t.set("no", ok === null ? P({ ru: "время вышло · отказ", en: "timed out · denied" }) : T("sc.denied"));
      audit(o.tool, "no", ok === null ? P({ ru: "60 с без ответа", en: "60 s timeout" }) : P({ ru: "владелец отказал", en: "owner denied" }));
      pcNote(T("note.denied"));
    }
    return ok;
  }

  /* ---------- desktop building blocks ---------- */
  var EXT = { pdf: ["PDF", "#e5484d"], jpg: ["JPG", "#14a6c4"], png: ["PNG", "#14a6c4"], docx: ["DOC", "#3b82f6"], exe: ["EXE", "#8b5cf6"], zip: ["ZIP", "#e39b0b"], csv: ["CSV", "#16a34a"], md: ["MD", "#64748b"], xlsx: ["XLS", "#15803d"], json: ["JSON", "#ca8a04"] };
  function fi(x) { var e = EXT[x] || ["FILE", "#555"]; return '<span class="fi" data-x="' + e[0] + '" style="--c:' + e[1] + '"></span>'; }
  function win(o) {
    var w = document.createElement("div");
    w.className = "win";
    w.style.cssText = o.css || "left:18px;top:16px;right:18px;bottom:12px";
    w.innerHTML =
      '<div class="win-t"><span class="wt-i">' + (o.icon || "📁") + "</span><span>" + esc(o.title) + '</span><span class="ctl"><span>—</span><span>▢</span><span>✕</span></span></div>' +
      (o.path ? '<div class="win-addr"><div class="path">' + o.path.map(esc).join(' <i>›</i> ') + '</div><div class="srch">🔍 <span>' + P({ ru: "Поиск", en: "Search" }) + "</span></div></div>" : "") +
      '<div class="win-b"></div>' + (o.foot != null ? '<div class="win-foot">' + esc(o.foot) + "</div>" : "");
    screen.appendChild(w);
    return w;
  }

  /* ---------- scenarios ---------- */
  var SC = {};

  SC.tidy = async function (id) {
    var FILES = [
      [{ ru: "Счёт_октябрь.pdf", en: "Invoice_oct.pdf" }, "pdf", 0], ["IMG_2041.jpg", "jpg", 1], [{ ru: "Договор_аренды.docx", en: "Lease.docx" }, "docx", 0],
      ["setup_obs.exe", "exe", 2], [{ ru: "отпуск_фото.zip", en: "holiday_pics.zip" }, "zip", 3], [{ ru: "Презентация.pdf", en: "Slides.pdf" }, "pdf", 0],
      ["IMG_2077.jpg", "jpg", 1], ["vlc-3.0.exe", "exe", 2], [{ ru: "Резюме.docx", en: "Resume.docx" }, "docx", 0],
      [{ ru: "скрин_14.png", en: "screen_14.png" }, "png", 1], [{ ru: "архив_проекта.zip", en: "project_backup.zip" }, "zip", 3], [{ ru: "Чек_магазин.pdf", en: "Receipt.pdf" }, "pdf", 0]
    ];
    var FOLD = [{ ru: "Документы", en: "Documents" }, { ru: "Фото", en: "Photos" }, { ru: "Установщики", en: "Installers" }, { ru: "Архивы", en: "Archives" }];
    var dl = P({ ru: "Загрузки", en: "Downloads" });
    var w = win({ title: dl, path: [P({ ru: "Этот компьютер", en: "This PC" }), dl], foot: P({ ru: "Элементов: 12", en: "12 items" }) });
    var body = w.querySelector(".win-b");
    await wait(60, id);
    var r = body.getBoundingClientRect();
    var W = r.width - 24, H = r.height - 16;
    var cols = Math.max(4, Math.min(6, Math.floor(W / 92)));
    var rows = 1 + Math.ceil(FILES.length / cols);
    var CW = 92, CH = 94;
    var s = Math.min(1, W / (cols * CW), H / (rows * CH));
    var box = document.createElement("div");
    box.className = "files";
    box.style.cssText = "inset:auto;left:12px;top:8px;width:" + (cols * CW) + "px;height:" + (rows * CH) + "px;padding:0;transform-origin:0 0;transform:scale(" + s + ")";
    body.appendChild(box);
    var pos = function (i, row) { return { x: (i % cols) * CW + 4, y: (row + Math.floor(i / cols)) * CH }; };
    var folders = FOLD.map(function (f, i) {
      var p = pos(i, 0), d = document.createElement("div");
      d.className = "f gone"; d.style.left = p.x + "px"; d.style.top = p.y + "px";
      d.innerHTML = '<span class="fo"><b>0</b></span><span>' + esc(P(f)) + "</span>";
      box.appendChild(d); return d;
    });
    var els = FILES.map(function (f, i) {
      var p = pos(i, 1), d = document.createElement("div");
      d.className = "f"; d.style.left = p.x + "px"; d.style.top = p.y + "px";
      d.innerHTML = fi(f[1]) + "<span>" + esc(P(f[0])) + "</span>";
      box.appendChild(d); return d;
    });

    await wait(500, id);
    await user(P({ ru: "Наведи порядок в «Загрузках»: разложи всё по папкам.", en: "Tidy up my Downloads: sort everything into folders." }), id);
    var t1 = tool("list_directory", home() + "\\Downloads");
    await wait(700, id);
    t1.set("ok", T("sc.read")); audit("list_directory", "ok", P({ ru: "смотрю, что лежит в Загрузках", en: "checking what's in Downloads" }));
    els.forEach(function (e, i) { setTimeout(function () { e.classList.add("pop"); }, i * 40); });
    pcNote(T("note.read"));
    await ai(P({ ru: "Вижу 12 файлов: документы, фото, установщики и архивы. Разложу их по четырём папкам одной командой — ничего не удаляю.", en: "I see 12 files: documents, photos, installers and archives. I'll sort them into four folders with one command — nothing gets deleted." }), id);
    var t2 = tool("run_command", "New-Item … ; Move-Item …");
    var ok = await ask(t2, {
      tool: "run_command", kind: "run",
      code: ZI.lang === "en"
        ? "cd ~\\Downloads\nmkdir Documents,Photos,Installers,Archives\nmv *.pdf,*.docx Documents; mv *.jpg,*.png Photos\nmv *.exe Installers; mv *.zip Archives"
        : "cd ~\\Downloads\nmkdir Документы,Фото,Установщики,Архивы\nmv *.pdf,*.docx Документы; mv *.jpg,*.png Фото\nmv *.exe Установщики; mv *.zip Архивы",
      why: P({ ru: "Раскладываю файлы по папкам по типу. Ничего не удаляю.", en: "Sorting files into folders by type. Deleting nothing." })
    }, id);
    if (!ok) {
      await ai(P({ ru: "Понял, ничего не трогаю. Могу просто показать список: что и куда я бы переместил.", en: "Got it, I won't touch anything. I can just show you a list of what I'd move where." }), id);
      return;
    }
    folders.forEach(function (f, i) { setTimeout(function () { f.classList.remove("gone"); f.classList.add("pop"); }, i * 110); });
    await wait(600, id);
    var counts = [0, 0, 0, 0];
    for (var i = 0; i < els.length; i++) {
      var c = FILES[i][2], fp = pos(c, 0);
      els[i].style.left = fp.x + "px"; els[i].style.top = fp.y + "px";
      els[i].classList.add("gone");
      (function (c) {
        setTimeout(function () {
          counts[c]++; var b = folders[c].querySelector("b"); b.textContent = counts[c]; b.classList.add("show");
          folders[c].classList.remove("pop"); void folders[c].offsetWidth; folders[c].classList.add("pop");
        }, 650);
      })(c);
      await wait(150, id);
    }
    await wait(700, id);
    w.querySelector(".win-foot").textContent = P({ ru: "Элементов: 4", en: "4 items" });
    await ai(P({ ru: "Готово: <b>12 файлов разложены по 4 папкам.</b> Ничего не удалено, а каждое действие записано в журнал аудита.", en: "Done: <b>12 files sorted into 4 folders.</b> Nothing deleted, and every action is in the audit log." }), id);
  };

  SC.find = async function (id) {
    var docs = P({ ru: "Документы", en: "Documents" });
    var ROWS = [
      [{ ru: "Счета_2026.csv", en: "Invoices_2026.csv" }, "csv", "12.11", 1],
      [{ ru: "Заметки_встреча_Альфа.md", en: "Meeting_notes_Alpha.md" }, "md", "03.11", 1],
      [{ ru: "План_продаж.xlsx", en: "Sales_plan.xlsx" }, "xlsx", "28.10", 0],
      [{ ru: "Отчёт_Q3.pdf", en: "Report_Q3.pdf" }, "pdf", "14.10", 0],
      [{ ru: "Контакты.csv", en: "Contacts.csv" }, "csv", "09.10", 0],
      [{ ru: "Бюджет_2027.xlsx", en: "Budget_2027.xlsx" }, "xlsx", "01.10", 0],
      [{ ru: "Письмо_юристу.docx", en: "Letter_to_lawyer.docx" }, "docx", "22.09", 0],
      [{ ru: "Идеи.md", en: "Ideas.md" }, "md", "15.09", 0]
    ];
    var w = win({ title: docs, path: [P({ ru: "Этот компьютер", en: "This PC" }), docs], foot: P({ ru: "Элементов: 8", en: "8 items" }) });
    var body = w.querySelector(".win-b");
    body.innerHTML = '<div class="split"><div class="rows"></div><div class="prev"></div></div>';
    var rowsEl = body.querySelector(".rows"), prev = body.querySelector(".prev");
    var rows = ROWS.map(function (r) {
      var d = document.createElement("div"); d.className = "row";
      var e = EXT[r[1]];
      d.innerHTML = '<span class="mi" style="--c:' + e[1] + '"></span><span>' + esc(P(r[0])) + "</span><small>" + r[2] + "</small>";
      rowsEl.appendChild(d); return d;
    });
    await wait(500, id);
    var q = P({ ru: "Найди в моих документах, сколько нам должна «Альфа» и до какого числа.", en: "Find in my documents how much Alpha owes us and by when." });
    await user(q, id);
    var t1 = tool("search_files", P({ ru: "«Альфа» в ", en: "“Alpha” in " }) + home() + "\\Documents");
    var srch = w.querySelector(".srch"); srch.classList.add("typed");
    var word = P({ ru: "Альфа", en: "Alpha" });
    for (var i = 1; i <= word.length; i++) { srch.innerHTML = "🔍 " + esc(word.slice(0, i)); await wait(90, id); }
    await wait(400, id);
    rows.forEach(function (r, i) { if (ROWS[i][3]) r.classList.add("hl"); else r.classList.add("dim"); });
    t1.set("ok", T("sc.read")); audit("search_files", "ok", P({ ru: "ищу «Альфа» в Документах · 2 файла", en: "searching “Alpha” in Documents · 2 files" }));
    pcNote(T("note.read"));
    await wait(500, id);
    var t2 = tool("read_file", P(ROWS[0][0]));
    rows[1].classList.remove("hl"); rows[1].classList.add("dim");
    await wait(600, id);
    var en = ZI.lang === "en";
    prev.innerHTML = '<div class="paper"><h5>' + esc(P(ROWS[0][0])) + '</h5><table><tr><th>№</th><th>' + (en ? "Client" : "Клиент") + "</th><th>" + (en ? "Amount" : "Сумма") + "</th><th>" + (en ? "Due" : "Срок") + "</th><th>" + (en ? "Status" : "Статус") + "</th></tr>" +
      "<tr><td>15</td><td>" + (en ? "Beta" : "Бета") + "</td><td>" + (en ? "$800" : "80 000") + "</td><td>" + (en ? "Oct 31" : "31.10") + "</td><td>" + (en ? "paid" : "оплачен") + "</td></tr>" +
      '<tr class="m"><td>17</td><td>' + (en ? "Alpha" : "Альфа") + "</td><td>" + (en ? "$1,500" : "150 000") + "</td><td>" + (en ? "Nov 30" : "30.11") + "</td><td>" + (en ? "unpaid" : "не оплачен") + "</td></tr>" +
      "<tr><td>19</td><td>" + (en ? "Alpha" : "Альфа") + "</td><td>" + (en ? "$600" : "60 000") + "</td><td>" + (en ? "Oct 15" : "15.10") + "</td><td>" + (en ? "paid" : "оплачен") + "</td></tr>" +
      '<tr class="m"><td>21</td><td>' + (en ? "Alpha" : "Альфа") + "</td><td>" + (en ? "$900" : "90 000") + "</td><td>" + (en ? "Dec 31" : "31.12") + "</td><td>" + (en ? "unpaid" : "не оплачен") + "</td></tr>" +
      '</table><div class="ln"></div><div class="ln" style="width:70%"></div></div>';
    prev.classList.add("show");
    t2.set("ok", T("sc.read")); audit("read_file", "ok", P({ ru: "читаю таблицу счетов", en: "reading the invoice table" }));
    await ai(P({ ru: "«Альфа» должна <b>240 000 ₽</b> по двум неоплаченным счетам — №17 и №21. Ближайший срок — <b>30 ноября</b>. Я только читал файлы, поэтому разрешение не понадобилось.", en: "Alpha owes <b>$2,400</b> on two unpaid invoices — #17 and #21. The nearest due date is <b>November 30</b>. I only read files, so no approval was needed." }), id);
  };

  SC.fix = async function (id) {
    var w = win({ title: "Planner", icon: "🗓", css: "left:18px;top:16px;right:18px;bottom:12px" });
    var body = w.querySelector(".win-b");
    body.innerHTML = '<div class="app-body"><div class="app-ph">' + new Array(13).join("<i></i>") + '</div>' +
      '<div class="err"><div class="err-h"><span class="x">✕</span><div><b>' + P({ ru: "Не удаётся запустить Planner", en: "Planner can't start" }) + "</b>" +
      P({ ru: "Файл настроек не найден:", en: "Settings file not found:" }) + "<br><code>" + esc(home()) + "\\Apps\\Planner\\config.json</code></div></div>" +
      '<div class="err-btn"><span>OK</span></div></div><div class="okapp"><div>✓ ' + P({ ru: "Planner запущен", en: "Planner is running" }) + "</div></div></div>";
    await wait(500, id);
    await user(P({ ru: "Программа выдаёт ошибку. Посмотри, что там, и почини.", en: "This app shows an error. Take a look and fix it." }), id);
    var t1 = tool("take_screenshot", P({ ru: "основной экран", en: "primary screen" }));
    var ok = await ask(t1, { tool: "take_screenshot", kind: "shot", shot: true, why: P({ ru: "Нужно увидеть текст ошибки на экране.", en: "I need to see the error text on the screen." }) }, id);
    if (!ok) {
      await ai(P({ ru: "Хорошо, без снимка. Скопируйте сюда текст ошибки — разберёмся по нему.", en: "Fine, no screenshot. Paste the error text here and we'll go from that." }), id);
      return;
    }
    shotFrame.classList.add("on"); flashEl.classList.remove("go"); void flashEl.offsetWidth; flashEl.classList.add("go");
    await wait(700, id); shotFrame.classList.remove("on");
    await ai(P({ ru: "Вижу ошибку: программа не находит файл настроек <b>config.json</b>. Проверю папку.", en: "I see it: the app can't find its settings file <b>config.json</b>. Let me check the folder." }), id);
    var t2 = tool("list_directory", home() + "\\Apps\\Planner");
    await wait(700, id);
    t2.set("ok", T("sc.read")); audit("list_directory", "ok", P({ ru: "проверяю папку программы", en: "checking the app folder" }));
    await ai(P({ ru: "Файла и правда нет. Создам его с настройками по умолчанию, остальные файлы не трогаю.", en: "The file really is missing. I'll create it with default settings and leave everything else alone." }), id);
    var t3 = tool("write_file", "…\\Planner\\config.json");
    var ok2 = await ask(t3, {
      tool: "write_file", kind: "write",
      code: '{\n  "language": "' + (ZI.lang === "en" ? "en" : "ru") + '",\n  "theme": "dark",\n  "autosave": true\n}',
      why: P({ ru: "Создаю недостающий файл настроек. Другие файлы не трогаю.", en: "Creating the missing settings file. Not touching other files." })
    }, id);
    if (!ok2) {
      await ai(P({ ru: "Ок, файл не создаю. Вот его содержимое — можно создать вручную в папке программы.", en: "OK, I won't create it. Here's the content — you can create it by hand in the app folder." }), id);
      return;
    }
    var err = body.querySelector(".err"); err.classList.add("out");
    await wait(500, id);
    body.querySelector(".okapp").classList.add("show");
    await ai(P({ ru: "Готово: <b>config.json создан, программа запускается.</b> Если что-то пойдёт не так, этот файл можно просто удалить.", en: "Done: <b>config.json is created and the app starts.</b> If anything goes wrong, just delete that file." }), id);
  };

  SC.multi = async function (id) {
    var en = ZI.lang === "en";
    var pc1 = en ? "Home PC" : "Домашний ПК", pc2 = en ? "Laptop" : "Ноутбук";
    var m = document.createElement("div"); m.className = "multi";
    m.innerHTML = [pc1, pc2].map(function (n) {
      return '<div class="term"><div class="term-h"><span>🖥</span><span class="pcn">' + n + '</span><span class="tag tag-v">' + (en ? "own pass" : "свой пропуск") + '</span></div><div class="term-b"><div class="dim">PS ' + esc(home()) + "\\app&gt;</div></div></div>";
    }).join("");
    screen.appendChild(m);
    var terms = m.querySelectorAll(".term");
    function line(k, cls, txt) { var d = document.createElement("div"); if (cls) d.className = cls; d.textContent = txt; var b = terms[k].querySelector(".term-b"); b.appendChild(d); while (b.children.length > 9) b.removeChild(b.firstChild); }
    await wait(500, id);
    await user(en ? "Build the project on my home PC and run the tests on the laptop. Then tell me the result." : "Собери проект на домашнем ПК, а тесты прогони на ноутбуке. Потом скажи итог.", id);
    await ai(en ? "Two computers — I'll ask each one separately." : "Два компьютера — спрошу у каждого отдельно.", id);
    var t1 = tool("run_command", "@" + pc1 + " · npm run build");
    var ok = await ask(t1, { tool: "run_command", kind: "run", pc: pc1, host: terms[0], code: "npm run build", why: en ? "Building the project for production." : "Собираю проект для публикации." }, id);
    if (ok) {
      line(0, "p", "> npm run build"); await wait(400, id);
      line(0, "", en ? "building for production…" : "сборка для публикации…"); await wait(700, id);
      line(0, "", "✓ 214 modules transformed"); await wait(400, id);
      line(0, "g", en ? "✓ built in 41 s" : "✓ готово за 41 с");
    } else { line(0, "y", en ? "✕ denied by the owner" : "✕ отклонено владельцем"); }
    await wait(400, id);
    var t2 = tool("run_command", "@" + pc2 + " · npm test");
    var ok2 = await ask(t2, { tool: "run_command", kind: "run", pc: pc2, host: terms[1], code: "npm test", why: en ? "Running the test suite." : "Запускаю тесты." }, id);
    if (ok2) {
      line(1, "p", "> npm test"); await wait(500, id);
      line(1, "g", "PASS  tests/api.test.js"); await wait(350, id);
      line(1, "g", "PASS  tests/ui.test.js"); await wait(350, id);
      line(1, "", "Tests: 128 passed, 128 total");
    } else { line(1, "y", en ? "✕ denied by the owner" : "✕ отклонено владельцем"); }
    await wait(300, id);
    if (ok && ok2) await ai(en ? "Build on the home PC passed, and on the laptop <b>128 of 128 tests are green.</b> Each computer asked you separately — each has its own rules and its own log." : "Сборка на домашнем ПК прошла, на ноутбуке <b>128 из 128 тестов зелёные.</b> Каждый компьютер спросил вас отдельно — у каждого свои правила и свой журнал.", id);
    else await ai(en ? "I did only what you allowed. Each PC decides for itself — a pass for one doesn't open the other." : "Сделал только то, что вы разрешили. Каждый ПК решает сам за себя — пропуск одного не открывает другой.", id);
  };

  /* ---------- runner ---------- */
  function reset() {
    msgs.innerHTML = ""; screen.innerHTML = "";
    note.classList.remove("show"); shotFrame.classList.remove("on");
    pc.querySelectorAll(".toast").forEach(function (t) { t.remove(); });
    trayZ.classList.remove("ping");
    compose.classList.remove("typed"); compose.textContent = T("chat.ph");
  }
  async function run(name) {
    var id = ++runId; current = name || current; reset();
    document.querySelectorAll("#scen .scen-b").forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-s") === current)); });
    try { await SC[current](id); } catch (e) { if (e !== ABORT && window.console) console.error(e); }
  }
  function stop() { runId++; reset(); }

  document.querySelectorAll("#scen .scen-b").forEach(function (b) {
    b.addEventListener("click", function () { if (document.body.classList.contains("power-on")) run(b.getAttribute("data-s")); else { current = b.getAttribute("data-s"); document.querySelectorAll("#scen .scen-b").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); }); } });
  });
  var rp = $("replay"); if (rp) rp.addEventListener("click", function () { if (document.body.classList.contains("power-on")) run(current); });

  /* clock */
  function tick() { var c = $("clock"); if (!c) return; var d = new Date(); c.innerHTML = d.toLocaleTimeString(ZI.lang === "en" ? "en-GB" : "ru-RU", { hour: "2-digit", minute: "2-digit" }) + "<br>" + d.toLocaleDateString(ZI.lang === "en" ? "en-GB" : "ru-RU"); }
  tick(); setInterval(tick, 20000);

  /* start when visible and powered */
  var visible = false, started = false;
  function maybeStart() { if (visible && document.body.classList.contains("power-on") && !started) { started = true; run(current); } }
  new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; maybeStart(); }); }, { threshold: 0.25 }).observe($("stage"));
  document.addEventListener("zi:power", function (e) {
    if (e.detail) { started = false; maybeStart(); }
    else { stop(); started = false; }
  });
  document.addEventListener("zi:lang", function () { tick(); auditCount(); if (started) run(current); else compose.textContent = T("chat.ph"); });

  window.ZStage = { run: run };
})();
