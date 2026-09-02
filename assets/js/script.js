(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky nav shadow/background on scroll
  function onScroll() {
    if (window.scrollY > 8) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active nav link highlighting
  var sections = document.querySelectorAll("main section[id]");
  var navLinkEls = document.querySelectorAll(".nav__link");

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinkEls.forEach(function (link) {
              var isMatch = link.getAttribute("href") === "#" + id;
              link.classList.toggle("is-active", isMatch);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // Tech stack tabs
  var stackTabs = Array.prototype.slice.call(document.querySelectorAll(".stack-tab"));
  var stackPanels = document.querySelectorAll(".stack-panel");

  function activateTab(tab) {
    stackTabs.forEach(function (t) {
      var isActive = t === tab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });
    stackPanels.forEach(function (panel) {
      panel.hidden = panel.id !== tab.getAttribute("data-target");
      panel.classList.toggle("is-active", !panel.hidden);
    });
  }

  stackTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { activateTab(tab); });
    tab.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") { return; }
      e.preventDefault();
      var nextIndex = e.key === "ArrowRight"
        ? (index + 1) % stackTabs.length
        : (index - 1 + stackTabs.length) % stackTabs.length;
      stackTabs[nextIndex].focus();
      activateTab(stackTabs[nextIndex]);
    });
  });

  // Stat count-up
  var statValues = document.querySelectorAll(".stat-card__value[data-count-to]");
  if ("IntersectionObserver" in window && statValues.length) {
    var statObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;

          if (reducedMotion) {
            el.textContent = target;
          } else {
            var duration = 1200;
            var start = null;
            var step = function (timestamp) {
              if (start === null) { start = timestamp; }
              var progress = Math.min((timestamp - start) / duration, 1);
              el.textContent = Math.floor(progress * target);
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                el.textContent = target;
              }
            };
            window.requestAnimationFrame(step);
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    statValues.forEach(function (el) { statObserver.observe(el); });
  } else {
    statValues.forEach(function (el) { el.textContent = el.getAttribute("data-count-to"); });
  }

  // Cursor spotlight on cards (desktop, fine pointer only)
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var spotlightCards = document.querySelectorAll(".project-feature, .project-compact, .research-card");
    spotlightCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
