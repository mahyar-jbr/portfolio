/* @ds-bundle: {"format":4,"namespace":"Lucent","components":[{"name":"GlassPanel"},{"name":"Button"},{"name":"Switch"},{"name":"NavBar"},{"name":"SegmentedControl"},{"name":"SkillChip"},{"name":"ProjectCard"},{"name":"Toast"},{"name":"Sheet"},{"name":"Hero"},{"name":"HeroLens"},{"name":"ExperienceList"},{"name":"ArtGallery"},{"name":"BrandMark"},{"name":"CaseStudy"},{"name":"ContactTiles"},{"name":"MotionLibrary"},{"name":"PortfolioPage"}]} */
(function () {
  "use strict";
  var W = window, D = document;
  var mq = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(mq && mq.matches); }
  function $$(root, sel) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
  function css(name, fallback) {
    var v = getComputedStyle(D.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function ms(name, fallback) { var v = parseFloat(css(name, "")); return isNaN(v) ? fallback : v; }

  /* ---------- Spring presets come from the spring-* tokens ("stiffness 520, damping 11") ---------- */
  var DEFAULTS = { jelly: [460, 16], lens: [260, 20], "lens-width": [300, 22], knob: [480, 22] };
  function preset(name) {
    var raw = css("--spring-" + name, ""), d = DEFAULTS[name] || [420, 13];
    var k = /stiffness\s+([\d.]+)/.exec(raw), c = /damping\s+([\d.]+)/.exec(raw);
    return { stiffness: k ? +k[1] : d[0], damping: c ? +c[1] : d[1] };
  }

  /* ---------- A damped spring. Underdamped on purpose: that wobble is the jelly. ---------- */
  function Spring(value, opts) {
    opts = opts || {};
    this.x = value; this.v = 0; this.target = value;
    this.k = opts.stiffness || 420; this.c = opts.damping || 13; this.onUpdate = opts.onUpdate; this.onRest = opts.onRest;
    this.raf = 0; this.last = 0;
  }
  Spring.prototype.set = function (x) { this.x = x; this.target = x; this.v = 0; this.onUpdate && this.onUpdate(x, 0); };
  Spring.prototype.to = function (t, instant) {
    this.target = t;
    if (instant || reduced()) { cancelAnimationFrame(this.raf); this.raf = 0; this.set(t); this.onRest && this.onRest(); return this; }
    if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame(this.step.bind(this)); }
    return this;
  };
  Spring.prototype.kick = function (velocity) { if (reduced()) return this; this.v += velocity; return this.to(this.target); };
  Spring.prototype.step = function (now) {
    var dt = this.last ? Math.min((now - this.last) / 1000, 1 / 30) : 1 / 60; this.last = now;
    for (var i = 0, h = dt / 4; i < 4; i++) { var a = -this.k * (this.x - this.target) - this.c * this.v; this.v += a * h; this.x += this.v * h; }
    this.onUpdate && this.onUpdate(this.x, this.v);
    if (Math.abs(this.v) < 0.002 && Math.abs(this.x - this.target) < 0.0005) {
      this.raf = 0; this.set(this.target); this.onRest && this.onRest(); return;
    }
    this.raf = requestAnimationFrame(this.step.bind(this));
  };
  function spring(value, name, onUpdate, onRest) { var p = preset(name); p.onUpdate = onUpdate; p.onRest = onRest; return new Spring(value, p); }

  /* WAAPI easing sampled from a spring, for one-shot keyframe animations. */
  var SPRING_EASE = "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.1, 1.078 30.9%, 1.006 38.1%, 0.984 42.4%, 0.976 46.9%, 0.985 55.5%, 1.002 66.7%, 1)";
  var springEase = (function () { try { return CSS.supports("animation-timing-function", SPRING_EASE) ? SPRING_EASE : "cubic-bezier(0.34, 1.56, 0.64, 1)"; } catch (e) { return "cubic-bezier(0.34, 1.56, 0.64, 1)"; } })();
  function anim(el, frames, opts) {
    if (!el.animate) return { finished: Promise.resolve(), cancel: function () {} };
    if (reduced()) { opts = Object.assign({}, opts, { duration: Math.min(opts.duration || 150, 150), delay: 0, easing: "ease" }); frames = frames.map(function (f) { var g = Object.assign({}, f); delete g.transform; delete g.filter; return g; }); }
    return el.animate(frames, opts);
  }

  /* ---------- Jelly: squash on press, wobble back on release ---------- */
  function jelly(el, opts) {
    if (!el || el.__luJelly) return el;
    var amount = (opts && opts.amount != null) ? opts.amount : (parseFloat(el.getAttribute("data-jelly")) || 1);
    el.classList.add("lu-jelly");
    var sx = spring(1, "jelly", function (x) { el.style.setProperty("--sx", x.toFixed(4)); });
    var sy = spring(1, "jelly", function (y) { el.style.setProperty("--sy", y.toFixed(4)); });
    var pressed = false;
    function down() { if (el.disabled || el.getAttribute("aria-disabled") === "true") return; pressed = true; sx.to(1 + 0.035 * amount); sy.to(1 - 0.06 * amount); }
    function up() { if (!pressed) return; pressed = false; sx.to(1); sy.to(1); sx.kick(-0.8 * amount); sy.kick(1.1 * amount); }
    function cancel() { pressed = false; sx.to(1); sy.to(1); }
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("pointerleave", cancel);
    el.addEventListener("keydown", function (e) { if ((e.key === " " || e.key === "Enter") && !e.repeat) down(); });
    el.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") up(); });
    el.__luJelly = { wobble: function (a) { a = a || amount; sx.kick(-1 * a); sy.kick(1.3 * a); } };
    return el;
  }

  /* ---------- Lens: the liquid selection pill shared by NavBar and SegmentedControl ---------- */
  function lens(container, opts) {
    if (!container || container.__luLens) return container.__luLens;
    opts = opts || {};
    var itemSel = opts.items || "[data-lens-item]";
    var attr = opts.attr || "aria-current", on = opts.on || "page";
    var items = $$(container, itemSel);
    if (!items.length) return null;
    var el = container.querySelector(".lu-lens");
    if (!el) { el = D.createElement("span"); el.className = "lu-lens"; el.setAttribute("aria-hidden", "true"); container.insertBefore(el, container.firstChild); }
    var vel = 0, current = null;
    function paint() {
      var s = Math.min(Math.abs(vel) / 2600, 0.28);
      el.style.transform = "translateX(" + xs.x.toFixed(2) + "px) scale(" + (1 + s * 0.35).toFixed(3) + "," + (1 - s).toFixed(3) + ")";
      el.style.width = Math.max(ws.x, 0).toFixed(2) + "px";
    }
    var xs = spring(0, "lens", function (x, v) { vel = v; paint(); });
    var ws = spring(0, "lens-width", paint);
    function measure(item) { var cr = container.getBoundingClientRect(), r = item.getBoundingClientRect(); return { x: r.left - cr.left - container.clientLeft, w: r.width }; }
    function select(item, instant, silent) {
      if (!item) return;
      items.forEach(function (it) {
        if (it === item) it.setAttribute(attr, on); else if (attr === "aria-current") it.removeAttribute(attr); else it.setAttribute(attr, "false");
        if (opts.roving) it.tabIndex = it === item ? 0 : -1;
      });
      var m = measure(item), first = !current;
      xs.to(m.x, instant || first); ws.to(m.w, instant || first);
      el.classList.remove("is-hidden");
      var changed = current !== item; current = item;
      if (changed && !silent && opts.onChange) opts.onChange(item, items.indexOf(item));
    }
    function clear() { current = null; items.forEach(function (it) { if (attr === "aria-current") it.removeAttribute(attr); else it.setAttribute(attr, "false"); }); el.classList.add("is-hidden"); }
    items.forEach(function (it, i) {
      it.addEventListener("click", function (e) {
        if (it.tagName === "A" && it.getAttribute("href") === "#") e.preventDefault();
        select(it);
      });
      if (opts.roving) it.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return; e.preventDefault();
        var n = items[(i + d + items.length) % items.length]; n.focus(); select(n);
      });
    });
    function relayout() { if (current) { var m = measure(current); xs.to(m.x, true); ws.to(m.w, true); } }
    if (W.ResizeObserver) new ResizeObserver(relayout).observe(container);
    var start = items.filter(function (it) { return it.getAttribute(attr) === on; })[0];
    requestAnimationFrame(function () { if (start) select(start, true, true); else if (opts.selectFirst !== false) select(items[0], true, true); else clear(); });
    container.__luLens = { select: select, clear: clear, relayout: relayout, items: items, get current() { return current; } };
    return container.__luLens;
  }
  function liquidNav(nav, opts) {
    if (nav.__luNavInit) return nav.__luLens;
    nav.__luNavInit = true;
    opts = Object.assign({ items: ".lu-nav-item", attr: "aria-current", on: "page" }, opts || {});
    var api = lens(nav, opts);
    if (nav.hasAttribute("data-compact")) navScroll(nav);
    /* scroll spy: items linking to #sections follow the section in view (targets are looked up live, so re-rendered pages keep working) */
    if (api && opts.spy !== false) {
      var lock = 0, tick = false;
      api.items.forEach(function (it) { it.addEventListener("click", function () { lock = Date.now(); }); });
      W.addEventListener("scroll", function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          tick = false; if (Date.now() - lock < 900) return;
          var best = null;
          api.items.forEach(function (it) {
            var h = it.getAttribute("href") || "", t = h.charAt(0) === "#" && h.length > 1 ? D.getElementById(h.slice(1)) : null;
            if (!t) return;
            if (!best) best = it;
            if (t.getBoundingClientRect().top < innerHeight * 0.45) best = it;
          });
          if (best && best !== api.current) api.select(best);
        });
      }, { passive: true });
    }
    return api;
  }
  function segmented(seg, opts) {
    return lens(seg, Object.assign({ items: ".lu-seg-item", attr: "aria-checked", on: "true", roving: true, onChange: function (item) {
      seg.dispatchEvent(new CustomEvent("change", { detail: { value: item.getAttribute("data-value") || item.textContent.trim() } }));
    } }, opts || {}));
  }

  /* ---------- Nav compacts as you scroll down, expands when you scroll back up ---------- */
  function navScroll(nav, opts) {
    if (!nav || nav.__luScroll) return;
    var threshold = (opts && opts.threshold) || 120, lastY = W.scrollY, ticking = false;
    function update() {
      var y = W.scrollY, down = y > lastY;
      if (y < threshold) nav.classList.remove("is-compact");
      else if (down && y - lastY > 4) nav.classList.add("is-compact");
      else if (!down && lastY - y > 4) nav.classList.remove("is-compact");
      lastY = y; ticking = false;
    }
    W.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    nav.__luScroll = true;
  }


  function scrollToEl(el, opts) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: (opts && opts.block) || "start" });
  }

  /* ---------- Switch: the knob stretches as it travels and swells while held ---------- */
  function switchControl(el) {
    if (!el || el.__luSwitch) return el;
    var knob = el.querySelector(".lu-switch-knob");
    if (!knob) { knob = D.createElement("span"); knob.className = "lu-switch-knob"; el.appendChild(knob); }
    var travel = function () { return el.clientWidth - knob.offsetWidth - 4; };
    var vel = 0, held = 0;
    function paint() {
      var s = Math.min(Math.abs(vel) / 900, 0.35) + held * 0.28;
      knob.style.transform = "translateX(" + pos.x.toFixed(2) + "px) scaleX(" + (1 + s).toFixed(3) + ") scaleY(" + (1 - s * 0.25).toFixed(3) + ")";
    }
    var pos = spring(0, "knob", function (x, v) { vel = v; paint(); });
    var hold = spring(0, "knob", function (h) { held = h; paint(); });
    function sync(instant) { pos.to(el.getAttribute("aria-checked") === "true" ? travel() : 0, instant); }
    el.addEventListener("pointerdown", function () { hold.to(1); });
    el.addEventListener("pointerleave", function () { hold.to(0); });
    el.addEventListener("pointerup", function () { hold.to(0); });
    el.addEventListener("click", function () {
      var next = el.getAttribute("aria-checked") !== "true";
      el.setAttribute("aria-checked", String(next)); sync(); hold.to(0);
      el.dispatchEvent(new CustomEvent("change", { detail: { checked: next } }));
    });
    requestAnimationFrame(function () { sync(true); });
    el.__luSwitch = true;
    return el;
  }

  /* ---------- Reveal: sections below the fold rise in as they arrive. On-screen content never hides. ---------- */
  function reveal(root) {
    if (!W.IntersectionObserver || reduced()) return;
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (e, i) {
        var el = e.target; io.unobserve(el);
        el.style.transitionDelay = (i * ms("--dur-stagger", 60)) + "ms";
        el.classList.add("lu-in");
        setTimeout(function () { el.classList.remove("lu-pending", "lu-in"); el.style.transitionDelay = ""; }, ms("--dur-enter", 700) + i * 60 + 50);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(root, "[data-reveal]").forEach(function (el) {
      if (el.__luReveal) return; el.__luReveal = true;
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("lu-pending"); io.observe(el); }
    });
  }

  /* ---------- Enter: a staggered arrival for the first screen (hero). Resting state is fully visible. ---------- */
  function enter(root) {
    var els = $$(root, "[data-enter]");
    els.forEach(function (el, i) {
      anim(el, [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "none" }
      ], { duration: ms("--dur-enter", 700), delay: i * 70, easing: css("--ease-settle", "ease-out"), fill: "backwards" });
    });
    return els.length;
  }

  /* ---------- Filter with FLIP: items leave, the rest slide into place on a spring, newcomers pop in ---------- */
  function filter(container, predicate, opts) {
    opts = opts || {};
    var items = $$(container, opts.items || ":scope > *");
    var shown = items.filter(function (el) { return !el.hidden; });
    var first = new Map(shown.map(function (el) { return [el, el.getBoundingClientRect()]; }));
    var leaving = shown.filter(function (el) { return !predicate(el); });
    var exitMs = ms("--dur-exit", 180);
    var outs = leaving.map(function (el) { return anim(el, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.97)" }], { duration: exitMs, easing: css("--ease-exit", "ease-in"), fill: "forwards" }).finished; });
    return Promise.all(outs).then(function () {
      items.forEach(function (el) { el.getAnimations && el.getAnimations().forEach(function (a) { a.cancel(); }); el.hidden = !predicate(el); });
      opts.layout && opts.layout(items.filter(function (el) { return !el.hidden; }));
      items.forEach(function (el, i) {
        if (el.hidden) return;
        var a = first.get(el), b = el.getBoundingClientRect();
        if (a) {
          var dx = a.left - b.left, dy = a.top - b.top, sx = a.width / b.width, sy = a.height / b.height;
          if (Math.abs(dx) + Math.abs(dy) + Math.abs(1 - sx) + Math.abs(1 - sy) < 0.5) return;
          anim(el, [{ transformOrigin: "0 0", transform: "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")" }, { transformOrigin: "0 0", transform: "none" }], { duration: ms("--dur-morph", 640), easing: springEase });
        } else {
          anim(el, [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: ms("--dur-jelly", 560), delay: i * 40, easing: css("--ease-settle", "ease-out"), fill: "backwards" });
        }
      });
    });
  }

  /* ---------- Toast: a glass capsule drops in, squashes, then floats away ---------- */
  var region;
  function toast(message, opts) {
    opts = opts || {};
    if (!region) { region = D.createElement("div"); region.className = "lu-toast-region"; region.setAttribute("role", "status"); region.setAttribute("aria-live", "polite"); D.body.appendChild(region); }
    var t = D.createElement("div");
    t.className = "lu-toast lu-glass is-clear";
    t.innerHTML = (opts.icon === false ? "" : '<span class="lu-toast-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>') + '<span class="lu-toast-text"></span>';
    t.querySelector(".lu-toast-text").textContent = message;
    region.appendChild(t);
    anim(t, [{ opacity: 0, transform: "translateY(-24px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: ms("--dur-morph", 640), easing: springEase });
    function close() {
      if (t.__closing) return; t.__closing = true;
      anim(t, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-12px) scale(0.98)" }], { duration: ms("--dur-exit", 180) + 80, easing: css("--ease-exit", "ease-in"), fill: "forwards" }).finished.then(function () { t.remove(); });
    }
    setTimeout(close, opts.duration || ms("--dur-toast", 2800));
    t.addEventListener("click", close);
    return { close: close };
  }

  /* ---------- Sheet: a glass panel morphs out of the control that opened it, and back into it ---------- */
  function sheet(opts) {
    opts = opts || {};
    var from = opts.from, last = D.activeElement;
    var wrap = D.createElement("div"); wrap.className = "lu-sheet-layer";
    wrap.innerHTML = '<div class="lu-sheet-backdrop"></div><div class="lu-sheet lu-glass" role="dialog" aria-modal="true" tabindex="-1"><button class="lu-btn is-glass is-icon lu-sheet-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="lu-sheet-body"></div></div>';
    var panel = wrap.querySelector(".lu-sheet"), body = wrap.querySelector(".lu-sheet-body"), back = wrap.querySelector(".lu-sheet-backdrop");
    if (opts.title) panel.setAttribute("aria-label", opts.title);
    if (typeof opts.content === "string") body.innerHTML = opts.content; else if (opts.content) body.appendChild(opts.content.cloneNode ? opts.content.cloneNode(true) : opts.content);
    D.body.appendChild(wrap); D.documentElement.classList.add("lu-locked");
    auto(wrap);
    function originFrames(reverse) {
      var p = panel.getBoundingClientRect(), frames;
      if (from && from.getBoundingClientRect) {
        var r = from.getBoundingClientRect();
        var dx = (r.left + r.width / 2) - (p.left + p.width / 2), dy = (r.top + r.height / 2) - (p.top + p.height / 2);
        frames = [{ transform: "translate(" + dx + "px," + dy + "px) scale(" + (r.width / p.width).toFixed(3) + "," + (r.height / p.height).toFixed(3) + ")", opacity: 0.6, borderRadius: "999px" }, { transform: "none", opacity: 1, borderRadius: getComputedStyle(panel).borderRadius }];
      } else {
        frames = [{ transform: "translateY(40px) scale(0.94)", opacity: 0 }, { transform: "none", opacity: 1 }];
      }
      return reverse ? frames.slice().reverse() : frames;
    }
    anim(back, [{ opacity: 0 }, { opacity: 1 }], { duration: ms("--dur-morph", 640) * 0.6, easing: "ease-out" });
    anim(panel, originFrames(false), { duration: ms("--dur-morph", 640) + 80, easing: springEase });
    setTimeout(function () { (panel.querySelector("[autofocus]") || panel).focus(); }, 30);
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        var f = $$(panel, "a[href],button,input,select,textarea,[tabindex]:not([tabindex='-1'])").filter(function (x) { return !x.disabled; });
        if (!f.length) return; var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && D.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && D.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    D.addEventListener("keydown", onKey);
    function close() {
      if (wrap.__closing) return; wrap.__closing = true;
      D.removeEventListener("keydown", onKey);
      anim(back, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-in", fill: "forwards" });
      anim(panel, originFrames(true), { duration: 380, easing: css("--ease-settle", "ease"), fill: "forwards" }).finished.then(function () {
        wrap.remove(); D.documentElement.classList.remove("lu-locked"); if (last && last.focus) last.focus();
        if (from && from.__luJelly) from.__luJelly.wobble(0.8);
        opts.onClose && opts.onClose();
      });
    }
    back.addEventListener("click", close);
    wrap.querySelector(".lu-sheet-close").addEventListener("click", close);
    return { close: close, panel: panel };
  }

  /* ---------- Page transitions and the theme cross-fade ---------- */
  function transition(update, opts) {
    opts = opts || {};
    if (!opts.root && D.startViewTransition && !reduced()) { D.documentElement.classList.add("lu-vt-page"); var vt = D.startViewTransition(update); vt.finished.then(function () { D.documentElement.classList.remove("lu-vt-page"); }); return vt.finished; }
    var root = opts.root || D.querySelector("main") || D.body;
    return anim(root, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.985)" }], { duration: 140, easing: "ease-in", fill: "forwards" }).finished.then(function () {
      update(); root.getAnimations && root.getAnimations().forEach(function (a) { a.cancel(); });
      return anim(root, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: css("--ease-settle", "ease-out") }).finished;
    });
  }
  function setTheme(theme) {
    function apply() { if (theme) D.documentElement.setAttribute("data-theme", theme); else D.documentElement.removeAttribute("data-theme"); }
    if (!D.startViewTransition || reduced()) { apply(); return; }
    D.documentElement.classList.add("lu-vt-theme");
    D.startViewTransition(apply).finished.then(function () { D.documentElement.classList.remove("lu-vt-theme"); });
  }

  /* ---------- Busy: a button holds its width and shows three soft dots ---------- */
  function busy(btn, promise) {
    btn.style.width = btn.offsetWidth + "px";
    btn.classList.add("is-loading"); btn.setAttribute("aria-busy", "true");
    if (!btn.querySelector(".lu-dots")) btn.insertAdjacentHTML("beforeend", '<span class="lu-dots" aria-hidden="true"><i></i><i></i><i></i></span>');
    function done() { btn.classList.remove("is-loading"); btn.removeAttribute("aria-busy"); btn.style.width = ""; if (btn.__luJelly) btn.__luJelly.wobble(0.8); }
    return Promise.resolve(promise).then(function (v) { done(); return v; }, function (e) { done(); throw e; });
  }


  /* ---------- Lens hero: one glass lens magnifies the name under it. Drag it or use the arrow keys. ---------- */
  function lensHero(stage, opts) {
    if (!stage || stage.__luLensHero) return;
    stage.__luLensHero = true;
    opts = opts || {};
    var glass = stage.querySelector(".lu-lens-glass"), type = stage.querySelector(".lu-lens-type");
    if (!glass || !type) return;
    var zoom = opts.zoom || parseFloat(glass.getAttribute("data-zoom")) || 1.45;
    var inner = D.createElement("div"); inner.className = "lu-lens-inner"; inner.setAttribute("aria-hidden", "true");
    var clone = type.cloneNode(true); clone.removeAttribute("id"); clone.removeAttribute("data-enter");
    inner.appendChild(clone); glass.appendChild(inner);
    var x = 0, y = 0;
    function size() { return glass.offsetWidth; }
    function paint() {
      var r = size() / 2, sw = stage.offsetWidth, sh = stage.offsetHeight;
      glass.style.setProperty("--lx", x.toFixed(1) + "px"); glass.style.setProperty("--ly", y.toFixed(1) + "px");
      inner.style.width = sw + "px"; inner.style.height = sh + "px";
      clone.style.width = type.offsetWidth + "px";
      inner.style.transformOrigin = (x + r) + "px " + (y + r) + "px";
      inner.style.transform = "translate(" + (-x) + "px," + (-y) + "px) scale(" + zoom + ")";
    }
    var sx = spring(0, "lens", function (v) { x = v; paint(); }), sy = spring(0, "lens", function (v) { y = v; paint(); });
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function limits() { var r = size(); return [-r * 0.3, stage.offsetWidth - r * 0.7, -r * 0.3, stage.offsetHeight - r * 0.7]; }
    function rest() {
      /* settle over the second letter of the first line by default */
      var r = size(), fs = parseFloat(getComputedStyle(type).fontSize);
      return [fs * 0.62, Math.max(0, fs * 0.46 - r / 2)];
    }
    var home = rest(), L = limits();
    sx.set(reduced() ? home[0] : L[1]); sy.set(home[1]);
    requestAnimationFrame(function () { sx.to(home[0]); });
    var drag = null;
    glass.addEventListener("pointerdown", function (e) { drag = { dx: e.clientX - x, dy: e.clientY - y }; glass.setPointerCapture(e.pointerId); });
    glass.addEventListener("pointermove", function (e) { if (!drag) return; L = limits(); sx.to(clamp(e.clientX - drag.dx, L[0], L[1]), true); sy.to(clamp(e.clientY - drag.dy, L[2], L[3]), true); });
    function end() { drag = null; }
    glass.addEventListener("pointerup", end); glass.addEventListener("pointercancel", end);
    glass.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 48 : 16, dx = e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0, dy = e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0;
      if (!dx && !dy) return; e.preventDefault(); L = limits();
      sx.to(clamp(sx.target + dx, L[0], L[1])); sy.to(clamp(sy.target + dy, L[2], L[3]));
    });
    if (W.ResizeObserver) new ResizeObserver(function () { L = limits(); sx.to(clamp(sx.target, L[0], L[1]), true); sy.to(clamp(sy.target, L[2], L[3]), true); }).observe(stage);
  }

  /* ---------- Live time: a quiet local clock for a property row ---------- */
  function liveTime(el) {
    if (!el || el.__luTime) return; el.__luTime = true;
    var tz = el.getAttribute("data-tz") || undefined;
    function tick() {
      try { el.textContent = new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", timeZone: tz }); } catch (e) { el.textContent = ""; }
    }
    tick(); setInterval(tick, 30000);
  }

  /* ---------- Expand: a row opens to its details, height on a spring-eased curve ---------- */
  function expandable(btn) {
    if (!btn || btn.__luExpand) return; btn.__luExpand = true;
    var panel = D.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (!open) {
        panel.hidden = false; var h = panel.scrollHeight;
        anim(panel, [{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: ms("--dur-morph", 640), easing: css("--ease-settle", "ease-out") });
      } else {
        var h2 = panel.scrollHeight;
        anim(panel, [{ height: h2 + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: ms("--dur-exit", 180) + 100, easing: css("--ease-exit", "ease-in") }).finished.then(function () { if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true; });
      }
    });
  }

  /* ---------- Gallery: rows spanned by each drawing's own aspect ratio, so nothing is cropped and order stays left to right ---------- */
  function gallery(root) {
    if (!root || root.__luGallery) return; root.__luGallery = true;
    var items = $$(root, ".lu-art");
    function layout() {
      var row = parseFloat(getComputedStyle(root).gridAutoRows) || 4, gap = parseFloat(getComputedStyle(root).rowGap) || 0;
      items.forEach(function (it) { var h = it.getBoundingClientRect().height + (parseFloat(getComputedStyle(it).marginBottom) || 0); it.style.gridRowEnd = "span " + Math.max(1, Math.ceil((h + gap) / (row + gap))); });
    }
    items.forEach(function (it) { var img = it.querySelector("img"); if (img && !img.complete) img.addEventListener("load", layout); });
    layout();
    if (W.ResizeObserver) new ResizeObserver(function () { requestAnimationFrame(layout); }).observe(root);
    items.forEach(function (it, i) {
      var btn = it.querySelector(".lu-art-open");
      if (btn) btn.addEventListener("click", function () { lightbox(items, i); });
    });
  }

  /* ---------- Lightbox: the drawing grows out of its thumbnail into a quiet paper room ---------- */
  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICON_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var ICON_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  function lightbox(items, index) {
    var last = D.activeElement, i = index;
    var box = D.createElement("div"); box.className = "lu-lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
    box.innerHTML = '<div class="lu-lightbox-bg"></div><div class="lu-lightbox-bar"><button class="lu-btn is-quiet is-icon is-small" data-a="prev" aria-label="Previous drawing">' + ICON_L + '</button><span class="lu-lightbox-count" aria-live="polite"></span><button class="lu-btn is-quiet is-icon is-small" data-a="next" aria-label="Next drawing">' + ICON_R + '</button><button class="lu-btn is-quiet is-icon is-small" data-a="close" aria-label="Close">' + ICON_X + '</button></div><div class="lu-lightbox-stage"><img class="lu-lightbox-img" alt=""></div><div class="lu-lightbox-info"><div><h2></h2><p></p></div><div class="lu-lightbox-process"></div></div>';
    var img = box.querySelector(".lu-lightbox-img"), h2 = box.querySelector("h2"), p = box.querySelector(".lu-lightbox-info p"), count = box.querySelector(".lu-lightbox-count"), proc = box.querySelector(".lu-lightbox-process"), bg = box.querySelector(".lu-lightbox-bg");
    function data(k) {
      var it = items[k], im = it.querySelector("img");
      var process = []; try { process = JSON.parse(it.getAttribute("data-process") || "[]"); } catch (e) {}
      return { src: it.getAttribute("data-full") || im.currentSrc || im.src, alt: im.alt, title: it.getAttribute("data-title") || (it.querySelector("figcaption b") || {}).textContent || "", note: it.getAttribute("data-note") || (it.querySelector("figcaption span") || {}).textContent || "", thumb: im, process: process };
    }
    function show(k, dir) {
      i = (k + items.length) % items.length; var d = data(i);
      function set() {
        img.src = d.src; img.alt = d.alt; h2.textContent = d.title; p.textContent = d.note; count.textContent = (i + 1) + " / " + items.length;
        proc.innerHTML = "";
        if (d.process.length) {
          var all = [{ src: d.src, label: "Final" }].concat(d.process);
          all.forEach(function (s, n) {
            var b = D.createElement("button"); b.setAttribute("aria-label", s.label || ("Step " + n)); if (!n) b.setAttribute("aria-current", "true");
            b.innerHTML = '<img alt="" src="' + s.src + '">';
            b.addEventListener("click", function () { img.src = s.src; $$(proc, "button").forEach(function (x) { x.setAttribute("aria-current", String(x === b)); }); });
            proc.appendChild(b);
          });
        }
      }
      if (dir) {
        anim(img, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (-24 * dir) + "px)" }], { duration: 140, easing: "ease-in", fill: "forwards" }).finished.then(function () {
          set(); img.getAnimations && img.getAnimations().forEach(function (a) { a.cancel(); });
          anim(img, [{ opacity: 0, transform: "translateX(" + (24 * dir) + "px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: css("--ease-settle", "ease-out") });
        });
      } else set();
    }
    show(i);
    D.body.appendChild(box); D.documentElement.classList.add("lu-locked");
    $$(box, ".lu-btn").forEach(function (b) { jelly(b, { amount: 0.7 }); });
    function morph(reverse) {
      var t = items[i].querySelector("img").getBoundingClientRect(), r = img.getBoundingClientRect();
      if (!r.width || !t.width) return Promise.resolve();
      var dx = (t.left + t.width / 2) - (r.left + r.width / 2), dy = (t.top + t.height / 2) - (r.top + r.height / 2), sc = t.width / r.width;
      var frames = [{ transform: "translate(" + dx + "px," + dy + "px) scale(" + sc + ")" }, { transform: "none" }];
      if (reverse) frames.reverse();
      anim(bg, reverse ? [{ opacity: .97 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: .97 }], { duration: reverse ? 260 : 400, easing: "ease-out", fill: "forwards" });
      return anim(img, frames, { duration: reverse ? 360 : ms("--dur-morph", 640), easing: css("--ease-settle", "ease-out"), fill: reverse ? "forwards" : "none" }).finished;
    }
    function go() { requestAnimationFrame(function () { morph(false); box.querySelector('[data-a="close"]').focus(); }); }
    if (img.complete) go(); else img.addEventListener("load", go, { once: true });
    function close() {
      if (box.__closing) return; box.__closing = true; D.removeEventListener("keydown", onKey);
      $$(box, ".lu-lightbox-bar, .lu-lightbox-info").forEach(function (el) { anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }); });
      morph(true).then(function () { box.remove(); D.documentElement.classList.remove("lu-locked"); var b = items[i].querySelector(".lu-art-open"); (b || last) && (b || last).focus(); });
    }
    function onKey(e) {
      if (e.key === "Escape") close(); else if (e.key === "ArrowRight") show(i + 1, 1); else if (e.key === "ArrowLeft") show(i - 1, -1);
      else if (e.key === "Tab") { var f = $$(box, "button"); var a = f[0], z = f[f.length - 1]; if (e.shiftKey && D.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && D.activeElement === z) { e.preventDefault(); a.focus(); } }
    }
    D.addEventListener("keydown", onKey);
    box.querySelector('[data-a="close"]').addEventListener("click", close);
    box.querySelector('[data-a="prev"]').addEventListener("click", function () { show(i - 1, -1); });
    box.querySelector('[data-a="next"]').addEventListener("click", function () { show(i + 1, 1); });
    bg.addEventListener("click", close);
    var sx0 = null;
    box.querySelector(".lu-lightbox-stage").addEventListener("pointerdown", function (e) { sx0 = e.clientX; });
    box.querySelector(".lu-lightbox-stage").addEventListener("pointerup", function (e) { if (sx0 == null) return; var d = e.clientX - sx0; sx0 = null; if (Math.abs(d) > 60) show(i + (d < 0 ? 1 : -1), d < 0 ? 1 : -1); else if (e.target === e.currentTarget) close(); });
    return { close: close };
  }

  /* ---------- Brand mark: the rotated-sigma M draws itself once, then its trail becomes a sigmoid ---------- */
  function drawMark(svg) {
    if (!svg || reduced()) return;
    /* the M starts life as an upright sigma and turns a quarter clockwise into place */
    $$(svg, "[data-turn]").forEach(function (g) {
      g.style.transformBox = "fill-box"; g.style.transformOrigin = "50% 50%";
      anim(g, [{ transform: "rotate(-90deg)" }, { transform: "rotate(0deg)" }], { duration: 900, delay: 200, easing: springEase, fill: "backwards" });
    });
    $$(svg, "[data-draw]").forEach(function (path, n) {
      var len = path.getTotalLength ? path.getTotalLength() : 0; if (!len) return;
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      anim(path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: parseFloat(path.getAttribute("data-draw")) || 900, delay: n * 260 + 850, easing: css("--ease-settle", "ease-out"), fill: "forwards" }).finished.then(function () { path.style.strokeDasharray = ""; path.style.strokeDashoffset = ""; });
    });
  }

  /* ---------- Wire everything under a root ---------- */
  function auto(root) {
    root = root || D;
    $$(root, "[data-jelly]:not([data-jelly='0'])").forEach(function (el) { jelly(el); });
    /* every control gets a press response by default; data-jelly="0" opts out */
    $$(root, ".lu-btn, button.lu-chip, .lu-nav-item, .lu-seg-item, .lu-toast").forEach(function (el) {
      if (el.hasAttribute("data-jelly")) return;
      var small = el.matches(".lu-nav-item, .lu-seg-item, .lu-chip, .is-small, .is-icon");
      jelly(el, { amount: small ? 0.7 : 1 });
    });
    $$(root, ".lu-nav").forEach(function (n) { liquidNav(n); });
    $$(root, ".lu-seg").forEach(function (s) { segmented(s); });
    $$(root, ".lu-switch").forEach(switchControl);
    $$(root, ".lu-chip[aria-pressed]:not([data-filter])").forEach(function (c) {
      if (c.__luChip) return; c.__luChip = true;
      c.addEventListener("click", function () { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); });
    });
    $$(root, "[data-filter-group]").forEach(function (group) {
      if (group.__luFilter) return; group.__luFilter = true;
      var target = D.querySelector(group.getAttribute("data-filter-group"));
      var chips = $$(group, "[data-filter]");
      chips.forEach(function (c) {
        c.addEventListener("click", function () {
          chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
          var f = c.getAttribute("data-filter");
          filter(target, function (el) { return f === "all" || (" " + (el.getAttribute("data-tags") || "") + " ").indexOf(" " + f + " ") > -1; }, {
            layout: function (vis) { $$(target, ".is-feature").forEach(function (x) { x.classList.remove("is-feature"); }); if (vis.length % 2 === 1 && target.hasAttribute("data-feature-odd")) vis[0].classList.add("is-feature"); }
          });
        });
      });
    });
    $$(root, "[data-sheet]").forEach(function (b) {
      if (b.__luSheet) return; b.__luSheet = true;
      b.addEventListener("click", function (e) { e.preventDefault(); var tpl = D.querySelector(b.getAttribute("data-sheet")); sheet({ from: b, title: b.getAttribute("data-sheet-title") || b.textContent.trim(), content: tpl && (tpl.content || tpl) }); });
    });
    $$(root, "[data-toast]").forEach(function (b) {
      if (b.__luToast) return; b.__luToast = true;
      b.addEventListener("click", function () {
        var copy = b.getAttribute("data-copy"), msg = b.getAttribute("data-toast");
        if (!copy) { toast(msg); return; }
        /* if the browser refuses the clipboard, show the text itself so it can be copied by hand */
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(copy).then(function () { toast(msg); }, function () { toast(copy, { icon: false, duration: 6000 }); });
        else toast(copy, { icon: false, duration: 6000 });
      });
    });
    $$(root, ".lu-lens-stage").forEach(function (st) { lensHero(st); });
    $$(root, "time[data-live]").forEach(liveTime);
    $$(root, "[aria-controls][aria-expanded].lu-exp-row").forEach(expandable);
    $$(root, ".lu-gallery").forEach(gallery);
    $$(root, "svg.lu-mark[data-animate]").forEach(drawMark);
    reveal(root);
    $$(root, "a[href^='#'][data-scroll-to]").forEach(function (a) {
      if (a.__luTo) return; a.__luTo = true;
      a.addEventListener("click", function (e) { var t = D.querySelector(a.getAttribute("href")); if (t) { e.preventDefault(); scrollToEl(t); } });
    });
    return root;
  }

  var api = {
    Spring: Spring, spring: spring, preset: preset, ease: springEase,
    jelly: jelly,
    lens: lens, liquidNav: liquidNav, segmented: segmented, navScroll: navScroll, switchControl: switchControl,
    reveal: reveal, enter: enter, scrollTo: scrollToEl, lensHero: lensHero, liveTime: liveTime, expandable: expandable, gallery: gallery, lightbox: lightbox, drawMark: drawMark, filter: filter, toast: toast, sheet: sheet, transition: transition, setTheme: setTheme, busy: busy, auto: auto,
    GlassPanel: "lu-glass", Button: "lu-btn", Switch: "lu-switch", NavBar: "lu-nav", SegmentedControl: "lu-seg", SkillChip: "lu-chip",
    ProjectCard: "lu-card", Toast: "lu-toast", Sheet: "lu-sheet", Hero: "lu-hero", ContactTiles: "lu-contact", ExperienceList: "lu-exp", ArtGallery: "lu-gallery", HeroLens: "lu-hero is-lens", BrandMark: "lu-mark", CaseStudy: "lu-case", MotionLibrary: "lu-root", PortfolioPage: "lu-root"
  };
  W.Lucent = Object.assign(W.Lucent || {}, api);
})();
