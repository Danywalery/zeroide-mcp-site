/* ZeroIDE MCP landing — hero dot field. Dim while "off"; a light wave runs from the switch when it powers on. */
(function () {
  "use strict";
  var cv = document.getElementById("field");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var hero = cv.parentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, dots = [], gap = 28;
  var on = false, ripples = [], mouse = { x: -9999, y: -9999, a: 0, ta: 0 };
  var visible = true, raf = 0, t0 = performance.now();

  function build() {
    var r = hero.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = W < 700 ? 22 : 28;
    dots = [];
    var cx = W / 2, cy = H * 0.46, maxd = Math.hypot(W * 0.62, H * 0.7);
    for (var y = gap / 2; y < H; y += gap) {
      for (var x = gap / 2; x < W; x += gap) {
        var d = Math.hypot(x - cx, (y - cy) * 1.25) / maxd;
        var v = Math.max(0, 1 - d); v = v * v * (3 - 2 * v);
        dots.push({ x: x, y: y, v: v, ph: Math.random() * 6.28, lit: 0 });
      }
    }
  }

  function frame(now) {
    raf = 0;
    var t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    mouse.a += (mouse.ta - mouse.a) * 0.08;
    var rp = ripples, speed = 900, band = 90;
    for (var i = rp.length - 1; i >= 0; i--) if ((now - rp[i].t) / 1000 * speed > Math.hypot(W, H) + 200) rp.splice(i, 1);
    for (var k = 0; k < dots.length; k++) {
      var p = dots[k];
      if (p.v <= 0.01) continue;
      var a = (on ? 0.13 : 0.075) + Math.sin(t * 0.9 + p.ph + p.x * 0.004) * 0.025;
      var size = 1.3, g = 0;
      for (var j = 0; j < rp.length; j++) {
        var front = (now - rp[j].t) / 1000 * speed;
        var dd = Math.hypot(p.x - rp[j].x, p.y - rp[j].y) - front;
        var b = Math.exp(-(dd * dd) / (band * band));
        if (b > 0.02) { g = Math.max(g, b * rp[j].s); if (rp[j].on && dd < 0) p.lit = Math.min(1, p.lit + 0.06); }
      }
      if (!on) p.lit *= 0.94;
      if (mouse.a > 0.01) {
        var md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 190) { var m = (1 - md / 190); m *= m; a += m * 0.55 * mouse.a; size += m * 1.2 * mouse.a; }
      }
      a += g * 0.9; size += g * 1.8;
      var lit = on ? Math.max(p.lit * 0.45, g) : g * 0.6;
      var R = Math.round(255 - (255 - 198) * lit), G = Math.round(255 - (255 - 248) * lit), B = Math.round(255 - (255 - 44) * lit);
      if (!on && g > 0) { R = 255; G = Math.round(255 - 160 * g); B = Math.round(255 - 160 * g); }
      ctx.fillStyle = "rgba(" + R + "," + G + "," + B + "," + Math.min(1, a * p.v * 1.4).toFixed(3) + ")";
      ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  build();
  frame(performance.now());
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { build(); kick(); }, 150); });
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); }).observe(hero);
  hero.addEventListener("pointermove", function (e) {
    var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.ta = 1; if (reduce) frame(performance.now());
  });
  hero.addEventListener("pointerleave", function () { mouse.ta = 0; });

  window.ZField = {
    power: function (state, ox, oy) {
      on = !!state;
      var r = cv.getBoundingClientRect();
      var x = ox != null ? ox - r.left : W / 2, y = oy != null ? oy - r.top : H / 2;
      ripples.push({ x: x, y: y, t: performance.now(), on: on, s: on ? 1 : 0.6 });
      if (reduce) { dots.forEach(function (p) { p.lit = on ? 1 : 0; }); frame(performance.now()); }
      kick();
    }
  };
})();
