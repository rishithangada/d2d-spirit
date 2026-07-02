// D2D Spirit — shared animation layer for security/integrations/demo pages.
// (index.html has its own inline engine and does NOT load this file.)
// Vanilla, no deps. Honors prefers-reduced-motion. Loads with `defer`.
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll reveal: any .reveal element fades/slides in when it enters view ──
  var revEls = document.querySelectorAll('.reveal');
  if (reduce) {
    revEls.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    revEls.forEach(function (e) { io.observe(e); });
  }

  // ── Count-up: <span data-count="48" data-suffix="hr" data-prefix="$">0</span> ──
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduce || !isFinite(target)) { el.textContent = prefix + target + suffix; return; }
    var done = false;
    var cio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting && !done) { done = true; run(); cio.disconnect(); }
      });
    }, { threshold: 0.5 });
    cio.observe(el);
    function run() {
      var dur = 1100, start = performance.now();
      (function tick(now) {
        var t = Math.min((now - start) / dur, 1);
        el.textContent = prefix + Math.round(target * (t * (2 - t))) + suffix; // ease-out
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }
  });
})();
