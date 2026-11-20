/* ZeroIDE MCP landing — i18n. Russian lives in the HTML, English below. */
(function () {
  "use strict";

  var EN = {
    "nav.live": "Demo", "nav.what": "What it is", "nav.how": "How it works", "nav.tools": "Features",
    "nav.safe": "Safety", "nav.video": "Videos", "nav.install": "Install", "nav.off": "MCP: OFF", "nav.dl": "Download",
    "hero.cta": "Download for Windows",
    "hero.pill": "Free and open source · Windows 10 and 11",
    "hero.l1": "AI can give advice.",
    "hero.l2": "Now it can <em>do the work.</em>",
    "pw.off": "MCP is off",
    "pw.hintOff": "Just like ZeroIDE MCP, this site is off by default. Flip the switch.",
    "hero.lead": "<strong>ZeroIDE MCP</strong> is a free Windows app. With it, ChatGPT, Claude, Notion, Cursor and other AI work right on your computer: they find and edit files, tidy things up, run programs and commands. It turns on with one click in the tray and does nothing important without your “yes”.",
    "hero.watch": "Watch in 60 seconds",
    "hero.m1": "Free forever", "hero.m2": "69 MB, no admin rights", "hero.m3": "Uninstalls with one button", "hero.cue": "Scroll",
    "marq.l": "Works with any AI that supports MCP", "marq.any": "any MCP client",
    "man.eye": "Why you need it",
    "man.text": "Today AI is like a brilliant consultant on the phone. It tells you which files to delete, which command to type and where to look for the bug. But you still have to press the buttons. <em>ZeroIDE MCP gives AI hands.</em> And you keep the key.",
    "man.zero": "$0", "man.s1": "tools<br>for AI", "man.s2": "free,<br>open source MIT-0", "man.s3": "button to<br>close access", "man.s4": "for your decision,<br>then it's a no",
    "live.eye": "Live demo",
    "live.h2": "Try it yourself. <em>You own this PC.</em>",
    "live.sub": "Pick a task. The AI writes in the chat on the left and works on the “computer” on the right. Reading goes through at once, anything that changes the PC waits for your button. It's an illustration, but the logic is the same as in the real app.",
    "sc.tidy": "Tidy up Downloads", "sc.tidyS": "a command · needs your “yes”",
    "sc.find": "Search my documents", "sc.findS": "read only · no questions",
    "sc.fix": "Why the error?", "sc.fixS": "a screenshot and a file fix",
    "sc.multi": "Two PCs, one task", "sc.multiS": "build on one, test on another",
    "chat.name": "Your AI assistant", "chat.conn": "connected to ZeroIDE MCP", "chat.ph": "Type a task…",
    "off.t": "MCP is off", "off.p": "The AI can do absolutely nothing on this PC. That's how the app works by default.", "off.b": "Turn MCP on",
    "audit.h": "— audit log: every call is recorded, secrets are masked",
    "lg.ok": "allowed", "lg.ask": "waiting for you", "lg.no": "denied", "lg.replay": "Replay the scenario",
    "usb.ai": "AI", "usb.l1": "ChatGPT, Claude…", "usb.l3": "Your PC", "usb.ok": "● connected",
    "what.eye": "What is MCP",
    "what.h2": "MCP is a <em>USB port</em> for artificial intelligence.",
    "what.sub": "The Model Context Protocol is an open standard that lets AI apps plug in outside tools. ZeroIDE MCP is one such tool, and what it plugs in is your Windows PC. It's a small app in the tray, next to the clock.",
    "what.i1": "An app on your PC", "what.i1p": "It runs on your machine and listens on 127.0.0.1 only. The project has no middleman server: the accounts and addresses are yours.",
    "what.i2": "19 tools for AI", "what.i2p": "PowerShell commands, files, images, screenshots, PC info, tray chat and logs. The AI picks what it needs for the task.",
    "what.i3": "Not another chatbot, not a subscription", "what.i3p": "Use the AI you already have. ZeroIDE MCP is free and its code is open (MIT-0 license).",
    "who.eye": "Who it's for", "who.h2": "Find yourself. <span class=\"mute\">Here's what AI will do for you.</span>",
    "how.eye": "How it works",
    "how.h2": "Between the AI and your PC there's a <em>checkpoint.</em> You hold the key.",
    "how.sub": "ZeroIDE MCP sits at the door and checks every request. Switch it off right on the diagram and see what happens to the requests.",
    "how.n1": "AI, anywhere", "how.n1s": "A web chat, an agent on this PC or on another computer",
    "how.n2": "Connection", "how.n2s": "This PC only, Tailscale, ngrok, Cloudflare Tunnel or your own SSH",
    "how.n3s": "Switch, approvals, passes, log", "how.on": "MCP ON",
    "how.n4": "Your Windows PC", "how.n4s": "PowerShell, files and screen",
    "how.l1": "Reading — goes through at once", "how.l2": "Writes and commands — wait for your “yes”", "how.l3": "MCP off — everything is refused",
    "how.s1": "You switch it on", "how.s1p": "One click in the tray. The server listens on 127.0.0.1 only and runs only while it's on.",
    "how.s2": "The AI asks", "how.s2p": "Every call comes with a short note: what the AI wants to do and why.",
    "how.s3": "You decide", "how.s3p": "Reading is allowed right away. Writing, editing files and commands wait for your “Allow”. No answer in 60 seconds means no.",
    "tools.eye": "Features", "tools.h2": "Everything AI needs to work on a PC.",
    "tools.sub": "Each tool is a simple skill. The AI combines them on its own: find → read → fix → check → report.",
    "tg.cmd": "Commands", "t.run": "Run commands and programs", "t.ask": "your “yes”", "t.js": "Watch a long task", "t.ok": "at once", "t.jo": "Read a task's output",
    "tg.files": "Files", "t.rf": "Read files", "t.ld": "See what's in a folder", "t.sf": "Search text across files", "t.wf": "Create and overwrite files", "t.ef": "Edit fragments precisely", "t.fo": "Copy, move and delete files",
    "tg.screen": "Screen & images", "t.ts": "Screenshot", "t.ri": "View images", "t.askShot": "asks", "t.tsp": "Both ask first; large images are downscaled locally on your PC.",
    "tg.talk": "Talking to you", "t.um": "A message in your tray", "t.tst": "Show what it's working on", "t.am": "Agent-to-agent messages", "t.ao": "Keep connection open (5 min)", "t.off": "off",
    "tg.rec": "Records & PC", "t.si": "PC and settings info", "t.al": "Log of every call", "t.je": "Write down the result", "t.jl": "Recall what's already done",
    "tf.1": "allowed by default", "tf.2": "waits for approval in the tray", "tf.3": "rules can be changed in Settings",
    "ctl.eye": "Safety and control", "ctl.h2": "Give AI a <em>pass,</em> not the keys to everything.",
    "ctl.sub": "Each AI gets its own pass: an OAuth sign-in you approve in the tray, or a named token. Build a pass yourself and see what it unlocks.",
    "ctl.f0": "For", "ctl.f1": "Access level", "ctl.read": "Read only", "ctl.rw": "Read and write", "ctl.full": "Full",
    "ctl.f2": "Folder", "ctl.all": "Whole PC", "ctl.f3": "Expires in", "ctl.never": "Never", "ctl.f4": "Request limit", "ctl.nolim": "No limit",
    "pass.t": "AI ACCESS PASS", "pass.a": "Access", "pass.r": "Folder", "pass.e": "Expires", "pass.l": "Limit", "pass.k": "key stored as SHA-256", "pass.rev": "REVOKED", "pass.revB": "Revoke the pass",
    "sf.1": "Off by default", "sf.1p": "The server listens on 127.0.0.1 only and runs only while it's on in the tray. Switch it off or quit the tray and access is closed.",
    "sf.2": "Approvals", "sf.2p": "Every call is rated low to critical and writes show a live diff preview. Critical actions allow one-time approval only.",
    "sf.3": "Tokens under lock", "sf.3p": "Without a token the server won't answer. Tokens are stored as SHA-256 hashes and aren't accepted in URLs by default.",
    "sf.4": "Change history & audit", "sf.4p": "Previous file versions stay for 30 days with 1-click Undo and a File Compare (Diff) window. Calls are logged with self-protection enabled.",
    "sf.5": "Your accounts and addresses", "sf.5p": "There is no project server between the AI and your PC. The link goes through whatever you chose.",
    "sf.6": "Clean uninstall", "sf.6p": "One button in Settings removes the app, tokens, logs, the Start Menu shortcut and autostart.",
    "hon.h": "Honestly, the main thing: it's not a sandbox.",
    "hon.p": "Allowed commands run with your Windows user's permissions. Treat every connection as remote control of the PC and read the <a href=\"https://github.com/Danywalery/ZeroIDE-MCP/blob/main/SECURITY.md\" target=\"_blank\" rel=\"noopener\">security notes</a>.",
    "hon.1": "Allow only what you understand", "hon.2": "Give AI the least access it needs", "hon.3": "Switch MCP off when you don't need it",
    "net.eye": "Several computers", "net.h2": "One AI. <em>As many PCs as you like.</em>",
    "net.sub": "Install ZeroIDE MCP on each computer and add each one to your AI client separately. One agent can then run a single task across several machines.",
    "net.1": "<b>Build on one, test on another.</b> For example, build on the home PC, run tests on the laptop and write the report on the work PC.",
    "net.2": "<b>Your own private network.</b> Computers in a Tailscale network see each other without a public address.",
    "net.3": "<b>Every PC has its own rules.</b> Its own approvals, passes and log. A pass for one PC doesn't work on another.",
    "net.agent": "One agent", "net.t1": "build ✓", "net.t2": "tests…", "net.t3": "report.md", "net.pc1": "Home PC", "net.pc2": "Laptop", "net.pc3": "Work PC",
    "cn.1": "This PC only", "cn.1p": "For an agent on the same computer: Claude Code, Cursor, Codex. Nothing is opened to the outside.", "cn.1t": "local",
    "cn.2p": "For web chats: ChatGPT, Claude, Notion. The wizard does the technical part — you just sign in and paste the key.", "cn.2t": "for web chats",
    "cn.3p": "For your own computers in a private network, no public address.", "cn.3t": "your PCs",
    "cn.4p": "If you have your own domain. The tunnel is created in Cloudflare Zero Trust.", "cn.4t": "own domain",
    "cn.5": "Your own SSH server", "cn.5p": "For those who already run a server of their own.", "cn.5t": "advanced",
    "cn.note": "The accounts and domains are yours. The project runs no gateway between the AI and your PC.",
    "vid.eye": "Videos", "vid.h2": "See the <em>real</em> thing.",
    "vid.sub": "Screen recordings from the project's repository, nothing staged. The videos are in English.",
    "vid.now": "Now playing:", "vid.src": "Source: README on GitHub",
    "v1.t": "One-minute overview", "v1.d": "What ZeroIDE MCP is and what it can do",
    "v2.t": "Setup with an AI agent and a task in Notion", "v2.d": "A real install from start to the first task",
    "v3.t": "Manual setup with the wizard", "v3.d": "Since 0.4.0 — step by step, no agent needed",
    "vid.note": "Videos play one after another. The glow around the player takes its colours from the video itself.",
    "in.eye": "Install", "in.h2": "Three steps. <em>No command line.</em>", "in.sub": "No admin rights needed. The setup wizard explains every step in plain words.",
    "in.1": "Download", "in.1p": "Get <code>zeroide-mcp.zip</code> with the button below. No GitHub account needed. The “Source code” archives won't work.", "in.size": "69 MB · v0.5.0",
    "in.2": "Run the wizard", "in.2p": "Extract the archive and open <code>ZeroIDE-MCP.exe</code>. The wizard explains what the app does and installs everything itself.",
    "in.o1": "Manually, with guidance", "in.o2": "With an AI agent on this PC",
    "in.3": "Connect your AI", "in.3p": "Choose what to connect: ChatGPT, Claude, Notion, an agent on this PC or another computer. The wizard walks you through it.",
    "in.c1": "What's on my desktop?", "in.c2": "<b>✓ list_directory</b> · 12 files and 3 folders. Show the list?",
    "dl.h": "ZeroIDE MCP 0.5.0 for Windows",
    "dl.s1": "Windows 10 or 11, x64", "dl.s2": "PowerShell 5.1 or later", "dl.s3": "No administrator rights", "dl.s4": "Installs to %LOCALAPPDATA%\\ZeroIDE-MCP",
    "dl.s5": "Internet during install: Node.js is downloaded and checked by SHA-256", "dl.s6": "MCP never turns on by itself — only you do that",
    "dl.b": "Download zeroide-mcp.zip", "copy": "Copy", "dl.sha": "Checksum", "dl.rel": "All releases", "dl.chg": "What's new",
    "im.1": "If Windows warns you", "im.1p": "The app isn't code-signed yet, so SmartScreen may show a warning. It's the same exe published in the release — you can compare the archive hash with the command above.",
    "im.1a": "Click “More info”", "im.1b": "Then “Run anyway”", "im.1c": "The setup wizard opens",
    "im.2": "Or let the AI install it", "im.2p": "Have Claude Code, Cursor or Codex? The wizard gives you a ready task and the agent follows AGENT_INSTALL.md from the archive. For example:",
    "im.2q": "Extract zeroide-mcp.zip and install ZeroIDE MCP following AGENT_INSTALL.md from the archive. Explain each command before you run it.",
    "faq.eye": "Questions", "faq.h2": "What people usually ask",
    "fq.1": "Do I need to know how to code?", "fa.1": "No. The setup wizard guides you step by step, and you give the AI tasks in plain words. One thing matters: before you press “Allow”, read what the AI is about to do.",
    "fq.2": "Is it safe?", "fa.2": "It's built for control: off by default, asks before writes and commands, issues limited passes and keeps a log. But it's not a sandbox: allowed commands run with your Windows user's permissions. Allow only what you understand.",
    "fq.3": "Which AI will work?", "fa.3": "Any client with MCP support: Claude, ChatGPT, Notion, Cursor, Codex, Claude Code and others. Not all of them are tested yet.",
    "fq.4": "Do I need a GitHub account?", "fa.4": "No. The Download button takes the file from the GitHub release, no sign-in needed.",
    "fq.5": "How much does it cost?", "fa.5": "Nothing. Open source, MIT-0 license. ngrok, Tailscale or Cloudflare have their own terms if you use them.",
    "fq.6": "Where does my data go?", "fa.6": "The app runs on your PC and the project has no server of its own. What the AI reads goes to the AI service you use, under its rules. That's why it pays to limit the pass to the folder you need.",
    "fq.7": "Does it work on Mac or Linux?", "fa.7": "Not yet. Version 0.5.0 is for Windows 10 and 11 (x64).",
    "fq.8": "Can I connect several computers?", "fa.8": "Yes. Install the app on each PC and add each one to your AI client as a separate MCP server. A pass for one PC doesn't work on another.",
    "fq.9": "How do I remove everything?", "fa.9": "Settings → Uninstall. The app stops connections and deletes the install folder with all tokens and logs, the Start Menu shortcut and autostart.",
    "fin.h": "Give AI hands. <em>Keep the key.</em>", "fin.p": "Free. 69 MB. Three steps to the first task.", "fin.gh": "Source code on GitHub",
    "ft.p": "Open source under MIT-0. Not affiliated with any AI vendor.", "ft.h1": "Product", "ft.h2": "Docs", "ft.conn": "Connections", "ft.sec": "Security", "ft.agent": "Install with an agent",
    "ft.h3": "Community", "ft.iss": "Report an issue", "ft.b": "For people who want AI to do things, not just suggest them.",
    "copied": "Copied"
  };

  /* strings set from JS (both languages) */
  var DYN = {
    ru: {
      "pw.on": "MCP включён", "pw.hintOn": "Теперь ИИ может работать на ПК — но только с вашего разрешения. Выключите, и доступ закроется.",
      "nav.on": "MCP: ВКЛ", "how.off": "MCP ВЫКЛ",
      "sc.read": "чтение · сразу", "sc.waiting": "ждёт вас…", "sc.allowed": "разрешено", "sc.denied": "отклонено", "sc.done": "готово", "sc.running": "выполняется…",
      "toast.app": "ZeroIDE MCP · запрос", "toast.allow": "Разрешить", "toast.deny": "Отклонить", "toast.hint": "Нажмите — так это выглядит и в жизни",
      "toast.run": "хочет выполнить команду", "toast.write": "хочет записать файл", "toast.shot": "хочет сделать снимок экрана", "toast.on": "на ПК",
      "note.read": "Чтение разрешено по умолчанию — без вопросов", "note.denied": "Вы отказали. ИИ ничего не изменил",
      "scope.read": "13 из 19 инструментов: читать, искать, смотреть сведения о ПК и журналы. Ничего не меняет на ПК.",
      "scope.readwrite": "+ запись, правка и перенос файлов, снимок экрана. Команды запрещены.",
      "scope.full": "Все 19 инструментов, включая команды. Запись и команды всё равно ждут вашего «да».",
      "s.read": "Чтение", "s.readwrite": "Чтение+запись", "s.full": "Полный", "r.all": "Весь ПК", "e.0": "Бессрочно", "e.d": "дн.", "l.0": "∞",
      "pass.count": "<b>{n}</b> из 19 инструментов", "pass.revB": "Отозвать пропуск", "pass.reissue": "Выпустить заново",
      "copied": "Скопировано"
    },
    en: {
      "pw.on": "MCP is on", "pw.hintOn": "Now the AI can work on the PC — but only with your permission. Switch it off and access closes.",
      "nav.on": "MCP: ON", "how.off": "MCP OFF",
      "sc.read": "read · at once", "sc.waiting": "waiting for you…", "sc.allowed": "allowed", "sc.denied": "denied", "sc.done": "done", "sc.running": "running…",
      "toast.app": "ZeroIDE MCP · request", "toast.allow": "Allow", "toast.deny": "Deny", "toast.hint": "Click it — that's how it looks for real",
      "toast.run": "wants to run a command", "toast.write": "wants to write a file", "toast.shot": "wants to take a screenshot", "toast.on": "on",
      "note.read": "Reading is allowed by default — no questions asked", "note.denied": "You said no. The AI changed nothing",
      "scope.read": "13 of 19 tools: read, search, view PC info and logs. Changes nothing on the PC.",
      "scope.readwrite": "+ writing, editing and moving files, screenshots. No commands.",
      "scope.full": "All 19 tools, commands included. Writes and commands still wait for your “yes”.",
      "s.read": "Read", "s.readwrite": "Read+write", "s.full": "Full", "r.all": "Whole PC", "e.0": "Never", "e.d": "d", "l.0": "∞",
      "pass.count": "<b>{n}</b> of 19 tools", "pass.revB": "Revoke the pass", "pass.reissue": "Issue again",
      "copied": "Copied"
    }
  };

  var HREF = {
    readme: {
      ru: "https://github.com/Danywalery/ZeroIDE-MCP/blob/main/README.ru.md",
      en: "https://github.com/Danywalery/ZeroIDE-MCP/blob/main/README.md"
    }
  };

  var ruCache = {};
  var nodes = [].slice.call(document.querySelectorAll("[data-i18n]"));
  var svgNodes = [].slice.call(document.querySelectorAll("[data-i18n-svg]"));
  nodes.forEach(function (el) { var k = el.getAttribute("data-i18n"); if (!(k in ruCache)) ruCache[k] = el.innerHTML; });
  svgNodes.forEach(function (el) { var k = el.getAttribute("data-i18n-svg"); if (!(k in ruCache)) ruCache[k] = el.textContent; });

  var ZI = window.ZI = {
    lang: document.documentElement.getAttribute("data-lang") === "en" ? "en" : "ru",
    t: function (k, vars) {
      var s = ZI.lang === "en" ? (EN[k] != null ? EN[k] : DYN.en[k]) : (DYN.ru[k] != null ? DYN.ru[k] : ruCache[k]);
      if (s == null) s = k;
      if (vars) for (var v in vars) s = s.replace("{" + v + "}", vars[v]);
      return s;
    },
    /* pick a {ru,en} object */
    p: function (o) { return o == null ? "" : (typeof o === "string" ? o : (o[ZI.lang] != null ? o[ZI.lang] : o.ru)); },
    apply: function (lang) {
      ZI.lang = lang === "en" ? "en" : "ru";
      document.documentElement.lang = ZI.lang;
      document.documentElement.setAttribute("data-lang", ZI.lang);
      try { localStorage.setItem("zi-lang", ZI.lang); } catch (e) {}
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        if (!(k in ruCache)) ruCache[k] = el.innerHTML;
        el.innerHTML = ZI.lang === "en" && EN[k] != null ? EN[k] : (ruCache[k] != null ? ruCache[k] : el.innerHTML);
      });
      svgNodes.forEach(function (el) {
        var k = el.getAttribute("data-i18n-svg");
        el.textContent = ZI.lang === "en" && EN[k] != null ? EN[k] : ruCache[k];
      });
      document.querySelectorAll("[data-i18n-href]").forEach(function (el) {
        var k = el.getAttribute("data-i18n-href");
        if (HREF[k] && HREF[k][ZI.lang]) el.setAttribute("href", HREF[k][ZI.lang]);
      });
      document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === ZI.lang)); });
      document.title = ZI.lang === "en" ? "ZeroIDE MCP — give AI hands, keep the key" : "ZeroIDE MCP — дайте ИИ руки, а ключ оставьте себе";
      document.dispatchEvent(new CustomEvent("zi:lang", { detail: ZI.lang }));
    }
  };
})();
