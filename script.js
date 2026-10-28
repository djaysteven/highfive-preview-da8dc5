(function () {
  var root = document.documentElement;
  var themeKey = "pattaya-demo-theme";
  var langKey = "pattaya-demo-lang";

  function theme() { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function lang() { return root.lang === "th" ? "th" : "en"; }

  function syncThemeUI() {
    var t = theme();
    document.querySelectorAll("[data-theme-set]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-theme-set") === t ? "true" : "false");
    });
    var live = document.getElementById("themeLive");
    if (live) live.textContent = t === "light" ? (lang() === "th" ? "ธีมสว่าง" : "Light theme") : (lang() === "th" ? "ธีมมืด" : "Dark theme");
  }

  function syncLangUI() {
    var l = lang();
    document.documentElement.lang = l;
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === l ? "true" : "false");
    });
    document.querySelectorAll("[data-aria-en]").forEach(function (el) {
      el.setAttribute("aria-label", l === "th" ? el.getAttribute("data-aria-th") : el.getAttribute("data-aria-en"));
    });
    document.querySelectorAll("[data-book]").forEach(function (a) {
      a.href = l === "th" ? a.getAttribute("data-book-th") : a.getAttribute("data-book-en");
    });
    var title = document.querySelector("title");
    if (title && title.dataset.en) title.textContent = l === "th" ? title.dataset.th : title.dataset.en;
    syncThemeUI();
  }

  document.querySelectorAll("[data-theme-set]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-theme-set");
      root.setAttribute("data-theme", next);
      root.style.colorScheme = next;
      try { localStorage.setItem(themeKey, next); } catch (e) {}
      syncThemeUI();
    });
  });

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-lang");
      root.lang = next;
      try { localStorage.setItem(langKey, next); } catch (e) {}
      syncLangUI();
    });
  });

  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var menuBtn = document.getElementById("menuBtn");
  var sheet = document.getElementById("mobileNav");
  var scrim = document.getElementById("menuScrim");
  var lockEls = [document.querySelector("main"), document.querySelector(".site-footer"), document.querySelector(".vantage"), document.querySelector(".sticky-bar")];
  function setLocked(on) {
    document.documentElement.classList.toggle("nav-open", on);
    document.body.style.overflow = on ? "hidden" : "";
    lockEls.forEach(function (el) { if (el) el.inert = on; });
  }
  function closeMenu() {
    if (!sheet || !menuBtn) return;
    sheet.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    setLocked(false);
    window.setTimeout(function () {
      sheet.hidden = true;
      if (scrim) scrim.hidden = true;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280);
  }
  function openMenu() {
    if (!sheet || !menuBtn) return;
    sheet.hidden = false;
    if (scrim) scrim.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add("is-open"); });
    menuBtn.setAttribute("aria-expanded", "true");
    setLocked(true);
    var close = document.getElementById("menuClose");
    if (close) close.focus();
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener("click", function () {
      if (menuBtn.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });
    if (scrim) scrim.addEventListener("click", closeMenu);
    document.getElementById("menuClose").addEventListener("click", function () {
      closeMenu();
      menuBtn.focus();
    });
    sheet.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (menuBtn.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") {
        closeMenu();
        menuBtn.focus();
        return;
      }
      if (e.key !== "Tab") return;
      var focusables = sheet.querySelectorAll("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  document.querySelectorAll("[data-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      document.querySelectorAll(".gal-card").forEach(function (card) {
        var ok = group === "all" || card.getAttribute("data-group") === group;
        card.hidden = !ok;
      });
    });
  });

  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    document.querySelectorAll("[data-zoom]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector(lang() === "th" ? "img.th, img.solo" : "img.en, img.solo");
        if (!img) img = btn.querySelector("img");
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = (lang() === "th" ? btn.getAttribute("data-cap-th") : btn.getAttribute("data-cap-en")) || img.alt;
        lb.hidden = false;
      });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest("[data-close]")) lb.hidden = true;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) lb.hidden = true;
    });
  }

  var form = document.getElementById("deskForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var thanks = document.getElementById("formThanks");
      if (thanks) thanks.classList.add("is-on");
      form.reset();
    });
  }

  syncLangUI();
})();
